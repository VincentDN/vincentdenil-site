"""Process explicit TTS requests; keep receipts after optional retention cleanup."""
import argparse
import asyncio
from datetime import datetime, timezone, timedelta
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
QUEUE = ROOT / 'tools/narration/requests.json'
LEDGER = ROOT / 'outbound/audio/deliveries.json'
POLICY = ROOT / 'tools/narration/retention.json'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def confined(value, prefix):
    p = Path(value)
    if p.is_absolute() or '..' in p.parts or not p.parts or p.parts[0] != prefix.split('/')[0]:
        raise ValueError('Invalid path: ' + value)
    full = ROOT / p
    if not full.resolve().is_relative_to((ROOT / prefix).resolve()):
        raise ValueError('Path leaves allowed directory: ' + value)
    if any(parent.is_symlink() for parent in [full, *full.parents] if parent != ROOT):
        raise ValueError('Symlinks are not allowed')
    return full

def validate(request):
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,100}', request['id']):
        raise ValueError('Invalid request ID')
    source = confined(request['source'], 'docs')
    out = confined(request['output_dir'], 'outbound/audio')
    if source.suffix != '.md' or not source.is_file():
        raise ValueError('Source must be an existing docs Markdown file')
    if request['voice'] not in ('en-GB-RyanNeural', 'en-GB-SoniaNeural', 'en-GB-LibbyNeural'):
        raise ValueError('Unsupported voice')
    if sha(source) != request['source_sha256']:
        raise ValueError('Source changed; update the request deliberately')
    return source, out

def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(data, indent=2) + '\n')
    temp.replace(path)

def load_requests():
    requests = json.loads(QUEUE.read_text())
    ids = [r['id'] for r in requests]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate request ID')
    return requests

def run(cleanup_only=False):
    ledger = json.loads(LEDGER.read_text()) if LEDGER.exists() else {}
    if not cleanup_only:
        for request in load_requests():
            old = ledger.get(request['id'])
            if old:
                if old['request'] != request:
                    raise ValueError('Delivered requests are immutable; use a new ID')
                continue
            source, out = validate(request)
            # Reuse the validated renderer; only explicit requests can generate audio.
            import render_founder_part_four as renderer
            renderer.SOURCE = source.relative_to(ROOT)
            renderer.OUT = out.relative_to(ROOT)
            renderer.VOICE = request['voice']
            asyncio.run(renderer.main())
            mp3 = out / (source.stem + '.mp3')
            report_path = out / (source.stem + '.validation.json')
            report = json.loads(report_path.read_text())
            if sha(mp3) != report['mp3_sha256'] or sha(source) != report['source_sha256']:
                raise ValueError('Rendered files failed hash verification')
            ledger[request['id']] = {'request': request, 'generated_at': datetime.now(timezone.utc).isoformat(),
                'mp3': str(mp3.relative_to(ROOT)), 'report': str(report_path.relative_to(ROOT)),
                'mp3_sha256': report['mp3_sha256'], 'duration_seconds': report['duration_seconds'], 'status': 'delivered'}
            write_json(LEDGER, ledger)
    days = json.loads(POLICY.read_text())['retention_days']
    if days is None:
        print('Retention deletion disabled pending user selection')
        return
    if not isinstance(days, int) or isinstance(days, bool) or days < 7:
        raise ValueError('Retention must be at least seven days or null')
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    for item in ledger.values():
        if item['status'] != 'delivered' or datetime.fromisoformat(item['generated_at']) >= cutoff:
            continue
        p = confined(item['mp3'], 'outbound/audio')
        if p.exists():
            # Never delete a newer replacement sharing the same output path.
            if sha(p) != item['mp3_sha256']:
                continue
            if any(other is not item and other['status'] == 'delivered' and other['mp3'] == item['mp3']
                   and datetime.fromisoformat(other['generated_at']) >= cutoff for other in ledger.values()):
                continue
            p.unlink()
        item['status'] = 'expired'
        item['removed_at'] = datetime.now(timezone.utc).isoformat()
    write_json(LEDGER, ledger)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cleanup-only', action='store_true')
    args = parser.parse_args()
    import os
    os.chdir(ROOT)
    run(args.cleanup_only)

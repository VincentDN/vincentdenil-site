#!/usr/bin/env python3
"""Narrate a Walking Through MD (or one episode of it) to MP3 with Microsoft's free Edge voices (default: Sonia, British)."""
import argparse, asyncio, os, pathlib, ssl, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from md_to_narration import narration  # noqa: E402


def use_custom_ca(bundle):
    # Behind a TLS-inspecting proxy (e.g. Claude cloud sessions), edge-tts must trust the proxy's CA.
    import certifi
    import edge_tts.communicate as comm
    certifi.where = lambda: bundle
    comm._SSL_CTX = ssl.create_default_context(cafile=bundle)


async def speak(text, voice, out):
    import edge_tts
    await edge_tts.Communicate(text, voice).save(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('md', help='Markdown file to narrate')
    ap.add_argument('mp3', help='MP3 file to write')
    ap.add_argument('--episode', type=int, help='Only narrate "## Episode N" of a multi-episode file')
    ap.add_argument('--voice', default='en-GB-SoniaNeural', help='Edge voice name (list them: edge-tts --list-voices)')
    ap.add_argument('--ca-bundle', default=os.environ.get('NARRATION_CA_BUNDLE') or ('/root/.ccr/ca-bundle.crt' if os.path.exists('/root/.ccr/ca-bundle.crt') else None))
    a = ap.parse_args()
    if a.ca_bundle:
        use_custom_ca(a.ca_bundle)
    text = narration(pathlib.Path(a.md).read_text(encoding='utf-8'), a.episode)
    tmp = a.mp3 + '.part'
    asyncio.run(speak(text, a.voice, tmp))
    os.replace(tmp, a.mp3)
    print(f'{a.mp3}: {len(text.split())} words narrated')


if __name__ == '__main__':
    main()

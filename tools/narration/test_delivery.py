import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from datetime import datetime, timezone, timedelta
from unittest.mock import patch
import deliver

class DeliveryTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for name in ['docs', 'outbound/audio', 'tools/narration']:
            (self.root/name).mkdir(parents=True)
        self.source = self.root/'docs/test.md'
        self.source.write_text('Hello Vincent. Alistair here.')
        for name, value in {'ROOT':self.root, 'QUEUE':self.root/'tools/narration/requests.json',
                            'LEDGER':self.root/'outbound/audio/deliveries.json',
                            'POLICY':self.root/'tools/narration/retention.json'}.items():
            p = patch.object(deliver, name, value); p.start(); self.addCleanup(p.stop)
        deliver.POLICY.write_text('{"retention_days": 90}')
        self.request = {'id':'test', 'source':'docs/test.md', 'source_sha256':deliver.sha(self.source),
                        'output_dir':'outbound/audio/test', 'voice':'en-GB-RyanNeural'}

    def test_source_and_paths(self):
        deliver.validate(self.request)
        with self.assertRaises(ValueError):
            deliver.validate(dict(self.request, source='docs/../../etc/passwd'))
        with self.assertRaises(ValueError):
            deliver.validate(dict(self.request, output_dir='outbound/rights-review'))
        self.source.write_text('Changed')
        with self.assertRaises(ValueError): deliver.validate(self.request)

    def test_symlink(self):
        (self.root/'docs/link.md').symlink_to(self.source)
        with self.assertRaises(ValueError):
            deliver.validate(dict(self.request, source='docs/link.md'))

    def test_cleanup_retains_sources_and_reports_and_newer_audio(self):
        old = datetime.now(timezone.utc)-timedelta(days=100)
        p = self.root/'outbound/audio/test.mp3'; p.write_bytes(b'old audio')
        report = self.root/'outbound/audio/test.validation.json'; report.write_text('{}')
        ledger = {'test':{'status':'delivered','generated_at':old.isoformat(),'mp3':'outbound/audio/test.mp3',
                          'mp3_sha256':deliver.sha(p),'request':self.request}}
        deliver.write_json(deliver.LEDGER, ledger)
        p.write_bytes(b'new replacement')
        deliver.run(cleanup_only=True)
        self.assertTrue(p.exists())
        p.write_bytes(b'old audio')
        deliver.run(cleanup_only=True)
        self.assertFalse(p.exists())
        self.assertTrue(report.exists()); self.assertTrue(self.source.exists())
        self.assertEqual(json.loads(deliver.LEDGER.read_text())['test']['status'],'expired')

    def test_delivered_request_is_not_rerendered_after_cleanup(self):
        deliver.QUEUE.write_text(json.dumps([self.request]))
        deliver.write_json(deliver.LEDGER, {'test':{'request':self.request,'status':'expired'}})
        deliver.run()
        changed = dict(self.request, voice='en-GB-SoniaNeural')
        deliver.QUEUE.write_text(json.dumps([changed]))
        with self.assertRaises(ValueError): deliver.run()

    def test_disabled_retention(self):
        deliver.POLICY.write_text('{"retention_days": null}')
        deliver.run(cleanup_only=True)
        self.assertFalse(deliver.LEDGER.exists())

if __name__ == '__main__': unittest.main()

# Narration: Walking Through MD → MP3 (free Microsoft "Sonia" voice)

How we turn Claudine's Walking Through episodes and briefings into MP3s for offline listening. It uses the free Microsoft Edge "Read aloud" neural voices through the open-source [`edge-tts`](https://github.com/rany2/edge-tts) Python package. Vincent picked **`en-GB-SoniaNeural`** (British, female) as Claudine's voice on 1 Nov 2026.

- No account, no API key, no cost.
- It needs internet access to Microsoft's speech service, `speech.platform.bing.com`.
- It's an unofficial use of Microsoft's read-aloud service, so it could stop working at any time. The offline fallback is described below.

## Files

| File | What it does |
|---|---|
| `md_to_narration.py` | Turns a Walking Through MD into plain narration text. Drops everything below the first `---` rule (the sources), drops italic-only front-matter paragraphs, turns headings into spoken lines, strips links, URLs, bullets and markdown emphasis. Can pick one `## Episode N` section. |
| `narrate.py` | Reads an MD, converts it with `md_to_narration.py` and writes an MP3 with the chosen voice. |

## One-off setup

```bash
python3 -m pip install edge-tts      # tested with edge-tts 7.3.1
```

That's all you need on Windows, macOS or Linux. `ffmpeg` is only needed for the checks below.

## Narrate an episode

```bash
# whole file
python3 tools/narration/narrate.py docs/walking-through-founder-curriculum-part-3-full-text.md outbound/audio/walking-through-founder-curriculum-part-3-full-text.mp3

# one episode of a multi-episode file
python3 tools/narration/narrate.py docs/walking-through-india-and-china-business-culture-full-text.md outbound/audio/walking-through-india-and-china-business-culture-episode-2.mp3 --episode 2

# another voice (list them with: edge-tts --list-voices)
python3 tools/narration/narrate.py some.md out.mp3 --voice en-GB-LibbyNeural
```

- **Output:** about 48 kbps mono, roughly 2.7 words per second. A 1,300-word episode takes about 8 minutes and comes to about 3 MB.
- **Partial files:** the script writes `name.mp3.part` and renames it only when it's complete, so a crash never leaves a half-finished MP3 with the final name.
- **Many files:** run several in parallel, for example `xargs -P 8` over a job list. A single long file renders slower than real time, so parallelism is what keeps a batch fast.

## Where the MP3s go

Follow the "Narrated audio delivery" standing rule in the repo's `AGENTS.md`. As of 1 Nov 2026, MP3s go to `outbound/audio/` (series in a subfolder), named after the MD they narrate, and are never linked from the site.

## Claude cloud sessions: TLS proxy

Cloud sessions route traffic through a TLS-inspecting proxy, and edge-tts pins its own certificate store, so a plain run fails with `CERTIFICATE_VERIFY_FAILED`. `narrate.py` handles this itself: it uses `/root/.ccr/ca-bundle.crt` when that file exists, or any bundle you pass with `--ca-bundle` or the `NARRATION_CA_BUNDLE` environment variable. Don't disable TLS verification.

## Check every file before delivering

Long renders sometimes come back silently truncated. On 1 Nov 2026, two of 40 files stopped early. Compare each MP3's length with its word count: a healthy file reads at roughly 2.4–2.8 words per second. Anything above about 3.0 is clipped, so re-render it.

```bash
python3 -c "import sys; sys.path.insert(0,'tools/narration'); from md_to_narration import narration; print(len(narration(open('EPISODE.md').read()).split()))"
ffprobe -v error -show_entries format=duration -of csv=p=0 EPISODE.mp3
```

## Offline fallback (no Microsoft service)

If edge-tts stops working, [Piper](https://github.com/OHF-Voice/piper1-gpl) runs fully offline. It sounds more robotic, but it's free and fast.

```bash
python3 -m pip install piper-tts
python3 -m piper.download_voices en_GB-jenny_dioco-medium
python3 -c "import sys; sys.path.insert(0,'tools/narration'); from md_to_narration import narration; open('ep.txt','w').write(narration(open('EPISODE.md').read()))"
python3 -m piper -m en_GB-jenny_dioco-medium -f ep.wav < ep.txt
ffmpeg -i ep.wav -ac 1 -b:a 64k EPISODE.mp3
```


## Alistair: Codex-authored narration

Codex-written episodes use Alistair, a male British persona. Use `--voice en-GB-RyanNeural` explicitly; the default Sonia voice remains for Claudine. For the new Founder’s Curriculum Part Four:

```bash
mkdir -p outbound/audio/founder-curriculum
python3 tools/narration/narrate.py docs/walking-through-founder-curriculum-part-4-full-text.md outbound/audio/founder-curriculum/walking-through-founder-curriculum-part-4-full-text.mp3 --voice en-GB-RyanNeural
```

Apply the duration/word-count and completeness checks above before delivery. The narration ends at the first horizontal rule, before the reader’s companion and sources.

"""Render Part Four in bounded chunks and reject suspiciously short audio."""
import asyncio, hashlib, json, pathlib, re, subprocess, tempfile
import edge_tts
from md_to_narration import narration

SOURCE = pathlib.Path("docs/walking-through-founder-curriculum-part-4-full-text.md")
OUT = pathlib.Path("outbound/audio/founder-curriculum")
VOICE = "en-GB-RyanNeural"

def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], text=True).strip())

async def main():
    raw = SOURCE.read_text()
    text = narration(raw)
    paragraphs = text.split("\n\n")
    chunks, current = [], ""
    for para in paragraphs:
        if current and len((current + para).split()) > 180:
            chunks.append(current); current = ""
        current += ("\n\n" if current else "") + para
    if current: chunks.append(current)
    OUT.mkdir(parents=True, exist_ok=True)
    records = []
    semaphore = asyncio.Semaphore(3)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        async def render(i, chunk):
            path = tmp / f"{i:03}.mp3"
            async with semaphore:
                for attempt in range(3):
                    try:
                        await asyncio.wait_for(edge_tts.Communicate(chunk, VOICE).save(str(path)), timeout=240)
                        secs = duration(path)
                        rate = len(chunk.split()) / secs
                        if not 1.5 <= rate <= 3.0:
                            raise ValueError(f"Suspicious audio rate: {rate}")
                        subprocess.run(["ffmpeg", "-v", "error", "-xerror", "-i", str(path), "-f", "null", "-"], check=True)
                        return {"chunk": i, "words": len(chunk.split()), "duration": secs, "words_per_second": rate}
                    except Exception:
                        if attempt == 2: raise
                        await asyncio.sleep(3)
        records = await asyncio.gather(*(render(i,c) for i,c in enumerate(chunks)))
        listing = tmp / "concat.txt"
        listing.write_text("".join(f"file '{tmp / f'{i:03}.mp3'}'\n" for i in range(len(chunks))))
        final = OUT / (SOURCE.stem + ".mp3")
        partial = OUT / (SOURCE.stem + ".partial.mp3")
        subprocess.run(["ffmpeg","-y","-v","error","-f","concat","-safe","0","-i",str(listing),"-c","copy",str(partial)],check=True)
        secs = duration(partial)
        rate = len(text.split())/secs
        if not 1.5 <= rate <= 3.0: raise ValueError("Combined audio duration failed")
        subprocess.run(["ffmpeg","-v","error","-xerror","-i",str(partial),"-f","null","-"],check=True)
        partial.replace(final)
        report = {"source":str(SOURCE),"source_sha256":hashlib.sha256(raw.encode()).hexdigest(),"voice":VOICE,"words":len(text.split()),"duration_seconds":secs,"words_per_second":rate,"chunks":records,"mp3_sha256":hashlib.sha256(final.read_bytes()).hexdigest(),"checks":"Per-chunk and combined duration plus full decoding; no human listening check"}
        (OUT / (SOURCE.stem+".validation.json")).write_text(json.dumps(report,indent=2)+"\n")
        print(json.dumps(report))
if __name__ == "__main__": asyncio.run(main())

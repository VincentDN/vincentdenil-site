# Slow-motion parallax animatic shots

Turns a layered PSD illustration into a 10 s, 24 fps, 1920x1080 slow-motion 2.5D
parallax clip for an animatic. Finished clips go to `outbound/animatics/<shot>/`
(delivery folder, kept off the live site; not linked from any index).

## Pipeline

1. **Split into depth planes** – `extract_planes.py shot.psd WORK shots/<shot>.planes.json`
   lists every layer, composites each plane with psd-tools (clipping masks and
   opacity honoured) and checks that the re-stacked planes match the PSD.
   Planes are stacked in the order they appear in the JSON (back to front).
2. **Clean the background plate** – `fill_background.py WORK` removes the
   subject from the flattened background, so the camera move doesn't reveal a
   ghost copy of it. It fills row by row from the texture on either side (which
   keeps the horizon and the horizontal sea strokes), removes rigging lines that
   were painted into the plate, and has a `MANUAL` list for hand paint-outs.
3. **Render** – `render_parallax.py WORK out.mp4 [preview]`. Each plane gets an
   inverse-depth map from a simple scene model:
   - sky = infinity (moves only with its own cloud drift),
   - sea = a ground plane, inverse depth rising linearly from the horizon (`YH`)
     to the bottom of the frame,
   - the ship stands on the sea, so each column takes the depth of its
     waterline. The hull stays fixed to its painted wake while the
     superstructure separates from the sky and the escorts.
   The camera trucks, rises slightly and dollies in, with a slow lens push and
   an eased-linear curve. Displacement = camera motion × inverse depth, which
   is correct perspective parallax. Frames are rendered at 2x and downsampled,
   with light grain.
   `preview` writes the first, middle and last frames as PNGs only.

Per-shot values (horizon row, waterline line, camera amounts, crop) sit at the
top of `render_parallax.py` and `fill_background.py`. Set them for each new PSD.

Dependencies: `pip install psd-tools opencv-python-headless pillow numpy`, plus `ffmpeg`.
Source PSDs stay in Dropbox; they are not committed.

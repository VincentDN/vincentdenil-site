"""Original seamless 4K plain-weave polyester preview maps (no external assets)."""
from pathlib import Path
import numpy as np
from PIL import Image

out = Path(__file__).resolve().parent.parent / 'textures'
out.mkdir(exist_ok=True)
n = 4096
# 128 yarns across a 64 mm tile: illustrative 0.5 mm yarn pitch.
y, x = np.mgrid[:n, :n].astype(np.float32) / 32
warp = np.maximum(0, np.sin(np.pi * (x % 1))) ** .65
weft = np.maximum(0, np.sin(np.pi * (y % 1))) ** .65
over = ((np.floor(x) + np.floor(y)) % 2) == 0
height = np.where(over, warp * (.65 + .35 * weft), weft * (.65 + .35 * warp))
height += .025 * np.sin(x * np.pi * 10) * np.sin(y * np.pi * 10)
detail = np.clip(.88 + .12 * height, 0, 1)
Image.fromarray(np.uint8(detail * 255)).save(out / 'polyester-weave-4k.png', optimize=True)
# Central differences are periodic, matching repeat wrapping. OpenGL tangent normals.
dx = (np.roll(height, -1, axis=1) - np.roll(height, 1, axis=1)) * 1.7
dy = (np.roll(height, -1, axis=0) - np.roll(height, 1, axis=0)) * 1.7
normal = np.stack((-dx, dy, np.ones_like(dx)), axis=-1)
normal /= np.linalg.norm(normal, axis=-1, keepdims=True)
Image.fromarray(np.uint8(np.clip(normal * .5 + .5, 0, 1) * 255)).save(out / 'polyester-normal-4k.png', optimize=True)
for p in out.glob('*.png'):
    print(p.name, Image.open(p).size, p.stat().st_size)

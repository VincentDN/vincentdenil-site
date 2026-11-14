"""Split a layered PSD into depth planes (PNG, full canvas, straight alpha).

Usage: python3 extract_planes.py shot.psd WORKDIR planes.json

planes.json maps plane name -> list of layer/group names, back to front, e.g.
  {"bg": ["Group 3", "Group 5"], "ship": ["Group 2", "Layer 5 copy"],
   "water": ["Layer 6"], "shiptop": ["Layer 9", "Layer 16", "Layer 16 copy"]}
A layer belongs to a plane if it, or any group above it, is listed. psd-tools
composites each plane so clipping masks and opacity match Photoshop. The script
re-stacks the planes and reports the difference from the full PSD composite.
"""
import json, sys
import numpy as np
from PIL import Image
from psd_tools import PSDImage

psd_path, work, cfg = sys.argv[1], sys.argv[2], sys.argv[3]
planes = json.load(open(cfg))
p = PSDImage.open(psd_path); W, H = p.size

def ancestors(l):
    names = []
    while l is not None and l is not p:
        names.append(l.name); l = l.parent
    return names

leaves = [l for l in p.descendants() if l.kind != "group"]
for l in p.descendants():
    print(f"{l.kind:12s} {l.name!r:50s} parent={l.parent.name!r} bbox={l.bbox}")

stack = np.zeros((H, W, 3), np.float32)
for name, layers in planes.items():
    keep = {id(l) for l in leaves if set(ancestors(l)) & set(layers)}
    im = p.composite(viewport=(0, 0, W, H), force=True,
                     layer_filter=lambda l, keep=keep: l.kind == "group" or id(l) in keep).convert("RGBA")
    im.save(f"{work}/P_{name}.png")
    a = np.asarray(im).astype(np.float32) / 255
    stack = a[..., :3] * a[..., 3:] + stack * (1 - a[..., 3:])
comp = p.composite().convert("RGB"); comp.save(f"{work}/comp.png")
d = np.abs(stack - np.asarray(comp).astype(np.float32) / 255)
print(f"re-stack vs PSD composite: mean {d.mean():.4f}, max {d.max():.3f}")

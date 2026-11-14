"""2.5D slow-motion parallax renderer for layered PSD plates.

Depth model: a ground plane (sea) whose inverse depth grows linearly below the
horizon, sky at infinity, and the ship standing on the sea with each column's
depth taken from its waterline. Camera = lateral truck + slight rise + dolly-in,
so every plane moves by (camera motion x inverse depth): true perspective parallax.
"""
import sys, subprocess, numpy as np, cv2
from PIL import Image

WORK = sys.argv[1]
OUT = sys.argv[2]
PREVIEW = len(sys.argv) > 3 and sys.argv[3] == "preview"

FPS, DUR = 24, 10.0
OW, OH = 1920, 1080
YH = 368.0                      # horizon row (source px)

def load(name):
    return np.asarray(Image.open(f"{WORK}/{name}").convert("RGBA")).astype(np.float32) / 255

bg = load("P_bg_fill.png"); ship = load("P_ship.png")
water = load("P_water.png"); shiptop = load("P_shiptop.png")
H, W = bg.shape[:2]

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def par_ground(y):
    return np.clip((y - YH) / (H - YH), 0, None)

def par_ship(x, y):
    wl = 1304.0 - 0.2385 * (np.clip(x, 176, 2511) - 250.0)
    return (wl - YH) / (H - YH)

def sky_w(y):
    t = np.clip((YH + 15 - y) / 60.0, 0, 1)
    return t * t * (3 - 2 * t)

# camera parameters (source px, at inverse-depth 1 = bottom of frame)
TX, TY = 150.0, 28.0            # content drift right (camera trucks left) and down (camera rises)
DOLLY = 0.075                   # dolly-in strength
C = np.array([1450.0, 820.0])   # dolly focus (ship midships)
CLOUD = 38.0                    # extra cloud drift (px over shot)
ZOOM0, ZOOM1 = 1.14, 1.185      # global crop factor start/end (slow lens push)
VIEW_C0 = np.array([1376.0, 768.0]); VIEW_C1 = np.array([1350.0, 772.0])

def ease(u):
    return 0.45 * u + 0.55 * (u * u * (3 - 2 * u))

def disp(px, py, kind, s):
    if kind == "ship":
        p = par_ship(px, py)
    else:
        p = par_ground(py)
    dx = s * (TX * p + DOLLY * p * (px - C[0]))
    dy = s * (TY * p + DOLLY * p * (py - C[1]))
    if kind == "bg":
        dx = dx + s * CLOUD * sky_w(py)
    return dx, dy

def warp(layer, kind, s):
    px, py = xx.copy(), yy.copy()
    for _ in range(3):                       # solve p + d(p) = q
        dx, dy = disp(px, py, kind, s)
        px, py = xx - dx, yy - dy
    return cv2.remap(layer, px.astype(np.float32), py.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

def over(dst, src):
    a = src[..., 3:4]
    return src[..., :3] * a + dst * (1 - a)

def frame(i, n):
    u = i / (n - 1); s = ease(u)
    out = warp(bg, "bg", s)[..., :3]
    out = over(out, warp(ship, "ship", s))
    out = over(out, warp(water, "ground", s))
    out = over(out, warp(shiptop, "ship", s))
    z = ZOOM0 + (ZOOM1 - ZOOM0) * s
    c = VIEW_C0 + (VIEW_C1 - VIEW_C0) * s
    vw = W / z; vh = vw * OH / OW
    SS = 2
    sc = OW * SS / vw
    M = np.array([[sc, 0, -(c[0] - vw / 2) * sc], [0, sc, -(c[1] - vh / 2) * sc]], np.float32)
    big = cv2.warpAffine(out, M, (OW * SS, OH * SS), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(1, 0, 1))
    img = cv2.resize(big, (OW, OH), interpolation=cv2.INTER_AREA)
    rng = np.random.default_rng(i)
    g = cv2.GaussianBlur(rng.normal(0, 1, (OH, OW)).astype(np.float32), (0, 0), 0.7)
    img = img + g[..., None] * 0.012
    return (np.clip(img, 0, 1) * 255 + 0.5).astype(np.uint8)

n = int(FPS * DUR)
if PREVIEW:
    for i in [0, n // 2, n - 1]:
        Image.fromarray(frame(i, n)).save(f"{OUT}_f{i:03d}.png")
    sys.exit()

ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                       "-s", f"{OW}x{OH}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow",
                       "-crf", "15", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
for i in range(n):
    ff.stdin.write(frame(i, n).tobytes())
ff.stdin.close(); ff.wait()
print("done", OUT)

import sys, numpy as np, cv2
from PIL import Image
WORK=sys.argv[1]
bg=np.asarray(Image.open(f'{WORK}/P_bg.png').convert('RGB')).astype(np.float32)
sa=np.maximum(np.asarray(Image.open(f'{WORK}/P_ship.png'))[...,3],np.asarray(Image.open(f'{WORK}/P_shiptop.png'))[...,3])
raw=(sa>5).astype(np.uint8)
solid=cv2.morphologyEx(raw,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(15,15)))
thin=raw&(1-cv2.dilate(solid,np.ones((5,5),np.uint8)))
band=cv2.dilate(thin,np.ones((41,41),np.uint8))
g=cv2.cvtColor(bg.astype(np.uint8),cv2.COLOR_RGB2GRAY)
bh=cv2.morphologyEx(g,cv2.MORPH_BLACKHAT,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))
cand=((bh>22)&(band>0)).astype(np.uint8)*255
segs=cv2.HoughLinesP(cand,1,np.pi/720,threshold=150,minLineLength=300,maxLineGap=8)
lines=np.zeros_like(g)
for x1,y1,x2,y2 in (segs.reshape(-1,4) if segs is not None else []):
    sl=(y2-y1)/((x2-x1) or 1e-6)
    if abs(sl) < 0.2: continue   # skip horizontal sea strokes
    dx,dy=x2-x1,y2-y1; n=(dx*dx+dy*dy)**0.5; ux,uy=dx/n,dy/n
    cv2.line(lines,(int(x1-ux*3000),int(y1-uy*3000)),(int(x2+ux*3000),int(y2+uy*3000)),255,5)
lines=lines*(cv2.dilate(thin,np.ones((101,101),np.uint8))>0)*(1-cv2.dilate(solid,np.ones((9,9),np.uint8)))
# hand paint-out of stray rigging/stays painted into the flattened background plate
MANUAL=[((1444,430),(1444,625)),((1318,488),(1472,620)),((2012,305),(2012,512)),((2060,305),(2060,480)),
        ((2100,342),(2436,430)),((2410,468),(2430,560)),((1735,284),(1860,262)),((1960,290),(2100,300))]
for (x1,y1),(x2,y2) in MANUAL: cv2.line(lines,(x1,y1),(x2,y2),255,9)
print('segments',0 if segs is None else len(segs),'line px',(lines>0).sum())
cv2.imwrite(WORK+'/lines.png',lines)
bg=cv2.inpaint(bg.astype(np.uint8),lines,4,cv2.INPAINT_TELEA).astype(np.float32)
m=cv2.dilate(solid,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(13,13))).astype(bool)
H,W=m.shape; out=bg.copy()
def strip(lo,hi,L,rev):
    # L samples tiled with reflection from known segment [lo,hi)
    n=hi-lo
    k=np.arange(L)
    per=2*n-2 if n>1 else 1
    t=k%per; t=np.where(t<n,t,per-t)
    return lo+(n-1-t if rev else t)
for y in range(H):
    r=m[y]
    if not r.any(): continue
    d=np.diff(np.concatenate([[0],r.astype(np.int8),[0]])); st=np.where(d==1)[0]; en=np.where(d==-1)[0]
    for j,(a,b) in enumerate(zip(st,en)):
        L=b-a; idx=np.arange(L)
        llo=en[j-1] if j>0 else 0; rhi=st[j+1] if j+1<len(st) else W
        haveL=a-llo>8; haveR=rhi-b>8
        if haveL: ls=strip(llo,a,L,True)[::-1]       # ends adjacent to a
        if haveR: rs=strip(b,rhi,L,False)
        if not haveL and not haveR: continue
        if not haveL: ls=rs
        if not haveR: rs=ls
        w=((idx+0.5)/L)[:,None]
        out[y,a:b]=bg[y,ls]*(1-w)+bg[y,rs]*w
bl=cv2.GaussianBlur(out,(0,0),sigmaX=0.8,sigmaY=2.0)
mf=cv2.GaussianBlur(m.astype(np.float32),(0,0),3)[...,None]
res=bg*(1-mf)+(out*0.5+bl*0.5)*mf
# thin rigging: small local inpaint
tm=cv2.dilate(thin,np.ones((7,7),np.uint8))*(~m).astype(np.uint8)*255
r8=np.clip(res,0,255).astype(np.uint8)
r8=cv2.inpaint(r8,tm,5,cv2.INPAINT_TELEA)
Image.fromarray(r8).save(f'{WORK}/P_bg_fill.png')
Image.fromarray(r8).resize((1376,768)).save(f'{WORK}/bgfill_s.jpg')

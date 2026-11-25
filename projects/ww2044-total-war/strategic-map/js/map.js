// The painted map: one plane over the baked world, coloured in a shader (painterly seas, textured shallows, coastal
// contour lines, wave strokes, nation fills on hill-shaded terrain, tree and mountain marks, subtle province borders),
// with a canvas overlay for rivers, trade routes and lettering. Below it, the wooden table the map lies on.
import * as T from 'three';
import {WORLD, PROVINCES, NATIONS} from './world.js';
const GLSL_NOISE = `
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),u.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=vn(p)*a;p=p*2.03+17.1;a*=.5;}return s;}
float fbm3(vec2 p){float s=0.,a=.5;for(int i=0;i<3;i++){s+=vn(p)*a;p=p*2.03+17.1;a*=.5;}return s;}
`;

export function buildMap(scene, grid, overlayTex) {
  // data texture: r = height, g = signed distance to the coast, b = distance to a province border, a = to a nation border
  const data = new Float32Array(grid.cols * grid.rows * 4);
  for (let k = 0; k < grid.cols * grid.rows; k++) { data[k * 4] = grid.h[k]; data[k * 4 + 1] = grid.sd[k]; data[k * 4 + 2] = Math.min(grid.dp[k], 60); data[k * 4 + 3] = Math.min(grid.dn[k], 60); }
  const half = new Uint16Array(data.length);
  for (let i = 0; i < data.length; i++) half[i] = T.DataUtils.toHalfFloat(data[i]);
  const tData = new T.DataTexture(half, grid.cols, grid.rows, T.RGBAFormat, T.HalfFloatType);
  tData.magFilter = tData.minFilter = T.LinearFilter;
  tData.needsUpdate = true;

  // province ids per cell (nearest), and each province's nation colour
  const ids = new Uint8Array(grid.cols * grid.rows * 4);
  for (let k = 0; k < grid.cols * grid.rows; k++) { const p = grid.pid[k] < 0 ? 511 : grid.pid[k]; ids[k * 4] = p & 255; ids[k * 4 + 1] = p >> 8; }
  const tId = new T.DataTexture(ids, grid.cols, grid.rows);
  tId.needsUpdate = true;
  // each cell's nation colour, filtered, so fills meet smoothly under the border line
  const natRGB = NATIONS.map(n => { const c = new T.Color(n.color); return [c.r * 255, c.g * 255, c.b * 255]; });
  const cols = new Uint8Array(grid.cols * grid.rows * 4);
  for (let k = 0; k < grid.cols * grid.rows; k++) { const p = grid.pid[k]; if (p >= 0) cols.set(natRGB[PROVINCES[p].nation], k * 4); cols[k * 4 + 3] = 255; }
  const tPal = new T.DataTexture(cols, grid.cols, grid.rows);
  tPal.magFilter = tPal.minFilter = T.LinearFilter;
  tPal.needsUpdate = true;
  const uniforms = {
    tData: {value: tData}, tOver: {value: overlayTex}, tId: {value: tId}, tPal: {value: tPal},
    uWorld: {value: new T.Vector2(WORLD.w, WORLD.d)}, uCell: {value: new T.Vector2(1 / grid.cols, 1 / grid.rows)},
    uHover: {value: -1}, uSel: {value: -1}, uTime: {value: 0},
  };
  const geo = new T.PlaneGeometry(WORLD.w, WORLD.d, 480, 320);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let k = 0; k < pos.count; k++) {
    const x = pos.getX(k), z = pos.getZ(k);
    const i = Math.round(((x + WORLD.w / 2) / WORLD.w) * (grid.cols - 1)), j = Math.round(((z + WORLD.d / 2) / WORLD.d) * (grid.rows - 1));
    pos.setY(k, Math.max(0, grid.h[j * grid.cols + i]) * 0.45);
  }
  const mat = new T.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 vP;void main(){vP=position.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `
precision highp float;
uniform sampler2D tData,tOver,tId,tPal;uniform vec2 uWorld,uCell;
uniform int uHover,uSel;uniform float uTime;varying vec2 vP;
${GLSL_NOISE}
float line(float d,float w,float px){return 1.-smoothstep(w*.5,w*.5+px,abs(d));}
void main(){
  vec2 uv=(vP+uWorld*.5)/uWorld;
  vec4 D=texture2D(tData,uv);float h=D.r,sd=D.g;
  float px=length(fwidth(vP));
  float wob=(fbm3(vP*.08)-.5)*2.6+(vn(vP*.5)-.5)*.6;
  float s=sd+wob;
  vec3 col;
  if(s>0.){
    // provinces: the baked id under this point, and the distances to the nearest province and nation borders
    vec4 I=texelFetch(tId,ivec2(uv*vec2(textureSize(tId,0)-1)+.5),0);
    int i1=int(I.r*255.+.5)+256*int(I.g*255.+.5);
    vec3 nat=texture2D(tPal,uv).rgb;
    float edge=D.b,nedge=D.a;
    // hill shade from the height field
    float hx=(texture2D(tData,uv+vec2(uCell.x*2.,0)).r-texture2D(tData,uv-vec2(uCell.x*2.,0)).r)*.5;
    float hz=(texture2D(tData,uv+vec2(0,uCell.y*2.)).r-texture2D(tData,uv-vec2(0,uCell.y*2.)).r)*.5;
    vec3 N=normalize(vec3(-hx*.55,3.,-hz*.55));float sh=dot(N,normalize(vec3(-.8,1.2,-.6)));
    float g=fbm(vP*.21);float g2=vn(vP*1.3);
    vec3 paper=vec3(.74,.75,.68);
    vec3 nd=mix(vec3(dot(nat,vec3(.3,.59,.11))),nat,.78);col=mix(nd,paper,.24)*(.9+.12*g+.05*g2);
    col*=.86+.2*sh;
    float mtn=smoothstep(20.,46.,h+(g-.5)*10.);
    col=mix(col,mix(col,vec3(.86,.88,.84),.4),mtn*mtn*(.35+.3*fbm3(vP*.05)));
    col*=1.-.15*mtn*smoothstep(.15,.0,sh-.55);
    // forest marks: small conifers in clusters
    float forest=smoothstep(.5,.62,fbm3(vP*.011+3.))*(1.-mtn)*smoothstep(4.,12.,sd);
    vec2 c=vP/vec2(5.5,6.5);vec2 ci=floor(c);vec2 f=fract(c)-.5-(vec2(h21(ci),h21(ci+7.))-.5)*.4;
    float tri=step(abs(f.x)*2.4,f.y+.28)*step(f.y,.22);float tree=tri*step(.3,h21(ci+3.))*forest;
    float fade=1.-smoothstep(.9,2.,px);
    col=mix(col,col*vec3(.55,.66,.55),tree*.75*fade+forest*.12);
    // provinces and nations
    if(i1==uHover)col=mix(col,vec3(1.,.97,.86),.14);
    if(i1==uSel)col=mix(col,vec3(1.,.95,.75),.22);
    col=mix(col,col*.6,line(edge,.7+px*.6,px)*.5);
    col=mix(col,col*.85+vec3(.04),smoothstep(12.,0.,nedge)*.5);
    col=mix(col,col*.4,line(nedge,1.8+px*.6,px)*.95);
    // coast: dark rim with a light inner edge
    col=mix(col,vec3(.12,.2,.2),line(s-.9,2.0+px*.5,px)*.95);
    col=mix(col,col*1.08,smoothstep(5.,2.,s)*.4);
  }else{
    float dep=-s;
    float m=fbm(vP*.0035+3.)*.6+fbm3(vP*.013)*.4;
    vec3 deep=vec3(.07,.11,.14),mid=vec3(.13,.2,.24),shal=vec3(.32,.4,.42);
    col=mix(mid,deep,smoothstep(.15,1.,dep/230.+(m-.5)*.9));
    col+=vec3(.06,.08,.1)*smoothstep(.55,.85,fbm(vP*.005+9.));
    // textured shallows: pale, broken, frothy
    float shelfN=(fbm3(vP*.025)-.5)*40.;
    float shelf=1.-smoothstep(10.,95.,dep+shelfN*1.4);
    float froth=smoothstep(.4,.8,fbm(vP*.09+vec2(uTime*.015,0.)))*(.6+.4*vn(vP*.6));
    float streak=smoothstep(.55,.9,fbm3(vec2(vP.x*.02,vP.y*.06)+5.));
    col=mix(col,mix(shal,vec3(.8,.84,.86),clamp(froth*.7+streak*.25,0.,1.)),shelf*(.5+.4*froth));
    col=mix(col,vec3(.62,.7,.74),(1.-smoothstep(0.,6.,dep))*.5);
    // contour lines: the dark coastal band, a fine pale line, a dashed outer line
    col=mix(col,vec3(.1,.16,.23),line(dep-3.,3.+px*.4,px)*.85);
    col=mix(col,vec3(.72,.79,.84),line(dep-70.-shelfN*.5,.8+px*.4,px)*.4);
    col=mix(col,vec3(.86,.89,.9),line(dep-110.-shelfN*.3,1.+px*.5,px)*.6*step(.42,fract(atan(vP.y-0.,vP.x+0.)*90.+length(vP)*.03)));
    // wave strokes
    float band=smoothstep(14.,30.,dep)*(1.-smoothstep(70.,140.,dep));
    vec2 wc=vP/vec2(15.,6.);vec2 wi=floor(wc);vec2 wf=fract(wc);
    float sq=.5+.13*sin(wf.x*18.85);
    float stroke=(1.-smoothstep(.04,.04+px*.2,abs(wf.y-sq)))*step(.12,wf.x)*step(wf.x,.88)*step(.62,h21(wi+11.));
    col=mix(col,col*.62,stroke*band*.7*(1.-smoothstep(1.,2.5,px)));
  }
  // graticule: a fine 100-unit grid and a stronger 400-unit grid, as on a staff map
  vec2 gq=abs(fract(vP/100.+.5)-.5)*100.,gQ=abs(fract(vP/400.+.5)-.5)*400.;
  float gl=max(line(min(gq.x,gq.y),.5+px*.2,px)*.07,line(min(gQ.x,gQ.y),1.+px*.4,px)*.16);
  col=mix(col,vec3(.85,.92,.9),gl);
  vec4 o=texture2D(tOver,uv);col=mix(col,o.rgb,o.a);
  // projected light: a slight cyan-white lift and gentle channel fringing toward the edges
  col=col*vec3(.96,1.,1.02)+vec3(.012,.02,.024);
  // the sheet: darker towards its edges, a thin lighter border
  vec2 e=min(uv,1.-uv)*uWorld;float ed=min(e.x,e.y);
  col*=.82+.18*smoothstep(0.,120.,ed);
  col=mix(col,vec3(.8,.86,.82),line(ed-6.,1.2,px)*.35);
  gl_FragColor=vec4(col,1.);
}`,
  });
  mat.extensions = {derivatives: true};
  const mesh = new T.Mesh(geo, mat);
  scene.add(mesh);

  // the table under the map
  const tmat = new T.ShaderMaterial({
    vertexShader: `varying vec2 vP;void main(){vP=position.xz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vP;${GLSL_NOISE}
void main(){vec2 p=vP*vec2(.004,.04);float g=fbm(vec2(p.x+fbm(p*2.)*1.5,p.y));float r=fract(g*9.+vP.y*.004);
vec3 c=vec3(.055,.065,.06)*(.85+.3*fbm(vP*.02))+vec3(.02)*vn(vP*vec2(.3,.03));
c*=.7+.3*smoothstep(-1800.,-500.,-length(vP));gl_FragColor=vec4(c,1.);}`,
  });
  tmat.extensions = {derivatives: true};
  const table = new T.Mesh(new T.PlaneGeometry(9000, 7000).rotateX(-Math.PI / 2), tmat);
  table.position.y = -3;
  scene.add(table);
  // a soft shadow where the sheet lies on the table
  const sc = document.createElement('canvas');
  sc.width = sc.height = 64;
  const sg = sc.getContext('2d');
  sg.fillStyle = '#000';
  sg.filter = 'blur(6px)';
  sg.fillRect(10, 10, 44, 44);
  const shadow = new T.Mesh(new T.PlaneGeometry(WORLD.w * 1.45, WORLD.d * 1.45).rotateX(-Math.PI / 2), new T.MeshBasicMaterial({map: new T.CanvasTexture(sc), transparent: true, opacity: 0.55, depthWrite: false}));
  shadow.position.set(25, -2, 30);
  scene.add(shadow);
  return {mesh, uniforms};
}

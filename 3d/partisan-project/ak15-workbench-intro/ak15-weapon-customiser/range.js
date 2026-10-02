// Range drill: five rounds at a 25 m target. Shot spread and pace come from the build's stats,
// so the same drill scores differently for a scoped, suppressed rifle than for a bare carbine.
// Pure maths plus a small canvas renderer; no Three.js.
export const DRILL={rounds:5,distance:25};

// Spread model (cm at 25 m, 1σ): aiming error from the sight plus follow-up error from recoil
// and sway, which grows with each shot in the string.
export function drillPlan(summary,kg){
 const sightErr=Math.max(1.2,9-summary.sighting*.08);// 4× scope ≈ 1.8 cm, irons ≈ 6 cm
 // Recoil hurts follow-up shots more than linearly: a bare, stockless carbine walks off the board.
 const recoilErr=(summary.recoil/100)**2*16;
 const swayErr=.8+kg*.45+(100-summary.ergo)*.04;
 const split=Math.max(.28,.95-summary.handling*.0075);// seconds between shots
 const draw=Math.max(.5,1.4-summary.handling*.01);// time to the first shot
 return {sightErr,recoilErr,swayErr,split,draw};
}
// Gaussian from two uniforms (Box–Muller).
function gauss(rand){let u=0;while(!u)u=rand();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*rand());}
export function fireString(plan,rand=Math.random){
 const shots=[];let climb=0;
 for(let i=0;i<DRILL.rounds;i++){
  const spread=Math.hypot(plan.sightErr,plan.swayErr,i?plan.recoilErr:0);
  climb+=i?plan.recoilErr*.45:0;// uncorrected muzzle climb walks shots up the target
  shots.push({x:gauss(rand)*spread,y:gauss(rand)*spread+climb,t:plan.draw+i*plan.split});
 }
 return shots;
}
// Rings in cm (radius) and their scores.
const RINGS=[[5,10],[10,9],[15,8],[22,7],[30,6],[40,5]];
export function score(shots){
 const points=shots.map(s=>{const r=Math.hypot(s.x,s.y);return RINGS.find(([rad])=>r<=rad)?.[1]??0;});
 let group=0;for(const a of shots)for(const b of shots)group=Math.max(group,Math.hypot(a.x-b.x,a.y-b.y));
 return {points,total:points.reduce((a,b)=>a+b,0),max:10*shots.length,group,time:shots.at(-1)?.t??0};
}
// Draw the target and the first `count` hits onto a canvas (CSS size w×h).
export function drawTarget(canvas,shots,count){
 const dpr=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||220,h=canvas.clientHeight||220;
 canvas.width=w*dpr;canvas.height=h*dpr;const g=canvas.getContext('2d');g.scale(dpr,dpr);
 const cx=w/2,cy=h/2,k=(Math.min(w,h)/2-6)/45;// px per cm; the board is 90 cm across
 g.fillStyle='#e9e4d6';g.fillRect(cx-45*k,cy-45*k,90*k,90*k);
 for(const [rad,val] of [...RINGS].reverse()){g.beginPath();g.arc(cx,cy,rad*k,0,Math.PI*2);g.fillStyle=val>=9?'#2b2f33':'#e9e4d6';g.fill();g.strokeStyle=val>=9?'#e9e4d6':'#2b2f33';g.lineWidth=1;g.stroke();}
 g.fillStyle='#ef8f39';g.strokeStyle='#1b1d20';g.lineWidth=1.5;
 shots.slice(0,count).forEach((s,i)=>{const x=cx+s.x*k,y=cy-s.y*k;g.beginPath();g.arc(x,y,4,0,Math.PI*2);g.fill();g.stroke();
  g.fillStyle='#1b1d20';g.font='600 9px ui-monospace,monospace';g.fillText(String(i+1),x+5,y-5);g.fillStyle='#ef8f39';});
}

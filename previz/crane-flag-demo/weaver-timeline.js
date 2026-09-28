// Portable, JSON-only interaction format. Times are seconds from the end of the countdown.
export const PROJECT={id:'crane-flag-demo',revision:'weaver-crane-v1'};
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const vec=v=>Array.isArray(v)&&v.length===3&&v.every(n=>finite(n)&&Math.abs(n)<=10000);
export function validCamera(c){return c&&vec(c.position)&&vec(c.target)&&finite(c.zoom)&&c.zoom>0&&c.zoom<=20;}
export function validState(s){return s&&['metric','imperial'].includes(s.units)&&(s.selected===null||['width','height','hoist','clearance','jib','human'].includes(s.selected))&&['crane','flag','front','mount',null].includes(s.view)&&['showDimensions','human','motion'].every(k=>typeof s[k]==='boolean')&&finite(s.wind)&&s.wind>=0&&s.wind<=1&&validCamera(s.camera);}
export function validAction(a){
 if(!a||typeof a!=='object')return false;
 if(a.type==='view')return ['crane','flag','front','mount'].includes(a.value);
 if(a.type==='selection')return a.value===null||['width','height','hoist','clearance','jib','human'].includes(a.value);
 if(a.type==='units')return ['metric','imperial'].includes(a.value);
 if(['showDimensions','human','motion'].includes(a.type))return typeof a.value==='boolean';
 if(a.type==='wind')return finite(a.value)&&a.value>=0&&a.value<=1;
 return false;
}
export function validateTimeline(data){
 const fail=message=>{throw new Error(message);};
 if(!data||data.schemaVersion!==1||data.project?.id!==PROJECT.id||data.project?.revision!==PROJECT.revision)fail('This track belongs to a different project or format.');
 if(!finite(data.duration)||data.duration<0||data.duration>14400||!validState(data.initialState))fail('Invalid duration or initial scene state.');
 if(!finite(data.syncOffset)||data.syncOffset<0||data.syncOffset>14400)fail('Invalid video offset.');
 for(const key of ['actions','camera','pointer']){
  const track=data[key];if(!Array.isArray(track)||track.length>400000)fail('Invalid or oversized track.');
  let last=-1;
  for(const e of track){
   if(!finite(e.time)||e.time<last||e.time<0||e.time>data.duration+.001)fail('Track events must be ordered within the recording duration.');last=e.time;
   if(key==='actions'&&!validAction(e))fail('Unsupported scene action.');
   if(key==='camera'&&!validCamera(e))fail('Invalid camera keyframe.');
   if(key==='pointer'&&(!['move','click'].includes(e.kind)||!['stage','sidebar'].includes(e.surface)||!finite(e.x)||!finite(e.y)||e.x<0||e.x>1||e.y<0||e.y>1||!(e.target===null||typeof e.target==='string'&&/^(view|units|measurement|marker|control):[a-z]+$/.test(e.target))))fail('Invalid pointer event.');
  }
 }
 return data;
}
export class InteractionRecorder{
 constructor(now=()=>performance.now()){this.now=now;this.active=false;this.data=null;}
 start(initialState){
  if(this.active)throw new Error('A recording is already running.');
  if(!validState(initialState))throw new Error('The scene is not ready to record.');
  this.started=this.now();this.active=true;this.lastCamera=-1;this.lastPointer=-1;
  this.data={schemaVersion:1,feature:'WeaverShell',project:{...PROJECT},createdAt:new Date().toISOString(),duration:0,syncOffset:0,initialState:structuredClone(initialState),actions:[],camera:[{time:0,...structuredClone(initialState.camera)}],pointer:[]};
 }
 time(){return Math.round((this.now()-this.started))/1000;}
 action(action){if(this.active&&validAction(action))this.data.actions.push({time:this.time(),...structuredClone(action)});}
 camera(camera,force=false){if(!this.active||!validCamera(camera))return;const time=this.time();if(force||time-this.lastCamera>=.1){this.data.camera.push({time,...structuredClone(camera)});this.lastCamera=time;}}
 pointer(event){if(!this.active)return;const time=this.time();if(event.kind==='click'||time-this.lastPointer>=.05){this.data.pointer.push({time,...event});this.lastPointer=time;}}
 stop(camera){if(!this.active)return this.data;this.camera(camera,true);this.data.duration=this.time();this.active=false;return validateTimeline(this.data);}
}

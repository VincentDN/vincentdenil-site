import {validateTimeline} from './weaver-timeline.js';

export function lastAt(track,time){let lo=0,hi=track.length;while(lo<hi){const mid=(lo+hi)>>>1;if(track[mid].time<=time)lo=mid+1;else hi=mid;}return lo-1;}

// Precompute discrete states once; seeking is O(log n), not a replay of DOM clicks.
export class TimelineModel{
 constructor(track){
  this.track=validateTimeline(structuredClone(track));
  let state={...this.track.initialState};this.states=[];
  for(const action of this.track.actions){state={...state,[action.type==='selection'?'selected':action.type]:action.value};this.states.push(state);}
  let phase=0,last=0,moving=this.track.initialState.motion;
  this.motion=[{time:0,phase:0,moving}];
  for(const action of this.track.actions)if(action.type==='motion'){phase+=moving?action.time-last:0;last=action.time;moving=action.value;this.motion.push({time:last,phase,moving});}
 }
 at(time){
  time=Math.max(0,Math.min(this.track.duration,time));
  const index=lastAt(this.track.actions,time),base=index<0?this.track.initialState:this.states[index];
  const keys=this.track.camera,i=lastAt(keys,time),a=i<0?{time:0,...this.track.initialState.camera}:keys[i],b=keys[i+1];
  let camera={position:[...a.position],target:[...a.target],zoom:a.zoom};
  if(b&&!b.cut&&b.time>a.time){const k=Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time)));camera={position:a.position.map((v,j)=>v+(b.position[j]-v)*k),target:a.target.map((v,j)=>v+(b.target[j]-v)*k),zoom:a.zoom+(b.zoom-a.zoom)*k};}
  const m=this.motion[lastAt(this.motion,time)];
  return {state:{...base,camera},phase:m.phase+(m.moving?time-m.time:0)};
 }
}

export class WeaverPlayer{
 constructor(video,adapter,onStatus=()=>{}){
  this.video=video;this.adapter=adapter;this.onStatus=onStatus;this.model=null;this.following=false;this.suspended=false;this.lastTime=-1;
  this.cursor=document.createElement('div');this.cursor.className='weaver-cursor';this.cursor.hidden=true;this.cursor.setAttribute('aria-hidden','true');document.body.append(this.cursor);
  this.ring=document.createElement('div');this.ring.className='weaver-replay-ring';this.ring.hidden=true;this.ring.setAttribute('aria-hidden','true');document.body.append(this.ring);
  video.addEventListener('play',()=>{if(!this.model||this.suspended)return;this.following=true;this.sync(true);this.onStatus('Playing tour');});
  for(const type of ['seeked','seeking','timeupdate','pause','ended'])video.addEventListener(type,()=>{if(this.following)this.sync(true);});
  const interrupt=e=>{
   if(!this.following||!(e.target instanceof Element)||e.target.closest('.demo-card,.demo-dialog,.weaver-author'))return;
   if(!e.target.closest('#stage,aside'))return;
   if(e.type==='keydown'&&!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','=','Enter',' '].includes(e.key))return;
   this.explore();
  };
  for(const type of ['pointerdown','wheel','keydown'])document.addEventListener(type,interrupt,{capture:true,passive:type==='wheel'});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  const frame=()=>{if(this.following&&!video.paused)this.sync();this.frame=requestAnimationFrame(frame);};this.frame=requestAnimationFrame(frame);
 }
 load(track){this.model=new TimelineModel(track);this.lastTime=-1;this.onStatus('Tour ready');if(this.following)this.sync(true);}
 clear(){this.video.pause();this.model=null;this.following=false;this.adapter.setPlaybackPhase(null);this.hidePointer();this.onStatus('Video only');}
 suspend(value){this.suspended=value;if(value)this.explore(false);}
 explore(notify=true){this.following=false;this.video.pause();this.adapter.setPlaybackPhase(null);this.hidePointer();if(notify&&this.model)this.onStatus('Exploring · resume when ready');}
 async resume(){if(!this.model||this.suspended)return;this.following=true;this.sync(true);try{await this.video.play();}catch{this.onStatus('Press Play to continue');}}
 sync(force=false){
  if(!this.model||this.suspended)return;
  const time=this.video.currentTime-this.model.track.syncOffset;
  if(!force&&time===this.lastTime)return;this.lastTime=time;
  const {state,phase}=this.model.at(time);this.adapter.setState(state);this.adapter.setPlaybackPhase(phase);
  if(time<0||time>this.model.track.duration){this.hidePointer();return;}
  const p=this.model.track.pointer;const i=lastAt(p,time);const event=p[i];
  this.cursor.hidden=true;this.ring.hidden=true;
  if(event&&time-event.time<2){const point=this.resolvePoint(event);if(point){this.cursor.hidden=false;this.cursor.style.left=point.x+'px';this.cursor.style.top=point.y+'px';}}
  // Only the most recent click in the last 650 ms is shown; seeking cannot fire old clicks.
  for(let j=i;j>=0&&time-p[j].time<.65;j--)if(p[j].kind==='click'){
   const point=this.resolvePoint(p[j]);if(point){const age=(time-p[j].time)/.65;this.ring.hidden=false;this.ring.style.left=point.x+'px';this.ring.style.top=point.y+'px';this.ring.style.opacity=1-age;this.ring.style.transform=`translate(-50%,-50%) scale(${matchMedia('(prefers-reduced-motion: reduce)').matches?1:1+age})`;}break;
  }
 }
 resolvePoint(event){
  if(event.target?.startsWith('marker:'))return this.adapter.projectMarker(event.target.split(':')[1]);
  if(event.target){const target=[...document.querySelectorAll('[data-weaver-id]')].find(el=>el.dataset.weaverId===event.target);if(!target||!target.getClientRects().length)return null;const r=target.getBoundingClientRect();const parent=target.closest('aside,#stage').getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;if(y<Math.max(0,parent.top)||y>Math.min(innerHeight,parent.bottom)||x<0||x>innerWidth)return null;return {x,y};}
  const surface=document.querySelector(event.surface==='stage'?'#stage':'aside');const r=surface.getBoundingClientRect();const x=r.left+r.width*event.x,y=r.top+r.height*event.y;return y>=0&&y<=innerHeight?{x,y}:null;
 }
 hidePointer(){this.cursor.hidden=this.ring.hidden=true;}
}

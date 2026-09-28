// WeaverShell: presenter video and opt-in interaction authoring.
import {weaverAdapter} from './viewer.js';
import {InteractionRecorder} from './weaver-timeline.js';
const card=document.querySelector('.demo-card');
const dialog=document.querySelector('.demo-dialog');
const input=document.querySelector('.demo-file');
const video=card.querySelector('video');
const feedback=document.querySelector('.demo-feedback');
let sourceURL=null;
const choose=()=>input.click();
card.querySelector('.demo-play').addEventListener('click',()=>dialog.showModal());
document.querySelector('.demo-close').addEventListener('click',()=>dialog.close());
document.querySelector('.demo-choose').addEventListener('click',choose);
card.querySelector('.demo-replace').addEventListener('click',()=>{feedback.textContent='';dialog.showModal();});
// Keep video controls and keyboard actions out of the underlying orbit viewer.
for(const type of ['pointerdown','pointerup','click','wheel','keydown'])card.addEventListener(type,e=>e.stopPropagation());
input.addEventListener('change',()=>{
 const file=input.files[0];if(!file)return;
 if(file.type&&!file.type.startsWith('video/')){feedback.textContent='Choose a video file.';input.value='';return;}
 video.pause();video.removeAttribute('src');video.load();
 if(sourceURL)URL.revokeObjectURL(sourceURL);
 sourceURL=URL.createObjectURL(file);video.src=sourceURL;
 feedback.textContent='Opening video…';input.value='';
});
video.addEventListener('loadedmetadata',()=>{
 card.querySelector('.demo-poster').hidden=true;video.hidden=false;card.querySelector('.demo-footer').hidden=false;
 feedback.textContent='';dialog.close();
 // A rejected play promise is normal when browser autoplay policy requires another click.
 video.play().catch(()=>{});
});
video.addEventListener('error',()=>{
 if(!sourceURL)return;
 video.hidden=true;card.querySelector('.demo-poster').hidden=false;card.querySelector('.demo-footer').hidden=true;
 feedback.textContent='This video could not be played. Try an MP4 with H.264 video and AAC audio.';
 if(!dialog.open)dialog.showModal();
});
window.addEventListener('pagehide',()=>{video.pause();});

// Authoring is explicit and kept out of the audience-facing page.
if(new URLSearchParams(location.search).get('author')==='1'){
 const panel=document.createElement('section');panel.className='weaver-author';panel.setAttribute('aria-label','WeaverShell authoring');
 panel.innerHTML=`<div class="weaver-author-title">WEAVERSHELL <span>AUTHOR MODE</span></div>
 <p class="weaver-session" role="status">Waiting for the project…</p>
 <div class="weaver-actions"><button type="button" data-record disabled>Record interactions</button><button type="button" data-stop disabled>Stop</button></div>
 <div class="weaver-actions"><button type="button" data-export disabled>Export track</button><button type="button" data-discard disabled>Discard track</button></div>
 <label class="weaver-offset">Video time at track start (s)<input type="number" min="0" max="14400" step="0.1" value="0" aria-label="Video time at track start in seconds"></label>
 <p class="weaver-author-note">Records page actions only. Start your webcam separately; use the countdown to align the take.</p>`;
 const compact=matchMedia('(max-width:780px)');
 const placeAuthor=()=>{const stage=document.querySelector('#stage');if(compact.matches)stage.parentElement.insertBefore(panel,stage);else stage.append(panel);};
 placeAuthor();compact.addEventListener('change',placeAuthor);
 for(const type of ['pointerdown','pointerup','click','wheel','keydown'])panel.addEventListener(type,e=>e.stopPropagation());
 const record=panel.querySelector('[data-record]'),stop=panel.querySelector('[data-stop]'),save=panel.querySelector('[data-export]'),discard=panel.querySelector('[data-discard]'),session=panel.querySelector('.weaver-session'),offset=panel.querySelector('input');
 const recorder=new InteractionRecorder();let countdown=null,tick=null,remaining=0,unsaved=false;
 const formatTime=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;
 const paint=()=>{session.textContent=`Recording ${formatTime(recorder.time())} · ${recorder.data.actions.length} actions`;};
 function finish(reason='Track ready to export.'){
  if(countdown!==null){clearInterval(countdown);countdown=null;session.textContent='Countdown cancelled.';record.disabled=false;stop.disabled=true;offset.disabled=false;return;}
  if(!recorder.active)return;
  recorder.stop(weaverAdapter.getState().camera);clearInterval(tick);tick=null;unsaved=true;
  record.disabled=true;stop.disabled=true;save.disabled=false;discard.disabled=false;offset.disabled=false;panel.classList.remove('is-recording');
  session.textContent=`${reason} ${formatTime(recorder.data.duration)} · ${recorder.data.actions.length} actions.`;
 }
 weaverAdapter.ready.then(()=>{
  record.disabled=false;session.textContent='Ready to capture a walkthrough.';
  weaverAdapter.subscribe(action=>{if(action.type==='camera')recorder.camera(action.value);else recorder.action(action);});
 });
 record.onclick=()=>{
  if(recorder.active||countdown!==null||unsaved)return;
  record.disabled=true;stop.disabled=false;save.disabled=true;discard.disabled=true;offset.disabled=true;remaining=3;
  session.textContent='3 · Start your webcam take';
  countdown=setInterval(()=>{
   remaining--;
   if(remaining){session.textContent=`${remaining} · Get ready`;return;}
   clearInterval(countdown);countdown=null;offset.value='0';
   recorder.start(weaverAdapter.getState());panel.classList.add('is-recording');paint();
   tick=setInterval(()=>{paint();if(recorder.time()>=14400)finish('Four-hour limit reached.');},250);
  },1000);
 };
 stop.onclick=()=>finish();
 save.onclick=()=>{
  const value=Number(offset.value);if(!Number.isFinite(value)||value<0||value>14400){session.textContent='Enter a video start time between 0 and 14400 seconds.';return;}
  recorder.data.syncOffset=value;
  const url=URL.createObjectURL(new Blob([JSON.stringify(recorder.data,null,2)],{type:'application/json'}));
  const download=document.createElement('a');download.href=url;download.download='weavershell-interactions.json';download.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  unsaved=false;record.disabled=false;session.textContent='Track exported. Keep it with your webcam recording.';
 };
 discard.onclick=()=>{recorder.data=null;unsaved=false;record.disabled=false;save.disabled=true;discard.disabled=true;offset.value='0';session.textContent='Track discarded. Ready for a new take.';};
 const surfaceOf=element=>{
  if(element.closest('.demo-card,.demo-dialog,.weaver-author'))return null;
  return element.closest('#stage')||element.closest('aside');
 };
 function pointer(e,kind){
  if(!recorder.active||!(e.target instanceof Element))return;
  const surface=surfaceOf(e.target);if(!surface)return;
  const rect=surface.getBoundingClientRect(),target=e.target.closest('[data-weaver-id]');
  let x=e.clientX,y=e.clientY;if(kind==='click'&&e.detail===0){const r=e.target.getBoundingClientRect();x=r.x+r.width/2;y=r.y+r.height/2;}
  const clamp=n=>Math.min(1,Math.max(0,n));
  recorder.pointer({kind,surface:surface.id==='stage'?'stage':'sidebar',target:target?.dataset.weaverId||null,x:clamp((x-rect.left)/rect.width),y:clamp((y-rect.top)/rect.height)});
  if(kind==='click'){
   const ring=document.createElement('span');ring.className='weaver-click';ring.style.left=x+'px';ring.style.top=y+'px';ring.setAttribute('aria-hidden','true');document.body.append(ring);setTimeout(()=>ring.remove(),750);
  }
 }
 document.addEventListener('pointermove',e=>pointer(e,'move'));
 document.addEventListener('click',e=>pointer(e,'click'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finish('Stopped because the page was hidden.');});
 window.addEventListener('beforeunload',e=>{if(recorder.active||unsaved){e.preventDefault();e.returnValue='';}});
}

import {InteractionRecorder} from './weaver-timeline.js';
import {WebcamCapture} from './weaver-camera.js';
import {downloadBlob} from './weaver-zip.js';
import {publishingPackage} from './weaver-publish.js';

export function initAuthor(app){
 const panel=document.createElement('section');panel.className='weaver-author';panel.setAttribute('aria-label','WeaverShell authoring');
 panel.innerHTML=`<div class="weaver-author-title">WEAVERSHELL <span>AUTHOR MODE</span></div>
 <p class="weaver-session" role="status">Ready to capture a walkthrough.</p>
 <div class="weaver-actions"><button type="button" data-record>Record interactions</button><button type="button" data-stop disabled>Stop</button></div>
 <div class="weaver-actions"><button type="button" data-export disabled>Export track</button><button type="button" data-discard disabled>Discard track</button></div>
 <label class="weaver-offset">Video time at track start (s)<input type="number" min="0" max="14400" step="0.001" value="0" aria-label="Video time at track start in seconds"></label>
 <details class="weaver-camera-tools"><summary>Camera & microphone</summary><video class="weaver-camera-preview" muted playsinline hidden aria-label="Live webcam preview"></video><p class="weaver-camera-status" role="status">Off · enable to record video and interactions together.</p><div class="weaver-actions"><button type="button" data-camera>Enable camera</button><button type="button" data-camera-off disabled>Turn off</button></div><button type="button" data-save-video disabled>Save webcam video</button></details>
 <button type="button" data-package disabled>Export publishing ZIP</button>
 <p class="weaver-author-note">Import a webcam video using PLAY DEMO, or enable the camera for a new take. Nothing uploads automatically.</p>`;
 const compact=matchMedia('(max-width:780px)');const place=()=>{const stage=document.querySelector('#stage');if(compact.matches)stage.parentElement.insertBefore(panel,stage);else stage.append(panel);};place();compact.addEventListener('change',place);
 for(const type of ['pointerdown','pointerup','click','wheel','keydown'])panel.addEventListener(type,e=>e.stopPropagation());
 const button=name=>panel.querySelector(`[data-${name}]`),record=button('record'),stop=button('stop'),save=button('export'),discard=button('discard'),bundle=button('package'),enable=button('camera'),off=button('camera-off'),saveVideo=button('save-video');
 const status=panel.querySelector('.weaver-session'),offset=panel.querySelector('input'),cameraStatus=panel.querySelector('.weaver-camera-status');
 const recorder=new InteractionRecorder();let countdown=null,tick=null,busy=false,trackUnsaved=false,videoUnsaved=false,rawVideo=null;
 const camera=new WebcamCapture(panel.querySelector('.weaver-camera-preview'),text=>{cameraStatus.textContent=text;},reason=>finish(reason));
 const format=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;
 function update(){
  const active=recorder.active||countdown!==null||busy;
  record.disabled=active||trackUnsaved||videoUnsaved;stop.disabled=!recorder.active&&countdown===null;
  save.disabled=active||!app.track;discard.disabled=active||!app.track;offset.disabled=active;
  bundle.disabled=active||!app.track||!app.mediaValid;saveVideo.disabled=active||!rawVideo;
  enable.disabled=active||Boolean(camera.stream);off.disabled=recorder.active||busy||(!camera.stream&&!enable.disabled);
  record.textContent=camera.stream?'Record camera + tour':'Record interactions';
 }
 app.addEventListener('change',()=>{if(!recorder.active&&!busy&&app.track)offset.value=app.track.syncOffset;update();});
 app.adapter.subscribe(action=>{if(action.type==='camera')recorder.camera(action.value);else{recorder.action(action);if(action.type==='view')recorder.camera({...app.adapter.getState().camera,cut:true},true);}});
 async function finish(reason='Track ready to export.'){
  if(busy)return;
  if(countdown!==null){clearInterval(countdown);countdown=null;app.player.suspend(false);status.textContent='Countdown cancelled.';update();return;}
  if(!recorder.active)return;
  const track=recorder.stop(app.adapter.getState().camera);trackUnsaved=true;clearInterval(tick);tick=null;busy=true;panel.classList.remove('is-recording');update();
  try{
   if(camera.recorder&&camera.active){
    const result=await camera.stop();if(!result?.file.size)throw new Error('The camera produced no video; the interaction track is still available.');
    rawVideo=result.file;videoUnsaved=true;cameraStatus.textContent=`Take captured · ${(rawVideo.size/1024/1024).toFixed(1)} MB`;
    await app.loadVideo(rawVideo,{autoplay:false});
    if(result.error)status.textContent='Partial video recovered after a recording error.';
   }
   await app.loadTrack(track);offset.value=track.syncOffset;status.textContent=`${reason} ${format(track.duration)} · ${track.actions.length} actions.`;
  }catch(error){await app.loadTrack(track);status.textContent=error.message;}
  finally{busy=false;app.player.suspend(false);update();}
 }
 enable.onclick=async()=>{
  enable.disabled=true;off.disabled=false;cameraStatus.textContent='Waiting for camera and microphone permission…';
  try{await camera.enable();}catch(error){camera.disable();cameraStatus.textContent=error.name==='NotAllowedError'?'Camera or microphone permission was denied. You can still import a webcam video.':error.message;}update();
 };
 off.onclick=()=>{camera.disable();cameraStatus.textContent='Camera and microphone off.';update();};
 record.onclick=()=>{
  if(record.disabled)return;
  app.player.suspend(true);let remaining=3;status.textContent='3 · Get ready';
  countdown=setInterval(async()=>{
   if(--remaining){status.textContent=`${remaining} · Get ready`;return;}
   clearInterval(countdown);countdown=null;busy=true;update();
   try{
    if(camera.stream)await camera.start();
    recorder.start(app.adapter.getState());recorder.data.syncOffset=camera.active?Math.max(0,(recorder.started-camera.started)/1000):0;offset.value=recorder.data.syncOffset;
    panel.classList.add('is-recording');status.textContent='Recording 00:00 · 0 actions';
    tick=setInterval(()=>{status.textContent=`Recording ${format(recorder.time())} · ${recorder.data.actions.length} actions`;if(recorder.time()>=14400)finish('Four-hour limit reached.');},250);
   }catch(error){camera.disable();app.player.suspend(false);status.textContent=error.message;}
   finally{busy=false;update();}
  },1000);update();
 };
 stop.onclick=()=>finish();
 offset.onchange=()=>{const value=Number(offset.value);if(!Number.isFinite(value)||value<0||value>14400){status.textContent='Enter a video start time between 0 and 14400 seconds.';return;}if(app.track){app.track.syncOffset=value;app.player.load(app.track);trackUnsaved=true;update();}};
 save.onclick=()=>{offset.onchange();if(!Number.isFinite(Number(offset.value))||Number(offset.value)<0||Number(offset.value)>14400)return;downloadBlob(new Blob([JSON.stringify(app.track,null,2)],{type:'application/json'}),'weavershell-interactions.json');trackUnsaved=false;status.textContent='Track exported. Keep it with your webcam recording.';update();};
 saveVideo.onclick=()=>{downloadBlob(rawVideo,rawVideo.name);videoUnsaved=false;status.textContent='Webcam video saved.';update();};
 discard.onclick=()=>{app.track=null;app.player.clear();recorder.data=null;trackUnsaved=false;offset.value='0';status.textContent='Track discarded. Save your webcam video before starting another take.';update();};
 bundle.onclick=async()=>{
  busy=true;update();try{const zip=await publishingPackage(app,text=>{status.textContent=text;});downloadBlob(zip,'weavershell-publishing.zip');trackUnsaved=videoUnsaved=false;status.textContent='Publishing ZIP exported. Unzip into your static site root.';}catch(error){status.textContent=error.message;}finally{busy=false;update();}
 };
 function pointer(e,kind){
  if(!recorder.active||!(e.target instanceof Element)||e.target.closest('.demo-card,.demo-dialog,.weaver-author'))return;
  const surface=e.target.closest('#stage')||e.target.closest('aside');if(!surface)return;const rect=surface.getBoundingClientRect(),target=e.target.closest('[data-weaver-id]');
  let x=e.clientX,y=e.clientY;if(kind==='click'&&e.detail===0){const r=e.target.getBoundingClientRect();x=r.x+r.width/2;y=r.y+r.height/2;}
  const clamp=n=>Math.min(1,Math.max(0,n));recorder.pointer({kind,surface:surface.id==='stage'?'stage':'sidebar',target:target?.dataset.weaverId||null,x:clamp((x-rect.left)/rect.width),y:clamp((y-rect.top)/rect.height)});
  if(kind==='click'){const ring=document.createElement('span');ring.className='weaver-click';ring.style.left=x+'px';ring.style.top=y+'px';ring.setAttribute('aria-hidden','true');document.body.append(ring);setTimeout(()=>ring.remove(),750);}
 }
 document.addEventListener('pointermove',e=>pointer(e,'move'));document.addEventListener('click',e=>pointer(e,'click'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(recorder.active||countdown!==null)finish('Stopped because the page was hidden.');else camera.disable();}});
 window.addEventListener('pagehide',()=>camera.disable());
 window.addEventListener('beforeunload',e=>{if(recorder.active||trackUnsaved||videoUnsaved){e.preventDefault();e.returnValue='';}});
 update();
}

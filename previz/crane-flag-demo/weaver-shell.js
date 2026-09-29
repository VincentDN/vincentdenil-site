import {weaverAdapter} from './viewer.js';
import {validateTimeline,PROJECT} from './weaver-timeline.js';
import {WeaverPlayer} from './weaver-player.js';
const card=document.querySelector('.demo-card'),dialog=document.querySelector('.demo-dialog');
const video=card.querySelector('video'),feedback=document.querySelector('.demo-feedback'),input=document.querySelector('.demo-file'),footer=card.querySelector('.demo-footer');
const published=document.querySelector('meta[name="weaver-manifest"]');
let sourceURL=null,captionURL=null,posterURL=null;
export const weaver=new EventTarget();
Object.assign(weaver,{video,adapter:weaverAdapter,player:null,media:null,mediaValid:false,track:null,captions:null,captionLanguage:'en',published:Boolean(published)});
const changed=()=>weaver.dispatchEvent(new Event('change'));
const report=text=>{feedback.textContent=text;};
function openDialog(){if(!dialog.open)dialog.showModal();}
function failed(error){report(error.message);openDialog();}
footer.innerHTML='<span class="weaver-playback-status" role="status">LOCAL PREVIEW</span><button type="button" class="weaver-resume" hidden>Resume tour</button><button type="button" class="demo-replace">Setup</button>';
const playbackStatus=footer.querySelector('.weaver-playback-status'),resume=footer.querySelector('.weaver-resume');
document.querySelector('.demo-notice').textContent='Add a video and an optional interaction track. Files stay on this device until you export a publishing package.';
function picker(label,accept,cls){const file=document.createElement('input');Object.assign(file,{type:'file',accept,hidden:true,className:cls+'-file'});dialog.append(file);const button=document.createElement('button');Object.assign(button,{type:'button',className:cls,textContent:label});button.onclick=()=>file.click();feedback.before(button);return {file,button};}
const timeline=picker('Add interaction track','.json,application/json','weaver-import-track');
timeline.file.className='weaver-track-file';
const trackStatus=document.createElement('p');trackStatus.className='weaver-track-status';trackStatus.textContent='No interaction track loaded.';feedback.before(trackStatus);
const removeTrack=document.createElement('button');Object.assign(removeTrack,{type:'button',textContent:'Remove track',className:'weaver-remove-track',hidden:true});feedback.before(removeTrack);
const captions=picker('Add captions (.vtt)','.vtt,text/vtt','weaver-caption');
const language=document.createElement('select');language.setAttribute('aria-label','Caption language');for(const [value,label]of [['en','English'],['nl','Dutch'],['fr','French'],['de','German']]){const option=document.createElement('option');option.value=value;option.textContent=label;language.append(option);}feedback.before(language);
language.onchange=()=>{weaver.captionLanguage=language.value;const t=video.querySelector('track');if(t)t.srclang=language.value;changed();};
const poster=picker('Add thumbnail','image/jpeg,image/png,image/webp','weaver-poster');
poster.file.onchange=async()=>{const file=poster.file.files[0];poster.file.value='';if(!file)return;try{if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw new Error('Choose a JPG, PNG or WebP thumbnail under 10 MB.');const image=await createImageBitmap(file);image.close();if(posterURL)URL.revokeObjectURL(posterURL);posterURL=URL.createObjectURL(file);video.poster=posterURL;card.querySelector('.demo-poster').style.backgroundImage=`url("${posterURL}")`;weaver.poster=file;poster.button.textContent='Replace thumbnail';changed();}catch(error){failed(error);}};
weaver.loadTrack=async data=>{
 const track=validateTimeline(data);await weaverAdapter.ready;
 weaver.track=structuredClone(track);weaver.player.load(track);trackStatus.textContent=`Interaction track · ${track.duration.toFixed(1)} seconds`;removeTrack.hidden=false;changed();
};
weaver.loadVideo=async(file,{autoplay=true}={})=>{
 if(!file||!file.size)throw new Error('Choose a non-empty video file.');
 video.pause();weaver.mediaValid=false;weaver.media=file;changed();
 if(sourceURL)URL.revokeObjectURL(sourceURL);sourceURL=URL.createObjectURL(file);report('Opening video…');
 await new Promise((resolve,reject)=>{
  const cleanup=()=>{video.removeEventListener('loadedmetadata',loaded);video.removeEventListener('error',bad);clearTimeout(timeout);};
  const loaded=()=>{cleanup();resolve();};const bad=()=>{cleanup();reject(new Error('This video could not be played. Try an MP4 with H.264 video and AAC audio.'));};
  const timeout=setTimeout(()=>{cleanup();reject(new Error('The video took too long to open. Try a browser-compatible MP4.'));},30000);
  video.addEventListener('loadedmetadata',loaded);video.addEventListener('error',bad);video.src=sourceURL;video.load();
 });
 weaver.mediaValid=true;weaver.width=video.videoWidth;weaver.height=video.videoHeight;card.querySelector('.demo-poster').hidden=true;video.hidden=false;footer.hidden=false;report('');dialog.close();changed();if(autoplay)video.play().catch(()=>{});
};
document.querySelector('.demo-close').onclick=()=>dialog.close();document.querySelector('.demo-choose').onclick=()=>input.click();footer.querySelector('.demo-replace').onclick=openDialog;
card.querySelector('.demo-play').onclick=()=>{if(published&&video.src){card.querySelector('.demo-poster').hidden=true;video.hidden=false;footer.hidden=false;if(weaver.track)weaver.player?.resume();else video.play().catch(()=>{});}else openDialog();};
input.onchange=async()=>{const file=input.files[0];input.value='';if(file)try{await weaver.loadVideo(file);}catch(error){failed(error);}};
timeline.file.onchange=async()=>{const file=timeline.file.files[0];timeline.file.value='';if(!file)return;try{if(file.size>64*1024*1024)throw new Error('The interaction track is too large.');await weaver.loadTrack(JSON.parse(await file.text()));report('Track ready. Play the video to follow the tour.');}catch(error){failed(error);}};
removeTrack.onclick=()=>{weaver.track=null;weaver.player.clear();removeTrack.hidden=true;resume.hidden=true;trackStatus.textContent='No interaction track loaded.';changed();};
captions.file.onchange=async()=>{const file=captions.file.files[0];captions.file.value='';if(!file)return;try{if(file.size>2*1024*1024||!(await file.text()).replace(/^\uFEFF/,'').startsWith('WEBVTT'))throw new Error('Choose a WebVTT captions file under 2 MB.');if(captionURL)URL.revokeObjectURL(captionURL);captionURL=URL.createObjectURL(file);video.querySelector('track')?.remove();const track=document.createElement('track');Object.assign(track,{kind:'captions',label:'Captions',srclang:language.value,src:captionURL,default:true});video.append(track);weaver.captions=file;captions.button.textContent='Replace captions';report('Captions loaded.');changed();}catch(error){failed(error);}};
for(const type of ['pointerdown','pointerup','click','wheel','keydown'])card.addEventListener(type,e=>e.stopPropagation());
window.addEventListener('pagehide',()=>video.pause());
weaverAdapter.ready.then(async()=>{
 weaver.player=new WeaverPlayer(video,weaverAdapter,text=>{playbackStatus.textContent=text;resume.hidden=!weaver.track||weaver.player?.following;});resume.onclick=()=>weaver.player.resume();
 if(!published&&new URLSearchParams(location.search).get('author')==='1'){const {initAuthor}=await import('./weaver-author.js');initAuthor(weaver);}
 if(published)try{
  const response=await fetch(published.content);if(!response.ok)throw new Error('The published demo manifest could not load.');const manifest=await response.json();
  if(manifest.schemaVersion!==1||manifest.project?.id!==PROJECT.id||manifest.project?.revision!==PROJECT.revision)throw new Error('This demo targets a different project version.');
  const base=new URL('./',location.href);const localURL=value=>{if(typeof value!=='string')throw new Error('Invalid media URL.');const url=new URL(value,base);if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))throw new Error('Demo assets must live inside this project.');return url.href;};
  const trackResponse=await fetch(localURL(manifest.timeline));if(!trackResponse.ok)throw new Error('The interaction track could not load.');await weaver.loadTrack(await trackResponse.json());
  video.src=localURL(manifest.video);if(manifest.poster){video.poster=localURL(manifest.poster);card.querySelector('.demo-poster').style.backgroundImage=`url("${video.poster}")`;}
  if(manifest.captions){const track=document.createElement('track');Object.assign(track,{kind:'captions',label:'Captions',srclang:manifest.captionLanguage||'en',src:localURL(manifest.captions),default:true});video.append(track);}
  video.addEventListener('error',()=>failed(new Error('The published video could not load. Check the media file and codec.')));
  footer.querySelector('.demo-replace').hidden=true;card.querySelector('.demo-caption').textContent='WATCH THE PROJECT WALKTHROUGH';
 }catch(error){failed(error);}
});

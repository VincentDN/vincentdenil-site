// Camera access happens only after the author explicitly enables it.
export class WebcamCapture{
 constructor(preview,onStatus=()=>{},onUnexpectedStop=()=>{}){this.preview=preview;this.onStatus=onStatus;this.onUnexpectedStop=onUnexpectedStop;this.stream=null;this.recorder=null;this.pending=null;this.error=null;this.cancelled=false;}
 async enable(){
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw new Error('Camera recording needs a supported browser on HTTPS or localhost.');
  this.cancelled=false;
  const stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30},facingMode:'user'},audio:true});
  if(this.cancelled){stream.getTracks().forEach(t=>t.stop());throw new Error('Camera request cancelled.');}
  this.stream=stream;this.preview.srcObject=stream;this.preview.hidden=false;await this.preview.play();
  const {width,height}=stream.getVideoTracks()[0].getSettings();this.onStatus(`Camera ready · ${width} × ${height}`);
  for(const track of stream.getTracks())track.addEventListener('ended',()=>{if(this.active)this.onUnexpectedStop('Camera or microphone disconnected.');else this.disable();});
  return {width,height};
 }
 get active(){return this.recorder?.state==='recording';}
 async start(){
  if(!this.stream||this.stream.getTracks().some(t=>t.readyState==='ended'))throw new Error('Enable the camera before recording.');
  if(this.active)throw new Error('The camera is already recording.');
  const mime=['video/mp4;codecs=avc1.42001E,mp4a.40.2','video/mp4','video/webm;codecs=vp8,opus','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));
  const recorder=new MediaRecorder(this.stream,{...(mime?{mimeType:mime}:{}),videoBitsPerSecond:8000000,audioBitsPerSecond:128000});this.recorder=recorder;this.error=null;
  const chunks=[];let bytes=0;
  this.pending=new Promise(resolve=>{
   recorder.addEventListener('dataavailable',e=>{if(e.data.size){chunks.push(e.data);bytes+=e.data.size;}if(bytes>512*1024*1024&&this.active)this.onUnexpectedStop('512 MB take limit reached.');});
   recorder.addEventListener('error',e=>{this.error=e.error||new Error('Recording failed.');this.onUnexpectedStop('Camera recording interrupted.');});
   recorder.addEventListener('stop',()=>{
    const type=recorder.mimeType||mime||'video/webm';const file=new File(chunks,[`weavershell-webcam.${type.includes('mp4')?'mp4':'webm'}`],{type});
    const duration=(performance.now()-this.started)/1000;this.disable();resolve({file,duration,error:this.error});
   });
  });
  await new Promise((resolve,reject)=>{recorder.addEventListener('start',()=>{this.started=performance.now();resolve();},{once:true});recorder.addEventListener('error',e=>reject(e.error||new Error('Recording could not start.')),{once:true});recorder.start(1000);});
 }
 async stop(){if(this.active)this.recorder.stop();return this.pending;}
 disable(){this.cancelled=true;if(this.active)this.recorder.stop();this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.preview.srcObject=null;this.preview.hidden=true;}
}

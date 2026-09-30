import {createZip} from './weaver-zip.js';
import {validateTimeline,PROJECT} from './weaver-timeline.js';
export async function publishingPackage(app,onProgress=()=>{}){
 if(!app.mediaValid||!app.media||!app.track)throw new Error('Load a playable video and interaction track before exporting.');
 if(app.media.size>1024*1024*1024)throw new Error('Use a delivery video under 1 GB for browser packaging. Keep the raw source separately.');
 const track=validateTimeline(app.track),project='previz/crane-flag-demo/';
 const entries=[];const add=(name,blob)=>entries.push({name,blob:blob instanceof Blob?blob:new Blob([blob])});
 const files=['index.html','viewer.js','units.js','weaver-shell.js','weaver-player.js','weaver-timeline.js','weaver-shell.css','fmp-logo.svg','models/crane.glb'];
 for(const name of files){onProgress(`Reading ${name}`);const response=await fetch(new URL(name,import.meta.url));if(!response.ok)throw new Error(`Could not read ${name}.`);let blob=await response.blob();
  if(name==='index.html'){let html=await blob.text();html=html.replace('</head>','<meta name="weaver-manifest" content="./demo.json"></head>');blob=new Blob([html],{type:'text/html'});}
  add(project+name,blob);
 }
 for(const name of ['assets/viewer-loader.css','favicon.ico']){const response=await fetch('/'+name);if(!response.ok)throw new Error(`Could not read ${name}.`);add(name,await response.blob());}
 const extension=app.media.type.includes('webm')?'webm':app.media.type.includes('quicktime')?'mov':app.media.name?.split('.').pop()?.toLowerCase()==='m4v'?'m4v':'mp4';
 const manifest={schemaVersion:1,feature:'vWeaver',project:PROJECT,video:`./media/presenter.${extension}`,timeline:'./interactions.json',width:app.width,height:app.height};
 add(project+'media/presenter.'+extension,app.media);
 if(app.poster){const ext=app.poster.type.includes('png')?'png':app.poster.type.includes('webp')?'webp':'jpg';manifest.poster='./media/poster.'+ext;add(project+'media/poster.'+ext,app.poster);}
 if(app.captions){manifest.captions='./media/captions.vtt';manifest.captionLanguage=app.captionLanguage;add(project+'media/captions.vtt',app.captions);}
 add(project+'demo.json',JSON.stringify(manifest,null,2));add(project+'interactions.json',JSON.stringify(track));
 add('index.html','<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="seo_hidden" content="true"><meta http-equiv="refresh" content="0;url=/previz/crane-flag-demo/"><title>vWeaver demo</title></head><body>Opening demonstration…</body></html>');
 add('README.txt','vWeaver static publishing package\n\nServe this folder as the website root over HTTP(S); opening files directly is not supported. Entry: /previz/crane-flag-demo/. No backend or recording permissions are required for playback. Three.js uses the pinned jsDelivr CDN and requires network access. The host should support byte-range requests for video seeking.\n\nThis is a delivery copy, not a transcoder: keep original webcam footage separately. Imported codecs must be supported by target browsers; MP4 H.264/AAC is recommended for broad compatibility. Validate audio and synchronization against the real take before publishing.\n\nCrane model: Majadroid / Maik Hoffmann, CC0. Source: https://opengameart.org/content/3d-house-construction-site-lowpoly-cc0\n');
 return createZip(entries,onProgress);
}

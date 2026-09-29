// ZIP store mode: no recompression of video, no third-party runtime required.
const table=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
export async function crc32(blob){let crc=0xffffffff;const reader=blob.stream().getReader();while(true){const {done,value}=await reader.read();if(done)break;for(const b of value)crc=table[(crc^b)&255]^(crc>>>8);}return (crc^0xffffffff)>>>0;}
function header(size){const bytes=new Uint8Array(size);return {bytes,view:new DataView(bytes.buffer)};}
export async function createZip(entries,onProgress=()=>{}){
 if(entries.length>65535)throw new Error('Too many files for this package.');
 const parts=[],central=[];let offset=0;
 for(let index=0;index<entries.length;index++){
  const {name,blob}=entries[index];if(!name||name.startsWith('/')||name.split('/').includes('..')||name.includes('\\'))throw new Error('Unsafe package path.');
  if(offset+blob.size>0xffffffff)throw new Error('Package exceeds the ZIP size limit.');
  onProgress(`Packing ${index+1}/${entries.length}: ${name}`);
  const filename=new TextEncoder().encode(name),crc=await crc32(blob),local=header(30),dir=header(46);
  local.view.setUint32(0,0x04034b50,true);local.view.setUint16(4,20,true);local.view.setUint16(6,0x800,true);local.view.setUint32(14,crc,true);local.view.setUint32(18,blob.size,true);local.view.setUint32(22,blob.size,true);local.view.setUint16(26,filename.length,true);
  dir.view.setUint32(0,0x02014b50,true);dir.view.setUint16(4,20,true);dir.view.setUint16(6,20,true);dir.view.setUint16(8,0x800,true);dir.view.setUint32(16,crc,true);dir.view.setUint32(20,blob.size,true);dir.view.setUint32(24,blob.size,true);dir.view.setUint16(28,filename.length,true);dir.view.setUint32(42,offset,true);
  parts.push(local.bytes,filename,blob);central.push(dir.bytes,filename);offset+=30+filename.length+blob.size;
 }
 const centralSize=central.reduce((sum,p)=>sum+p.byteLength,0),end=header(22);end.view.setUint32(0,0x06054b50,true);end.view.setUint16(8,entries.length,true);end.view.setUint16(10,entries.length,true);end.view.setUint32(12,centralSize,true);end.view.setUint32(16,offset,true);
 return new Blob([...parts,...central,end.bytes],{type:'application/zip'});
}
export function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}

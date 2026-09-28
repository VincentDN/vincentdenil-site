// Display conversion only: scene geometry and GLB exports remain in meters.
const decimal=(n,digits)=>Number(n.toFixed(digits)).toString();
export function formatLength(meters,units='imperial'){
 if(units==='metric')return meters<.1?`${decimal(meters*1000,2)} mm`:`${decimal(meters,4)} m`;
 return `${decimal(meters/.3048,meters<.3048?4:2)}ft (${decimal(meters/.0254,2)}in)`;
}

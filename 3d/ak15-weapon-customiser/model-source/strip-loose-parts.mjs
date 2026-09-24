// Removes the loose cartridge, case and spare magazine from the Sketchfab download.
// Usage: npm i @gltf-transform/core@4 @gltf-transform/functions@4
//        node strip-loose-parts.mjs low-poly_ak-74m_zenitco.glb ../model/ak-74m-zenitco.glb
import {NodeIO} from '@gltf-transform/core';
import {prune} from '@gltf-transform/functions';
const [input,output]=process.argv.slice(2);
const io=new NodeIO(),doc=await io.read(input);
const loose=['54539_4','54539 case_5','ak74 30rnd empty mag (polymer)_7'];
for(const node of doc.getRoot().listNodes())if(loose.includes(node.getName()))node.dispose();
await doc.transform(prune());
await io.write(output,doc);

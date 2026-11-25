// Boot: data, campaign save (or a skirmish), world, view, HUD, input, then the fixed-step loop.
import {loadSave, deploy, finish} from './bridge.js';
import {createWorld, step, TICK} from './sim.js';
import {economySystem} from './economy.js';
import {combatSystem} from './combat.js';
import {buildSystem, handlers} from './build.js';
import {aiSystem, makeAi} from './ai.js';
import {createView} from './render.js';
import {createHud} from './ui.js';
import {bindInput} from './input.js';

const [data, map] = await Promise.all(['../data/battle-units.json', '../data/battle-map.json'].map((u) => fetch(new URL(u, import.meta.url)).then((r) => r.json())));
const save = loadSave(), pb = save?.pendingBattle;
const world = createWorld({map, data, seed: pb?.seed ?? ((Math.random() * 2 ** 31) | 0)});
deploy(world, pb ? save : null);
const view = await createView(document.querySelector('#stage canvas'), world);
const hud = createHud(world, view);
const pan = bindInput(view.renderer.domElement, view, world, hud);
// ?watch=1 lets an AI play our side too; ?speed=N runs the clock faster (both for testing and demos)
const q = new URLSearchParams(location.search), speed = Math.min(8, +q.get('speed') || 1);
const systems = [...(q.has('watch') ? [makeAi(0)] : []), aiSystem, economySystem, combatSystem, buildSystem];
document.getElementById('loading').hidden = true;
if (pb) document.getElementById('mode').textContent = `${save.armies[pb.attacker]?.name} vs ${save.armies[pb.defender]?.name} · ${pb.province}`;
window.__battle = world; window.__view = view; // for headless checks

let acc = 0, last = performance.now(), ended = false;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (!hud.paused && !ended) { acc += dt * speed; while (acc >= TICK) { step(world, systems, handlers); view.onEvents(world.events); hud.onEvents(world.events); acc -= TICK; } }
  pan(dt); view.draw(dt, hud.selected); hud.update(dt);
  if (world.winner !== null && !ended) { ended = true; hud.end(world.winner === 0, finish(world, pb ? save : null)); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

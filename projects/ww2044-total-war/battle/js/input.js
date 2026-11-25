// Mouse and keys. Left click or drag: select. Right click: move, or attack what is under the cursor.
// WASD or arrows or screen edge: pan. Wheel: zoom. Q/E: turn. R retreat, G reinforce, X stop, Ctrl+1-9 set group, 1-9 recall, P pause.
import {order, dist} from './sim.js';

export function bindInput(canvas, view, world, ui, side = 0) {
  const sel = ui.selected, keys = new Set(), groups = {}, boxEl = document.getElementById('box');
  let drag = null, mouse = {x: innerWidth / 2, y: innerHeight / 2, in: false};
  const mine = () => world.squads.filter((s) => s.side === side);
  const near = (p, list, r) => list.reduce((best, s) => { const d = dist(s, p); return d < r && (!best || d < dist(best, p)) ? s : best; }, null);

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    if (e.button === 0) drag = {x: e.clientX, y: e.clientY};
    if (e.button === 2 && sel.size) {
      const p = view.pick(e.clientX, e.clientY); if (!p) return;
      const enemy = near(p, world.squads.filter((s) => s.side !== side), 5) || near(p, world.buildings.filter((b) => b.side !== side), 9);
      const ids = [...sel].filter((id) => mine().some((s) => s.id === id));
      if (enemy) order(world, side, {kind: 'attack', ids, target: enemy.id}); else order(world, side, {kind: 'move', ids, x: p.x, z: p.z});
      view.marker(p.x, p.z); ui.ack(enemy ? 'attack' : 'move');
    }
  });
  addEventListener('pointermove', (e) => {
    mouse = {x: e.clientX, y: e.clientY, in: true};
    if (drag && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) { const x = Math.min(drag.x, e.clientX), y = Math.min(drag.y, e.clientY); Object.assign(boxEl.style, {display: 'block', left: x + 'px', top: y + 'px', width: Math.abs(e.clientX - drag.x) + 'px', height: Math.abs(e.clientY - drag.y) + 'px'}); drag.box = true; }
  });
  document.addEventListener('pointerleave', () => { mouse.in = false; });
  addEventListener('pointerup', (e) => {
    if (e.button !== 0 || !drag) return;
    if (!e.shiftKey) sel.clear();
    if (drag.box) {
      const x0 = Math.min(drag.x, e.clientX), x1 = Math.max(drag.x, e.clientX), y0 = Math.min(drag.y, e.clientY), y1 = Math.max(drag.y, e.clientY);
      for (const s of mine()) { const q = view.project(s.x, 1, s.z); if (q && q.x >= x0 && q.x <= x1 && q.y >= y0 && q.y <= y1) sel.add(s.id); }
    } else if (e.target === canvas) { const p = view.pick(e.clientX, e.clientY), s = p && near(p, mine(), 5); if (s) sel.add(s.id); }
    boxEl.style.display = 'none'; drag = null; ui.refresh();
  });
  canvas.addEventListener('wheel', (e) => { e.preventDefault(); view.cam.d = Math.max(28, Math.min(170, view.cam.d * (1 + Math.sign(e.deltaY) * 0.1))); }, {passive: false});
  addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    const k = e.key.toLowerCase(); keys.add(k);
    const ids = [...sel];
    if (k === 'r' && ids.length) order(world, side, {kind: 'retreat', ids});
    else if (k === 'g' && ids.length) order(world, side, {kind: 'reinforce', ids});
    else if (k === 'x' && ids.length) order(world, side, {kind: 'stop', ids});
    else if (k === 'p') ui.togglePause();
    else if (k === 'escape') { sel.clear(); ui.refresh(); }
    else if (k === ' ') { const s = mine().find((s) => sel.has(s.id)) || world.buildings.find((b) => b.side === side); if (s) { view.cam.x = s.x; view.cam.z = s.z + 20; } e.preventDefault(); }
    else if (/^[1-9]$/.test(k)) { if (e.ctrlKey || e.metaKey) { groups[k] = ids; e.preventDefault(); } else if (groups[k]) { sel.clear(); groups[k].forEach((id) => mine().some((s) => s.id === id) && sel.add(id)); ui.refresh(); } }
  });
  addEventListener('keyup', (e) => keys.delete(e.key.toLowerCase()));
  addEventListener('blur', () => keys.clear());

  /** Per-frame camera pan and turn. */
  return function update(dt) {
    const c = view.cam, sp = c.d * 1.1 * dt, edge = 14;
    let fx = 0, fz = 0;
    if (keys.has('w') || keys.has('arrowup') || (mouse.in && mouse.y < edge)) fz -= 1;
    if (keys.has('s') || keys.has('arrowdown') || (mouse.in && mouse.y > innerHeight - edge)) fz += 1;
    if (keys.has('a') || keys.has('arrowleft') || (mouse.in && mouse.x < edge)) fx -= 1;
    if (keys.has('d') || keys.has('arrowright') || (mouse.in && mouse.x > innerWidth - edge)) fx += 1;
    if (keys.has('q')) c.yaw += dt * 1.2; if (keys.has('e')) c.yaw -= dt * 1.2;
    const cs = Math.cos(c.yaw), sn = Math.sin(c.yaw), half = world.map.size[0] / 2;
    c.x = Math.max(-half, Math.min(half, c.x + (fx * cs + fz * sn) * sp)); c.z = Math.max(-half, Math.min(half, c.z + (-fx * sn + fz * cs) * sp));
  };
}

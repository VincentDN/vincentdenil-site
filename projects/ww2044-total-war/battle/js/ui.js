// HUD: resources and population, victory pools, squad plates, selection card, recruit and construct panel, minimap, toasts, end screen.
import {order, hq} from './sim.js';
import {popUsed} from './economy.js';
import {canBuy, canConstruct, canUpgrade, canReinforce} from './build.js';

const $ = (id) => document.getElementById(id);
const ICON = {rifle: 'i-rifle', pioneer: 'i-hammer-nails', recon: 'i-spy', mg: 'i-field-gun', halftrack: 'i-bulldozer', tank: 'i-tank',
  'rifle-depot': 'i-castle', 'signal-mast': 'i-radio-tower', 'motor-pool': 'i-gears', 'armour-shed': 'i-factory'};
const icon = (id) => `<svg><use href="../strategic-map/img/icons.svg#${id}"/></svg>`;
const cost = (c) => Object.entries(c).map(([k, v]) => `<i class="r ${k}">${v}</i>`).join('');
const stars = (n) => '★'.repeat(n) + '<span class="off">' + '★'.repeat(3 - n) + '</span>';
const PT = {relay: 'Relay', fuel: 'Fuel depot', ordnance: 'Ordnance cache'};
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

export function createHud(world, view, side = 0, onEnd) {
  const selected = new Set(), plates = new Map(), hud = {selected, paused: false};
  const D = world.data;
  // recruit and construct buttons
  const recruit = Object.keys(D.units), build = Object.keys(D.buildings).filter((k) => D.buildings[k].tier);
  $('recruit').innerHTML = recruit.map((k) => `<button data-buy="${k}" title="${D.units[k].name}">${icon(ICON[k])}<b>${D.units[k].name}</b><span>${cost(D.units[k].cost)}</span><em></em></button>`).join('');
  $('construct').innerHTML = build.map((k) => `<button data-build="${k}" title="${D.buildings[k].name}">${icon(ICON[k])}<b>${D.buildings[k].name}</b><span>${cost(D.buildings[k].cost)}</span><em></em></button>`).join('');
  document.querySelector('.cmd').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    if (b.dataset.buy) order(world, side, {kind: 'buy', type: b.dataset.buy});
    if (b.dataset.build) order(world, side, {kind: 'construct', type: b.dataset.build});
  });
  $('sel').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.disabled) return; const ids = [...selected];
    if (b.dataset.act) order(world, side, {kind: b.dataset.act, ids});
    if (b.dataset.up) order(world, side, {kind: 'upgrade', ids, id: b.dataset.up});
  });
  $('plates').addEventListener('pointerdown', (e) => { const p = e.target.closest('.plate'); if (!p || e.button) return; e.stopPropagation(); if (!e.shiftKey) selected.clear(); selected.add(+p.dataset.id); hud.refresh(); });
  $('mini').addEventListener('pointerdown', (e) => { const r = e.currentTarget.getBoundingClientRect(), W = world.map.size[0]; view.cam.x = ((e.clientX - r.left) / r.width - 0.5) * W; view.cam.z = ((e.clientY - r.top) / r.height - 0.5) * W + 20; });
  $('pause').addEventListener('click', () => hud.togglePause());
  hud.togglePause = () => { hud.paused = !hud.paused; $('paused').hidden = !hud.paused; };

  function toast(msg, cls = '') { const t = document.createElement('div'); t.className = 'toast ' + cls; t.textContent = msg; $('toasts').prepend(t); setTimeout(() => t.remove(), 4200); }
  hud.ack = () => {};
  hud.onEvents = (events) => {
    for (const e of events) {
      const me = e.side === side;
      if (e.kind === 'captured') toast(`${me ? 'We took' : 'Enemy took'} ${PT[world.points.find((p) => p.id === e.point).kind]} ${e.point.toUpperCase()}`, me ? 'good' : 'bad');
      else if (e.kind === 'ready' && me) toast(`${D.units[e.type].name} ready`);
      else if (e.kind === 'built' && me) toast(`${D.buildings[e.type].name} complete`, 'good');
      else if (e.kind === 'wiped') toast(me ? `${D.units[e.type].name} wiped out` : `Enemy ${D.units[e.type].name} destroyed`, me ? 'bad' : 'good');
    }
  };

  hud.refresh = () => {
    const sq = world.squads.filter((s) => selected.has(s.id));
    for (const id of [...selected]) if (!sq.some((s) => s.id === id)) selected.delete(id);
    if (!sq.length) { $('sel').innerHTML = '<p class="hint">Select squads with a click or a drag. Right-click to move, or on an enemy to attack.<br><kbd>R</kbd> retreat · <kbd>G</kbd> reinforce · <kbd>X</kbd> stop · <kbd>Ctrl</kbd>+<kbd>1-9</kbd> groups · <kbd>Space</kbd> centre · <kbd>P</kbd> pause</p>'; return; }
    const s = sq[0], u = D.units[s.type], st = s.liveStars ?? s.stars;
    const ups = Object.entries(D.upgrades).filter(([, up]) => up.for.includes(s.type));
    $('sel').innerHTML = `<h2>${icon(ICON[s.type])}${sq.length > 1 ? `${sq.length} squads` : u.name}<span class="stars">${stars(st)}</span></h2>
      <div class="men">${s.vehicle ? `<i class="hp"><b style="width:${s.men[0] ? s.men[0].hp / u.hp * 100 : 0}%"></b></i>` : Array.from({length: s.size}, (_, i) => `<i class="${i < s.men.length ? 'on' : ''}"></i>`).join('')}</div>
      <p class="state">${s.state === 'retreat' ? 'Retreating' : s.supp > 0.9 ? 'Pinned' : s.supp > 0.5 ? 'Suppressed' : s.state === 'attack' ? 'Engaging' : s.moving ? 'Moving' : 'Holding'} · ${s.kills} kills · XP ${Math.round(s.xp * 100)}</p>
      <div class="acts"><button data-act="retreat">Retreat <kbd>R</kbd></button>${s.vehicle ? '' : `<button data-act="reinforce" ${canReinforce(world, s) ? `disabled title="${canReinforce(world, s)}"` : ''}>Reinforce <kbd>G</kbd></button>`}<button data-act="stop">Stop <kbd>X</kbd></button></div>
      ${ups.length ? `<h3>Upgrades</h3><div class="ups">${ups.map(([id, up]) => { const why = canUpgrade(world, s, id); return `<button data-up="${id}" ${why ? `disabled title="${why}"` : ''} class="${s.upgrades.includes(id) ? 'have' : ''}">${up.name}<span>${s.upgrades.includes(id) ? 'Fitted' : cost(up.cost)}</span></button>`; }).join('')}</div>` : ''}`;
  };

  let acc = 0;
  hud.update = (dt) => {
    const r = world.res[side], inc = world.income[side];
    $('res').innerHTML = ['m', 'o', 'f'].map((k) => `<span class="cur r ${k}" title="${{m: 'Muster', o: 'Ordnance', f: 'Fuel'}[k]}"><b>${Math.floor(r[k])}</b><small>+${(inc[k] * 60).toFixed(0)}/min</small></span>`).join('') + `<span class="cur pop" title="Population">${icon('i-person')}<b>${popUsed(world, side)}/${D.economy.pop}</b></span>`;
    $('pool0').style.width = world.pool[side] / D.economy.victoryPool * 100 + '%'; $('pool1').style.width = world.pool[1 - side] / D.economy.victoryPool * 100 + '%';
    $('poolv0').textContent = Math.ceil(world.pool[side]); $('poolv1').textContent = Math.ceil(world.pool[1 - side]); $('clock').textContent = mmss(world.time);
    // plates above squads
    const seen = new Set();
    for (const s of world.squads) {
      let el = plates.get(s.id);
      if (!el) { el = document.createElement('div'); el.className = `plate s${s.side}`; el.dataset.id = s.id; $('plates').append(el); plates.set(s.id, el); }
      seen.add(s.id);
      const q = view.project(s.x, s.vehicle ? 4.5 : 2.6, s.z); if (!q) { el.style.display = 'none'; continue; }
      el.style.display = ''; el.style.transform = `translate(${q.x}px,${q.y}px)`;
      const st = s.liveStars ?? s.stars, key = `${s.men.length}|${st}|${selected.has(s.id)}|${s.supp > 0.5}|${s.state}|${s.vehicle ? Math.round(s.men[0]?.hp) : ''}`;
      if (el.dataset.k !== key) { el.dataset.k = key; el.classList.toggle('on', selected.has(s.id)); el.classList.toggle('supp', s.supp > 0.5); el.classList.toggle('ret', s.state === 'retreat');
        const hpPct = s.vehicle ? (s.men[0]?.hp || 0) / D.units[s.type].hp * 100 : s.men.length / s.size * 100;
        el.innerHTML = `${icon(ICON[s.type])}<i class="bar"><b style="width:${hpPct}%"></b></i>${st ? `<span class="st">${'★'.repeat(st)}</span>` : ''}`; }
    }
    for (const [id, el] of plates) if (!seen.has(id)) { el.remove(); plates.delete(id); }
    acc += dt; if (acc < 0.25) return; acc = 0;
    // slower: buttons, queue, selection, minimap
    for (const b of document.querySelectorAll('[data-buy]')) { const why = canBuy(world, side, b.dataset.buy); b.disabled = !!why; b.querySelector('em').textContent = why; }
    for (const b of document.querySelectorAll('[data-build]')) { const why = canConstruct(world, side, b.dataset.build), bd = world.buildings.find((x) => x.side === side && x.type === b.dataset.build); b.disabled = !!why; b.querySelector('em').textContent = bd && bd.done < 1 ? `Building ${Math.round(bd.done * 100)}%` : why; b.classList.toggle('have', !!bd && bd.done >= 1); }
    const q = world.buildings.filter((b) => b.side === side).flatMap((b) => b.queue);
    $('queue').innerHTML = q.map((it, i) => `<span title="${D.units[it.type].name}">${icon(ICON[it.type])}${i === 0 || true ? `<i style="width:${Math.min(100, it.t / D.units[it.type].build * 100)}%"></i>` : ''}</span>`).join('');
    if (selected.size) hud.refresh();
    mini();
  };
  const mc = $('mini'), mx = mc.getContext('2d');
  function mini() {
    const W = world.map.size[0], S = mc.width, k = S / W, p = (v) => (v + W / 2) * k;
    mx.fillStyle = '#3d4532'; mx.fillRect(0, 0, S, S);
    mx.strokeStyle = '#8a8270'; mx.lineWidth = 3; for (const [[a, b], [c, d]] of world.map.roads) { mx.beginPath(); mx.moveTo(p(a), p(b)); mx.lineTo(p(c), p(d)); mx.stroke(); }
    for (const b of world.map.blocks) { mx.fillStyle = b.kind === 'hedge' ? '#2a3322' : b.kind === 'sandbags' ? '#8d7d5c' : '#6a6058'; mx.fillRect(p(b.at[0] - b.size[0] / 2), p(b.at[1] - b.size[1] / 2), Math.max(1.5, b.size[0] * k), Math.max(1.5, b.size[1] * k)); }
    for (const pt of world.points) { mx.fillStyle = pt.owner === null ? '#d8d0bc' : pt.owner === side ? '#8fd16a' : '#e0583c'; mx.beginPath(); mx.arc(p(pt.x), p(pt.z), 5, 0, 7); mx.fill(); if (pt.owner !== null && !pt.linked[pt.owner]) { mx.strokeStyle = '#000'; mx.lineWidth = 1.5; mx.stroke(); } }
    for (const b of world.buildings) { mx.fillStyle = b.side === side ? '#b8f08a' : '#ff7a5c'; mx.fillRect(p(b.x) - 3, p(b.z) - 3, 6, 6); }
    for (const s of world.squads) { mx.fillStyle = s.side === side ? (selected.has(s.id) ? '#fff' : '#8fd16a') : '#e0583c'; mx.beginPath(); mx.arc(p(s.x), p(s.z), s.vehicle ? 3.2 : 2.4, 0, 7); mx.fill(); }
    const c = view.cam; mx.strokeStyle = '#e2c98f'; mx.lineWidth = 1; mx.strokeRect(p(c.x) - c.d * 0.6 * k, p(c.z - 20) - c.d * 0.4 * k, c.d * 1.2 * k, c.d * 0.8 * k);
  }

  hud.end = (won, lines) => {
    $('end').hidden = false; $('end-title').textContent = won ? 'Victory' : 'Defeat';
    $('end-sub').textContent = won ? 'The town is ours. The men who held it will remember.' : 'We fell back. What is left of the army regroups.';
    $('end-list').innerHTML = lines.map((l) => `<li>${l}</li>`).join('');
  };
  hud.refresh();
  return hud;
}

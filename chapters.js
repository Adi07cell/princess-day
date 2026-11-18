/* ==========================================================================
   The chapters
   ========================================================================== */
const ease = {
  io: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
};
function tween(from, to, ms, set, e = ease.io) {
  return new Promise(res => {
    const s = performance.now();
    (function step(n) {
      const k = Math.min(1, (n - s) / ms);
      set(from + (to - from) * e(k));
      k < 1 ? requestAnimationFrame(step) : res();
    })(s);
  });
}
const shortName = n => n.split(' (')[0];

/* =========================== I. PRINCESS CARD =========================== */
const Card = (() => {
  const STATS = [['Sweet Tooth', '99', 99], ['Caffeine', 'Infusion', 92], ['Plot Twists', '97', 97],
                 ['Goth Rating', '100', 100], ['Lab Brain', 'MSc', 100], ['Boredom Caused', '0', 0]];
  const FINE = [['Sweet Tooth', 'Kinder Joy dependency, certified.'], ['Goth Rating', 'leather jacket + pink bow = 100%.'],
                ['Boredom Caused', '0. Statistically impossible.']];
  function init() {
    const card = $('#pcard');
    $('#pstats').innerHTML = STATS.map(([l, v, p]) => `<li><span>${l}</span><b>${v}</b><i style="--v:${p}%"></i></li>`).join('');
    $('.pcard__backart').insertAdjacentHTML('beforeend', `<ul class="pcard__fine">${FINE.map(([a, b]) => `<li><b>${a}:</b> ${b}</li>`).join('')}</ul>`);
    let tx = 0, ty = 0, rx = 0, ry = 0, flip = 0, flipT = 0, last = -1e4, sx = 0, sy = 0, moved = false, down = false, base = null, visible = false, raf = 0;
    const clamp = (v, m) => Math.max(-m, Math.min(m, v));

    function aim(e) {
      const r = card.getBoundingClientRect();
      tx = clamp(((e.clientX - r.left) / r.width - .5) * 30, 14);
      ty = clamp(((e.clientY - r.top) / r.height - .5) * -30, 14);
      last = performance.now();
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 10) moved = true;
    }
    function flipIt() { flipT = flipT ? 0 : 180; Music.sfx.flip(); haptic(8); }
    let asked = false;
    function askMotion() {
      if (asked) return; asked = true;
      const D = window.DeviceOrientationEvent;
      if (D && typeof D.requestPermission === 'function') D.requestPermission().then(s => s === 'granted' && addEventListener('deviceorientation', orient)).catch(() => {});
    }
    function orient(e) {
      if (e.gamma == null || !visible) return;
      if (!base) base = { b: e.beta, g: e.gamma };
      base.b += (e.beta - base.b) * .004; base.g += (e.gamma - base.g) * .004;   // slowly re-centre
      tx = clamp((e.gamma - base.g) * 1.1, 14); ty = clamp((e.beta - base.b) * -1.1, 14);
      last = performance.now();
    }
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') addEventListener('deviceorientation', orient);

    card.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sy = e.clientY; aim(e); });
    card.addEventListener('pointermove', e => { if (down || e.pointerType === 'mouse') aim(e); });
    card.addEventListener('pointerup', () => { askMotion(); if (down && !moved) flipIt(); down = false; tx = ty = 0; });
    card.addEventListener('pointercancel', () => { down = false; tx = ty = 0; });
    card.addEventListener('pointerleave', () => { if (!down) tx = ty = 0; });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flipIt(); } });

    function loop(t) {
      raf = visible ? requestAnimationFrame(loop) : 0;
      let gx = tx, gy = ty;
      if (t - last > 1600 && !REDUCED) { gx = Math.sin(t / 1700) * 9; gy = Math.cos(t / 2300) * 6; }
      rx += (gy - rx) * .12; ry += (gx - ry) * .12; flip += (flipT - flip) * .1;
      const s = card.style;
      s.setProperty('--rx', rx.toFixed(2) + 'deg'); s.setProperty('--ry', ry.toFixed(2) + 'deg'); s.setProperty('--flip', flip.toFixed(2) + 'deg');
      s.setProperty('--px', (50 + ry * 3).toFixed(1) + '%'); s.setProperty('--py', (50 - rx * 3).toFixed(1) + '%');
      s.setProperty('--shine', Math.min(1, (Math.abs(rx) + Math.abs(ry)) / 16).toFixed(2));
    }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(card);
  }
  return { init };
})();

/* =========================== II. CLAW MACHINE =========================== */
const Claw = (() => {
  const SLOTS = [
    { id: 'ghost', row: 1, x: .235 }, { id: 'owl', row: 1, x: .405 }, { id: 'spider', row: 1, x: .575 },
    { id: 'bunny', row: 0, x: .15 }, { id: 'cat', row: 0, x: .32 }, { id: 'axolotl', row: 0, x: .49 }, { id: 'bat', row: 0, x: .66 },
  ];
  const byId = id => PLUSHIES.find(p => p.id === id);
  let glass, rig, cable, head, pile, btn, W = 0, H = 0, PW = 0;
  let items = [], state = 'idle', cx = 0, len = 26, open = 1, carried = null, phase = 0, lastT = 0, visible = false, raf = 0;
  let adopted = store.get('adopted', []);
  const status = t => { $('#clawStatus').textContent = t; };

  function measure() {
    W = glass.clientWidth; H = glass.clientHeight; PW = W * .28;
    items.forEach(it => { it.x = it.fx * W - PW / 2; it.y = it.row ? H - PW * 1.42 : H - PW * 1.02; if (!it.moving) { it.bx = it.x; it.by = it.y; } });
  }
  function build() {
    pile.innerHTML = '';
    items = SLOTS.filter(s => !adopted.includes(s.id)).map(s => {
      const el = document.createElement('div');
      el.className = 'plush' + (s.row ? ' is-back' : '');
      el.innerHTML = Art.plush[s.id]();
      pile.appendChild(el);
      return { ...s, fx: s.x, el, rot: rand(-8, 8) };
    });
    measure();
  }
  function render() {
    rig.style.transform = `translateX(${(cx - 30).toFixed(1)}px)`;
    cable.style.height = len.toFixed(1) + 'px';
    head.style.setProperty('--open', open);
    items.forEach(it => { it.el.style.transform = `translate(${it.x.toFixed(1)}px, ${it.y.toFixed(1)}px) rotate(${it.rot.toFixed(1)}deg)`; });
  }
  const mid = () => W * .40, amp = () => W * .30;

  function loop(t) {
    raf = visible ? requestAnimationFrame(loop) : 0;
    const dt = Math.min(50, t - (lastT || t)); lastT = t;
    if (state === 'idle') { phase += dt * .0016; cx = mid() + amp() * Math.sin(phase); }
    if (carried) {
      carried.x = cx - PW / 2; carried.y = len + 44 - PW * .32;
      carried.rot = Math.sin(t / 160) * 5;
    }
    render();
  }

  function nearest() {
    let best = null, bd = Infinity;
    items.forEach(it => {
      const d = Math.abs(it.fx * W - cx) - (it.row ? 0 : 6);    // gentle preference for the front row
      if (d < bd) { bd = d; best = it; }
    });
    return best && bd < W * .3 ? best : null;
  }
  function settle(it) {   // gravity + two little bounces back to its spot
    return new Promise(res => {
      let vy = 0, bounces = 0; it.moving = true;
      (function step() {
        vy += 1.1; it.y += vy;
        if (it.y >= it.by) { it.y = it.by; vy *= -.35; bounces++; if (bounces > 2 || Math.abs(vy) < 1) { it.moving = false; return res(); } Music.sfx.drop(); }
        it.rot *= .95;
        requestAnimationFrame(step);
      })();
    });
  }

  async function drop() {
    if (state !== 'idle') return;
    if (!items.length) { adoptedReset(); return; }
    state = 'busy'; btn.disabled = true; btn.classList.add('is-pressed'); setTimeout(() => btn.classList.remove('is-pressed'), 140);
    Music.sfx.tap(); haptic(10);
    const target = nearest();
    status('Steady… steady…');
    if (target) await tween(cx, target.fx * W, 280, v => (cx = v), ease.out);
    Music.sfx.whirr(.95);
    const depth = target ? Math.max(26, target.y + PW * .32 - 44) : H - 90;
    await tween(len, depth, 950, v => (len = v));
    open = 0; Music.sfx.tap(); haptic(6); await sleep(320);
    if (!target) {
      await tween(len, 26, 800, v => (len = v)); open = 1;
      status('Nothing there but velvet. Try again — aim for something soft.');
      return finish();
    }
    target.moving = true; carried = target;
    const nearMiss = !store.get('missed', false);
    Music.sfx.whirr(.9);
    if (nearMiss) {
      await tween(len, depth * .45, 650, v => (len = v));
      carried = null; open = .6; Music.sfx.pop(); haptic([6, 20, 6]);
      store.set('missed', true);
      await settle(target);
      await tween(len, 26, 600, v => (len = v)); open = 1;
      status('So close! The claw got starstruck — happens around royalty. It’s rigged in your favour now. Promise.');
      return finish();
    }
    await tween(len, 26, 900, v => (len = v));
    Music.sfx.whirr(.75);
    await tween(cx, W * .89, 750, v => (cx = v));
    open = 1; carried = null; Music.sfx.pop(); await sleep(120);
    await tween(target.y, H + 10, 380, v => (target.y = v), ease.in);
    Music.sfx.drop(); haptic([10, 30, 18]);
    target.el.remove(); items = items.filter(i => i !== target);
    adopted.push(target.id); store.set('adopted', adopted);
    if (!store.get('firstPlush')) { store.set('firstPlush', target.id); Epilogue.plush(); }
    FX.burstAt($('.claw__chute'), 46, { up: true, hearts: .25 }); Music.sfx.win();
    const p = byId(target.id);
    await Modal.open({ art: Art.plush[p.id](), kicker: `Adopted · ${p.kind}`, title: p.name, body: p.msg, button: 'Take me home' });
    renderShelf();
    status(items.length ? `${items.length} more waiting. They’re all pretending not to stare at you.` : 'The vault is empty. All seven are yours now — I’ll tell them.');
    await tween(cx, mid(), 600, v => (cx = v));
    phase = 0;
    finish();
  }
  function finish() {
    state = 'idle'; btn.disabled = false;
    $('span', btn).textContent = items.length ? 'Drop' : 'Again';
  }
  function adoptedReset() {
    build(); render(); $('span', btn).textContent = 'Drop';
    status('Restocked! They all wanted a second hug.');
  }
  function renderShelf() {
    const shelf = $('#shelf');
    shelf.innerHTML = PLUSHIES.map(p => adopted.includes(p.id)
      ? `<button class="shelf__slot is-filled" data-id="${p.id}" aria-label="${p.name}">${Art.plush[p.id]()}</button>`
      : `<span class="shelf__slot" aria-hidden="true"></span>`).join('');
    $('#shelfCount').textContent = adopted.length;
    $$('button', shelf).forEach(b => b.addEventListener('click', () => {
      const p = byId(b.dataset.id);
      Modal.open({ art: Art.plush[p.id](), kicker: p.kind, title: p.name, body: p.msg, button: 'Back to the shelf' });
    }));
  }
  function init() {
    glass = $('#clawGlass'); rig = $('#clawRig'); cable = $('#clawCable'); head = $('#clawHead'); pile = $('#clawPile'); btn = $('#clawDrop');
    // marquee bulbs along the arch
    const bulbs = $('.claw__bulbs'), N = 13;
    for (let i = 0; i < N; i++) {
      const a = Math.PI - (i / (N - 1)) * Math.PI, b = document.createElement('i'); b.className = 'bulb';
      b.style.left = (50 + Math.cos(a) * 45) + '%'; b.style.top = (88 - Math.sin(a) * 74) + '%';
      b.style.animationDelay = (i % 2 ? .9 : 0) + 's';
      bulbs.appendChild(b);
    }
    build(); renderShelf();
    if (adopted.length === PLUSHIES.length) adoptedReset();
    cx = mid(); render();
    btn.addEventListener('click', drop);
    addEventListener('resize', () => { if (state === 'idle') measure(); }, { passive: true });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) { lastT = 0; raf = requestAnimationFrame(loop); } }).observe(glass);
  }
  return { init };
})();

/* =========================== III. SURPRISE EGG =========================== */
const Egg = (() => {
  const SKINS = [
    { top: ['#FFD9E5', '#F4B6C8', '#DE8AA6'], dots: '#fff', bow: '#2b2030', knot: '#F4B6C8' },
    { top: ['#E6DAF6', '#C8B6E2', '#9E88C4'], dots: '#fff', bow: '#6B1E3A', knot: '#E9C46A' },
    { top: ['#5a2a63', '#3D1F45', '#24112a'], dots: '#E9C46A', bow: '#F4B6C8', knot: '#E9C46A' },
  ];
  const SPLIT = [3, 3, 2];
  let taps = 0, eggIdx = store.get('eggs', 0), got = store.get('coupons', []);
  const EGG = 'M100 8 C152 8 184 88 184 142 C184 198 146 232 100 232 C54 232 16 198 16 142 C16 88 48 8 100 8Z';

  function draw() {
    const skin = SKINS[eggIdx % SKINS.length];
    const zig = []; for (let x = 0, i = 0; x <= 200; x += 12.5, i++) zig.push([x, i % 2 ? 134 : 122]);
    const zs = zig.map(p => p.join(',')).join(' ');
    const topPoly = `0,0 200,0 ${zig.slice().reverse().map(p => p.join(',')).join(' ')}`;
    const botPoly = `${zs} 200,240 0,240`;
    const dots = []; for (let i = 0; i < 26; i++) { const x = rand(30, 170), y = rand(24, 118); dots.push(`<path transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${rand(.5, 1).toFixed(2)})" d="M0 2.4 C-5 -1.6 -2.6 -5.6 0 -2.6 C2.6 -5.6 5 -1.6 0 2.4Z" fill="${skin.dots}" opacity=".45"/>`); }
    const lace = zig.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#FFF6FA" stroke="#f0bfd0" stroke-width=".8"/>`).join('');
    $('#eggSvg').innerHTML = `<defs>
      <linearGradient id="eTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${skin.top[0]}"/><stop offset=".5" stop-color="${skin.top[1]}"/><stop offset="1" stop-color="${skin.top[2]}"/></linearGradient>
      <linearGradient id="eBot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF8EF"/><stop offset=".55" stop-color="#F3E3D3"/><stop offset="1" stop-color="#D9C2AA"/></linearGradient>
      <radialGradient id="eShine" cx=".34" cy=".22" r=".42"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="eGlow"><stop offset="0" stop-color="#F6E1A6"/><stop offset=".5" stop-color="#E9C46A" stop-opacity=".5"/><stop offset="1" stop-color="#E9C46A" stop-opacity="0"/></radialGradient>
      <clipPath id="cTop"><polygon points="${topPoly}"/></clipPath><clipPath id="cBot"><polygon points="${botPoly}"/></clipPath></defs>
      <g class="egg__bottom" clip-path="url(#cBot)"><path d="${EGG}" fill="url(#eBot)"/><path d="${EGG}" fill="url(#eShine)"/></g>
      <ellipse class="egg__glow" cx="100" cy="128" rx="96" ry="46" fill="url(#eGlow)"/>
      <g class="egg__top" clip-path="url(#cTop)"><path d="${EGG}" fill="url(#eTop)"/>${dots.join('')}<path d="${EGG}" fill="url(#eShine)"/>
        <path class="egg__crack" d="M100 22 L93 44 L104 60 L95 80 L107 98 L99 122" fill="none" stroke="#4a1328" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></g>
      <g class="egg__top">${lace}</g>
      <g class="egg__ribbon">${Art.bow(100, 128, 1.9, skin.bow, skin.knot)}</g>`;
  }
  function couponHTML(c, i, fan) {
    return `<div class="coupon${fan ? ' fan' : ''}" style="--i:${i}">
      <div class="coupon__icon">${Art.icon[c.icon]()}</div>
      <div class="coupon__body"><p class="coupon__k">Coupon · redeem anytime</p><p class="coupon__t">${c.title}</p><p class="coupon__f">${c.fine}</p></div></div>`;
  }
  function renderBook() {
    $('#couponCount').textContent = got.length;
    $('#couponList').innerHTML = got.map(i => `<button data-i="${i}">${COUPONS[i].title}</button>`).join('');
    $$('#couponList button').forEach(b => b.addEventListener('click', () => {
      const c = COUPONS[b.dataset.i];
      Modal.open({ art: `<div style="width:84px;margin:auto;color:#E9C46A">${Art.icon[c.icon]()}</div>`, kicker: 'Coupon · redeem anytime', title: c.title, body: c.fine, button: 'Back in the book' });
    }));
  }
  async function tap() {
    const egg = $('#egg');
    if (egg.classList.contains('is-open')) return;
    if (eggIdx >= SPLIT.length) { toast('That was the whole box. Your coupons are safe in the book below.'); return; }
    taps++;
    egg.classList.remove('wob1', 'wob2'); void egg.offsetWidth;
    if (taps === 1) { egg.classList.add('wob1'); Music.sfx.tap(); haptic(8); $('#eggStatus').textContent = 'It wiggled. Again.'; }
    else if (taps === 2) { egg.classList.add('wob2', 'cracked'); Music.sfx.crack(); haptic(14); $('#eggStatus').textContent = 'Cracking… one more.'; }
    else {
      egg.classList.add('is-open'); Music.sfx.seal(); haptic([10, 30, 18]);
      FX.burstAt(egg, 60, { up: true, power: 8, hearts: .2 });
      setTimeout(() => Music.sfx.win(), 250);
      const start = SPLIT.slice(0, eggIdx).reduce((a, b) => a + b, 0), batch = COUPONS.slice(start, start + SPLIT[eggIdx]);
      const charm = CHARMS[eggIdx % CHARMS.length];
      $('#eggStatus').textContent = '';
      $('#eggPrize').innerHTML = `<div class="charm"><span class="charm__icon">${Art.icon[charm.icon]()}</span><span class="charm__name">Toy inside: ${charm.name}!</span></div>
        <div class="coupons">${batch.map((c, i) => couponHTML(c, i, true)).join('')}</div>`;
      batch.forEach((_, i) => { if (!got.includes(start + i)) got.push(start + i); });
      eggIdx++; store.set('eggs', eggIdx); store.set('coupons', got); renderBook();
      $('#eggAgain').hidden = eggIdx >= SPLIT.length;
      if (eggIdx >= SPLIT.length) setTimeout(() => { $('#eggStatus').textContent = 'That’s every egg. Unlike real Kinder Joys, these ones survived you.'; }, 1200);
    }
  }
  function again() {
    taps = 0; const egg = $('#egg');
    egg.classList.remove('is-open', 'cracked', 'wob1', 'wob2'); draw();
    $('#eggPrize').innerHTML = ''; $('#eggAgain').hidden = true;
    $('#eggStatus').textContent = 'A fresh one. Same rules: it’s shy.';
    Music.sfx.whoosh(); egg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function init() {
    draw(); renderBook();
    if (eggIdx >= SPLIT.length) $('#eggStatus').textContent = 'You’ve opened every egg. Your coupons are in the book below.';
    $('#egg').addEventListener('click', tap);
    $('#eggAgain').addEventListener('click', again);
  }
  return { init };
})();

/* =========================== IV. TAROT =========================== */
const Tarot = (() => {
  let flipped = 0;
  function deal() {
    const hand = TAROT.slice().sort(() => Math.random() - .5).slice(0, 3);
    flipped = 0;
    $('#tarot').innerHTML = hand.map((c, i) => `
      <button class="tcard" aria-label="Face-down card ${i + 1}. Tap to turn it over.">
        <span class="tcard__inner">
          <span class="tcard__face tcard__back">${Art.icon.moon()}</span>
          <span class="tcard__face tcard__front"><span class="tcard__n">${c.n}</span><span class="tcard__art">${Art.icon[c.icon]()}</span><span class="tcard__name">${c.name}</span></span>
        </span></button>`).join('');
    $('#readings').innerHTML = ''; $('#tarotAgain').hidden = true;
    $$('.tcard').forEach((el, i) => el.addEventListener('click', () => {
      if (el.classList.contains('is-flipped')) return;
      el.classList.add('is-flipped'); el.setAttribute('aria-label', `${hand[i].name}: ${hand[i].read}`);
      Music.sfx.flip(); haptic(8);
      setTimeout(() => {
        const c = hand[i];
        $('#readings').insertAdjacentHTML('beforeend', `<div class="reading"><span class="reading__n">${c.n}</span><span class="reading__name">${c.name}</span><p class="reading__text">${c.read}</p></div>`);
        FX.burstAt(el, 16, { colors: ['#E9C46A', '#F6E1A6'] });
        Music.sfx.chime();
        if (++flipped === 3) setTimeout(() => {
          $('#readings').insertAdjacentHTML('beforeend', `<p class="readings__birds">Byangomi says the cards are never wrong.<br>Byangoma says they’re occasionally a little biased.</p>`);
          $('#tarotAgain').hidden = false;
        }, 700);
      }, 780);
    }));
  }
  function init() { deal(); $('#tarotAgain').addEventListener('click', () => { Music.sfx.whoosh(); deal(); }); }
  return { init };
})();

/* =========================== V. THE TALE =========================== */
const Tale = (() => {
  let token = 0, skip = false;
  async function show(id, scroll) {
    const my = ++token, node = TALE[id], text = $('#bookText'), choices = $('#bookChoices');
    choices.innerHTML = ''; $('#bookEnd').hidden = true; skip = false;
    if (scroll) { const r = $('#book').getBoundingClientRect(); if (r.top < 0) $('#book').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    text.innerHTML = node.text.map((para, i) =>
      `<p class="${para.startsWith('“') ? 'is-quote' : ''}${i === 0 && id === 'start' ? ' drop' : ''}">${para.split(' ').map(w => `<span class="w">${w}</span>`).join(' ')}</p>`).join('');
    const words = $$('.w', text);
    for (let i = 0; i < words.length; i++) {
      if (my !== token) return;
      if (skip || REDUCED) { words.slice(i).forEach(w => w.classList.add('on')); break; }
      words[i].classList.add('on');
      await sleep(/[.,—:)]$/.test(words[i].textContent) ? 140 : 38);
    }
    if (my !== token) return;
    if (node.end) {
      $('#bookEnd').hidden = false; Music.sfx.chime();
      FX.burstAt($('#book'), 30, { up: true, colors: ['#E9C46A', '#F4B6C8'] });
      return;
    }
    choices.innerHTML = node.choices.map(([label, to], i) => `<button class="choice" style="animation-delay:${i * 90}ms" data-to="${to}">${label}</button>`).join('');
    $$('.choice', choices).forEach(b => b.addEventListener('click', () => { Music.sfx.flip(); haptic(6); show(b.dataset.to, true); }));
  }
  function init() {
    $('#bookText').addEventListener('click', () => (skip = true));
    const ta = $('#chapter2'), link = $('#sendChapter');
    const upd = () => (link.href = waLink(`Chapter Two, by ${CONFIG.name} ✍️\n\n${ta.value.trim() || 'It began with…'}`));
    ta.addEventListener('input', upd); upd();
    $('#taleAgain').addEventListener('click', () => show('start', true));
    $('#vial').addEventListener('click', () => {
      Music.sfx.chime();
      Modal.open({ art: `<div style="width:70px;margin:auto">${$('#vial').innerHTML}</div>`, kicker: 'Found in the margins', title: 'Amortentia', body: SECRETS.vial, button: 'Cork it' });
    });
    const book = $('#book');
    if (book.classList.contains('is-in')) show('start');
    else Reveal.when(book, () => setTimeout(() => show('start'), 450));
  }
  return { init };
})();

/* =========================== VI. THE POTIONS LAB =========================== */
const Lab = (() => {
  let chosen = [], found = store.get('potions', []), busy = false, brews = 0;
  const ing = id => INGREDIENTS.find(i => i.id === id);
  const key = ids => ids.slice().sort().join('+');
  const LEVEL = [140, 112, 84];                  // liquid surface per ingredient count
  function mix(ids) {
    if (!ids.length) return '#C8B6E2';
    const c = ids.map(id => ing(id).color).map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
    let [r, g, b] = [0, 1, 2].map(k => c.reduce((s, x) => s + x[k], 0) / c.length / 255);
    // brighten + saturate the average so mixes stay jewel-toned instead of muddy
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    let h = 0, sat = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
    if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = ((h % 6) + 6) % 6;
    sat = Math.min(1, sat * 1.6 + .12); const L = Math.min(.66, Math.max(.42, l));
    const C = (1 - Math.abs(2 * L - 1)) * sat, X = C * (1 - Math.abs((h % 2) - 1)), m = L - C / 2;
    const k = Math.floor(h);
    [r, g, b] = [[C, X, 0], [X, C, 0], [0, C, X], [0, X, C], [X, 0, C], [C, 0, X]][k];
    return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
  }
  function paintFlask() {
    const f = $('#flask');
    f.style.setProperty('--liq', mix(chosen));
    f.style.setProperty('--lvl', (chosen.length ? LEVEL[chosen.length - 1] : 214) + 'px');
    f.classList.toggle('has-liquid', chosen.length > 0);
    $('#brew').disabled = chosen.length !== 3 || busy;
    $('#labMix').textContent = chosen.length ? chosen.map(id => ing(id).name).join(' · ') + (chosen.length < 3 ? ` — ${3 - chosen.length} more` : '') : 'Pick three ingredients from the shelf.';
  }
  function renderJars() {
    $('#jars').innerHTML = INGREDIENTS.map(i => `
      <button class="jar${chosen.includes(i.id) ? ' is-on' : ''}" data-id="${i.id}" aria-pressed="${chosen.includes(i.id)}" style="--c:${i.color}">
        <span class="jar__art">${Art.jar(i.color)}<span class="jar__icon">${Art.icon[i.icon]()}</span></span>
        <span class="jar__name">${i.name}</span></button>`).join('');
    $$('.jar').forEach(b => b.addEventListener('click', () => {
      if (busy) return;
      const id = b.dataset.id;
      if (chosen.includes(id)) chosen = chosen.filter(x => x !== id);
      else if (chosen.length >= 3) { toast('Only three fit in the flask, Professor.'); b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); return; }
      else { chosen.push(id); Music.sfx.pop(); haptic(6); }
      b.classList.toggle('is-on', chosen.includes(id)); b.setAttribute('aria-pressed', chosen.includes(id));
      paintFlask();
    }));
  }
  function renderBook() {
    $('#recipeCount').textContent = found.length;
    $('#recipes').innerHTML = RECIPES.map((r, i) => found.includes(i)
      ? `<li class="is-found"><span class="dot" style="--c:${mix(r.set)}"></span><b>${r.name}</b><em>${r.set.map(id => ing(id).name.split(',')[0].split(' (')[0]).join(' + ')}</em></li>`
      : `<li><span class="dot"></span><b>? ? ?</b><em>${r.hint}</em></li>`).join('');
  }
  async function brew() {
    if (chosen.length !== 3 || busy) return;
    busy = true; paintFlask(); brews++;
    const f = $('#flask'); f.classList.add('is-brewing');
    Music.sfx.whoosh(); haptic([8, 30, 8, 30, 12]);
    await sleep(REDUCED ? 200 : 1500);
    Music.sfx.seal(); FX.burstAt(f, 50, { up: true, power: 7, colors: [mix(chosen), '#E9C46A', '#FCEFF2'] });
    f.classList.remove('is-brewing');
    const idx = RECIPES.findIndex(r => key(r.set) === key(chosen)), color = mix(chosen);
    if (idx >= 0) {
      const r = RECIPES[idx], fresh = !found.includes(idx);
      if (fresh) { found.push(idx); store.set('potions', found); }
      Music.sfx.win();
      await Modal.open({ art: Art.potion(color), kicker: fresh ? `Recipe discovered · ${found.length}/9` : 'Brewed again · already in your book', title: r.name, body: `${r.effect}\n\nSide effect: ${r.side}`, button: 'Bottle it' });
      renderBook();
      if (fresh && found.length === RECIPES.length) {
        FX.burstAt($('#recipes'), 70, { hearts: .3, power: 8 });
        await Modal.open({ art: Art.potion('#E9C46A'), kicker: 'All nine recipes', title: 'Top of the class', body: 'Every potion in the notebook, brewed by the Half-Blood Princess herself.\nSnape would still deduct points. I, however, am deeply impressed.', button: 'Close the notebook' });
      }
    } else {
      const left = RECIPES.map((r, i) => i).filter(i => !found.includes(i));
      const names = chosen.map(id => ing(id).name.split(',')[0].split(' (')[0].toLowerCase());
      const line = DUDS[brews % DUDS.length].replace('{a}', names[0]).replace('{b}', names[1]);
      const hint = left.length ? `\n\nByangomi peeks into the flask and whispers: “${RECIPES[pick(left)].hint}”` : '';
      Music.sfx.chime();
      await Modal.open({ art: Art.potion(color), kicker: 'Unnamed brew', title: 'Hmm. Interesting.', body: line + hint, button: 'Try again' });
    }
    chosen = []; busy = false; renderJars(); paintFlask();
  }
  function init() {
    renderJars(); renderBook(); paintFlask();
    $('#brew').addEventListener('click', brew);
  }
  return { init };
})();

/* =========================== EPILOGUE =========================== */
const Epilogue = (() => {
  function plush() {
    const id = store.get('firstPlush', 'bat'), p = PLUSHIES.find(x => x.id === id);
    $('#letterPlush').innerHTML = `${Art.plush[id]()}<span class="tag">${shortName(p.name)} insisted on coming.</span>`;
  }
  function init() {
    $('#letterBody').innerHTML = LETTER.map((t, i) => `<p style="--i:${i}">${t}</p>`).join('');
    $('#signOff').textContent = CONFIG.signOff;
    $('#dateLine').textContent = CONFIG.dateLine;
    plush();

    // wish candle: press & hold to blow
    const c = $('#wishCandle'); let blow = 0, holding = false, done = false, raf = 0, lastT = 0;
    function step(t) {
      const dt = lastT ? Math.min(50, t - lastT) : 16; lastT = t;
      blow = Math.max(0, Math.min(1, blow + (holding ? dt / 1150 : -dt / 350)));
      c.style.setProperty('--blow', blow.toFixed(3));
      if (blow >= 1 && !done) return out();
      raf = (holding || blow > 0) && !done ? requestAnimationFrame(step) : 0;
      if (!raf) lastT = 0;
    }
    function press(e) { if (done) return; e.preventDefault(); holding = true; Music.sfx.blow(); haptic(6); if (!raf) raf = requestAnimationFrame(step); }
    function release() { holding = false; }
    function out() {
      done = true; c.classList.add('is-out'); document.body.classList.add('is-wished');
      setTimeout(() => document.body.classList.remove('is-wished'), 6000);
      Music.sfx.blow(); setTimeout(() => Music.sfx.win(), 300); haptic([10, 40, 10]);
      const [x, y] = centerOf($('.wc__flame', c)); FX.burst(x, y, 70, { up: true, power: 9, grav: .03, colors: ['#F6E1A6', '#E9C46A', '#FCEFF2', '#C8B6E2'] });
      const d = $('#wishDone');
      d.textContent = 'Wish received. The fortune birds are on it.';
      setTimeout(() => { d.innerHTML = 'Wish received. The fortune birds are on it.<br><span class="hand" style="font-size:1.3rem;font-style:normal">status: pending — looking very likely</span>'; }, 1800);
    }
    c.addEventListener('pointerdown', press);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => c.addEventListener(ev, release));
    c.addEventListener('contextmenu', e => e.preventDefault());
    c.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !done) { e.preventDefault(); out(); } });

    const vote = $('#vote');
    vote.href = waLink('⭐ Voted.\nComment: ');
    vote.addEventListener('click', () => { vote.classList.add('is-voted'); FX.burstAt(vote, 30, { up: true, colors: ['#E9C46A', '#F6E1A6'] }); Music.sfx.chime(); });
  }
  return { init, plush };
})();

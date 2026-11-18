/* ==========================================================================
   Conductor
   ========================================================================== */
(function () {
  const N = CONFIG.name;
  $('.prologue__title .script').textContent = N;
  $('#heroName').textContent = N;
  $('.pcard__name').textContent = N;
  $('.letter__hi').textContent = `${N},`;
  $('.colophon .script').textContent = N;
  document.title = `A Letter for ${N}`;

  paintArt();
  $('#ribbonBow').innerHTML = `<svg viewBox="-15 -8 30 22" aria-hidden="true">${Art.bow(0, 0, 1, '#F4B6C8', '#E9C46A')}</svg>`;
  if (MARGIN.quote) { const m = $('#margin'); m.hidden = false; m.innerHTML = `Quoted in the margins: “${MARGIN.quote}” <span>${MARGIN.note}</span>`; }

  /* ---------- floating candles ---------- */
  const candles = $('#candles'), count = innerWidth < 600 ? 9 : 14;
  for (let i = 0; i < count; i++) {
    // keep the centre column clear for the words; candles live at the edges and up high
    const left = i % 2 === 0, wide = innerWidth > 900;
    const x = left ? rand(2, wide ? 20 : 14) : rand(wide ? 78 : 84, 95);
    let y = (i / count) * 80 + rand(2, 8);
    if (!left && y < 22) y += 16;
    const s = rand(.55, 1.15);
    const el = document.createElement('span');
    el.className = 'candle';
    el.style.cssText = `--x:${x}%;--y:${y}%;--s:${s.toFixed(2)};--o:${(.35 + s * .55).toFixed(2)};--d:${rand(-4, 0).toFixed(2)}s;--dur:${rand(2.6, 4.2).toFixed(2)}s;--l:${(1.1 + i * .16).toFixed(2)}s`;
    el.innerHTML = '<i class="candle__flame"></i><i class="candle__body"></i>';
    candles.appendChild(el);
  }

  /* ---------- prologue ---------- */
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), sleep(2500)])
    .then(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));

  let opened = false;
  $('#seal').addEventListener('click', async () => {
    if (opened) return; opened = true;
    Music.start();
    Music.sfx.seal(); haptic(12);
    $('#prologue').classList.add('is-opening');
    FX.burstAt($('#seal'), 44, { colors: ['#E05A7A', '#F4B6C8', '#E9C46A', '#FCEFF2'], power: 7 });
    await sleep(REDUCED ? 300 : 1900);
    window.scrollTo(0, 0);
    document.body.classList.remove('is-sealed');
    document.body.classList.add('is-open');
    $('#main').removeAttribute('aria-hidden');
    const vis = new Set(), aio = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)); FX.ambient(vis.size > 0); });
    [$('.hero'), $('#epilogue')].forEach(el => aio.observe(el));
    const ribbon = $('#ribbon'); let ticking = false;
    const onScroll = () => { if (ticking) return; ticking = true; requestAnimationFrame(() => { ticking = false; const max = document.documentElement.scrollHeight - innerHeight; const p = max > 0 ? Math.min(1, scrollY / max) : 0; ribbon.style.setProperty('--p', p.toFixed(4)); ribbon.classList.toggle('is-done', p > .995); }); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    Dock.init();
    let zt; const zio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; clearTimeout(zt);
      zt = setTimeout(() => Music.zone(SCORE[e.target.id]), 700);
    }), { rootMargin: '-45% 0px -45% 0px' });
    Object.keys(SCORE).forEach(id => { const el = document.getElementById(id); if (el) zio.observe(el); });
    setTimeout(() => $('#heroName').classList.add('is-swept'), 2000);
    setTimeout(() => FX.burstAt($('#heroName'), 30, { colors: ['#E9C46A', '#F6E1A6', '#FCEFF2'], power: 5 }), 2300);
    setTimeout(() => $('#prologue').remove(), 1400);
  });

  /* ---------- crown easter egg: five quick taps ---------- */
  let crownTaps = 0, crownTimer;
  $('#crown').addEventListener('click', () => {
    crownTaps++; clearTimeout(crownTimer); crownTimer = setTimeout(() => (crownTaps = 0), 1400);
    FX.burstAt($('#crown'), 8, { colors: ['#E9C46A', '#F6E1A6'], power: 3 });
    Music.sfx.tap();
    if (crownTaps === 5) {
      crownTaps = 0;
      const c = $('#crown'); c.classList.remove('spin'); void c.offsetWidth; c.classList.add('spin');
      FX.burstAt(c, 60, { power: 8, hearts: .3 }); Music.sfx.win(); haptic([10, 30, 10]);
      toast(SECRETS.crown, 4200);
    }
  });

  /* ---------- chapters wake up as she reaches them ---------- */
  Reveal.watch();
  Reveal.when($('#letter'), () => {});
  [['#crowning', Card.init], ['#vault', Claw.init], ['#surprise', Egg.init], ['#fortune', Tarot.init],
   ['#tale', Tale.init], ['#lab', Lab.init], ['#epilogue', Epilogue.init]]
    .forEach(([sel, fn]) => {
      const sec = $(sel);
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { rootMargin: '600px 0px' });
      io.observe(sec);
    });
  Bats.init();
})();

/* ==========================================================================
   The music box.
   Nothing here is a recording: every note of "Rishika's Waltz" is synthesised
   live in her browser, the moment she opens the letter.
   ========================================================================== */
const Music = (() => {
  let ctx, master, musicBus, sfxBus, reverbIn, noiseBuf;
  let on = false, mood = 'sweet', timer = null, auto = true, zoneMood = 'sweet', paused = false, switchTimer = null;
  let events = [], cursor = 0, loopStart = 0, loopBeats = 0, spb = 0.5, track = null;
  const listeners = new Set();
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  /* ---------- chords: bass note, waltz "pah-pah" pair, arpeggio ---------- */
  const CH = {
    C:  { b: 48, u: [64, 67], a: [60, 64, 67, 72] },
    Am: { b: 45, u: [64, 69], a: [57, 60, 64, 69] },
    F:  { b: 53, u: [65, 69], a: [53, 57, 60, 65] },
    G:  { b: 55, u: [62, 67], a: [55, 59, 62, 67] },
    Dm: { b: 50, u: [65, 69], a: [50, 53, 57, 62] },
    E:  { b: 52, u: [64, 68], a: [52, 56, 59, 64] },
    E7: { b: 52, u: [62, 68], a: [52, 56, 59, 62] },
    Bb: { b: 58, u: [65, 70], a: [58, 62, 65, 70] },
    A7: { b: 57, u: [61, 67], a: [57, 61, 64, 67] },
    Gm: { b: 55, u: [62, 70], a: [55, 58, 62, 67] },
    Edim: { b: 52, u: [64, 70], a: [52, 55, 58, 64] },
  };
  const bars = (list, beats = 3) => list.map(c => [c, beats]);

  /* ---------- three moods, three original waltzes ---------- */
  const TRACKS = {
    sweet: {
      title: "Rishika's Waltz", sub: 'Sweet', bpm: 126, style: 'waltz', warm: { cut: 1700, gain: .010, voice: .022 },
      mel: [[76,2],[79,1], [81,1],[79,1],[76,1], [77,2],[81,1], [79,3],
            [76,1],[77,1],[79,1], [84,2],[83,1], [81,1],[77,1],[74,1], [74,2],[71,1],
            [76,2],[79,1], [81,1],[84,1],[83,1], [81,2],[77,1], [79,2],[74,1],
            [76,1],[79,1],[84,1], [81,2],[79,1], [77,1],[76,1],[74,1], [72,3]],
      chords: bars(['C','Am','F','G','C','Am','F','G','C','Am','F','G','C','F','G','C']),
    },
    gothic: {
      title: 'Nocturne for a Princess', sub: 'Gothic', bpm: 104, style: 'waltz', warm: { cut: 1050, gain: .015, voice: .020 },
      mel: [[76,1],[81,1],[84,1], [86,2],[84,1], [83,1],[80,1],[76,1], [81,3],
            [84,1],[81,1],[77,1], [77,1],[81,1],[86,1], [84,1],[83,1],[80,1], [83,3],
            [76,1],[81,1],[84,1], [83,2],[86,1], [84,1],[81,1],[77,1], [76,2],[80,1],
            [81,1],[84,1],[88,1], [86,2],[77,1], [80,1],[83,1],[86,1], [81,3]],
      chords: bars(['Am','Dm','E','Am','F','Dm','E','E','Am','G','F','E','Am','Dm','E7','Am']),
    },
    dreamy: {
      title: 'Lullaby in Candlelight', sub: 'Dreamy', bpm: 80, style: 'arp', warm: { cut: 1500, gain: .012, voice: .016 },
      mel: [[81,2],[84,1], [86,2],[81,1], [82,1],[81,1],[79,1], [79,3],
            [81,2],[84,1], [88,2],[84,1], [86,1.5],[84,1.5], [77,3],
            [77,1],[81,1],[84,1], [86,1],[84,1],[81,1], [82,2],[86,1], [84,3],
            [81,1],[84,1],[88,1], [86,2],[82,1], [79,1],[81,1],[82,1], [77,3]],
      chords: [...bars(['F','Dm','Bb','C','F','Am']), ['Bb',1.5], ['C',1.5],
               ...bars(['F','F','Dm','Bb','C','Am','Bb','C','F'])],
    },
    // Original, in a wizarding style: celesta melody, pizzicato bass, harp sweeps, live cauldron bubbles.
    potions: {
      title: 'Something Brewing', sub: 'Potions', bpm: 112, style: 'pizz', bubbles: true, warm: { cut: 1200, gain: .011, voice: .016 },
      mel: [[69,.5],[74,.5],[77,.5],[81,.5],[80,.5],[81,.5], [86,1],[85,.5],[86,.5],[81,1], [82,.5],[81,.5],[79,.5],[82,.5],[86,1], [85,1.5],[81,.5],[76,1],
            [77,.5],[76,.5],[77,.5],[81,.5],[86,.5],[89,.5], [86,1],[82,.5],[86,.5],[89,1], [88,.5],[86,.5],[85,.5],[82,.5],[79,.5],[76,.5], [85,1],[81,2],
            [69,.5],[74,.5],[77,.5],[81,.5],[80,.5],[81,.5], [84,1],[81,.5],[84,.5],[89,1], [82,.5],[86,.5],[79,.5],[82,.5],[86,1], [88,1],[82,.5],[79,.5],[76,1],
            [77,.5],[81,.5],[86,.5],[89,.5],[88,.5],[86,.5], [85,.5],[86,.5],[88,.5],[91,.5],[88,1], [85,1],[81,.5],[79,.5],[76,.5],[73,.5], [74,1.5],[0,1.5]],
      chords: bars(['Dm','Dm','Gm','A7','Dm','Bb','Edim','A7','Dm','F','Gm','Edim','Dm','A7','A7','Dm']),
    },
  };

  function compile(t) {
    const ev = [];
    let beat = 0;
    for (const [m, d] of t.mel) { if (m) ev.push({ beat, k: 'mel', m, d }); beat += d; }
    loopBeats = beat;
    beat = 0;
    for (const [name, d] of t.chords) {
      const c = CH[name];
      if (t.style === 'pizz') {
        ev.push({ beat, k: 'pluck', m: c.b });
        for (let i = 1; i < d; i++) ev.push({ beat: beat + i, k: 'stab', ms: c.u });
        if (Math.round(beat / 3) % 4 === 3) ev.push({ beat: beat + 2, k: 'gliss', ms: c.a });
      } else if (t.style === 'waltz') {
        ev.push({ beat, k: 'bass', m: c.b, d });
        for (let i = 1; i < d; i++) ev.push({ beat: beat + i, k: 'chord', ms: c.u });
      } else {
        ev.push({ beat, k: 'bass', m: c.b, d });
        const pat = [0, 1, 2, 3, 2, 1];
        for (let i = 0; i < d * 2; i++) ev.push({ beat: beat + i / 2, k: 'arp', m: c.a[pat[i % 6]] + 12 });
      }
      // the warm bed under the music box: soft strings + a round low end
      ev.push({ beat, k: 'strings', ms: [c.b + 12, ...c.u], d });
      ev.push({ beat, k: 'warmbass', m: c.b, d });
      beat += d;
    }
    return ev.sort((a, b) => a.beat - b.beat);
  }

  /* ---------- graph ---------- */
  function build() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = 0.0001;
    const felt = ctx.createBiquadFilter(); felt.type = 'lowpass'; felt.frequency.value = 4600; felt.Q.value = .5;
    musicBus = ctx.createGain(); musicBus.gain.value = 1;
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8;
    const verb = ctx.createConvolver(); verb.buffer = impulse(3.4, 2.6);
    reverbIn = ctx.createGain(); reverbIn.gain.value = 0.42;
    musicBus.connect(felt); felt.connect(master); felt.connect(reverbIn);
    sfxBus.connect(master);
    reverbIn.connect(verb); verb.connect(master);
    master.connect(comp); comp.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else if (on) ctx.resume();
    });
    return true;
  }

  function impulse(sec, decay) {
    const rate = ctx.sampleRate, len = Math.floor(rate * sec), buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      // filtered noise that gets darker as it decays: a warm hall, not a bright tin room
      let y = 0;
      for (let i = 0; i < len; i++) {
        const k = i / len, a = .55 - .45 * k;
        y += a * ((Math.random() * 2 - 1) - y);
        d[i] = y * 1.7 * Math.pow(1 - k, decay);
      }
    }
    return buf;
  }

  /* ---------- instruments ---------- */
  // A music-box tine: pure tone + an inharmonic shimmer that dies fast.
  function tine(t, m, vel = 1, dest = musicBus, len = 1.8) {
    const f = hz(m);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2 * vel, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(dest);
    const o1 = ctx.createOscillator(); o1.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2;
    const g2 = ctx.createGain(); g2.gain.value = 0.07;
    const o3 = ctx.createOscillator(); o3.frequency.value = f * 4.07;
    const g3 = ctx.createGain();
    g3.gain.setValueAtTime(0.0001, t);
    g3.gain.exponentialRampToValueAtTime(0.05 * vel, t + 0.003);
    g3.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o1.connect(g); o2.connect(g2); g2.connect(g); o3.connect(g3); g3.connect(dest);
    for (const o of [o1, o2, o3]) { o.start(t); o.stop(t + len + 0.05); }
  }

  // Soft string section: detuned saws, a filter that slowly opens, gentle vibrato, spread left/right.
  function strings(t, ms, dur, w) {
    const rel = 1.2, end = t + dur + rel + .05;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .6;
    lp.frequency.setValueAtTime(w.cut * .5, t);
    lp.frequency.linearRampToValueAtTime(w.cut, t + Math.min(1.2, dur * .6));
    lp.connect(musicBus);
    const lfo = ctx.createOscillator(), depth = ctx.createGain();
    lfo.frequency.value = 4.6; depth.gain.value = 6; lfo.connect(depth);
    ms.forEach((m, i) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(.0001, t);
      g.gain.linearRampToValueAtTime(w.gain, t + Math.min(.7, dur * .45));
      g.gain.setValueAtTime(w.gain, t + dur);
      g.gain.linearRampToValueAtTime(.0001, t + dur + rel);
      const out = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (out) { out.pan.value = [-.45, .45, 0][i % 3]; g.connect(out); out.connect(lp); } else g.connect(lp);
      for (const det of [-9, 8]) {
        const o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.value = hz(m); o.detune.value = det; depth.connect(o.detune);
        o.connect(g); o.start(t); o.stop(end);
      }
    });
    lfo.start(t); lfo.stop(end);
  }

  // A round, warm low end that holds each chord (felt on headphones, hinted on phone speakers).
  function warmBass(t, m, dur) {
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 480; lp.connect(musicBus); g.connect(lp);
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(.075, t + .05);
    g.gain.exponentialRampToValueAtTime(.035, t + dur);
    g.gain.linearRampToValueAtTime(.0001, t + dur + .6);
    const o1 = ctx.createOscillator(); o1.type = 'triangle'; o1.frequency.value = hz(m);
    const o2 = ctx.createOscillator(); o2.frequency.value = hz(m - 12);
    for (const o of [o1, o2]) { o.connect(g); o.start(t); o.stop(t + dur + .7); }
  }

  // A soft woodwind voice doubling the melody an octave below, so it sings instead of just plinking.
  function voice(t, m, dur, gain) {
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 1900; lp.connect(musicBus); g.connect(lp);
    const len = Math.max(.25, dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(gain, t + .08);
    g.gain.setValueAtTime(gain, t + len * .7);
    g.gain.linearRampToValueAtTime(.0001, t + len + .35);
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = hz(m - 12);
    const vib = ctx.createOscillator(), vd = ctx.createGain();
    vib.frequency.value = 5.2; vd.gain.value = 7; vib.connect(vd); vd.connect(o.detune);
    o.connect(g);
    for (const x of [o, vib]) { x.start(t); x.stop(t + len + .4); }
  }

  function bubble(t) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = 380 + Math.random() * 520;
    o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 2.4, t + .09);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.045, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .12);
    o.connect(g); g.connect(musicBus); o.start(t); o.stop(t + .14);
  }

  /* ---------- scheduler ---------- */
  function timeOf(e) { return loopStart + e.beat * spb; }
  function tick() {
    if (!on || paused || !events.length) return;
    if (track.bubbles && Math.random() < .035) bubble(ctx.currentTime + .05 + Math.random() * .1);
    const horizon = ctx.currentTime + 0.2;
    while (timeOf(events[cursor]) < horizon) {
      const e = events[cursor], t = Math.max(timeOf(e), ctx.currentTime + 0.01);
      if (e.k === 'mel') { tine(t, e.m, .9, musicBus, 2.4); voice(t, e.m, e.d * spb, track.warm.voice); }
      else if (e.k === 'bass') tine(t, e.m, 0.45, musicBus, 1.6);
      else if (e.k === 'chord') e.ms.forEach(m => tine(t, m, 0.2, musicBus, 0.9));
      else if (e.k === 'arp') tine(t, e.m, 0.2, musicBus, 1.6);
      else if (e.k === 'strings') strings(t, e.ms, e.d * spb, track.warm);
      else if (e.k === 'warmbass') warmBass(t, e.m, e.d * spb);
      else if (e.k === 'pluck') tine(t, e.m, .6, musicBus, .45);
      else if (e.k === 'stab') e.ms.forEach(m => tine(t, m, .22, musicBus, .3));
      else if (e.k === 'gliss') [0, 1, 2, 3].flatMap(o => e.ms.map(m => m + 12 + o * 12)).filter(m => m < 100).forEach((m, i) => tine(t + i * .045, m, .18, musicBus, 1));
      cursor++;
      if (cursor >= events.length) { cursor = 0; loopStart += loopBeats * spb; }
    }
  }

  function load(name) {
    track = TRACKS[name];
    spb = 60 / track.bpm;
    events = compile(track);
    cursor = 0;
    loopStart = ctx.currentTime + 0.25;
  }

  function emit() { listeners.forEach(fn => fn({ on, mood, auto, track: TRACKS[mood] })); }

  /* ---------- public ---------- */
  function start() {                       // must be called from a tap
    if (!ctx && !build()) return;
    ctx.resume();
    on = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 1.6);
    load(mood);
    clearInterval(timer);
    timer = setInterval(tick, 40);
    emit();
  }
  function stop() {
    if (!ctx) return;
    on = false;
    clearInterval(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    setTimeout(() => { if (!on) ctx.suspend(); }, 450);
    emit();
  }
  function setMood(m, opts = {}) {
    if (!TRACKS[m]) return;
    if (!opts.auto) auto = false;
    if (m === mood) { emit(); return; }
    mood = m;
    if (on) {                                   // crossfade: fade out, swap at a fresh downbeat, fade in
      const t = ctx.currentTime;
      musicBus.gain.cancelScheduledValues(t);
      musicBus.gain.setValueAtTime(Math.max(musicBus.gain.value, .0001), t);
      musicBus.gain.exponentialRampToValueAtTime(.0001, t + .6);
      paused = true; clearTimeout(switchTimer);
      switchTimer = setTimeout(() => {
        load(mood); paused = false;
        const t2 = ctx.currentTime;
        musicBus.gain.cancelScheduledValues(t2);
        musicBus.gain.setValueAtTime(.0001, t2);
        musicBus.gain.exponentialRampToValueAtTime(1, t2 + 1.4);
      }, 650);
    }
    emit();
  }
  function zone(m) { zoneMood = m; if (auto) setMood(m, { auto: true }); }
  function setAuto(v) { auto = v; if (v) setMood(zoneMood, { auto: true }); emit(); }

  /* ---------- little sounds for little moments ---------- */
  function noise(t, dur, type, f0, f1, gain, q = 1) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const bp = ctx.createBiquadFilter(); bp.type = type; bp.Q.value = q;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(bp); bp.connect(g); g.connect(sfxBus);
    s.start(t); s.stop(t + dur + 0.02);
  }
  function blip(t, f0, f1, dur, gain, type = 'sine') {
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + dur + 0.02);
  }
  const ready = () => ctx && on;
  const now = () => ctx.currentTime;
  const sfx = {
    chime() { if (!ready()) return; const t = now(); [84, 88, 91, 96].forEach((m, i) => tine(t + i * 0.06, m, 0.5, sfxBus, 1.2)); },
    win() { if (!ready()) return; const t = now(); [72, 76, 79, 84, 88, 91].forEach((m, i) => tine(t + i * 0.07, m, 0.6, sfxBus, 1.6)); },
    pop() { if (!ready()) return; blip(now(), 900, 260, 0.12, 0.25); },
    tap() { if (!ready()) return; blip(now(), 1400, 900, 0.05, 0.08, 'triangle'); },
    crack() { if (!ready()) return; const t = now(); noise(t, 0.09, 'bandpass', 2600, 1200, 0.5, 2); blip(t, 300, 120, 0.08, 0.15, 'triangle'); },
    seal() { if (!ready()) return; const t = now(); noise(t, 0.14, 'bandpass', 1800, 500, 0.6, 1.5); blip(t + 0.02, 160, 60, 0.25, 0.35); },
    whoosh() { if (!ready()) return; noise(now(), 0.35, 'bandpass', 500, 2400, 0.22, 0.8); },
    flip() { if (!ready()) return; const t = now(); noise(t, 0.18, 'highpass', 3000, 6000, 0.12); blip(t + 0.12, 600, 1200, 0.08, 0.06, 'triangle'); },
    drop() { if (!ready()) return; blip(now(), 180, 55, 0.3, 0.4); },
    blow() { if (!ready()) return; noise(now(), 0.7, 'lowpass', 1600, 200, 0.35, 0.5); },
    whirr(dur = 0.8) {
      if (!ready()) return;
      const t = now(), o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t); o.frequency.linearRampToValueAtTime(95, t + dur);
      lp.type = 'lowpass'; lp.frequency.value = 380;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.08);
      g.gain.setValueAtTime(0.05, t + dur - 0.1); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); lp.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + dur + 0.05);
    },
  };

  return {
    start, stop, setMood, zone, setAuto, sfx,
    toggle() { on ? stop() : start(); },
    get on() { return on; }, get mood() { return mood; }, get auto() { return auto; },
    tracks: TRACKS,
    subscribe(fn) { listeners.add(fn); fn({ on, mood, auto, track: TRACKS[mood] }); },
  };
})();

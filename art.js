/* ==========================================================================
   Hand-drawn SVG art: plushies, line icons, crown, seal, bats.
   ========================================================================== */
const Art = (() => {
  let n = 0;
  const uid = p => `${p}${++n}`;
  const INK = '#1d1018';
  const rg = (id, a, b, cx = .38, cy = .3, r = .85) =>
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
  const svg = (inner, defs = '', vb = '0 0 100 100') =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>${defs}</defs>${inner}</svg>`;
  const shadow = (rx = 26) => `<ellipse cx="50" cy="95" rx="${rx}" ry="3.4" fill="#000" opacity=".22"/>`;

  function face(cx, cy, o = {}) {
    const s = o.s || 1, ink = o.ink || INK, gap = (o.gap || 9.5) * s, blush = o.blush || '#ff6f9c';
    let g = '';
    for (const d of [-1, 1]) g += `<ellipse cx="${cx + d * (gap + 5 * s)}" cy="${cy + 5 * s}" rx="${4.4 * s}" ry="${2.5 * s}" fill="${blush}" opacity=".5"/>`;
    if (!o.noEyes) for (const d of [-1, 1]) {
      const x = cx + d * gap;
      g += o.happy
        ? `<path d="M${x - 3 * s} ${cy + 1 * s} q${3 * s} ${-4.2 * s} ${6 * s} 0" fill="none" stroke="${ink}" stroke-width="${1.6 * s}" stroke-linecap="round"/>`
        : `<ellipse cx="${x}" cy="${cy}" rx="${3 * s}" ry="${3.4 * s}" fill="${ink}"/><circle cx="${x + 1.1 * s}" cy="${cy - 1.3 * s}" r="${1.1 * s}" fill="#fff"/><circle cx="${x - 1 * s}" cy="${cy + 1.4 * s}" r="${.5 * s}" fill="#fff" opacity=".7"/>`;
    }
    const mc = o.mouth || ink, my = cy + 4.6 * s;
    g += `<path d="M${cx - 3.2 * s} ${my} q${1.6 * s} ${2.4 * s} ${3.2 * s} 0 q${1.6 * s} ${2.4 * s} ${3.2 * s} 0" fill="none" stroke="${mc}" stroke-width="${1.2 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
    if (o.fangs) g += `<path d="M${cx - 2.7 * s} ${my + .8 * s} l${.8 * s} ${2.6 * s} l${.8 * s} ${-2.3 * s}z M${cx + 1.1 * s} ${my + .8 * s} l${.8 * s} ${2.6 * s} l${.8 * s} ${-2.3 * s}z" fill="#fff" stroke="${mc}" stroke-width="${.45 * s}" stroke-linejoin="round"/>`;
    return g;
  }

  function bow(x, y, s = 1, c = '#ff8fb3', knot) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 0 l-4 10 M0 0 l4 10" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M0 0 C-6 -7 -13 -6 -13 0 C-13 6 -6 7 0 0Z M0 0 C6 -7 13 -6 13 0 C13 6 6 7 0 0Z" fill="${c}"/>
      <path d="M-3 -1 C-6 -3 -9 -3 -10 -1 M3 -1 C6 -3 9 -3 10 -1" stroke="#000" stroke-opacity=".18" stroke-width="1" fill="none"/>
      <circle r="2.6" fill="${knot || c}" stroke="#000" stroke-opacity=".15" stroke-width=".6"/></g>`;
  }

  /* --------------------------- plushies --------------------------- */
  const plush = {
    bunny() {
      const g = uid('pb');
      return svg(`${shadow()}
        <path d="M18 82 L12 50 L32 63 L50 57 L68 63 L88 50 L82 82Z" fill="#4d1029"/>
        <path d="M23 80 L19 57 L33 66 L50 61 L67 66 L81 57 L77 80Z" fill="#9b1f48"/>
        <g transform="rotate(-14 38 30)"><ellipse cx="38" cy="27" rx="7.6" ry="19" fill="url(#${g})"/><ellipse cx="38" cy="29" rx="3.8" ry="13" fill="#ffc3d5"/></g>
        <g transform="rotate(14 62 30)"><ellipse cx="62" cy="27" rx="7.6" ry="19" fill="url(#${g})"/><ellipse cx="62" cy="29" rx="3.8" ry="13" fill="#ffc3d5"/></g>
        <ellipse cx="50" cy="66" rx="27" ry="25" fill="url(#${g})"/>
        ${face(50, 62, { fangs: true })}
        <circle cx="50" cy="85" r="3.2" fill="#c2185b" stroke="#e9c27a" stroke-width="1.1"/>`,
        rg(g, '#ffffff', '#efd6e0'));
    },
    bat() {
      const g = uid('pt');
      const lace = [[73,55],[66,50],[58,47],[50,46],[42,47],[34,50],[27,55]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff6fa" stroke="#f0bfd0" stroke-width=".6"/>`).join('');
      return svg(`${shadow()}
        <path d="M30 58 C18 44 6 46 3 54 C8 56 9 61 6 66 C12 65 15 69 14 74 C19 70 25 71 30 74Z" fill="#4e3d63"/>
        <path d="M70 58 C82 44 94 46 97 54 C92 56 91 61 94 66 C88 65 85 69 86 74 C81 70 75 71 70 74Z" fill="#4e3d63"/>
        <path d="M29 61 C21 53 13 53 10 57 C14 60 14 63 13 66 C18 66 20 69 20 72 C23 70 27 71 29 72Z M71 61 C79 53 87 53 90 57 C86 60 86 63 87 66 C82 66 80 69 80 72 C77 70 73 71 71 72Z" fill="#ff9ec0" opacity=".55"/>
        <path d="M34 38 L28 15 L45 31Z M66 38 L72 15 L55 31Z" fill="#5e4a7a"/>
        <circle cx="50" cy="65" r="27" fill="url(#${g})"/>
        <path d="M23 60 C22 36 36 30 50 30 C64 30 78 36 77 60 C70 50 60 46 50 46 C40 46 30 50 23 60Z" fill="#fff6fa"/>
        <path d="M30 42 C40 36 60 36 70 42" stroke="#f3c6d6" stroke-width="1" fill="none" stroke-dasharray="1.6 2"/>
        ${lace}
        ${bow(28, 72, .55, '#ff8fb3')}
        ${face(50, 63, { fangs: true })}`,
        rg(g, '#a792c2', '#5b4777'));
    },
    ghost() {
      const g = uid('pg');
      return svg(`${shadow(24)}
        <path d="M27 90 L27 52 C27 36 38 26 50 26 C62 26 73 36 73 52 L73 90 Q67.5 84 62 90 Q56 84 50 90 Q44 84 38 90 Q32.5 84 27 90Z" fill="url(#${g})"/>
        ${bow(38, 33, .6, '#2b2030', '#3d2f45')}
        ${face(50, 52)}
        <path d="M44 66 q-3 -5 0 -9 M50 65 q-3 -5 0 -9" stroke="#c7b3d6" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".9"/>
        <path d="M40 69 h20 l-2.4 12 q-7.6 3.4 -15.2 0z" fill="#f6ebdd" stroke="#c9a45c" stroke-width="1"/>
        <ellipse cx="50" cy="69" rx="10" ry="2.2" fill="#6b3e26"/>
        <path d="M60 71 q6 0 5 5 q-1 4 -6 3.4" stroke="#c9a45c" stroke-width="1.6" fill="none"/>
        <ellipse cx="38.5" cy="76" rx="4.6" ry="3.6" fill="#f3eef9"/><ellipse cx="61.5" cy="77" rx="4.2" ry="3.4" fill="#f3eef9"/>`,
        rg(g, '#ffffff', '#e6ddf3'));
    },
    cat() {
      const g = uid('pc');
      const pearls = [-12, -8, -4, 0, 4, 8, 12].map(dx => {
        const x = 50 + dx, y = 67 + 5.5 * (1 - (dx / 13) ** 2);
        return `<circle cx="${x}" cy="${y}" r="1.9" fill="#fffaf0" stroke="#e2d4bf" stroke-width=".4"/>`;
      }).join('');
      return svg(`${shadow()}
        <path d="M72 86 C92 84 94 62 82 56" stroke="#2c2333" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M27 48 L25 19 L46 36Z M73 48 L75 19 L54 36Z" fill="#2c2333"/>
        <path d="M30 42 L29.5 27 L41 36Z M70 42 L70.5 27 L59 36Z" fill="#ff9ec0" opacity=".8"/>
        <ellipse cx="50" cy="63" rx="27" ry="26" fill="url(#${g})"/>
        <path d="M23 72 Q50 62 77 72 L79 90 Q50 97 21 90Z" fill="#141016"/>
        <path d="M41 67 L50 81 L44 93 L33 71Z M59 67 L50 81 L56 93 L67 71Z" fill="#2e2431"/>
        <path d="M30 76 q4 -3 8 -2 M66 74 q4 0 6 3" stroke="#fff" stroke-opacity=".22" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M50 81 V94" stroke="#bdbcc8" stroke-width="1" stroke-dasharray="1.2 1.2"/>
        <circle cx="29" cy="74" r="1.1" fill="#d6d6de"/><circle cx="71" cy="74" r="1.1" fill="#d6d6de"/>
        ${pearls}
        <ellipse cx="51" cy="60" rx="4" ry="2.4" fill="#ff7aa2" opacity=".45"/>
        ${face(50, 52, { noEyes: true, mouth: '#ffc2d4', blush: '#ff7aa2' })}
        <ellipse cx="40.5" cy="51" rx="4.2" ry="4.6" fill="#ffd36e"/><ellipse cx="40.5" cy="51" rx="1.3" ry="3.6" fill="#140c12"/><circle cx="42" cy="49.4" r="1" fill="#fff"/>
        <ellipse cx="59.5" cy="51" rx="4.2" ry="4.6" fill="#ffd36e"/><ellipse cx="59.5" cy="51" rx="1.3" ry="3.6" fill="#140c12"/><circle cx="61" cy="49.4" r="1" fill="#fff"/>
        <path d="M48.6 55.2 h2.8 l-1.4 1.8z" fill="#ff9ec0"/>
        <path d="M34 57 l-11 -2 M34 60 l-11 2 M66 57 l11 -2 M66 60 l11 2" stroke="#b9a8c6" stroke-width=".8" stroke-linecap="round"/>
        ${bow(66, 36, .45, '#ff8fb3')}`,
        rg(g, '#54465f', '#1f1825'));
    },
    owl() {
      const g = uid('po');
      const specks = [[38,74],[46,80],[56,79],[63,72],[33,66],[66,64],[42,86],[58,87]]
        .map(([x, y]) => `<path d="M${x - 2} ${y} l2 1.6 l2 -1.6" stroke="#b3a796" stroke-width=".9" fill="none" stroke-linecap="round"/>`).join('');
      const eye = x => `<circle cx="${x}" cy="54" r="8.4" fill="#fff" stroke="#e2d8c8" stroke-width="1"/><circle cx="${x}" cy="54" r="5.4" fill="#f2b84b"/><circle cx="${x}" cy="54" r="3.4" fill="${INK}"/><circle cx="${x + 1.4}" cy="52.4" r="1.2" fill="#fff"/>`;
      return svg(`${shadow()}
        <path d="M29 42 L26 26 L40 36Z M71 42 L74 26 L60 36Z" fill="#e3dccf"/>
        <ellipse cx="50" cy="62" rx="26" ry="30" fill="url(#${g})"/>
        <ellipse cx="25.5" cy="68" rx="6.4" ry="15" transform="rotate(12 25.5 68)" fill="#ddd3c4"/>
        <ellipse cx="74.5" cy="68" rx="6.4" ry="15" transform="rotate(-12 74.5 68)" fill="#ddd3c4"/>
        ${specks}
        ${eye(40)}${eye(60)}
        <ellipse cx="31" cy="63" rx="4" ry="2.2" fill="#ff6f9c" opacity=".45"/><ellipse cx="69" cy="63" rx="4" ry="2.2" fill="#ff6f9c" opacity=".45"/>
        <path d="M47.4 59 L52.6 59 L50 64Z" fill="#e39b3a"/>
        <g transform="rotate(-7 50 79)"><rect x="37" y="71" width="26" height="16" rx="1.6" fill="#f6ebdd" stroke="#c9a45c" stroke-width=".9"/>
        <path d="M37 71.5 L50 80.5 L63 71.5" stroke="#c9a45c" stroke-width=".9" fill="none"/><circle cx="50" cy="80.5" r="3.2" fill="#a3133a"/><path d="M48.6 80.5 h2.8" stroke="#e9c27a" stroke-width=".6"/></g>
        <ellipse cx="44" cy="92" rx="3.6" ry="2" fill="#e39b3a"/><ellipse cx="56" cy="92" rx="3.6" ry="2" fill="#e39b3a"/>`,
        rg(g, '#ffffff', '#e5ddcf'));
    },
    spider() {
      const g = uid('ps');
      const legs = [
        'M32 58 Q18 46 11 58', 'M30 66 Q14 62 8 76', 'M32 73 Q18 78 15 91', 'M37 79 Q28 88 30 96',
      ];
      const legSvg = legs.map(d => `<path d="${d}" stroke="#e0759a" stroke-width="3.4" fill="none" stroke-linecap="round"/>`).join('');
      const cuffs = [[17,51],[13,66],[19,83],[31,88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff6fa" stroke="#f0bfd0" stroke-width=".6"/>`).join('');
      const collar = [-15, -10, -5, 0, 5, 10, 15].map(dx => {
        const x = 50 + dx, y = 77 + 3 * (1 - (dx / 16) ** 2);
        return `<circle cx="${x}" cy="${y}" r="3" fill="#fff6fa" stroke="#f0bfd0" stroke-width=".6"/>`;
      }).join('');
      return svg(`${shadow()}
        <g>${legSvg}${cuffs}</g><g transform="matrix(-1 0 0 1 100 0)">${legSvg}${cuffs}</g>
        <circle cx="50" cy="64" r="25" fill="url(#${g})"/>
        ${collar}
        <circle cx="43.5" cy="52" r="1.5" fill="${INK}"/><circle cx="56.5" cy="52" r="1.5" fill="${INK}"/>
        <circle cx="38.5" cy="55" r="1.1" fill="${INK}"/><circle cx="61.5" cy="55" r="1.1" fill="${INK}"/>
        ${face(50, 62)}
        ${bow(50, 40, .62, '#2b2030', '#3d2f45')}`,
        rg(g, '#ffd3e1', '#ef7ea6'));
    },
    axolotl() {
      const g = uid('pa');
      const gill = (d) => `<path d="${d}" stroke="#ff6f9f" stroke-width="4" stroke-linecap="round" fill="none"/>`;
      const gills = gill('M29 45 L17 36') + gill('M26 53 L12 51') + gill('M28 61 L16 67');
      const frill = [[20,38],[15,51],[19,65]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#ff8fb3"/>`).join('');
      return svg(`${shadow()}
        <path d="M70 80 C86 78 93 67 91 58 C85 66 79 71 70 71Z" fill="#f4a5c0"/>
        <g>${gills}${frill}</g><g transform="matrix(-1 0 0 1 100 0)">${gills}${frill}</g>
        <ellipse cx="50" cy="61" rx="25" ry="23" fill="url(#${g})"/>
        <path d="M27 73 Q50 66 73 73 L75 92 Q50 97 25 92Z" fill="#fbfbff" stroke="#d9d4e6" stroke-width=".8"/>
        <path d="M43 71 L50 84 L57 71" stroke="#c9c3d9" stroke-width="1.3" fill="none"/>
        <rect x="58" y="80" width="9" height="7" rx="1" fill="none" stroke="#c9c3d9" stroke-width=".9"/>
        <path d="M61 77.5 v5" stroke="#7a5ccc" stroke-width="1.4" stroke-linecap="round"/>
        <rect x="33" y="80" width="9" height="4.4" rx="1" fill="#e9c27a"/>
        ${face(50, 56, { gap: 11 })}
        <circle cx="39" cy="56" r="5.6" fill="none" stroke="#3b2a40" stroke-width="1.1"/><circle cx="61" cy="56" r="5.6" fill="none" stroke="#3b2a40" stroke-width="1.1"/>
        <path d="M44.6 55.4 q5.4 -2.4 10.8 0" stroke="#3b2a40" stroke-width="1.1" fill="none"/>`,
        rg(g, '#ffe0ea', '#f59bbb'));
    },
  };

  /* --------------------------- line icons (64×64) --------------------------- */
  const L = (inner, extra = '') => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;
  const icon = {
    crown: () => L(`<path d="M12 46 L9 22 L22 32 L32 14 L42 32 L55 22 L52 46Z"/><path d="M12 52 H52"/><circle cx="32" cy="38" r="2.4"/><circle cx="21" cy="40" r="1.6"/><circle cx="43" cy="40" r="1.6"/>`),
    sweet: () => L(`<path d="M19 36 L23 54 H41 L45 36"/><path d="M27 38 L28.5 54 M37 38 L35.5 54"/><path d="M16 36 C13 27 23 22 27 25 C29 16 39 16 41 24 C48 22 51 30 48 36Z"/><circle cx="33" cy="13" r="3"/><path d="M33 16 V20"/><path d="M27 44 l1.6 4 l1.6 -4 M34 44 l1.6 4 l1.6 -4" stroke-width="1.4"/>`),
    quill: () => L(`<path d="M52 8 C34 12 20 28 16 52"/><path d="M52 8 C50 24 38 38 20 46"/><path d="M44 14 L30 22 M48 22 L32 30 M44 32 L27 36"/><path d="M16 52 L12 58"/><path d="M8 58 H30" stroke-dasharray="2 4"/>`),
    flask: () => L(`<path d="M25 8 H39 M28 8 V25 L14 49 Q11 56 18 56 H46 Q53 56 50 49 L36 25 V8"/><path d="M18 44 Q25 40 32 44 T46 44"/><circle cx="28" cy="50" r="1.6"/><circle cx="36" cy="48" r="1.2"/><path d="M44 16 c4 -2 6 2 10 0 M44 22 c4 -2 6 2 10 0" stroke-width="1.4"/>`),
    moon: () => L(`<path d="M38 9 A23 23 0 1 0 55 40 A17 17 0 1 1 38 9Z"/><path d="M48 16 l1.4 3 l3 1.4 l-3 1.4 l-1.4 3 l-1.4 -3 l-3 -1.4 l3 -1.4z" stroke-width="1.4"/><circle cx="54" cy="30" r="1"/>`),
    cups: () => L(`<path d="M8 28 H28 V40 Q28 48 18 48 Q8 48 8 40Z"/><path d="M28 31 h3 q4 0 4 4 t-4 4 h-3"/><path d="M33 28 H53 V40 Q53 48 43 48 Q33 48 33 40Z"/><path d="M53 31 h3 q4 0 4 4 t-4 4 h-3" opacity=".0"/><path d="M14 22 q-2 -4 1 -8 M22 22 q-2 -4 1 -8 M40 22 q-2 -4 1 -8 M47 22 q-2 -4 1 -8" stroke-width="1.4"/><path d="M6 54 H58"/><path d="M30.5 12 c-2 -3 -6 -1 -4 2 l4 4 l4 -4 c2 -3 -2 -5 -4 -2z" stroke-width="1.4"/>`),
    bat: () => L(`<path d="M32 26 C28 26 26 30 26 34 C20 28 12 28 6 32 C10 34 12 38 11 42 C15 40 19 42 20 46 C23 42 28 42 32 46 C36 42 41 42 44 46 C45 42 49 40 53 42 C52 38 54 34 58 32 C52 28 44 28 38 34 C38 30 36 26 32 26Z"/><path d="M28 26 L27 21 L30 24 M36 26 L37 21 L34 24"/><circle cx="29.5" cy="32" r=".8" fill="currentColor"/><circle cx="34.5" cy="32" r=".8" fill="currentColor"/>`),
    owl: () => L(`<path d="M18 22 L16 12 L24 18 Q32 14 40 18 L48 12 L46 22 Q52 34 46 46 Q40 56 32 56 Q24 56 18 46 Q12 34 18 22Z"/><circle cx="25" cy="28" r="5"/><circle cx="39" cy="28" r="5"/><circle cx="25" cy="28" r="1.4" fill="currentColor"/><circle cx="39" cy="28" r="1.4" fill="currentColor"/><path d="M30 33 L32 37 L34 33"/><rect x="22" y="41" width="20" height="12" rx="1"/><path d="M22 41.5 L32 48 L42 41.5"/>`),
    rose: () => L(`<path d="M32 30 C22 30 18 22 22 14 C26 18 30 16 32 12 C34 16 38 18 42 14 C46 22 42 30 32 30Z"/><path d="M27 20 C30 24 34 24 37 20 M29 16 C31 19 33 19 35 16"/><path d="M32 30 V58"/><path d="M32 44 C26 40 20 42 18 46 C24 48 28 47 32 44Z M32 50 C38 46 44 48 46 52 C40 54 36 53 32 50Z"/>`),
    candle: () => L(`<path d="M24 28 H40 V56 H24Z"/><path d="M32 28 V23"/><path d="M32 8 C36 13 37 17 32 21 C27 17 28 13 32 8Z"/><path d="M24 34 c3 2 4 6 3 9" stroke-width="1.4"/><path d="M16 56 H48"/>`),
    heart: () => L(`<path d="M32 54 C14 42 8 32 12 22 C16 13 28 13 32 22 C36 13 48 13 52 22 C56 32 50 42 32 54Z"/>`),
    star: () => L(`<path d="M32 8 L38.5 24 L56 25.5 L42.6 36.8 L46.8 54 L32 44.8 L17.2 54 L21.4 36.8 L8 25.5 L25.5 24Z"/>`),
    /* royal-order items */
    tuberose: () => L(`<path d="M32 58 V14"/>${[14, 22, 30, 38].map((y, i) => `<path d="M32 ${y} c-${5 + i} -1 -${7 + i} -6 -4 -${7}" /><path d="M32 ${y + 2} c${5 + i} -1 ${7 + i} -6 4 -${7}"/>`).join('')}<path d="M32 50 C26 46 22 47 20 50 M32 52 C38 48 42 49 44 52"/>`),
    roses: () => L(`<path d="M22 26 C15 26 12 20 15 14 C18 17 21 15 22 12 C23 15 26 17 29 14 C32 20 29 26 22 26Z"/><path d="M42 30 C35 30 32 24 35 18 C38 21 41 19 42 16 C43 19 46 21 49 18 C52 24 49 30 42 30Z"/><path d="M22 26 L30 56 M42 30 L34 56"/><path d="M26 56 H38"/><path d="M27 42 C22 39 18 41 17 44 C21 45 24 45 27 42Z"/>`),
    infusion: () => L(`<path d="M14 26 H44 V36 Q44 48 29 48 Q14 48 14 36Z"/><path d="M44 29 h3 q5 0 5 5 t-5 5 h-4"/><path d="M8 52 Q29 58 50 52"/><path d="M22 20 q-3 -4 0 -9 M30 20 q-3 -4 0 -9 M38 20 q-3 -4 0 -9" stroke-width="1.5"/>`),
    coldcoffee: () => L(`<path d="M20 22 L24 58 H40 L44 22"/><path d="M18 22 H46"/><path d="M20 22 C20 14 44 14 44 22"/><path d="M36 6 L32 30" stroke-width="2.4"/><rect x="26" y="36" width="6" height="6" rx="1" stroke-width="1.4"/><rect x="33" y="44" width="6" height="6" rx="1" stroke-width="1.4"/>`),
    cappuccino: () => L(`<path d="M12 24 H46 V34 Q46 48 29 48 Q12 48 12 34Z"/><path d="M46 28 h3 q5 0 5 5 t-5 5 h-4"/><path d="M6 52 Q29 58 52 52"/><path d="M29 36 C22 31 22 26 26 25.5 C28 25.3 29 27 29 28 C29 27 30 25.3 32 25.5 C36 26 36 31 29 36Z" stroke-width="1.5"/>`),
    rosogolla: () => L(`<path d="M10 40 H54 L48 54 Q32 60 16 54Z"/><circle cx="24" cy="30" r="9"/><circle cx="40" cy="30" r="9"/><path d="M20 26 q2 -2 4 -2 M36 26 q2 -2 4 -2" stroke-width="1.4"/>`),
    sandesh: () => L(`<path d="M32 12 C44 12 52 24 52 36 C52 46 44 52 32 52 C20 52 12 46 12 36 C12 24 20 12 32 12Z"/><path d="M32 18 V48 M32 22 L22 44 M32 22 L42 44 M32 20 L16 36 M32 20 L48 36" stroke-width="1.3"/>`),
    moa: () => L(`<circle cx="32" cy="34" r="17"/>${[[26,26],[34,24],[40,30],[24,34],[32,32],[38,40],[28,42],[42,36],[20,30]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="1" stroke-width="1.2"/>`).join('')}<path d="M10 56 H54"/>`),
    patishapta: () => L(`<path d="M8 40 C8 30 22 24 34 26 L56 30 C60 31 60 39 56 40 L34 44 C22 46 8 48 8 40Z"/><ellipse cx="14" cy="38" rx="5" ry="6"/><path d="M14 38 c1 -1 2 0 1 1"/><path d="M6 54 H58"/>`),
    leaf: () => L(`<path d="M14 52 C10 30 26 12 52 10 C54 36 38 52 14 52Z"/><path d="M14 52 C24 40 34 30 46 18"/><path d="M26 40 l-2 -8 M34 32 l-2 -8 M30 38 l8 0 M38 30 l8 0" stroke-width="1.4"/>`),
    drop: () => L(`<path d="M32 8 C40 22 50 32 50 42 C50 52 42 58 32 58 C22 58 14 52 14 42 C14 32 24 22 32 8Z"/><path d="M22 42 c0 6 4 9 9 9" stroke-width="1.5"/>`),
    helix: () => L(`<path d="M20 6 C20 22 44 26 44 42 C44 50 38 54 32 58"/><path d="M44 6 C44 22 20 26 20 42 C20 50 26 54 32 58"/><path d="M23 13 H41 M27 20 H37 M27 36 H37 M23 44 H41" stroke-width="1.5"/>`),
    cloud: () => L(`<path d="M18 46 C8 46 8 32 18 32 C18 20 34 18 38 28 C42 22 54 26 52 36 C60 38 58 48 50 48 Z"/><path d="M26 40 q4 3 8 0" stroke-width="1.5"/><circle cx="25" cy="37" r="1" fill="currentColor"/><circle cx="35" cy="37" r="1" fill="currentColor"/>`),
    note: () => L(`<path d="M24 46 V14 L50 8 V40"/><ellipse cx="18" cy="46" rx="7" ry="5.5"/><ellipse cx="44" cy="40" rx="7" ry="5.5"/><path d="M24 22 L50 16" stroke-width="1.5"/>`),
    egg: () => L(`<path d="M32 8 C44 8 52 26 52 38 C52 50 43 58 32 58 C21 58 12 50 12 38 C12 26 20 8 32 8Z"/><path d="M12.6 33 L19 37 L25 31 L32 37 L39 31 L45 37 L51.4 33"/>`),
  };

  /* --------------------------- set pieces --------------------------- */
  function crown(gold = true) {
    const g = uid('cr');
    return svg(`<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c9"/><stop offset=".35" stop-color="#e9c27a"/><stop offset=".6" stop-color="#b8893f"/><stop offset="1" stop-color="#f6d996"/></linearGradient></defs>
      <path d="M14 70 L8 30 L32 50 L50 18 L68 50 L92 30 L86 70Z" fill="url(#${g})" stroke="#7a5420" stroke-width="1.2" stroke-linejoin="round"/>
      <rect x="13" y="70" width="74" height="10" rx="3" fill="url(#${g})" stroke="#7a5420" stroke-width="1.2"/>
      <circle cx="8" cy="28" r="4" fill="#ffd6e0" stroke="#7a5420"/><circle cx="50" cy="15" r="4.6" fill="#ffd6e0" stroke="#7a5420"/><circle cx="92" cy="28" r="4" fill="#ffd6e0" stroke="#7a5420"/>
      <path d="M50 52 l5 7 l-5 7 l-5 -7z" fill="#b0173c" stroke="#7a5420"/><circle cx="30" cy="62" r="3" fill="#7d5cc6"/><circle cx="70" cy="62" r="3" fill="#7d5cc6"/>
      <path d="M20 36 L30 46" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-linecap="round"/>`, '', '0 0 100 90');
  }

  function seal(letter = 'R') {
    const g = uid('se');
    return svg(`<defs><radialGradient id="${g}" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#e24a72"/><stop offset=".55" stop-color="#a3133a"/><stop offset="1" stop-color="#650a24"/></radialGradient></defs>
      <path d="M50 4 C62 3 70 10 80 12 C90 18 94 28 95 40 C99 50 95 62 90 70 C86 82 76 90 64 94 C54 98 44 97 34 94 C22 91 12 82 8 70 C3 60 2 48 6 38 C9 26 16 15 28 9 C35 5 42 5 50 4Z" fill="url(#${g})"/>
      <circle cx="50" cy="50" r="31" fill="none" stroke="#5a0820" stroke-opacity=".55" stroke-width="2.4"/>
      <circle cx="50" cy="50" r="31" fill="none" stroke="#ff9fb8" stroke-opacity=".35" stroke-width="1" transform="translate(-.8 -.8)"/>
      <text x="50" y="63" text-anchor="middle" font-family="Grenze Gotisch, serif" font-weight="700" font-size="40" fill="#4f061b" opacity=".8">${letter}</text>
      <text x="49.2" y="62.2" text-anchor="middle" font-family="Grenze Gotisch, serif" font-weight="700" font-size="40" fill="#ff9fb8" opacity=".55">${letter}</text>
      <path d="M38 22 l3 -5 l3 5 l3 -5 l3 5 l3 -5 l3 5 l3 -5 l3 5" stroke="#ff9fb8" stroke-opacity=".5" stroke-width="1.4" fill="none"/>
      <ellipse cx="34" cy="26" rx="10" ry="5" fill="#fff" opacity=".18" transform="rotate(-30 34 26)"/>`);
  }

  function cuteBat(c = '#2b2030') {
    return svg(`<path d="M50 34 C44 34 41 40 41 46 C33 36 20 36 8 42 C14 46 16 52 15 58 C21 55 27 58 29 64 C34 58 42 58 50 64 C58 58 66 58 71 64 C73 58 79 55 85 58 C84 52 86 46 92 42 C80 36 67 36 59 46 C59 40 56 34 50 34Z" fill="${c}"/>
      <path d="M44 35 L42 25 L47 31 M56 35 L58 25 L53 31" fill="${c}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="46" cy="44" r="2" fill="#ffd6e0"/><circle cx="54" cy="44" r="2" fill="#ffd6e0"/>
      <ellipse cx="42.5" cy="49" rx="2.4" ry="1.3" fill="#ff7aa2" opacity=".7"/><ellipse cx="57.5" cy="49" rx="2.4" ry="1.3" fill="#ff7aa2" opacity=".7"/>
      <path d="M48.4 49.5 l.8 2 l.8 -1.8 M51 49.5 l.8 2 l.8 -1.8" stroke="#fff" stroke-width=".9" fill="none"/>`, '', '0 20 100 50');
  }

  function flourish() {
    return `<svg viewBox="0 0 240 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M4 12 H86 M154 12 H236"/><path d="M86 12 C96 2 106 2 110 10 C112 14 108 18 104 15 M154 12 C144 2 134 2 130 10 C128 14 132 18 136 15"/>
      <path d="M120 4 l4 8 l-4 8 l-4 -8z" fill="currentColor" fill-opacity=".25"/><circle cx="112" cy="12" r="1.4" fill="currentColor"/><circle cx="128" cy="12" r="1.4" fill="currentColor"/>
      <path d="M30 12 c4 -5 10 -5 12 0 M210 12 c-4 -5 -10 -5 -12 0" opacity=".6"/></svg>`;
  }

  function potion(color = '#F4B6C8') {
    const g = uid('pt'), sh = uid('ps');
    return svg(`<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".35" stop-color="${color}"/><stop offset="1" stop-color="${color}"/></linearGradient>
      <radialGradient id="${sh}" cx=".35" cy=".3" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="50" cy="94" rx="26" ry="3.4" fill="#000" opacity=".25"/>
      <path d="M43 10 h14 v6 h-14z" fill="#A8782F"/><path d="M41 16 h18 v4 h-18z" fill="#7a5420"/>
      <path d="M44 20 h12 v14 C72 40 80 52 80 64 C80 82 66 92 50 92 C34 92 20 82 20 64 C20 52 28 40 44 34Z" fill="rgba(255,255,255,.1)" stroke="#FCEFF2" stroke-opacity=".8" stroke-width="2"/>
      <path d="M23 60 C34 54 44 66 56 60 C64 56 72 56 77 60 C78 78 66 89 50 89 C34 89 22 78 23 60Z" fill="url(#${g})"/>
      <circle cx="40" cy="74" r="2.4" fill="#fff" opacity=".7"/><circle cx="58" cy="68" r="1.6" fill="#fff" opacity=".6"/><circle cx="50" cy="80" r="1.2" fill="#fff" opacity=".6"/>
      <path d="M20 64 C20 52 28 40 44 34 V20 h12 v14 C72 40 80 52 80 64" fill="url(#${sh})"/>
      <path d="M30 50 C27 56 26 62 27 68" stroke="#fff" stroke-opacity=".7" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M50 22 C46 12 58 8 56 2" stroke="#E9C46A" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M74 24 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2z" fill="#E9C46A"/>`);
  }

  function jar(color) {
    return svg(`<rect x="17" y="2" width="14" height="8" rx="2" fill="#A8782F"/>
      <path d="M15 10 h18 v5 c6 2 9 6 9 12 v19 c0 5 -4 8 -9 8 h-18 c-5 0 -9 -3 -9 -8 v-19 c0 -6 3 -10 9 -12z" fill="rgba(255,255,255,.07)" stroke="#FCEFF2" stroke-opacity=".55" stroke-width="1.4"/>
      <path d="M7.6 28 C16 25 26 31 40.4 27 v19 c0 4.4 -3.4 7 -8 7 h-16.8 c-4.6 0 -8 -2.6 -8 -7z" fill="${color}"/>
      <path d="M11 22 c-1 3 -1.4 7 -1 11" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/>`, '', '0 0 48 56');
  }

  return { plush, icon, crown, seal, cuteBat, flourish, bow, potion, jar };
})();

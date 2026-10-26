// EDU NOVA Math — Parte 1/5: utilidades y generadores de preguntas.
// La interfaz completa (todos los elementos visibles) está escrita en index.html.
// EDU NOVA Math — Lógica de la aplicación: contenidos, progreso, actividades y juegos.
// La interfaz completa (todos los elementos visibles) está escrita en index.html.
/* ============================================================
   1. UTILIDADES: números, fracciones, opciones y preguntas
   ============================================================ */
const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (a) => a[R(0, a.length - 1)];
const shuf = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = R(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const fmt = (n) => String(+(+n).toFixed(6)).replace('.', ',').replace('-', '−');
const fix = (n, d) => (+n).toFixed(d).replace('.', ',').replace('-', '−');
const fs = (n, d) => {
  const g = gcd(n, d);
  n /= g;
  d /= g;
  return d === 1 ? String(n) : n + '/' + d;
};
const parseNum = (s) => {
  s = String(s).trim().replace('−', '-').replace(',', '.').replace(/\s/g, '');
  return /^-?\d*\.?\d+$/.test(s) ? parseFloat(s) : NaN;
};
const inputNumber = (input) => parseNum(input.value);
function numOpts(ans, o = {}) {
  const step = o.step || 1,
    dec = o.dec ?? (Number.isInteger(ans) ? 0 : 2),
    neg = o.neg,
    f = o.f || (dec ? (x) => fix(x, dec) : String);
  const set = new Set([f(ans)]),
    cands = [
      ...(o.extra || []),
      ans + step,
      ans - step,
      ans + 2 * step,
      ans - 2 * step,
      ans + 10 * step,
      ans - 10 * step,
      ans * 2,
      ans + 5 * step,
      ans - 5 * step,
      ans + 3 * step,
    ];
  const out = [f(ans)];
  for (const c0 of shuf(cands)) {
    const c = +(+c0).toFixed(6);
    if (!neg && c < 0) continue;
    const s = f(c);
    if (!set.has(s)) {
      set.add(s);
      out.push(s);
    }
    if (out.length >= 4) break;
  }
  let k = 7;
  while (out.length < 4) {
    const s = f(ans + k * step);
    if (!set.has(s) && (neg || ans + k * step >= 0)) {
      set.add(s);
      out.push(s);
    }
    k += 2;
  }
  return shuf(out);
}
const Q = (q, a, opts, exp, x = {}) => Object.assign({ q, a: String(a), opts: shuf(opts), exp }, x);
const QN = (q, ans, exp, o = {}) => {
  const f = o.f || (o.dec ? (x) => fix(x, o.dec) : Number.isInteger(ans) ? String : fmt);
  const dec = o.dec ?? (Number.isInteger(ans) ? 0 : 2);
  return Q(q, f(ans), numOpts(ans, Object.assign({ f, dec }, o)), exp, Object.assign({ num: ans }, o.x || {}));
};
function fracOpts(n, d) {
  const a = fs(n, d);
  const c = [
    `${n + 1}/${d}`,
    `${n}/${d + 1}`,
    `${Math.max(1, n - 1)}/${d}`,
    `${n + 2}/${d}`,
    `${n}/${d + 2}`,
    `${d}/${n}`,
    `${n * 2}/${d * 3}`,
  ].filter((x) => x !== a);
  return [a, ...shuf([...new Set(c)]).slice(0, 3)];
}
const C = {
  sun: '#f4b400',
  mint: '#2fbf86',
  coral: '#ee6a86',
  sky: '#3aa8e8',
  violet: '#8a6cf0',
  bg: '#ffffff',
  ln: '#b9aee8',
  fg: '#2b2a5c',
};
const vT = (x, y, size, txt, mid) =>
  `<text x="${x}" y="${y}"${mid ? ' text-anchor="middle"' : ''} fill="${C.fg}" font-family="Fredoka,sans-serif" font-size="${size}">${txt}</text>`;
const vBars = (n, d) => {
  const w = Math.min(300, d * 46),
    cw = w / d;
  let s = `<svg width="${w + 4}" height="56" viewBox="0 0 ${w + 4} 56" role="img" aria-label="${n} de ${d} partes pintadas">`;
  for (let i = 0; i < d; i++)
    s += `<rect x="${2 + i * cw}" y="2" width="${cw - 2}" height="52" rx="8" fill="${i < n ? C.sky : C.bg}" stroke="${C.ln}" stroke-width="2"/>`;
  return s + '</svg>';
};
const vArray = (r, c) => {
  let s = `<svg width="${c * 26 + 4}" height="${r * 26 + 4}" role="img" aria-label="${r} filas de ${c}">`;
  for (let i = 0; i < r; i++)
    for (let j = 0; j < c; j++) s += `<circle cx="${15 + j * 26}" cy="${15 + i * 26}" r="10" fill="${C.sun}"/>`;
  return s + '</svg>';
};
const vRect = (w, h, u = 'm', fillIt = false) => {
  const k = Math.min(220 / w, 140 / h, 34),
    W = w * k,
    H = h * k;
  return `<svg width="${W + 70}" height="${H + 50}" role="img" aria-label="rectángulo de ${w} por ${h}">
    <rect x="35" y="14" width="${W}" height="${H}" rx="4" fill="${fillIt ? C.mint + '55' : 'none'}" stroke="${C.mint}" stroke-width="4"/>
    ${vT(35 + W / 2, H + 38, 17, `${w} ${u}`, 1)}
    ${vT(18, 14 + H / 2 + 5, 17, h, 1)}
    </svg>`;
};
const vTri = (b, h, u = 'cm') =>
  `<svg width="230" height="150" role="img" aria-label="triángulo base ${b} altura ${h}">
    <polygon points="25,125 205,125 120,20" fill="${C.coral}44" stroke="${C.coral}" stroke-width="4"/>
    <line x1="120" y1="20" x2="120" y2="125" stroke="${C.fg}" stroke-dasharray="5 4"/>
    ${vT(115, 144, 16, `base ${b} ${u}`, 1)}
    ${vT(128, 82, 16, h)}
    </svg>`;
const vBox = (l, w, h) =>
  `<svg width="230" height="160" role="img" aria-label="prisma ${l} por ${w} por ${h}">
    <polygon points="30,60 130,60 130,140 30,140" fill="${C.violet}44" stroke="${C.violet}" stroke-width="3"/>
    <polygon points="30,60 70,30 170,30 130,60" fill="${C.violet}77" stroke="${C.violet}" stroke-width="3"/>
    <polygon points="130,60 170,30 170,110 130,140" fill="${C.violet}22" stroke="${C.violet}" stroke-width="3"/>
    ${vT(80, 158, 15, `${l} cm`, 1)}
    ${vT(190, 85, 15, `${h} cm`)}
    ${vT(100, 22, 15, `${w} cm`)}
    </svg>`;
const vCircle = (r) =>
  `<svg width="200" height="170" role="img" aria-label="círculo de radio ${r}">
    <circle cx="100" cy="85" r="68" fill="${C.sky}33" stroke="${C.sky}" stroke-width="4"/>
    <line x1="100" y1="85" x2="168" y2="85" stroke="${C.fg}" stroke-width="3"/>
    <circle cx="100" cy="85" r="4" fill="${C.fg}"/>
    ${vT(134, 76, 16, `r = ${r}`, 1)}
    </svg>`;
const vLine = (a, b, marks) => {
  const w = 300,
    x = (v) => 20 + ((v - a) / (b - a)) * w;
  let s = `<svg width="${w + 40}" height="66" role="img" aria-label="recta numérica">
    <line x1="14" y1="30" x2="${w + 26}" y2="30" stroke="${C.fg}" stroke-width="3"/>`;
  for (let v = a; v <= b; v++) {
    s += `<line x1="${x(v)}" y1="22" x2="${x(v)}" y2="38" stroke="${C.fg}" stroke-width="2"/>
      ${vT(x(v), 58, 13, String(v).replace('-', '−'), 1)}`;
  }
  (marks || []).forEach((m) => (s += `<circle cx="${x(m)}" cy="30" r="7" fill="${C.sun}"/>`));
  return s + '</svg>';
};
const vProse = (t) => `<div style="font-size:42px;letter-spacing:6px">${t}</div>`;
const GEN = {};
GEN.t4_1 = (L) => {
  const t = R(0, 3);
  if (t === 0) {
    const m = [
        [10, 50],
        [50, 200],
        [100, 500],
      ][L - 1],
      a = R(...m),
      b = R(...m);
    return QN(`${a} + ${b} = ?`, a + b, `Suma ${a} + ${b} = ${a + b}`, {
      step: L === 1 ? 10 : L === 2 ? 100 : 1000,
    });
  }
  if (t === 1) {
    const m = [
      [20, 60],
      [50, 200],
      [100, 500],
    ][L - 1];
    let a = R(...m),
      b = R(Math.floor(m[0] / 2), a - 1);
    return QN(`${a} − ${b} = ?`, a - b, `Resta ${a} − ${b} = ${a - b}`, {
      step: L === 1 ? 10 : L === 2 ? 100 : 1000,
    });
  }
  if (t === 2) {
    const p = [10, 10, 100][L - 1],
      n = R(p * 3, p * (L === 3 ? 15 : 9)) + R(1, p - 1);
    const a = Math.round(n / p) * p;
    return QN(
      `Redondea ${n} a ${p === 10 ? 'las decenas' : p === 100 ? 'las centenas' : 'los millares'}`,
      a,
      `${n} está más cerca de ${a}.`,
      { step: p }
    );
  }
  const d = [2, 2, 3][L - 1];
  const nums = new Set();
  while (nums.size < 4) nums.add(R(10 ** (d - 1), 10 ** d - 1));
  const arr = [...nums];
  const mx = Math.max(...arr);
  return Q(
    '¿Cuál es el número mayor?',
    String(mx),
    arr.map(String),
    `Compara cifra por cifra desde la izquierda: ${mx} es el mayor.`
  );
};
GEN.t4_2 = (L) => {
  const t = R(0, 3);
  if (t === 0) {
    const [a, b] = [
      [R(2, 5), R(2, 5)],
      [R(2, 9), R(2, 5)],
      [R(2, 9), R(2, 9)],
    ][L - 1];
    return QN(`${a} × ${b} = ?`, a * b, `${a} × ${b} = ${a * b}`, {
      step: L === 1 ? a : L === 2 ? b : 10,
      x: { vis: L === 1 ? vArray(a, b) : '' },
    });
  }
  if (t === 1) {
    const [b, c] = [
      [R(2, 5), R(2, 5)],
      [R(2, 5), R(2, 9)],
      [R(2, 9), R(2, 9)],
    ][L - 1];
    return QN(`${b * c} ÷ ${b} = ?`, c, `Porque ${b} × ${c} = ${b * c}.`, {
      step: L === 1 ? 1 : 2,
    });
  }
  if (t === 2) {
    const a = [R(2, 4), R(2, 5), R(3, 6)][L - 1],
      b = [R(2, 5), R(2, 6), R(2, 6)][L - 1];
    return QN(
      `Una bandeja tiene ${b} salteñas. ¿Cuántas salteñas hay en ${a} bandejas?`,
      a * b,
      `${a} × ${b} = ${a * b} salteñas.`,
      { step: b }
    );
  }
  const a = R(2, 9),
    b = [R(2, 5), R(2, 6), R(2, 9)][L - 1];
  return QN(`${a} × ? = ${a * b}`, b, `${a * b} ÷ ${a} = ${b}`, { step: 1 });
};
GEN.t4_3 = (L) => {
  const t = R(0, 3),
    ds = [
      [2, 3, 4],
      [2, 3, 4, 5],
      [2, 3, 4, 5, 6],
    ][L - 1],
    d = pick(ds),
    n = R(1, d - 1);
  if (t === 0) {
    const k = R(2, L === 1 ? 2 : 3);
    return QN(`${n}/${d} = ?/${d * k}`, n * k, `Multiplica arriba y abajo por ${k}: ${n}×${k}=${n * k}.`, { step: 1 });
  }
  if (t === 1) {
    const D = d < 3 ? 4 : d,
      n1 = R(1, D - 1);
    let m = R(1, D - 1);
    while (m === n1) m = R(1, D - 1);
    const big = Math.max(n1, m);
    return Q(
      '¿Qué fracción es mayor?',
      `${big}/${D}`,
      [`${n1}/${D}`, `${m}/${D}`, 'Son iguales'],
      'Con el mismo denominador, es mayor la que tiene mayor numerador.'
    );
  }
  if (t === 2) {
    const a = R(1, Math.max(1, d - 2)),
      b = R(1, d - 1 - a < 1 ? 1 : d - 1 - a);
    const s = a + b;
    return Q(
      `${a}/${d} + ${b}/${d} = ?`,
      `${s}/${d}`,
      [`${s}/${d}`, `${s}/${d * 2}`, `${s + 1}/${d}`, `${Math.abs(a - b) || 1}/${d}`],
      `Mismo denominador: se suman los numeradores. ${a}+${b}=${s}.`
    );
  }
  return Q(
    '¿Qué fracción está pintada?',
    `${n}/${d}`,
    [`${n}/${d}`, `${d - n}/${d}`, `${n}/${d + 1}`, `${n + 1}/${d}`].filter((v, i, a) => a.indexOf(v) === i),
    `Hay ${n} partes pintadas de ${d} iguales.`,
    { vis: vBars(n, d) }
  );
};
GEN.t4_4 = (L) => {
  if (R(0, 3) === 0) {
    const it = pick([
      ['la distancia de Santa Cruz a Cotoca', 'km'],
      ['el peso de una mochila', 'kg'],
      ['el agua de una botella', 'L'],
      ['el largo de un lápiz', 'cm'],
      ['el peso de una moneda', 'g'],
      ['una dosis de jarabe', 'mL'],
      ['la altura de una puerta', 'm'],
    ]);
    const u = ['m', 'km', 'cm', 'kg', 'g', 'L', 'mL'];
    const o = [it[1], ...shuf(u.filter((x) => x !== it[1])).slice(0, 3)];
    return Q(`¿Qué unidad usarías para medir ${it[0]}?`, it[1], o, `Lo más cómodo es medir ${it[0]} en ${it[1]}.`);
  }
  const P = [
      ['m', 'cm', 100],
      ['km', 'm', 1000],
      ['kg', 'g', 1000],
      ['L', 'mL', 1000],
      ['cm', 'mm', 10],
    ],
    [A, B, f] = pick(P);
  if (R(0, 2) === 0) {
    const v = R(1, L + 2);
    return QN(`${v * f} ${B} = ? ${A}`, v, `${v * f} ÷ ${f} = ${v}`, { step: 1 });
  }
  const v = L === 1 ? R(1, 5) : L === 2 ? R(2, 10) : pick([0.5, 1.5, 2.5]);
  return QN(`${fmt(v)} ${A} = ? ${B}`, v * f, `${fmt(v)} × ${f} = ${fmt(v * f)}`, { step: f / 10 });
};
GEN.t4_5 = (L) => {
  const t = R(0, 4),
    m = [
      [2, 5],
      [2, 8],
      [3, 10],
    ][L - 1],
    w = R(...m),
    h = R(...m);
  if (t === 0)
    return QN(
      `Un rectángulo mide ${w} m de largo y ${h} m de ancho. ¿Cuál es su perímetro (m)?`,
      2 * (w + h),
      `P = 2 × (${w} + ${h}) = ${2 * (w + h)} m`,
      { step: 2, x: { vis: vRect(w, h) } }
    );
  if (t === 1)
    return QN(`Un cuadrado tiene lado ${w} cm. ¿Cuál es su perímetro (cm)?`, 4 * w, `P = 4 × ${w} = ${4 * w} cm`, { step: 4 });
  if (t === 2) {
    const c = R(m[0], m[1]);
    return QN(
      `Un triángulo tiene lados de ${w} cm, ${h} cm y ${c} cm. ¿Cuál es su perímetro (cm)?`,
      w + h + c,
      `Suma de los lados: ${w}+${h}+${c}=${w + h + c}`,
      { step: 2 }
    );
  }
  if (t === 3) {
    const f = pick([
      ['triángulo', 3],
      ['cuadrilátero', 4],
      ['pentágono', 5],
      ['hexágono', 6],
      ['octógono', 8],
    ]);
    return Q(`¿Cuántos lados tiene un ${f[0]}?`, String(f[1]), numOpts(f[1]), `El ${f[0]} tiene ${f[1]} lados.`);
  }
  return QN(
    `Un rectángulo tiene perímetro ${2 * (w + h)} m y un lado de ${w} m. ¿Cuánto mide el otro lado (m)?`,
    h,
    `Semiperímetro = ${w + h}. ${w + h} − ${w} = ${h}`,
    { step: 1 }
  );
};
GEN.t5_1 = (L) => {
  const t = R(0, 4),
    d = L < 3 ? 1 : 2,
    k = 10 ** d;
  if (t === 0) {
    const a = R(11, 60 * L + 39) / k,
      b = R(11, 60 * L + 39) / k;
    return QN(`${fix(a, d)} + ${fix(b, d)} = ?`, a + b, `Alinea las comas y suma.`, {
      dec: d,
      step: (1 / k) * 10,
    });
  }
  if (t === 1) {
    let a = R(30, 60 * L + 39) / k,
      b = R(11, Math.floor(a * k) - 1) / k;
    return QN(`${fix(a, d)} − ${fix(b, d)} = ?`, a - b, `Alinea las comas y resta.`, {
      dec: d,
      step: (1 / k) * 10,
    });
  }
  if (t === 2) {
    let a = R(11, 99) / 100,
      b = R(11, 99) / 100;
    while (a === b) b = R(11, 99) / 100;
    const mx = Math.max(a, b);
    return Q('¿Cuál es mayor?', fix(mx, 2), [fix(a, 2), fix(b, 2)], `Compara décimas, luego centésimas: ${fix(mx, 2)} es mayor.`);
  }
  if (t === 3) {
    const x = R(11, 99) / 10,
      p = pick([10, 10, 10, 100]);
    return QN(
      `${fmt(x)} × ${p} = ?`,
      Math.round(x * p * 1000) / 1000,
      `Multiplicar por ${p} mueve la coma ${p === 10 ? 1 : 2} lugar(es) a la derecha.`,
      { f: fmt, step: p / 10 }
    );
  }
  const a = R(2, 9) + pick([0.5, 0]),
    b = R(3, 12) + pick([0.5, 0]);
  return Q(
    `Compras pan por Bs ${fix(a, 2)} y leche por Bs ${fix(b, 2)}. ¿Cuánto gastas?`,
    'Bs ' + fix(a + b, 2),
    numOpts(a + b, { dec: 2, step: 0.5, f: (x) => 'Bs ' + fix(x, 2) }),
    `${fix(a, 2)} + ${fix(b, 2)} = ${fix(a + b, 2)}`
  );
};
GEN.t5_2 = (L) => {
  const t = R(0, 3);
  if (t === 0) {
    const d1 = pick([2, 3, 4]);
    let d2 = L === 1 ? d1 * 2 : pick([2, 3, 4].filter((x) => x !== d1));
    const n = R(1, d1 - 1),
      m = R(1, d2 - 1);
    const N = n * d2 + m * d1,
      D = d1 * d2,
      a = fs(N, D);
    const o = [a, `${n + m}/${d1 + d2}`, `${N + 1}/${D}`, `${N}/${D + d1}`].filter((v, i, x) => x.indexOf(v) === i);
    while (o.length < 4) o.push(`${N + o.length}/${D}`);
    return Q(`${n}/${d1} + ${m}/${d2} = ?`, a, o, `Denominador común ${lcm(d1, d2)}. Resultado ${a}.`);
  }
  if (t === 1) {
    const b = R(2, 5),
      a = R(1, b - 1),
      d = R(2, 4),
      c = R(1, d - 1);
    const ans = fs(a * c, b * d);
    return Q(
      `${a}/${b} × ${c}/${d} = ?`,
      ans,
      [...new Set([ans, `${a + c}/${b + d}`, `${a * c}/${b + d}`, `${a * d}/${b * c}`, '1/2', '2/3', '3/4', '1/3'])].slice(0, 4),
      `Multiplica numeradores y denominadores: ${a * c}/${b * d}, y simplifica.`
    );
  }
  if (t === 2) {
    const g = pick([2, 3]),
      n = pick([1, 2, 3]),
      d = pick([4, 5, 6].filter((x) => gcd(n, x) === 1 && x > n));
    return Q(`Simplifica ${n * g}/${d * g}`, `${n}/${d}`, fracOpts(n, d), `Divide arriba y abajo entre ${g}.`);
  }
  const d = pick([2, 3, 4, 5]),
    n = R(1, d - 1),
    k = R(2, 6);
  return QN(`${n}/${d} de ${d * k} = ?`, n * k, `${d * k} ÷ ${d} = ${k} y ${k} × ${n} = ${n * k}`, {
    step: 1,
  });
};
GEN.t5_3 = (L) => {
  const t = R(0, 3),
    mx = L === 1 ? 4 : L === 2 ? 6 : 8;
  if (t === 0) {
    const g = R(2, 4),
      u = R(2, 4),
      a = g * u,
      b = g * pick([2, 3, 4].filter((x) => x !== u));
    return QN(
      `¿Cuál es el máximo común divisor (MCD) de ${a} y ${b}?`,
      gcd(a, b),
      `El mayor número que divide a ambos es ${gcd(a, b)}.`,
      { step: 1 }
    );
  }
  if (t === 1) {
    const a = R(2, mx),
      b = R(2, mx);
    return QN(
      `¿Cuál es el mínimo común múltiplo (mcm) de ${a} y ${b}?`,
      lcm(a, b),
      `El menor número que es múltiplo de ambos es ${lcm(a, b)}.`,
      { step: Math.max(a, b) }
    );
  }
  if (t === 2) {
    const k = pick([2, 3, 5, 9, 10, 4, 6].slice(0, L === 1 ? 3 : 5));
    const m = k * R(2, 10);
    const o = new Set([m]);
    while (o.size < 4) {
      const x = R(10, 150);
      if (x % k) o.add(x);
    }
    return Q(
      `¿Cuál de estos números es múltiplo de ${k}?`,
      String(m),
      [...o].map(String),
      `${m} ÷ ${k} = ${m / k}, división exacta.`
    );
  }
  const n = pick([6, 8, 10, 12, 15, 16, 18, 20, 24].slice(0, L === 1 ? 3 : 5)),
    dv = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) dv.push(i);
  return QN(`¿Cuántos divisores tiene el ${n}?`, dv.length, `Los divisores de ${n} son: ${dv.join(', ')}.`, { step: 1 });
};
GEN.t5_4 = (L) => {
  const t = R(0, 4),
    m = [
      [2, 5],
      [2, 7],
      [3, 9],
    ][L - 1],
    w = R(...m),
    h = R(...m);
  if (t === 0)
    return QN(`Un rectángulo mide ${w} m por ${h} m. ¿Cuál es su área (m²)?`, w * h, `A = ${w} × ${h} = ${w * h} m²`, {
      step: w,
      x: { vis: vRect(w, h, 'm', true) },
    });
  if (t === 1) {
    const b = w * 2,
      hh = h;
    return QN(
      `Un triángulo tiene base ${b} cm y altura ${hh} cm. ¿Cuál es su área (cm²)?`,
      (b * hh) / 2,
      `A = (${b} × ${hh}) ÷ 2 = ${(b * hh) / 2} cm²`,
      { step: b / 2, x: { vis: vTri(b, hh) } }
    );
  }
  if (t === 2) {
    const a = R(2, 4),
      b = R(2, 3),
      c = R(2, 4);
    return QN(
      `Un prisma mide ${a} cm × ${b} cm × ${c} cm. ¿Cuál es su volumen (cm³)?`,
      a * b * c,
      `V = ${a} × ${b} × ${c} = ${a * b * c} cm³`,
      { step: a, x: { vis: vBox(a, b, c) } }
    );
  }
  if (t === 3)
    return QN(`Un cuadrado tiene lado ${w} m. ¿Cuál es su área (m²)?`, w * w, `A = ${w} × ${w} = ${w * w} m²`, { step: w });
  return QN(
    `Un rectángulo tiene área ${w * h} m² y un lado de ${w} m. ¿Cuánto mide el otro lado (m)?`,
    h,
    `${w * h} ÷ ${w} = ${h}`,
    { step: 1 }
  );
};
GEN.t5_5 = (L) => {
  const T = [
    () => {
      const k = R(2, 4),
        p = R(5, 12),
        pay = Math.ceil((k * p) / 50 + 0.01) * 50;
      return QN(
        `Doña Rosa compra ${k} kg de tomate a Bs ${p} el kilo y paga con Bs ${pay}. ¿Cuánto cambio recibe (Bs)?`,
        pay - k * p,
        `Gasta ${k}×${p}=${k * p}. Cambio: ${pay}−${k * p}=${pay - k * p}.`,
        { step: 5 }
      );
    },
    () => {
      const v = pick([20, 30, 40, 50]),
        t = R(2, 3);
      return QN(
        `Un micro viaja a ${v} km por hora durante ${t} horas. ¿Cuántos kilómetros recorre?`,
        v * t,
        `${v} × ${t} = ${v * t} km`,
        { step: (v / 2) | 0 || 5 }
      );
    },
    () => {
      const g = R(2, 5),
        c = R(2, 6);
      return QN(
        `Se reparten ${g * c} cuadernos en partes iguales entre ${g} cursos. ¿Cuántos cuadernos recibe cada curso?`,
        c,
        `${g * c} ÷ ${g} = ${c}`,
        { step: 1 }
      );
    },
    () => {
      const x = R(2, 5) * 100,
        y = pick([2, 6, 8]);
      return QN(
        `Una receta de empanadas lleva ${x} g de harina para 4 personas. ¿Cuántos gramos para ${y} personas?`,
        (x / 4) * y,
        `Para 1 persona: ${x / 4} g. Para ${y}: ${(x / 4) * y} g.`,
        { step: 50 }
      );
    },
    () => {
      const a = R(2, 6),
        p = R(2, 6),
        q = R(1, 3);
      return QN(
        `Compras ${a} cuadernos a Bs ${p} cada uno y un lápiz de Bs ${q}. ¿Cuánto pagas en total (Bs)?`,
        a * p + q,
        `${a}×${p} = ${a * p}, más ${q} = ${a * p + q}.`,
        { step: 2 }
      );
    },
    () => {
      const a = R(130, 150) / 100,
        b = a + R(5, 25) / 100;
      return QN(
        `Ana mide ${fix(a, 2)} m y su hermano ${fix(b, 2)} m. ¿Cuántos metros más alto es el hermano?`,
        b - a,
        `${fix(b, 2)} − ${fix(a, 2)} = ${fix(b - a, 2)}`,
        { dec: 2, step: 0.05 }
      );
    },
  ];
  return pick(L === 1 ? T.slice(0, 3) : L === 2 ? T.slice(1, 5) : T.slice(3))();
};
GEN.t6_1 = (L) => {
  const a = R(2, 9),
    b = R(2, 6),
    c = R(2, 6),
    d = R(2, 6);
  if (L === 1) {
    const t = R(0, 1);
    return t
      ? QN(`${a} + ${b} × ${c} = ?`, a + b * c, `Primero la multiplicación: ${b}×${c}=${b * c}; luego ${a}+${b * c}.`, {
          extra: [(a + b) * c],
          step: 2,
        })
      : QN(`(${a} + ${b}) × ${c} = ?`, (a + b) * c, `Primero el paréntesis: ${a}+${b}=${a + b}; luego ×${c}.`, {
          extra: [a + b * c],
          step: 2,
        });
  }
  if (L === 2) {
    const x = a * b,
      y = c * d,
      mx = Math.max(x, y),
      mn = Math.min(x, y);
    return R(0, 1)
      ? QN(
          `${mx > x ? c : a} × ${mx > x ? d : b} − ${mx > x ? a : c} × ${mx > x ? b : d} = ?`,
          mx - mn,
          `Haz las multiplicaciones y luego resta.`,
          { step: 2 }
        )
      : QN(`(${a} + ${b}) × ${c} − ${d} = ?`, (a + b) * c - d, `Paréntesis, multiplicación y al final la resta.`, { step: 2 });
  }
  const e = R(1, 9);
  return QN(
    `${a} + [(${b} + ${c}) × ${d}] − ${e} = ?`,
    a + (b + c) * d - e,
    `Corchete: (${b}+${c})×${d}=${(b + c) * d}. Luego ${a}+${(b + c) * d}−${e}.`,
    { step: 3 }
  );
};
GEN.t6_2 = (L) => {
  const t = R(0, 4);
  if (t === 0) {
    const p = pick(
        [
          [10, 50],
          [10, 20, 25, 50],
          [10, 20, 25, 50, 75],
        ][L - 1]
      ),
      N = R(1, 6) * 20;
    return QN(`¿Cuánto es el ${p}% de ${N}?`, (p * N) / 100, `${p}% de ${N} = ${N} × ${p} ÷ 100 = ${(p * N) / 100}`, { step: L });
  }
  if (t === 1) {
    const p = pick([10, 20, 25, 50]),
      N = R(2, 8) * 20;
    return QN(
      `Una mochila cuesta Bs ${N} y tiene ${p}% de descuento. ¿Cuánto pagas (Bs)?`,
      N - (p * N) / 100,
      `Descuento: ${(p * N) / 100}. Pagas ${N}−${(p * N) / 100}.`,
      { step: 5 }
    );
  }
  if (t === 2) {
    const a = R(2, 6),
      u = R(2, 9),
      c = a * R(2, 4);
    return QN(
      `Si ${a} cuadernos cuestan Bs ${a * u}, ¿cuánto cuestan ${c} cuadernos (Bs)?`,
      c * u,
      `Cada cuaderno cuesta ${u}. ${c} × ${u} = ${c * u}.`,
      { step: u }
    );
  }
  if (t === 3) {
    const f = pick([
      [1, 2, 50],
      [1, 4, 25],
      [3, 4, 75],
      [1, 5, 20],
      [2, 5, 40],
      [1, 10, 10],
      [3, 5, 60],
    ]);
    return Q(
      `${f[0]}/${f[1]} equivale a…`,
      f[2] + '%',
      shuf([f[2], f[2] + 10, f[2] - 10, f[2] + 25].map((x) => (x <= 0 ? 5 : x) + '%'))
        .filter((v, i, x) => x.indexOf(v) === i)
        .slice(0, 3)
        .concat(f[2] + '%')
        .filter((v, i, x) => x.indexOf(v) === i),
      `${f[0]}÷${f[1]} = ${f[2] / 100} = ${f[2]}%`
    );
  }
  const N = pick([20, 25, 40, 50]),
    p = pick([10, 20, 30, 40, 50, 60, 80].filter((x) => (x * N) % 100 === 0)),
    x = (p * N) / 100;
  return Q(
    `En un curso de ${N} estudiantes, ${x} llegaron en bus. ¿Qué porcentaje es?`,
    p + '%',
    shuf([p, p + 10, p - 10 > 0 ? p - 10 : p + 20, p + 20].map((v) => v + '%'))
      .filter((v, i, a) => a.indexOf(v) === i)
      .concat(p + '%')
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 4),
    `${x} ÷ ${N} = ${p / 100} = ${p}%`
  );
};
GEN.t6_3 = (L) => {
  const t = R(0, 3),
    m = L === 1 ? 5 : L === 2 ? 10 : 20,
    a = R(-m, m),
    b = R(-m, m),
    s = (n) => (n < 0 ? `(${fmt(n)})` : String(n));
  if (t === 0)
    return QN(`${a} + ${s(b)} = ?`, a + b, `Si los signos son distintos se restan y se conserva el signo del mayor.`, {
      neg: 1,
      f: fmt,
      step: 1,
    });
  if (t === 1)
    return QN(`${a} − ${s(b)} = ?`, a - b, `Restar un número equivale a sumar su opuesto.`, {
      neg: 1,
      f: fmt,
      step: 1,
    });
  if (t === 2) {
    const s = new Set();
    while (s.size < 4) s.add(R(-m, m));
    const arr = [...s],
      mn = Math.min(...arr);
    return Q('¿Cuál es el menor?', fmt(mn), arr.map(fmt), `En la recta, el número más a la izquierda es el menor.`, {
      vis: vLine(-6, 6, []),
    });
  }
  const T = [
    () => {
      const x = R(2, 9),
        d = R(x + 1, x + 10);
      return QN(
        `En Potosí la temperatura era ${x} °C y bajó ${d} grados. ¿Qué temperatura marca ahora (°C)?`,
        x - d,
        `${x} − ${d} = ${x - d}`,
        { neg: 1, f: fmt, step: 1 }
      );
    },
    () => {
      const x = R(5, 20),
        u = R(2, x);
      return QN(`Un buzo está a −${x} m y sube ${u} m. ¿A qué profundidad está (m)?`, -x + u, `−${x} + ${u} = ${-x + u}`, {
        neg: 1,
        f: fmt,
        step: 1,
      });
    },
  ];
  return pick(T)();
};
GEN.t6_4 = (L) => {
  const pool = [
      [0, 4, 5],
      [0, 2, 4, 5],
      [1, 2, 3, 4],
    ][L - 1],
    t = pick(pool);
  if (t === 0) {
    const a = R(30, 90),
      b = R(30, 80);
    return QN(
      `Dos ángulos de un triángulo miden ${a}° y ${b}°. ¿Cuánto mide el tercero (°)?`,
      180 - a - b,
      `Los ángulos de un triángulo suman 180°. 180−${a}−${b}.`,
      { step: 5 }
    );
  }
  if (t === 1) {
    const n = pick([5, 6, 8]);
    return QN(
      `¿Cuánto suman los ángulos interiores de un polígono de ${n} lados (°)?`,
      (n - 2) * 180,
      `(n − 2) × 180 = ${n - 2} × 180`,
      { step: 180 }
    );
  }
  if (t === 2) {
    const r = R(1, 5);
    return QN(
      `Un círculo tiene radio ${r} cm. ¿Cuál es su circunferencia? (usa π = 3,14)`,
      +(2 * 3.14 * r).toFixed(2),
      `C = 2 × 3,14 × ${r}`,
      { f: fmt, step: 3.14, x: { vis: vCircle(r) } }
    );
  }
  if (t === 3) {
    const r = R(2, 5);
    return QN(
      `Un círculo tiene radio ${r} cm. ¿Cuál es su área (cm²)? (π = 3,14)`,
      +(3.14 * r * r).toFixed(2),
      `A = 3,14 × ${r} × ${r}`,
      { f: fmt, step: 3.14, x: { vis: vCircle(r) } }
    );
  }
  if (t === 4) {
    const a = R(60, 110),
      b = R(70, 100),
      c = R(60, 100);
    return QN(
      `Tres ángulos de un cuadrilátero miden ${a}°, ${b}° y ${c}°. ¿Cuánto mide el cuarto (°)?`,
      360 - a - b - c,
      `Un cuadrilátero suma 360°.`,
      { step: 5 }
    );
  }
  const g = pick([
    [30, 'agudo'],
    [50, 'agudo'],
    [90, 'recto'],
    [120, 'obtuso'],
    [150, 'obtuso'],
    [180, 'llano'],
  ]);
  return Q(
    `Un ángulo de ${g[0]}° es…`,
    g[1],
    ['agudo', 'recto', 'obtuso', 'llano'],
    `Agudo <90°, recto =90°, obtuso entre 90° y 180°, llano =180°.`
  );
};
GEN.t6_5 = (L) => {
  const t = R(0, 3);
  if (t === 0) {
    const a = R(2, 9),
      d = R(2, 5),
      k = 2;
    const seq = L === 1 ? [0, 1, 2, 3].map((i) => a + d * i) : [1, 2, 3, 4].map((i) => a * k ** (i - 1)).slice(0, 4);
    const nx = L === 1 ? a + d * 4 : a * k ** 4;
    return QN(
      `¿Qué número sigue? ${seq.join(', ')}, …`,
      nx,
      L === 1 ? `Aumenta de ${d} en ${d}.` : `Se multiplica por ${k} cada vez.`,
      { step: d }
    );
  }
  if (t === 1) {
    const x = R(3, 12);
    return QN(
      `Ana tiene el doble de años que Beto. Juntos suman ${3 * x}. ¿Cuántos años tiene Ana?`,
      2 * x,
      `Beto = ${x}, Ana = ${2 * x}, juntos ${3 * x}.`,
      { step: 1 }
    );
  }
  if (t === 2) {
    if (L < 3 || R(0, 3)) {
      const nm = shuf(['Luis', 'Ana', 'Pedro', 'Marta', 'Sofía', 'Diego']).slice(0, 3),
        top = R(0, 1);
      const fm = (n) => (/a$/.test(n) ? 'alta' : 'alto');
      return Q(
        `${nm[0]} es más ${fm(nm[0])} que ${nm[1]}. ${nm[1]} es más ${fm(nm[1])} que ${nm[2]}. ¿Qué persona es la más ${top ? 'alta' : 'baja'}?`,
        top ? nm[0] : nm[2],
        nm,
        'Ordena a los tres de mayor a menor estatura.'
      );
    }
    const n = R(3, 5);
    return QN(
      `En una reunión hay ${n} personas y cada una saluda a las demás una sola vez. ¿Cuántos saludos hay?`,
      (n * (n - 1)) / 2,
      `${n} × ${n - 1} ÷ 2 = ${(n * (n - 1)) / 2}`,
      { step: 1 }
    );
  }
  const x = R(2, 6),
    d = R(2, 8);
  return QN(
    `Un cuaderno y un lápiz cuestan Bs ${2 * x + d}. El cuaderno cuesta Bs ${d} más que el lápiz. ¿Cuánto cuesta el lápiz (Bs)?`,
    x,
    `Lápiz = x, cuaderno = x + ${d}. 2x + ${d} = ${2 * x + d}, entonces x = ${x}.`,
    { step: 1 }
  );
};

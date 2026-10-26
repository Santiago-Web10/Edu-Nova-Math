// EDU NOVA Math — Parte 2/5: contenidos y estado guardado.
/* ============================================================
   2. CONTENIDOS EDUCATIVOS Y BANCO DE PREGUNTAS
   ============================================================ */
const TOPICS = [
  {
    id: 't4_1',
    g: 4,
    ic: '🔢',
    c: 'sky',
    name: 'Números naturales y operaciones básicas',
    lab: 'order-nat',
  },
  { id: 't4_2', g: 4, ic: '✖️', c: 'mint', name: 'Multiplicación y división', lab: 'pairs' },
  { id: 't4_3', g: 4, ic: '🍕', c: 'sun', name: 'Fracciones y equivalencias', lab: 'frac' },
  {
    id: 't4_4',
    g: 4,
    ic: '📏',
    c: 'coral',
    name: 'Medidas de longitud, masa y capacidad',
    lab: 'pairs',
  },
  {
    id: 't4_5',
    g: 4,
    ic: '🔷',
    c: 'violet',
    name: 'Figuras geométricas y perímetro',
    lab: 'rect-perim',
  },
  { id: 't5_1', g: 5, ic: '🔟', c: 'sky', name: 'Números decimales', lab: 'order-dec' },
  { id: 't5_2', g: 5, ic: '🍰', c: 'sun', name: 'Fracciones y operaciones', lab: 'frac' },
  { id: 't5_3', g: 5, ic: '🔗', c: 'mint', name: 'Múltiplos y divisores', lab: 'pairs' },
  { id: 't5_4', g: 5, ic: '📦', c: 'violet', name: 'Área y volumen', lab: 'rect-area' },
  { id: 't5_5', g: 5, ic: '🧺', c: 'coral', name: 'Problemas matemáticos aplicados', lab: 'pairs' },
  { id: 't6_1', g: 6, ic: '🧮', c: 'sky', name: 'Operaciones combinadas', lab: 'pairs' },
  { id: 't6_2', g: 6, ic: '💯', c: 'coral', name: 'Porcentajes y proporcionalidad', lab: 'pct' },
  { id: 't6_3', g: 6, ic: '🌡️', c: 'mint', name: 'Números enteros', lab: 'order-int' },
  { id: 't6_4', g: 6, ic: '📐', c: 'violet', name: 'Geometría avanzada', lab: 'rect-circle' },
  {
    id: 't6_5',
    g: 6,
    ic: '🕵️',
    c: 'sun',
    name: 'Resolución de problemas y razonamiento lógico',
    lab: 'pairs',
  },
];
const topicBy = (id) => TOPICS.find((t) => t.id === id);
const THEORY = {
  t4_1: {
    intro:
      'Los números naturales sirven para contar. Los ordenamos por valor posicional: unidades, decenas, centenas y millares.',
    ex: [
      {
        t: 'Sumar con llevada: 475 + 268',
        v: vProse('475 + 268 = 743'),
        r: '5+8=13 (escribo 3, llevo 1). 7+6+1=14 (escribo 4, llevo 1). 4+2+1=7.',
      },
      {
        t: 'Redondear 3.482 a las centenas',
        v: vProse('3.482 ≈ 3.500'),
        r: 'La cifra de las decenas es 8 (5 o más), así que sube: 3.500.',
      },
    ],
    tip: 'Para comparar números, mira primero cuántas cifras tienen y luego compara de izquierda a derecha.',
  },
  t4_2: {
    intro: 'Multiplicar es sumar el mismo número varias veces. Dividir es repartir en partes iguales. Son operaciones inversas.',
    ex: [
      { t: '4 filas de 6 puntos', v: vArray(4, 6), r: '4 × 6 = 24 puntos en total.' },
      {
        t: 'Reparto: 24 ÷ 6',
        v: vProse('24 ÷ 6 = 4'),
        r: 'Porque 6 × 4 = 24. Si sabes la tabla, sabes dividir.',
      },
    ],
    tip: 'Para comprobar una división, multiplica el resultado por el divisor.',
  },
  t4_3: {
    intro:
      'Una fracción indica partes de un entero dividido en partes iguales. El numerador son las partes que tomas y el denominador, las partes totales.',
    ex: [
      { t: '3/5 del entero', v: vBars(3, 5), r: '3 partes pintadas de 5 iguales: 3/5.' },
      {
        t: 'Fracciones equivalentes: 1/2 = 2/4',
        v: vBars(2, 4),
        r: 'Multiplicar arriba y abajo por el mismo número no cambia el valor.',
      },
    ],
    tip: 'Con el mismo denominador, la fracción con mayor numerador es la mayor.',
  },
  t4_4: {
    intro:
      'Medimos longitud en metros (m), masa en gramos (g) y capacidad en litros (L). Con prefijos cambian las unidades: kilo = 1000, centi = 1/100, mili = 1/1000.',
    ex: [
      {
        t: '2 km a metros',
        v: vProse('2 km = 2.000 m'),
        r: '1 km tiene 1.000 m. Multiplicas por 1.000.',
      },
      { t: '3 L a mililitros', v: vProse('3 L = 3.000 mL'), r: '1 L tiene 1.000 mL.' },
    ],
    tip: 'De unidad grande a pequeña se multiplica. De pequeña a grande se divide.',
  },
  t4_5: {
    intro: 'El perímetro es la longitud del contorno de una figura. Se calcula sumando todos sus lados.',
    ex: [
      {
        t: 'Rectángulo de 8 m por 5 m',
        v: vRect(8, 5),
        r: 'P = 8 + 5 + 8 + 5 = 26 m, o 2 × (8 + 5).',
      },
      { t: 'Cuadrado de lado 6 cm', v: vProse('P = 4 × 6 = 24 cm'), r: 'Los 4 lados son iguales.' },
    ],
    tip: 'El perímetro se mide en unidades de longitud: cm, m, km.',
  },
  t5_1: {
    intro: 'Los decimales representan partes de la unidad: décimas, centésimas y milésimas. La coma separa enteros de decimales.',
    ex: [
      {
        t: 'Sumar 2,35 + 1,4',
        v: vProse('2,35 + 1,40 = 3,75'),
        r: 'Alinea las comas y completa con ceros.',
      },
      {
        t: 'Multiplicar 3,2 × 10',
        v: vProse('3,2 × 10 = 32'),
        r: 'Mueve la coma un lugar a la derecha.',
      },
    ],
    tip: 'Para comparar decimales, iguala la cantidad de cifras con ceros: 0,5 = 0,50.',
  },
  t5_2: {
    intro:
      'Para sumar fracciones con distinto denominador, busca un denominador común. Para multiplicar, multiplica numeradores y denominadores.',
    ex: [
      { t: '1/2 + 1/4', v: vBars(3, 4), r: '1/2 = 2/4, entonces 2/4 + 1/4 = 3/4.' },
      { t: '2/3 × 3/4', v: vProse('6/12 = 1/2'), r: 'Multiplica y simplifica dividiendo entre 6.' },
    ],
    tip: 'Siempre simplifica el resultado cuando puedas.',
  },
  t5_3: {
    intro:
      'Un múltiplo se obtiene multiplicando por 1, 2, 3… Un divisor es un número que divide exacto. El MCD es el mayor divisor común. El mcm es el menor múltiplo común.',
    ex: [
      {
        t: 'MCD de 12 y 18',
        v: vProse('MCD = 6'),
        r: 'Divisores de 12: 1,2,3,4,6,12. De 18: 1,2,3,6,9,18. El mayor común es 6.',
      },
      {
        t: 'mcm de 4 y 6',
        v: vProse('mcm = 12'),
        r: 'Múltiplos de 4: 4,8,12. De 6: 6,12. El primero común es 12.',
      },
    ],
    tip: 'Criterios: divisible entre 2 si termina en cifra par, entre 5 si termina en 0 o 5, entre 3 si la suma de cifras lo es.',
  },
  t5_4: {
    intro:
      'El área mide la superficie de una figura (en unidades cuadradas). El volumen mide el espacio que ocupa un cuerpo (en unidades cúbicas).',
    ex: [
      { t: 'Rectángulo 6 m × 4 m', v: vRect(6, 4, 'm', true), r: 'A = 6 × 4 = 24 m².' },
      { t: 'Prisma 3 × 4 × 5 cm', v: vBox(3, 4, 5), r: 'V = 3 × 4 × 5 = 60 cm³.' },
    ],
    tip: 'Área del triángulo = base × altura ÷ 2.',
  },
  t5_5: {
    intro:
      'Para resolver un problema: lee, identifica los datos, elige la operación, resuelve y comprueba que la respuesta tenga sentido.',
    ex: [
      {
        t: 'Compras en el mercado',
        v: vProse('🍅 3 kg × Bs 8'),
        r: '3 × 8 = Bs 24. Si pagas con Bs 50, tu cambio es 50 − 24 = Bs 26.',
      },
      {
        t: 'Proporcionalidad',
        v: vProse('4 → 200 g · 8 → 400 g'),
        r: 'Si doblas las personas, doblas la harina.',
      },
    ],
    tip: 'Subraya la pregunta y escribe qué operación usas antes de calcular.',
  },
  t6_1: {
    intro:
      'Cuando hay varias operaciones, se resuelven en orden: paréntesis y corchetes, luego multiplicaciones y divisiones, y al final sumas y restas.',
    ex: [
      { t: '3 + 4 × 2', v: vProse('3 + 8 = 11'), r: 'Primero 4 × 2 = 8.' },
      { t: '(3 + 4) × 2', v: vProse('7 × 2 = 14'), r: 'El paréntesis manda: 3 + 4 = 7.' },
    ],
    tip: 'Si hay operaciones del mismo nivel, resuelve de izquierda a derecha.',
  },
  t6_2: {
    intro:
      'El porcentaje indica cuántas partes de 100 tomamos. 50% es la mitad, 25% es la cuarta parte y 10% es la décima parte.',
    ex: [
      { t: '25% de 80', v: vProse('80 ÷ 4 = 20'), r: '25% es 1/4. Dividimos entre 4.' },
      {
        t: 'Descuento 20% en Bs 150',
        v: vProse('150 − 30 = Bs 120'),
        r: '20% de 150 es 30. Pagas 120.',
      },
    ],
    tip: 'Para hallar el 10%, divide entre 10. Con eso calculas muchos otros.',
  },
  t6_3: {
    intro: 'Los enteros incluyen negativos, el cero y positivos. Se ubican en la recta numérica: a la derecha son mayores.',
    ex: [
      {
        t: '−3 y 2 en la recta',
        v: vLine(-5, 5, [-3, 2]),
        r: '2 está a la derecha de −3, entonces 2 > −3.',
      },
      {
        t: '−4 + 7',
        v: vProse('−4 + 7 = 3'),
        r: 'Signos distintos: resta 7 − 4 y deja el signo del mayor.',
      },
    ],
    tip: 'Restar un número es sumar su opuesto: 5 − (−2) = 5 + 2.',
  },
  t6_4: {
    intro:
      'Los ángulos de un triángulo suman 180° y los de un cuadrilátero 360°. En un círculo: circunferencia C = 2πr y área A = πr². Usamos π ≈ 3,14.',
    ex: [
      {
        t: 'Círculo de radio 5',
        v: vCircle(5),
        r: 'C = 2 × 3,14 × 5 = 31,4. A = 3,14 × 25 = 78,5.',
      },
      {
        t: 'Polígono de 6 lados',
        v: vProse('(6 − 2) × 180 = 720°'),
        r: 'Se divide en 4 triángulos de 180°.',
      },
    ],
    tip: 'El radio es la mitad del diámetro.',
  },
  t6_5: {
    intro: 'Para razonar, busca patrones, ordena la información y prueba con casos. Dibujar o hacer una tabla ayuda mucho.',
    ex: [
      { t: 'Sucesión 3, 6, 12, 24…', v: vProse('× 2 cada vez'), r: 'Siguiente: 48.' },
      { t: 'El doble de edad', v: vProse('B + 2B = 3B'), r: 'Si suman 18, B = 6 y A = 12.' },
    ],
    tip: 'Cuando no sepas por dónde empezar, escribe lo que sabes con números.',
  },
}; /* ============================================================
   3. ESTADO, PROGRESO LOCAL Y CONFIGURACIÓN DEL ALUMNO
   ============================================================ */
const KEY = 'edunova.v2';
const DEF = () => ({
  sound: true,
  day: { last: '', n: 0 },
  name: '',
  grade: 4,
  locked: false,
  xp: 0,
  topics: {},
  games: {},
  badges: {},
  streakMax: 0,
  acc: '',
  stats: { correct: 0, builds: 0, cases: 0, wins: 0, labs: 0, retoBest: 0 },
});
let S = DEF();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const o = JSON.parse(raw);
    S = Object.assign(DEF(), o);
    S.stats = Object.assign(DEF().stats, o.stats || {});
    if (!S.locked && S.name && Object.keys(S.topics).length) S.locked = true;
  }
} catch (e) {}
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const $ = (s, r = document) => r.querySelector(s);
const lvlOf = (x) => Math.floor(x / 150) + 1;
const LVN = [
  'Cadete',
  'Explorador',
  'Navegante',
  'Piloto',
  'Capitán',
  'Comandante',
  'Almirante',
  'Astro sabio',
  'Leyenda Nova',
  'Maestro galáctico',
];
const lvName = (l) => LVN[Math.min(l - 1, LVN.length - 1)];
const nameOf = () => S.name || 'Explorador';
const withName = (s) => (S.name ? s.replace(/([!¡.?]*)$/, ', ' + S.name + '$1') : s);
const topicStat = (id) =>
  S.topics[id] || (S.topics[id] = { attempts: 0, correct: 0, total: 0, best: 0, last: 0, done: false, lab: false });
const gradeTopics = (g) => TOPICS.filter((t) => t.g === g);
const gradeDone = (g) => gradeTopics(g).filter((t) => S.topics[t.id]?.done).length;
const accuracy = () => {
  let c = 0,
    t = 0;
  Object.values(S.topics).forEach((x) => {
    c += x.correct;
    t += x.total;
  });
  return t ? Math.round((c / t) * 100) : 0;
};
function addXP(n) {
  const before = lvlOf(S.xp);
  S.xp += n;
  const after = lvlOf(S.xp);
  save();
  hud();
  if (after > before) {
    toast(`¡Subiste al nivel ${after}! ${lvName(after)} 🚀`);
    confetti();
  }
  checkBadges();
}
let AC;
function sfx(k) {
  if (!S.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime,
      T = (f, d, at = 0, ty = 'sine', v = 0.12) => {
        const o = AC.createOscillator(),
          g = AC.createGain();
        o.type = ty;
        o.frequency.value = f;
        g.gain.setValueAtTime(v, t + at);
        g.gain.exponentialRampToValueAtTime(0.001, t + at + d);
        o.connect(g);
        g.connect(AC.destination);
        o.start(t + at);
        o.stop(t + at + d);
      };
    ({
      ok: () => {
        T(660, 0.12);
        T(880, 0.18, 0.1);
      },
      bad: () => T(180, 0.28, 0, 'triangle', 0.15),
      tick: () => T(900, 0.05, 0, 'square', 0.04),
      win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => T(f, 0.25, i * 0.09)),
    })[k]();
  } catch (e) {}
}
function touchDay() {
  const f = (x) => x.toLocaleDateString('en-CA'),
    d = new Date(),
    today = f(d),
    last = S.day.last;
  if (last !== today) {
    S.day.n = last === f(new Date(d - 864e5)) ? S.day.n + 1 : 1;
    S.day.last = today;
    save();
  }
}

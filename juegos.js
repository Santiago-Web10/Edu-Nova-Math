// EDU NOVA Math — Parte 4/5: insignias, progreso y juegos.
const doneAny = (ids) => ids.some((i) => S.topics[i]?.done);
const anyGold = () => Object.values(S.games).some((g) => g.medal === 3);
const BADGES = [
  { id: 'maestro', f: () => doneAny(['t4_1', 't4_2', 't5_1', 't6_1']) },
  { id: 'fracc', g: [4, 5], f: () => doneAny(['t4_3', 't5_2']) },
  { id: 'campeon', f: () => S.xp >= 1000 },
  { id: 'geo', f: () => doneAny(['t4_5', 't5_4', 't6_4']) },
  { id: 'prob', g: [5, 6], f: () => doneAny(['t5_5', 't6_5']) },
  { id: 'const', f: () => S.day.n >= 3 },
  { id: 'paso', f: () => S.stats.correct >= 1 },
  { id: 'racha', f: () => S.streakMax >= 5 },
  { id: 'racha10', f: () => S.streakMax >= 10 },
  { id: 'veloz', f: () => S.stats.retoBest >= 8 },
  { id: 'viajero', f: () => S.stats.wins >= 1 },
  { id: 'detective', f: () => S.stats.cases >= 5 },
  { id: 'constructor', f: () => S.stats.builds >= 3 },
  { id: 'manos', f: () => S.stats.labs >= 3 },
  { id: 'oro', f: anyGold },
  { id: 'g4', g: [4], f: () => gradeDone(4) === 5 },
  { id: 'g5', g: [5], f: () => gradeDone(5) === 5 },
  { id: 'g6', g: [6], f: () => gradeDone(6) === 5 },
  { id: 'estrella', f: () => lvlOf(S.xp) >= 5 },
  { id: 'nova', f: () => gradeTopics(S.grade).every((t) => (S.topics[t.id]?.best || 0) >= 90) },
];
const badgeOn = (b) => !S.locked || !b.g || b.g.includes(S.grade);
function checkBadges() {
  let n = 0;
  BADGES.forEach((b) => {
    if (!S.badges[b.id] && badgeOn(b) && b.f()) {
      S.badges[b.id] = new Date().toISOString().slice(0, 10);
      n++;
      const el = $(`[data-b="${b.id}"]`);
      setTimeout(() => {
        toast(`${el.dataset.i} ¡Nuevo logro${S.name ? ', ' + S.name : ''}: ${el.dataset.n}!`);
        confetti();
      }, 300 * n);
    }
  });
  if (n) save();
}

/* ---------- Logros ---------- */
RENDER.logros = () => {
  const lv = lvlOf(S.xp),
    act = BADGES.filter(badgeOn),
    got = act.filter((b) => S.badges[b.id]).length;
  $('#lgTitle').textContent = S.name ? `Logros de ${S.name}` : 'Logros';
  $('#lgLv').textContent = lv;
  $('#lgLv2').textContent = lv + 1;
  $('#lgName').textContent = lvName(lv);
  $('#lgXp').textContent = S.xp;
  $('#lgNext').textContent = 150 - (S.xp % 150);
  $('#lgGot').textContent = got;
  $('#lgTotal').textContent = act.length;
  $('#lgBar').style.width = ((S.xp % 150) / 150) * 100 + '%';
  $$('.badge[data-b]').forEach((c) => {
    const bd = BADGES.find((b) => b.id === c.dataset.b);
    show(c, badgeOn(bd));
    const on = !!S.badges[c.dataset.b];
    c.classList.toggle('lock', !on);
    $('.ic', c).textContent = on ? c.dataset.i : '🔒';
    $('.b-state', c).textContent = on ? 'Desbloqueado ✓' : 'Pendiente';
  });
  $$('#accGrid .acc-btn').forEach((b) => {
    const k = b.dataset.a,
      req = +b.dataset.req,
      locked = lv < req;
    b.classList.toggle('lock', locked);
    b.disabled = locked;
    b.classList.toggle('on', S.acc === k);
    $('.a-state', b).textContent = locked ? 'Nivel ' + req : S.acc === k ? 'Puesto ✓' : 'Toca para usar';
  });
};

/* ---------- Progreso ---------- */
let PG = null;
const GNAMES = {
  reto: 'Reto Matemático',
  aventura: 'Aventura Numérica',
  detective: 'Detective Matemático',
  construye: 'Construye y Calcula',
};
const actGo = (id) => {
  if (id === 'game') {
    GP = null;
    go('juegos');
  } else if (id[0] === 'g') {
    TG = +id[1];
    LS = null;
    go('temas');
  } else {
    TG = topicBy(id).g;
    LS = { id, step: 0 };
    go('temas');
  }
};
RENDER.progreso = () => {
  PG = S.locked ? S.grade : PG || S.grade;
  show($('#pgTabs'), !S.locked);
  const g = PG,
    gt = gradeTopics(g),
    done = gradeDone(g),
    all = S.locked ? done : TOPICS.filter((t) => S.topics[t.id]?.done).length,
    played = Object.values(S.games).reduce((a, x) => a + x.plays, 0);
  const tried = (S.locked ? gt : TOPICS)
    .filter((t) => (S.topics[t.id]?.total || 0) >= 3)
    .map((t) => ({ t, a: Math.round((S.topics[t.id].correct / S.topics[t.id].total) * 100) }));
  const str = tried.filter((x) => x.a >= 80),
    weak = tried.filter((x) => x.a < 70);
  const recs = [];
  weak.forEach((x) => recs.push(['📌', `Necesitas practicar ${x.t.name.toLowerCase()}.`, x.t.id]));
  str.slice(0, 2).forEach((x) => recs.push(['🌟', `Excelente trabajo en ${x.t.name.toLowerCase()}.`, x.t.id]));
  if (done === 5 && g < 6 && !S.locked)
    recs.push(['🚀', `Te recomendamos completar el nivel avanzado: pasa a ${g + 1}.º.`, 'g' + (g + 1)]);
  else if (done === 5) recs.push(['🎮', 'Pon a prueba tu velocidad en el Reto Matemático en dificultad difícil.', 'game']);
  if (!recs.length) {
    const n = gt.find((t) => !S.topics[t.id]?.done);
    recs.push(['👉', n ? `Empieza con «${n.name}».` : '¡Sigue jugando para ganar medallas!', n ? n.id : 'game']);
  }
  $('#pDonut').style.setProperty('--p', done * 20);
  $('#pDonutN').textContent = done * 20;
  $('#pName').textContent = nameOf();
  $('#pGrade').textContent = g;
  $('#pStreak').textContent = S.day.n;
  $('#pStreakT').textContent = S.day.n === 1 ? 'día' : 'días';
  pressed('#pgTabs [data-pg]', 'pg', g);
  $('#pDone').textContent = done + ' de 5';
  $('#pDoneG').textContent = g;
  $('#pXp').textContent = S.xp;
  $('#pAcc').textContent = accuracy() + '%';
  $('#pAll').textContent = all + (S.locked ? ' de 5' : ' de 15');
  $('#pAllT').textContent = S.locked ? 'temas de tu curso' : 'temas en total';
  $('#pPlayed').textContent = played;
  $('#pBadges').textContent = Object.keys(S.badges).length;
  $$('#pRows .prow').forEach((r, i) => {
    const t = gt[i],
      s = S.topics[t.id] || {};
    r.className = 'prow c-' + t.c;
    $('.p-name', r).textContent = `${t.ic} ${t.name}`;
    $('.p-best', r).textContent = (s.best || 0) + '%';
    $('.p-bar', r).style.width = (s.best || 0) + '%';
    $('.p-info', r).textContent = s.total
      ? `Precisión total: ${Math.round((s.correct / s.total) * 100)}% · ${s.attempts} intento(s)`
      : 'Sin practicar';
  });
  $$('#pRecs .rec').forEach((el, i) => {
    const r = recs[i];
    show(el, !!r);
    if (!r) return;
    $('.ic', el).textContent = r[0];
    $('.grow', el).textContent = r[1];
    $('button', el).onclick = () => actGo(r[2]);
  });
  $('#pStr').textContent = str.length
    ? str.map((x) => `${x.t.name} (${x.a}%)`).join(' · ')
    : 'Practica al menos 3 preguntas por tema para descubrirlas.';
  $('#pWeak').textContent = weak.length
    ? weak.map((x) => `${x.t.name} (${x.a}%)`).join(' · ')
    : 'Todavía no hay áreas por reforzar.';
  const mx = Math.max(100, ...Object.values(S.games).map((y) => y.best));
  $$('#pGames .grow-row').forEach((r) => {
    const x = S.games[r.dataset.gp];
    $('.gp-best', r).textContent = x ? x.best : 0;
    $('.gp-medal', r).textContent = ['', '🥉', '🥈', '🥇'][x ? x.medal : 0];
    $('.gp-bar', r).style.width = (x ? (x.best / mx) * 100 : 0) + '%';
  });
  const log = Object.entries(S.games)
    .flatMap(([id, x]) => x.log.map((l) => ({ id, ...l })))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 8);
  show($('#pLogWrap'), log.length > 0);
  show($('#pLogEmpty'), !log.length);
  $$('#pLog tr:not(:first-child)').forEach((tr, i) => {
    const l = log[i];
    show(tr, !!l);
    if (!l) return;
    const td = tr.children;
    td[0].textContent = GNAMES[l.id];
    td[1].textContent = l.score;
    td[2].textContent = l.secs + 's';
    td[3].textContent = ['—', '🥉', '🥈', '🥇'][l.medal];
  });
};

/* ---------- Juegos ---------- */
let GM = null,
  GP = null,
  GS = { grade: 4, diff: 1 };
function stopGame() {
  if (GM && GM.timer) clearInterval(GM.timer);
  GM = null;
}
const GAMES = [
  {
    id: 'reto',
    n: 'Reto Matemático',
    ic: '⏱️',
    d: 'Resuelve operaciones contra el reloj. Tienes hasta 2 minutos y puedes ir con calma.',
    diff: true,
  },
  {
    id: 'aventura',
    n: 'Aventura Numérica',
    ic: '🚀',
    d: 'Haz avanzar a Nova por 12 planetas resolviendo desafíos. Tienes 5 vidas.',
  },
  {
    id: 'detective',
    n: 'Detective Matemático',
    ic: '🔍',
    d: 'Lee las pistas y toca al sospechoso que las cumple todas. ¡Descarta números y atrapa al culpable!',
  },
  {
    id: 'construye',
    n: 'Construye y Calcula',
    ic: '🏗️',
    d: 'Levanta figuras en la cuadrícula usando perímetro y área. Tienes 5 minutos.',
  },
];
const MED = ['😊', '🥉', '🥈', '🥇'],
  MEDN = ['¡Sigue practicando!', 'Medalla de bronce', 'Medalla de plata', 'Medalla de oro'];
const GPANELS = ['gCount', 'gReto', 'gAv', 'gDet', 'gCon'];
const showPanel = (id) => GPANELS.forEach((p) => show($('#' + p), p === id));
RENDER.juegos = () => {
  if (GP) return gameSetup();
  show($('#gList'), true);
  show($('#gSetup'), false);
  show($('#gStage'), false);
  $$('#gGrid .gcard').forEach((c) => {
    const x = S.games[c.dataset.g];
    $('.g-best', c).textContent = x ? x.best : 0;
    $('.g-plays', c).textContent = x ? x.plays : 0;
    $('.g-medal', c).textContent = MED[x ? x.medal : 0];
  });
};
function gameSetup() {
  const g = GAMES.find((x) => x.id === GP);
  show($('#gList'), false);
  show($('#gSetup'), true);
  show($('#gStage'), false);
  show($('#back'), true);
  show($('#gsetup'), true);
  $('#gsIc').textContent = g.ic;
  $('#gsName').textContent = g.n;
  $('#gsDesc').textContent = g.d;
  if (S.locked) GS.grade = S.grade;
  show($('#gsGradeH'), !S.locked);
  show($('#gsGrades'), !S.locked);
  show($('#gsFixed'), S.locked);
  $('#gsFixed').textContent = `Preguntas y retos de tu curso: ${gradeLabel()}`;
  pressed('#gsGrades [data-gr]', 'gr', GS.grade);
  show($('#gsDiffBox'), !!g.diff);
  pressed('#gsDiffs [data-df]', 'df', GS.diff);
}
function startGame() {
  stopGame();
  show($('#gSetup'), false);
  show($('#gStage'), true);
  scrollTo({ top: 0 });
  const run = {
    reto: playReto,
    aventura: playAventura,
    detective: playDetective,
    construye: playConstruye,
  }[GP];
  if (GP === 'reto' || GP === 'construye') countdown(run);
  else run();
}
function countdown(cb) {
  let n = 3;
  GM = { timer: null };
  showPanel('gCount');
  const draw = () => {
    const el = $('#gCountN');
    el.textContent = n || '¡Ya!';
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';
    sfx('tick');
  };
  draw();
  GM.timer = setInterval(() => {
    n--;
    if (n < 0) {
      clearInterval(GM.timer);
      GM = null;
      cb();
    } else draw();
  }, 800);
}
// Registro único: puntuación, medalla, historial, experiencia y resultado final.
function finishGame(id, score, medal, secs, extra = '') {
  const x = S.games[id] || (S.games[id] = { plays: 0, best: 0, medal: 0, log: [] });
  x.plays++;
  x.best = Math.max(x.best, score);
  x.medal = Math.max(x.medal, medal);
  x.log.unshift({ score, medal, secs, ts: Date.now() });
  x.log = x.log.slice(0, 8);
  save();
  stopGame();
  addXP(Math.round(score / 4));
  if (medal >= 2) confetti();
  $('#mdMedal').textContent = MED[medal];
  $('#mdTitle').textContent = withName(MEDN[medal]);
  $('#mdScore').textContent = score;
  $('#mdSecs').textContent = secs;
  $('#mdExtra').textContent = extra;
  $('#mdXp').textContent = Math.round(score / 4);
  openModal('mdFinish');
}

/* JUEGO 1: reto contrarreloj */
let RS = null;
function playReto() {
  showPanel('gReto');
  const pool = {
      4: ['t4_1', 't4_2', 't4_4', 't4_5'],
      5: ['t5_1', 't5_3', 't5_4', 't5_5'],
      6: ['t6_1', 't6_2', 't6_3', 't6_5'],
    }[GS.grade],
    d = GS.diff;
  GM = {
    t: [120, 100, 90][d - 1],
    T: [120, 100, 90][d - 1],
    score: 0,
    ok: 0,
    streak: 0,
    lock: false,
  };
  const me = GM,
    i = $('#ra');
  const upd = () => {
    $('#rScore').textContent = me.score;
    $('#rOk').textContent = me.ok;
    $('#rCombo').textContent = me.streak;
    $('#rComboChip').classList.toggle('combo', me.streak >= 3);
    $('#rTm').textContent = '⏱ ' + me.t + 's';
    $('#rBar').style.width = (me.t / me.T) * 100 + '%';
  };
  const nextQ = () => {
    let q,
      n = 0;
    do {
      q = GEN[pick(pool)](d);
      n++;
    } while ((q.num === undefined || q.q.length > 85) && n < 40);
    me.q = q;
    $('#rQ').innerHTML = q.q;
    i.value = '';
    $('#rf').textContent = '';
    upd();
    i.focus();
  };
  RS = () => {
    if (me.lock || !i.value.trim()) return;
    const ok = Math.abs(inputNumber(i) - me.q.num) < 1e-9;
    sfx(ok ? 'ok' : 'bad');
    if (ok) {
      me.ok++;
      me.streak++;
      const pt = 10 * d + Math.min(me.streak, 5) * 2;
      me.score += pt;
      pop($('#rQ'), '+' + pt + (me.streak >= 3 ? ' 🔥' : ''), C.mint);
      nextQ();
    } else {
      me.streak = 0;
      me.lock = true;
      flash($('#gReto'), false);
      $('#rf').innerHTML = `❌ Era <b>${esc(me.q.a)}</b>`;
      upd();
      setTimeout(() => {
        if (GM === me) {
          me.lock = false;
          nextQ();
        }
      }, 1800);
    }
  };
  i.onkeydown = (e) => {
    if (e.key === 'Enter') RS();
  };
  nextQ();
  me.timer = setInterval(() => {
    me.t--;
    upd();
    if (me.t <= 5 && me.t > 0) sfx('tick');
    if (me.t <= 0) {
      const th = [
          [3, 6, 9],
          [3, 5, 8],
          [2, 4, 6],
        ][d - 1],
        m = me.ok >= th[2] ? 3 : me.ok >= th[1] ? 2 : me.ok >= th[0] ? 1 : 0,
        sc = me.score,
        ok = me.ok;
      S.stats.retoBest = Math.max(S.stats.retoBest, ok);
      finishGame('reto', sc, m, me.T, `Resolviste ${ok} operaciones.`);
    }
  }, 1000);
}

/* JUEGO 2: aventura de opción múltiple */
function playAventura() {
  showPanel('gAv');
  const gt = gradeTopics(GS.grade);
  GM = { mode: 'av', pos: 0, lives: 5, t0: Date.now(), ans: null };
  const mk = () => {
    let q,
      n = 0;
    const L = GM.pos < 8 ? 1 : GM.pos < 11 ? 2 : 3;
    do {
      q = GEN[pick(gt).id](L);
      n++;
    } while (q.opts.length < 3 && n < 20);
    GM.q = q;
    GM.ans = null;
    draw();
  };
  const draw = () => {
    const q = GM.q,
      A = GM.ans;
    $('#aPos').textContent = Math.min(GM.pos + 1, 12);
    $('#aLives').textContent = '❤️'.repeat(GM.lives) || '💔';
    $$('#aTrack .cell').forEach((c, i) => {
      c.classList.toggle('me', i === GM.pos);
      c.classList.toggle('done', i < GM.pos);
      c.textContent = i === GM.pos ? '🚀' : c.dataset.e;
    });
    $('#aQ').innerHTML = q.q;
    const v = $('#aVis');
    v.innerHTML = q.vis || '';
    show(v, !!q.vis);
    $$('#aOpts .opt').forEach((b, i) => {
      const o = q.opts[i];
      show(b, o !== undefined);
      if (o === undefined) return;
      b.textContent = o;
      b.disabled = !!A;
      b.classList.remove('ok', 'bad');
      if (A) {
        if (o === q.a) b.classList.add('ok');
        else if (o === A) b.classList.add('bad');
      }
    });
    const fb = $('#aFb');
    show(fb, !!A);
    if (A) {
      const r = A === q.a;
      fb.classList.toggle('ok', r);
      fb.classList.toggle('bad', !r);
      $('#aFbHead').innerHTML = r ? '✅ ¡Avanzas!' : '❌ Pierdes una vida. Era <b>' + esc(q.a) + '</b>.';
      $('#aFbExp').innerHTML = q.exp;
    }
    show($('#aNextRow'), !!A);
    const tr = $('#aTrack'),
      me = $('.cell.me', tr);
    if (me) tr.scrollLeft += me.getBoundingClientRect().left - tr.getBoundingClientRect().left - tr.clientWidth / 2;
    if (A) $('#cnA').focus();
  };
  GM.mk = mk;
  GM.draw = draw;
  mk();
}
function aventuraPick(i) {
  if (!GM || GM.mode !== 'av' || GM.ans) return;
  const q = GM.q,
    o = q.opts[i];
  GM.ans = o;
  sfx(o === q.a ? 'ok' : 'bad');
  if (o === q.a) {
    GM.pos++;
    GM.draw();
    pop($('#aTrack .cell.me'), '🚀 ¡Avanzas!', C.mint);
    flash($('#gAv'), true);
  } else {
    GM.lives--;
    GM.draw();
    pop($('#aTrack'), '💔 −1 vida', C.coral);
    flash($('#gAv'), false);
  }
}
function aventuraNext() {
  if (!GM || GM.mode !== 'av') return;
  const secs = Math.round((Date.now() - GM.t0) / 1000);
  if (GM.pos >= 12) {
    S.stats.wins++;
    finishGame(
      'aventura',
      120 + GM.lives * 20 + Math.max(0, 180 - secs),
      GM.lives >= 4 ? 3 : GM.lives >= 3 ? 2 : 1,
      secs,
      '¡Llegaste a la base!'
    );
  } else if (GM.lives <= 0) finishGame('aventura', GM.pos * 10, 0, secs, `Llegaste al planeta ${GM.pos}.`);
  else GM.mk();
}

/* JUEGO 3: detective con sospechosos */
const dsum = (n) =>
  String(n)
    .split('')
    .reduce((a, b) => a + +b, 0);
function mkCase(g) {
  const [lo, hi] = g === 4 ? [10, 50] : g === 5 ? [10, 100] : [20, 200],
    n = R(lo, hi),
    P = [];
  P.push(n % 2 ? { t: 'Es un número impar', f: (x) => x % 2 === 1 } : { t: 'Es un número par', f: (x) => x % 2 === 0 });
  (g === 4 ? [3, 5, 10] : [3, 4, 5, 6, 10]).forEach((k) => {
    if (n % k === 0) P.push({ t: `Es múltiplo de ${k}`, f: (x) => x % k === 0 });
  });
  [3, 5].forEach((k) => {
    if (n % k) P.push({ t: `No es múltiplo de ${k}`, f: (x) => x % k !== 0 });
  });
  const ds = dsum(n),
    sp = Math.max(6, Math.floor((hi - lo) / 5)),
    a = n - R(3, sp),
    b = n + R(3, sp);
  P.push(
    { t: `La suma de sus cifras es ${ds}`, f: (x) => dsum(x) === ds },
    { t: `Termina en ${n % 10}`, f: (x) => x % 10 === n % 10 },
    { t: `Es mayor que ${a}`, f: (x) => x > a },
    { t: `Es menor que ${b}`, f: (x) => x < b }
  );
  const cl = shuf(P).slice(0, g === 4 ? 2 : 3),
    fails = [];
  for (let x = lo; x <= hi; x++) {
    if (x === n) continue;
    const ok = cl.filter((p) => p.f(x)).length;
    if (ok < cl.length) fails.push({ x, ok });
  }
  const sus = shuf([
    n,
    ...shuf(fails.sort((p, q) => q.ok - p.ok).slice(0, 14))
      .slice(0, 3)
      .map((o) => o.x),
  ]);
  return { n, lo, hi, cl, sus };
}
function playDetective() {
  showPanel('gDet');
  const T = [
    'La clave de la caja fuerte',
    'El número del casillero',
    'El código de la nave',
    'La placa del micro misterioso',
    'La puerta secreta de la escuela',
  ];
  GM = { mode: 'det', i: 0, score: 0, solved: 0, t0: Date.now() };
  const next = () => {
    GM.c = mkCase(GS.grade);
    GM.dead = new Set();
    GM.hint = 0;
    GM.wrong = 0;
    GM.done = false;
    GM.msg = '';
    draw();
  };
  const draw = () => {
    const c = GM.c,
      pts = Math.max(10, 30 - 5 * GM.wrong - 5 * GM.hint),
      left = c.sus.filter((s) => s !== c.n && !GM.dead.has(s)).length;
    GM.pts = pts;
    $('#dCase').textContent = GM.i + 1;
    $('#dScore').textContent = GM.score;
    $('#dPts').textContent = pts;
    $('#dTitle').textContent = T[GM.i];
    $$('#dClues .clue').forEach((el, i) => {
      const p = c.cl[i];
      show(el, !!p);
      if (p) $('.clue-t', el).textContent = p.t;
    });
    $$('#dSusp .opt').forEach((b, i) => {
      const s = c.sus[i];
      show(b, s !== undefined);
      if (s === undefined) return;
      const dead = GM.dead.has(s);
      b.textContent = s;
      b.disabled = GM.done || dead;
      b.classList.toggle('ok', GM.done && s === c.n);
      b.classList.toggle('bad', dead);
      b.classList.toggle('dead', dead);
    });
    const m = $('#dMsg');
    m.textContent = GM.msg;
    show(m, !!GM.msg);
    show($('#dWin'), GM.done);
    $('#dAns').textContent = c.n;
    show($('#cnD'), GM.done);
    $('#cnD').textContent = GM.i === 4 ? 'Ver resultado' : 'Siguiente caso →';
    const dh = $('#dh');
    show(dh, !GM.done);
    dh.disabled = left < 1;
    if (GM.done) $('#cnD').focus();
  };
  GM.next = next;
  GM.draw = draw;
  next();
}
function detectivePick(i) {
  if (!GM || GM.mode !== 'det' || GM.done) return;
  const c = GM.c,
    s = c.sus[i];
  if (s === c.n) {
    sfx('ok');
    GM.done = true;
    GM.msg = '';
    GM.score += GM.pts;
    GM.solved++;
    S.stats.cases++;
    save();
    checkBadges();
    GM.draw();
    flash($('#gDet'), true);
  } else {
    sfx('bad');
    GM.wrong++;
    GM.dead.add(s);
    const f = c.cl.find((p) => !p.f(s));
    GM.msg = `❌ El ${s} no cumple: «${f.t}».`;
    GM.draw();
    flash($('#gDet'), false);
  }
}
function detectiveHint() {
  if (!GM || GM.mode !== 'det') return;
  const c = GM.c,
    w = c.sus.filter((s) => s !== c.n && !GM.dead.has(s));
  if (!w.length) return;
  const s = pick(w),
    f = c.cl.find((p) => !p.f(s));
  GM.dead.add(s);
  GM.hint++;
  GM.msg = `💡 Descarté el ${s}: no cumple «${f.t}».`;
  GM.draw();
}
function detectiveNext() {
  if (!GM || GM.mode !== 'det') return;
  GM.i++;
  if (GM.i >= 5) {
    const sc = GM.score,
      m = sc >= 100 ? 3 : sc >= 70 ? 2 : sc >= 40 ? 1 : 0;
    finishGame('detective', sc, m, Math.round((Date.now() - GM.t0) / 1000), `Resolviste ${GM.solved} de 5 casos.`);
  } else GM.next();
}

/* JUEGO 4: construcción geométrica en cuadrícula */
let conDown = false;
function playConstruye() {
  showPanel('gCon');
  const W = 12,
    H = 8,
    g = GS.grade;
  const task = () => {
    if (g === 4) {
      const w = R(2, 4),
        h = R(2, 4);
      return {
        k: 'perim',
        P: 2 * (w + h),
        hint: `Prueba con ${w} de largo y ${h} de ancho.`,
        t: `Construye un <b>rectángulo</b> de perímetro <b>${2 * (w + h)} m</b>.`,
      };
    }
    if (g === 5) {
      const w = R(2, 6),
        h = R(2, 4);
      return {
        k: 'rect',
        A: w * h,
        P: 2 * (w + h),
        hint: `Piensa en ${w} × ${h}.`,
        t: `Construye un <b>rectángulo</b> de área <b>${w * h} m²</b> y perímetro <b>${2 * (w + h)} m</b>.`,
      };
    }
    const A = pick([9, 12, 16]),
      P = 2 * Math.ceil(2 * Math.sqrt(A));
    return {
      k: 'min',
      A,
      P,
      hint: `Cuanto más parecida a un cuadrado, menor perímetro. Mínimo posible: ${P} m.`,
      t: `Construye una figura de área <b>${A} m²</b> con el <b>menor perímetro posible</b>.`,
    };
  };
  GM = {
    mode: 'con',
    r: 0,
    solved: 0,
    hints: 0,
    t: 300,
    t0: Date.now(),
    on: new Set(),
    tk: task(),
  };
  const me = GM,
    cells = $$('#bg div');
  const calc = () => {
    const on = me.on;
    let per = 0;
    on.forEach((i) => {
      const r = Math.floor(i / W),
        c = i % W;
      [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ].forEach(([y, x]) => {
        if (y < 0 || y >= H || x < 0 || x >= W || !on.has(y * W + x)) per++;
      });
    });
    let conn = on.size > 0;
    if (conn) {
      const st = [[...on][0]],
        seen = new Set(st);
      while (st.length) {
        const i = st.pop(),
          r = Math.floor(i / W),
          c = i % W;
        [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ].forEach(([y, x]) => {
          const j = y * W + x;
          if (y >= 0 && y < H && x >= 0 && x < W && on.has(j) && !seen.has(j)) {
            seen.add(j);
            st.push(j);
          }
        });
      }
      conn = seen.size === on.size;
    }
    let rect = false;
    if (on.size) {
      const rs = [...on].map((i) => Math.floor(i / W)),
        cs = [...on].map((i) => i % W);
      rect = (Math.max(...rs) - Math.min(...rs) + 1) * (Math.max(...cs) - Math.min(...cs) + 1) === on.size;
    }
    return { area: on.size, per, conn, rect };
  };
  const live = () => {
    const c = calc();
    $('#bl').innerHTML = `Área: <b>${c.area} m²</b> · Perímetro: <b>${c.per} m</b>`;
    cells.forEach((d, i) => d.classList.toggle('on', me.on.has(i)));
  };
  const draw = () => {
    $('#cTm').textContent = '⏱ ' + me.t + 's';
    $('#cR').textContent = me.r + 1;
    $('#cOk').textContent = me.solved;
    $('#cQ').innerHTML = me.tk.t;
    $('#bf').textContent = '';
    live();
  };
  const end = () => {
    const sc = Math.max(0, me.solved * 20 - me.hints * 5 + (me.solved ? Math.floor(me.t / 10) : 0)),
      m = me.solved >= 4 ? 3 : me.solved >= 3 ? 2 : me.solved >= 2 ? 1 : 0;
    finishGame('construye', sc, m, 300 - me.t, `Construiste ${me.solved} de 5 figuras.`);
  };
  const adv = (ok) => {
    if (GM !== me) return;
    if (ok) {
      me.solved++;
      toast('🏗️ ¡Construcción perfecta!');
      confetti();
    }
    me.r++;
    if (me.r >= 5) return end();
    me.on = new Set();
    me.tk = task();
    draw();
  };
  const gr = $('#bg');
  let val = true;
  conDown = false;
  const hit = (e) => {
    const i = cells.indexOf(document.elementFromPoint(e.clientX, e.clientY));
    if (i >= 0) {
      val ? me.on.add(i) : me.on.delete(i);
      live();
    }
  };
  gr.onpointerdown = (e) => {
    const i = cells.indexOf(document.elementFromPoint(e.clientX, e.clientY));
    if (i >= 0) {
      val = !me.on.has(i);
      conDown = true;
      hit(e);
    }
  };
  gr.onpointermove = (e) => {
    if (conDown) hit(e);
  };
  gr.onpointerup = gr.onpointerleave = () => {
    conDown = false;
  };
  $('#bc').onclick = () => {
    me.on.clear();
    live();
  };
  $('#bh').onclick = () => {
    me.hints++;
    $('#bf').textContent = '💡 ' + me.tk.hint;
  };
  $('#bs').onclick = () => adv(false);
  $('#bk').onclick = () => {
    const c = calc(),
      T = me.tk;
    let ok = false,
      msg = '';
    if (!c.conn) msg = 'La figura debe estar toda unida.';
    else if (T.k === 'perim') {
      ok = c.rect && c.per === T.P;
      msg = !c.rect ? 'Debe ser un rectángulo.' : `Tu perímetro es ${c.per} m y debe ser ${T.P} m.`;
    } else if (T.k === 'rect') {
      ok = c.rect && c.area === T.A && c.per === T.P;
      msg = !c.rect ? 'Debe ser un rectángulo.' : `Tienes área ${c.area} y perímetro ${c.per}. Revisa las medidas.`;
    } else {
      ok = c.area === T.A && c.per === T.P;
      msg =
        c.area !== T.A ? `Tu área es ${c.area} m² y debe ser ${T.A} m².` : `Tu perímetro es ${c.per} m. Se puede con ${T.P} m.`;
    }
    if (ok) {
      S.stats.builds++;
      save();
      adv(true);
    } else {
      sfx('bad');
      $('#bf').textContent = '❌ ' + msg;
    }
  };
  draw();
  me.timer = setInterval(() => {
    me.t--;
    $('#cTm').textContent = '⏱ ' + me.t + 's';
    if (me.t <= 0) end();
  }, 1000);
}

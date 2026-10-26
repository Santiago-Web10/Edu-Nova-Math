// EDU NOVA Math — Parte 3/5: interfaz, lecciones, práctica y actividades.
/* ============================================================
   4. INTERFAZ: el HTML ya contiene todos los elementos.
   Aquí solo se muestran, ocultan y rellenan con datos.
   ============================================================ */
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const show = (el, on = true) => el.classList.toggle('hide', !on);
const setStars = (el, n) => [...el.children].forEach((s, i) => s.classList.toggle('off', i >= n));
const pressed = (sel, attr, val) => $$(sel).forEach((b) => b.setAttribute('aria-pressed', +b.dataset[attr] === val));

// Nova es una imagen SVG externa: el accesorio se elige con el fragmento de la URL (nova.svg#gorra).
const dressNova = () => $$('img[data-nova]').forEach((img) => (img.src = 'assets/nova.svg' + (S.acc ? '#' + S.acc : '')));
function hud() {
  $('#dstrN').textContent = S.day.n;
  $('#dstrT').textContent = S.day.n === 1 ? 'día' : 'días';
  $('#snd').textContent = S.sound ? '🔊' : '🔇';
  $('#lvN').textContent = lvlOf(S.xp);
  $('#lvB').style.width = ((S.xp % 150) / 150) * 100 + '%';
  dressNova();
}

let tT;
function toast(m) {
  const t = $('#toast');
  t.textContent = m;
  t.classList.add('on');
  clearTimeout(tT);
  tT = setTimeout(() => t.classList.remove('on'), 2600);
}
let cfx = [],
  cfRun = false;
function confetti() {
  sfx('win');
  const c = $('#fx');
  c.width = innerWidth;
  c.height = innerHeight;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const cols = ['#ffc24d', '#7fd8b0', '#ff8fab', '#7cc4ff', '#b79bff'];
  for (let i = 0; i < 110; i++)
    cfx.push({
      x: innerWidth / 2,
      y: innerHeight / 3,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 13 - 2,
      s: 5 + Math.random() * 7,
      c: pick(cols),
      r: Math.random() * 6,
      l: 90 + Math.random() * 50,
    });
  if (!cfRun) {
    cfRun = true;
    (function f() {
      const x = c.getContext('2d');
      x.clearRect(0, 0, c.width, c.height);
      cfx = cfx.filter((p) => p.l-- > 0);
      cfx.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.r += 0.2;
        x.save();
        x.translate(p.x, p.y);
        x.rotate(p.r);
        x.fillStyle = p.c;
        x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        x.restore();
      });
      if (cfx.length) requestAnimationFrame(f);
      else {
        cfRun = false;
        x.clearRect(0, 0, c.width, c.height);
      }
    })();
  }
}
function pop(t, txt, col) {
  if (!t) return;
  const r = t.getBoundingClientRect(),
    e = document.createElement('span');
  e.className = 'pop';
  e.textContent = txt;
  e.style.cssText = `left:${Math.min(innerWidth - 60, Math.max(60, r.left + r.width / 2))}px;top:${Math.max(70, r.top)}px;color:${col || '#ffc83d'}`;
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 900);
}
function flash(t, ok) {
  if (!t) return;
  t.classList.remove('flash-ok', 'flash-bad');
  void t.offsetWidth;
  t.classList.add(ok ? 'flash-ok' : 'flash-bad');
}
const PRAISE = ['¡Genial!', '¡Excelente!', '¡Eres un crack!', '¡Muy bien!', '¡Así se hace!'],
  OOPS = ['¡Casi!', '¡Ánimo!', '¡Sigue intentando!', '¡Tú puedes!'];

/* ---------- Ventana modal (los paneles están en el HTML) ---------- */
function openModal(id) {
  $$('.md-panel').forEach((p) => show(p, p.id === id));
  $('#modal').classList.add('on');
  const b = $('#' + id + ' button');
  b && b.focus();
}
function closeModal() {
  $('#modal').classList.remove('on');
}
function bindKeypad(kp, inp, send) {
  kp.onclick = (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const x = b.dataset.k;
    if (x === '⌫') inp.value = inp.value.slice(0, -1);
    else if (x === 'Enviar') send();
    else inp.value += x;
    sfx('tick');
  };
}

/* ---------- Navegación entre secciones ---------- */
let HT;
const VIEWS = ['home', 'temas', 'juegos', 'progreso', 'logros'];
const RENDER = {};
let cur = 'home';
function go(v) {
  clearInterval(HT);
  stopGame();
  cur = v;
  VIEWS.forEach((k) => $('#v-' + k).classList.toggle('on', k === v));
  $$('[data-v]').forEach((b) => b.setAttribute('aria-current', b.dataset.v === v));
  RENDER[v]();
  scrollTo({ top: 0 });
}

/* ---------- Inicio ---------- */
RENDER.home = () => {
  const done = TOPICS.filter((t) => S.topics[t.id]?.done).length;
  const nx = gradeTopics(S.grade).find((t) => !S.topics[t.id]?.done);
  show($('#hGreet'), !!S.name);
  show($('#hWelcome'), !S.name);
  $('#hName').textContent = S.name;
  $('#inName').value = S.name;
  $('#inGrade').value = S.grade;
  show($('#hProfile'), S.locked);
  show($('#hFields'), !S.locked);
  show($('#start'), !S.locked);
  $('#hpName').textContent = S.name;
  $('#hpGrade').textContent = S.grade;
  $('#hTag').textContent = S.locked ? `Matemáticas de ${gradeLabel()}` : 'Matemáticas para 4.º, 5.º y 6.º de Primaria';
  show($('#cont'), !!(nx && S.locked && Object.keys(S.topics).length));
  $('#homeDone').textContent = S.locked ? gradeDone(S.grade) : done;
};

/* ---------- Temas: lista por grado ---------- */
let TG = S.grade,
  LS = null;
const gradeLabel = () => S.grade + '.º de Primaria';
RENDER.temas = () => {
  if (S.locked) TG = S.grade;
  show($('#gradeTabs'), !S.locked);
  $('#temasTitle').textContent = S.locked ? `Temas de ${gradeLabel()}` : 'Temas por grado';
  $('#temasSub').textContent = S.locked
    ? `${nameOf()}, elige un tema. Completa cada tema con 6 aciertos de 10.`
    : 'Elige un grado y un tema. Completa cada tema con 6 aciertos de 10.';
  show($('#temasList'), !LS);
  show($('#lesson'), !!LS);
  if (LS) return renderLesson();
  const n = gradeTopics(TG).find((t) => !S.topics[t.id]?.done);
  $('#recTitle').textContent = n ? withName('Nova recomienda') : withName(`¡Completaste los 5 temas de ${TG}.º!`);
  $('#recText').textContent = n
    ? `${n.ic} ${n.name}`
    : S.locked
      ? '¡Gran trabajo! Practica en los juegos para ganar medallas.'
      : 'Practica en los juegos o pasa al siguiente grado.';
  const rg = $('#recGo');
  show(rg, !!n);
  if (n) rg.dataset.rec = n.id;
  pressed('#gradeTabs [data-g]', 'g', TG);
  $$('#topicGrid .topic').forEach((c) => {
    const t = topicBy(c.dataset.t),
      s = S.topics[t.id] || {};
    show(c, t.g === TG);
    $('.t-state', c).textContent = s.done ? 'Completado ✓' : s.attempts ? 'En curso' : 'Nuevo';
    setStars($('.stars', c), s.best >= 90 ? 3 : s.best >= 60 ? 2 : s.best >= 40 ? 1 : 0);
    $('.t-bar', c).style.width = (s.best || 0) + '%';
  });
};
const openTopic = (id) => {
  LS = { id, step: 0 };
  RENDER.temas();
  scrollTo({ top: 0 });
};

/* ---------- Lección: 4 pasos (los paneles ya existen en el HTML) ---------- */
function renderLesson() {
  const t = topicBy(LS.id),
    th = THEORY[t.id];
  $('#lessonChip').textContent = `${t.g}.º · ${t.ic} ${t.name}`;
  $$('#stepsNav [data-s]').forEach((b) => b.setAttribute('aria-current', +b.dataset.s === LS.step));
  for (let i = 0; i < 4; i++) show($('#step' + i), i === LS.step);
  if (LS.step === 0) {
    $('#s0Title').textContent = t.name;
    const lines = th.intro.split(/(?<=\.)\s/);
    $$('#s0Intro .intro-line').forEach((p, i) => {
      show(p, i < lines.length);
      p.textContent = lines[i] || '';
    });
    $('#s0Tip').textContent = th.tip;
  } else if (LS.step === 1) {
    $$('#s1Grid .ex').forEach((c, i) => {
      const e = th.ex[i];
      show(c, !!e);
      if (!e) return;
      $('.ex-t', c).innerHTML = e.t;
      $('.ex-v', c).innerHTML = e.v;
      $('.ex-r', c).innerHTML = e.r;
      show($('.ex-r', c), false);
      show($('.ex-btn', c), true);
    });
  } else if (LS.step === 2) {
    startPractice();
    renderPractice();
  } else renderLab(t);
}

function startPractice() {
  if (LS.qs) return;
  const lv = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    seen = new Set(),
    qs = [];
  lv.forEach((L) => {
    let q,
      n = 0;
    do {
      q = GEN[LS.id](L);
      n++;
    } while (seen.has(q.q) && n < 30);
    seen.add(q.q);
    q.L = L;
    q.input = q.num !== undefined && L >= 2 && Math.random() < 0.25;
    qs.push(q);
  });
  LS.qs = qs;
  LS.i = 0;
  LS.ok = 0;
  LS.ans = null;
  LS.streak = 0;
  LS.ended = false;
}

/* ---------- Práctica: 10 preguntas ---------- */
function renderPractice() {
  const end = LS.i >= 10;
  show($('#pq'), !end);
  show($('#pEnd'), end);
  if (end) return practiceEnd();
  const q = LS.qs[LS.i],
    A = LS.ans;
  $('#pqN').textContent = LS.i + 1;
  $('#pqLv').textContent = '●'.repeat(q.L) + '○'.repeat(3 - q.L);
  $('#pqOk').textContent = LS.ok;
  $('#pqStreak').textContent = LS.streak;
  $('#pqBar').style.width = LS.i * 10 + '%';
  $('#pqText').innerHTML = q.q;
  const v = $('#pqVis');
  v.innerHTML = q.vis || '';
  show(v, !!q.vis);
  show($('#pqOpts'), !q.input);
  $$('#pqOpts .opt').forEach((b, i) => {
    const o = q.opts[i];
    show(b, o !== undefined);
    if (o === undefined) return;
    b.textContent = o;
    b.disabled = !!A;
    b.classList.remove('ok', 'bad');
    if (A) {
      if (o === q.a) b.classList.add('ok');
      else if (o === A.v) b.classList.add('bad');
    }
  });
  show($('#pqInputBox'), !!q.input && !A);
  if (q.input && !A) {
    const i = $('#inA');
    i.value = '';
    i.focus();
  }
  const y = $('#pqYour');
  show(y, !!q.input && !!A);
  if (q.input && A) {
    $('#pqYourV').textContent = A.v;
    y.classList.toggle('ok', A.right);
    y.classList.toggle('bad', !A.right);
  }
  const fb = $('#pqFb');
  show(fb, !!A);
  if (A) {
    fb.classList.toggle('ok', A.right);
    fb.classList.toggle('bad', !A.right);
    $('#pqFbHead').textContent = A.head;
    $('#pqFbExp').innerHTML = q.exp;
  }
  show($('#pqNextRow'), !!A);
  if (A) {
    $('#nq').textContent = LS.i === 9 ? 'Ver resultado' : 'Siguiente →';
    setTimeout(() => $('#nq').focus(), 400);
  }
}
function answer(v) {
  const q = LS.qs[LS.i];
  if (LS.ans) return;
  const right = q.input ? Math.abs(parseNum(v) - q.num) < 1e-9 : v === q.a;
  sfx(right ? 'ok' : 'bad');
  const s = topicStat(LS.id);
  s.total++;
  if (right) {
    s.correct++;
    LS.ok++;
    LS.streak++;
    S.stats.correct++;
    S.streakMax = Math.max(S.streakMax, LS.streak);
    S.xp += 10;
  } else LS.streak = 0;
  LS.ans = {
    v,
    right,
    head: right ? withName(pick(PRAISE)) + ' +10 puntos.' : withName(pick(OOPS)) + ' La respuesta es ' + q.a + '.',
  };
  save();
  hud();
  checkBadges();
  renderPractice();
  flash($('#pq'), right);
  pop($('#pqText'), right ? (LS.streak >= 3 ? '🔥x' + LS.streak + ' +10' : '+10 ⭐') : '💫', right ? C.mint : C.coral);
}
function practiceEnd() {
  const s = topicStat(LS.id),
    pct = LS.ok * 10;
  if (!LS.ended) {
    LS.ended = true;
    LS.was = s.done;
    s.attempts++;
    s.last = pct;
    s.best = Math.max(s.best, pct);
    if (pct >= 60) s.done = true;
    save();
    if (pct >= 60) confetti();
    checkBadges();
  }
  const st = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
  $('#pEndMsg').textContent =
    pct >= 90
      ? '¡Perfecto! Eres un as.'
      : pct >= 60
        ? '¡Tema completado! Muy buen trabajo.'
        : 'Casi. Repasa la explicación e inténtalo otra vez.';
  setStars($('#pEndStars'), st);
  $('#pEndOk').textContent = LS.ok;
  $('#pEndPct').textContent = pct;
  $('#pEndXp').textContent = LS.ok * 10;
  show($('#pEndNew'), !LS.was && s.done);
}

/* ---------- Actividad práctica ---------- */
const LABS = ['labFrac', 'labRect', 'labOrder', 'labPct', 'labPairs'];
function labReset() {
  LABS.forEach((id) => show($('#' + id), false));
  show($('#labBad'), false);
  show($('#labOk'), false);
  show($('#labEnd'), false);
}
function labDone(msg) {
  const t = topicStat(LS.id);
  S.stats.labs++;
  let bonus = '';
  if (!t.lab) {
    t.lab = true;
    bonus = '+20 puntos';
    save();
    addXP(20);
  } else save();
  confetti();
  $('#labOkMsg').textContent = msg;
  $('#labBonus').textContent = bonus;
  show($('#labBad'), false);
  show($('#labOk'), true);
  show($('#labEnd'), true);
}
function labBad(msg) {
  const f = $('#labBad');
  f.textContent = msg;
  show(f, true);
}
function renderLab(t) {
  const [kind, mode] = t.lab.split('-');
  labReset();
  ({ frac: labFrac, rect: labRect, order: labOrder, pct: labPct, pairs: labPairs })[kind](mode, t);
}
function labFrac(m, t) {
  show($('#labFrac'), true);
  let n,
    d,
    eq = '';
  if (t.g === 4) {
    d = R(2, 5);
    n = R(1, d - 1);
  } else {
    const base = pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [1, 4],
    ]);
    const k = 2;
    n = base[0] * k;
    d = base[1] * k;
    eq = `${base[0]}/${base[1]}`;
  }
  const on = Array(d).fill(false),
    btns = $$('#lfBar button');
  $('#lfTotal').textContent = d;
  $('#lfQ').innerHTML = eq ? `Pinta una fracción de la barra equivalente a <b>${eq}</b>.` : `Pinta <b>${n}/${d}</b> de la barra.`;
  const draw = () => {
    btns.forEach((b, i) => {
      show(b, i < d);
      b.classList.toggle('on', !!on[i]);
    });
    $('#lfCount').textContent = on.filter(Boolean).length;
  };
  btns.forEach(
    (b, i) =>
      (b.onclick = () => {
        on[i] = !on[i];
        draw();
      })
  );
  const chk = $('#lfChk');
  chk.disabled = false;
  chk.onclick = () => {
    const c = on.filter(Boolean).length;
    if (c === n) {
      chk.disabled = true;
      labDone(eq ? `¡Sí! ${n}/${d} es equivalente a ${eq}.` : `¡Exacto, ${n}/${d}!`);
    } else labBad(c > n ? 'Pintaste demasiadas partes.' : 'Faltan partes por pintar.');
  };
  draw();
}
function labRect(m) {
  show($('#labRect'), true);
  let w = R(2, 6),
    h = R(2, 6),
    r = R(2, 8),
    tgt;
  if (m === 'perim') {
    tgt = 2 * (R(3, 7) + R(2, 5));
  } else if (m === 'area') {
    tgt = R(2, 6) * R(2, 5);
  } else {
    tgt = +(2 * 3.14 * R(2, 5)).toFixed(2);
  }
  $('#lrQ').innerHTML =
    m === 'perim'
      ? `Forma un rectángulo con perímetro <b>${tgt} m</b>.`
      : m === 'area'
        ? `Forma un rectángulo con área <b>${tgt} m²</b>.`
        : `Elige el radio para que la circunferencia mida <b>${fmt(tgt)} cm</b> (π = 3,14).`;
  show($('#lrCircle'), m === 'circle');
  show($('#lrRectBox'), m !== 'circle');
  $('#sr').value = r;
  $('#sw').value = w;
  $('#sh').value = h;
  const upd = () => {
    if (m === 'circle') {
      r = +$('#sr').value;
      $('#vr').textContent = r + ' cm';
      $('#rv').innerHTML = vCircle(r);
      $('#rn').innerHTML = `Circunferencia: <b>${fmt(+(2 * 3.14 * r).toFixed(2))} cm</b>`;
    } else {
      w = +$('#sw').value;
      h = +$('#sh').value;
      $('#vw').textContent = w + ' m';
      $('#vh').textContent = h + ' m';
      $('#rv').innerHTML = vRect(w, h, 'm', true);
      $('#rn').innerHTML = `Perímetro: <b>${2 * (w + h)} m</b> · Área: <b>${w * h} m²</b>`;
    }
  };
  $$('#labRect input').forEach((i) => (i.oninput = upd));
  upd();
  const chk = $('#lrChk');
  chk.disabled = false;
  chk.onclick = () => {
    const v = m === 'perim' ? 2 * (w + h) : m === 'area' ? w * h : +(2 * 3.14 * r).toFixed(2);
    if (Math.abs(v - tgt) < 1e-6) {
      chk.disabled = true;
      labDone('¡Medida exacta!');
    } else labBad(`Ahora tienes ${fmt(v)}. Ajusta las barras.`);
  };
}
function labOrder(m) {
  show($('#labOrder'), true);
  const s = new Set();
  while (s.size < 4) s.add(m === 'nat' ? R(10, 999) : m === 'dec' ? R(5, 499) / 100 : R(-9, 9));
  const arr = shuf([...s]),
    sorted = [...arr].sort((x, y) => x - y);
  let k = 0;
  const used = Array(4).fill(false),
    chips = $$('#loChips .opt'),
    f = (x) => (m === 'dec' ? fix(x, 2) : fmt(x));
  const draw = () => {
    chips.forEach((b, i) => {
      b.textContent = f(arr[i]);
      b.classList.toggle('used', used[i]);
      b.classList.remove('bad');
    });
    $('#loSeq').textContent = sorted.slice(0, k).map(f).join(' < ') || '…';
  };
  chips.forEach(
    (b, i) =>
      (b.onclick = () => {
        if (used[i]) return;
        if (arr[i] === sorted[k]) {
          used[i] = true;
          k++;
          draw();
          if (k === 4) labDone('¡Ordenados!');
        } else {
          b.classList.add('bad');
          labBad('Ese no es el menor de los que quedan. Inténtalo otra vez.');
          setTimeout(() => b.classList.remove('bad'), 400);
        }
      })
  );
  draw();
}
let pctDown = false;
function labPct() {
  show($('#labPct'), true);
  const p = pick([10, 20, 25, 50]);
  const on = Array(100).fill(false);
  let val = true;
  $('#lpP').textContent = p;
  const g = $('#pg'),
    cells = $$('#pg div');
  const upd = () => {
    cells.forEach((d, i) => d.classList.toggle('on', on[i]));
    const c = on.filter(Boolean).length;
    $('#pc').textContent = `Pintados: ${c} de 100 = ${c}%`;
  };
  const hit = (e) => {
    const t = document.elementFromPoint(e.clientX, e.clientY),
      i = cells.indexOf(t);
    if (i >= 0) {
      on[i] = val;
      upd();
    }
  };
  g.onpointerdown = (e) => {
    const i = cells.indexOf(document.elementFromPoint(e.clientX, e.clientY));
    if (i >= 0) {
      val = !on[i];
      pctDown = true;
      hit(e);
    }
  };
  g.onpointermove = (e) => {
    if (pctDown) hit(e);
  };
  const chk = $('#lpChk');
  chk.disabled = false;
  chk.onclick = () => {
    const c = on.filter(Boolean).length;
    if (c === p) {
      chk.disabled = true;
      labDone(`¡${p}% son ${p} de 100!`);
    } else labBad(c > p ? 'Pintaste de más.' : 'Faltan cuadritos.');
  };
  upd();
}
function labPairs(m, t) {
  show($('#labPairs'), true);
  const qs = [],
    seen = new Set();
  let n = 0;
  while (qs.length < 3 && n++ < 60) {
    const q = GEN[t.id](n % 2 ? 1 : 2);
    if (!seen.has(q.a) && q.q.length < 110) {
      seen.add(q.a);
      qs.push(q);
    }
  }
  const right = shuf(qs.map((q) => q.a));
  let selL = null;
  const done = new Set(),
    L = $$('#lpL .opt'),
    Rr = $$('#lpR .opt');
  const draw = () => {
    L.forEach((b, i) => {
      const q = qs[i];
      show(b, !!q);
      if (!q) return;
      b.innerHTML = q.q;
      b.classList.toggle('done', done.has(q.a));
      b.classList.toggle('sel', selL === i);
    });
    Rr.forEach((b, i) => {
      const a = right[i];
      show(b, a !== undefined);
      if (a === undefined) return;
      b.textContent = a;
      b.classList.remove('bad');
      b.classList.toggle('done', done.has(a));
    });
  };
  L.forEach(
    (b, i) =>
      (b.onclick = () => {
        selL = i;
        draw();
      })
  );
  Rr.forEach(
    (b, i) =>
      (b.onclick = () => {
        if (selL === null) return labBad('Primero toca una pregunta.');
        const a = right[i];
        if (qs[selL].a === a) {
          done.add(a);
          selL = null;
          draw();
          if (done.size === qs.length) labDone('¡Todas las parejas!');
        } else {
          b.classList.add('bad');
          labBad('Esa no es la pareja. Sigue intentando.');
        }
      })
  );
  draw();
}

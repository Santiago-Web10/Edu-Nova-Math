// EDU NOVA Math — Parte 5/5: inicio de la aplicación.
/* ============================================================
   7. INICIO DE LA APLICACIÓN Y EVENTOS (se conectan una sola vez)
   ============================================================ */
function init() {
  // Menús
  $$('[data-v]').forEach(
    (b) =>
      (b.onclick = () => {
        if (b.dataset.v === 'temas') LS = null;
        if (b.dataset.v === 'juegos') GP = null;
        go(b.dataset.v);
      })
  );
  $('#snd').onclick = () => {
    S.sound = !S.sound;
    save();
    hud();
    sfx('ok');
  };
  $('#modal').onclick = (e) => {
    if (e.target.id === 'modal') closeModal();
  };
  // Inicio
  $('#start').onclick = () => {
    const n = $('#inName').value.trim().replace(/\s+/g, ' ').slice(0, 20);
    if (n.length < 2) {
      toast('✏️ Escribe tu nombre para comenzar');
      $('#inName').focus();
      return;
    }
    $('#mgName').textContent = n;
    $('#mgGrade').textContent = $('#inGrade').value;
    openModal('mdGrade');
  };
  $('#gNo').onclick = closeModal;
  $('#gYes').onclick = () => {
    S.name = $('#inName').value.trim().replace(/\s+/g, ' ').slice(0, 20);
    S.grade = +$('#inGrade').value;
    S.locked = true;
    GS.grade = S.grade;
    TG = S.grade;
    PG = S.grade;
    save();
    closeModal();
    LS = null;
    checkBadges();
    go('temas');
  };
  $('#cont').onclick = () => {
    const nx = gradeTopics(S.grade).find((t) => !S.topics[t.id]?.done);
    if (!nx) return;
    TG = nx.g;
    LS = { id: nx.id, step: 0 };
    go('temas');
  };
  // Temas
  $$('#gradeTabs [data-g]').forEach(
    (b) =>
      (b.onclick = () => {
        if (S.locked) return;
        TG = +b.dataset.g;
        RENDER.temas();
      })
  );
  $('#recGo').onclick = () => openTopic($('#recGo').dataset.rec);
  $$('#topicGrid .topic').forEach((b) => (b.onclick = () => openTopic(b.dataset.t)));
  $('#backT').onclick = () => {
    LS = null;
    RENDER.temas();
  };
  $$('#stepsNav [data-s]').forEach(
    (b) =>
      (b.onclick = () => {
        LS.step = +b.dataset.s;
        if (LS.step === 2) LS.qs = null;
        renderLesson();
      })
  );
  $('#s0Next').onclick = () => {
    LS.step = 1;
    renderLesson();
  };
  $$('#s1Grid .ex-btn').forEach(
    (b) =>
      (b.onclick = () => {
        const c = b.closest('.ex');
        show($('.ex-r', c), true);
        show(b, false);
      })
  );
  $('#s1Next').onclick = () => {
    LS.step = 2;
    LS.qs = null;
    renderLesson();
  };
  // Práctica
  $$('#pqOpts .opt').forEach(
    (b, i) =>
      (b.onclick = () => {
        if (!LS || !LS.qs || LS.ans) return;
        answer(LS.qs[LS.i].opts[i]);
      })
  );
  const send = () => {
    const v = $('#inA').value;
    if (!v.trim() || !LS || !LS.qs || LS.ans) return;
    answer(v);
  };
  $('#inA').onkeydown = (e) => {
    if (e.key === 'Enter') send();
  };
  bindKeypad($('#kpPractice'), $('#inA'), send);
  $('#nq').onclick = () => {
    LS.i++;
    LS.ans = null;
    renderPractice();
  };
  $('#again').onclick = () => {
    LS.qs = null;
    LS.step = 2;
    renderLesson();
  };
  $('#toLab').onclick = () => {
    LS.step = 3;
    renderLesson();
  };
  $('#toList').onclick = $('#toList2').onclick = () => {
    LS = null;
    RENDER.temas();
  };
  $('#again2').onclick = () => renderLesson();
  addEventListener('pointerup', () => {
    pctDown = false;
    conDown = false;
  });
  // Juegos
  $$('#gGrid .gcard').forEach(
    (b) =>
      (b.onclick = () => {
        GP = b.dataset.g;
        if (S.locked) GS.grade = S.grade;
        RENDER.juegos();
      })
  );
  $('#back').onclick = () => {
    stopGame();
    GP = null;
    RENDER.juegos();
  };
  $$('#gsGrades [data-gr]').forEach(
    (b) =>
      (b.onclick = () => {
        if (S.locked) return;
        GS.grade = +b.dataset.gr;
        gameSetup();
      })
  );
  $$('#gsDiffs [data-df]').forEach(
    (b) =>
      (b.onclick = () => {
        GS.diff = +b.dataset.df;
        gameSetup();
      })
  );
  $('#play').onclick = startGame;
  $('#exit').onclick = () => {
    stopGame();
    gameSetup();
  };
  $('#m1').onclick = () => {
    closeModal();
    gameSetup();
    $('#play').click();
  };
  $('#m2').onclick = () => {
    closeModal();
    GP = null;
    RENDER.juegos();
  };
  bindKeypad($('#kpReto'), $('#ra'), () => RS && RS());
  $$('#aOpts .opt').forEach((b, i) => (b.onclick = () => aventuraPick(i)));
  $('#cnA').onclick = aventuraNext;
  $$('#dSusp .opt').forEach((b, i) => (b.onclick = () => detectivePick(i)));
  $('#dh').onclick = detectiveHint;
  $('#cnD').onclick = detectiveNext;
  // Progreso
  $$('#pgTabs [data-pg]').forEach(
    (b) =>
      (b.onclick = () => {
        if (S.locked) return;
        PG = +b.dataset.pg;
        RENDER.progreso();
      })
  );
  $('#rst').onclick = () => openModal('mdReset');
  $('#no').onclick = closeModal;
  $('#yes').onclick = () => {
    S = DEF();
    save();
    hud();
    closeModal();
    TG = 4;
    PG = null;
    GS.grade = 4;
    LS = null;
    GP = null;
    go('home');
  };
  // Logros
  $$('#accGrid .acc-btn').forEach(
    (b) =>
      (b.onclick = () => {
        if (b.disabled) return;
        S.acc = b.dataset.a;
        save();
        hud();
        RENDER.logros();
      })
  );
  GS.grade = S.grade;
  TG = S.grade;
  touchDay();
  hud();
  go('home');
  checkBadges();
}
init();

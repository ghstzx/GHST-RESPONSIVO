// ── ELEMENTOS ──
const slider      = document.getElementById('slider');
const slides      = document.querySelectorAll('.slide');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress');

let currentSlide = parseInt(sessionStorage.getItem('capituloSalvo')) || 0;

// ── ATUALIZAÇÃO CENTRAL ──
function update(skipTransition) {
  sessionStorage.setItem('capituloSalvo', currentSlide);
  if (skipTransition) {
    slider.style.transition = 'none';
    slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
    slider.offsetHeight;
    slider.style.transition = '';
  } else {
    slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
  }

  slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));

  const nav = currentSlide <= 1;
  prevBtn.style.visibility    = nav ? 'hidden' : 'visible';
  nextBtn.style.visibility    = nav ? 'hidden' : 'visible';
  prevBtn.style.pointerEvents = nav ? 'none' : 'auto';
  nextBtn.style.pointerEvents = nav ? 'none' : 'auto';
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === slides.length - 1;

  progressBar.style.width = `${(currentSlide / (slides.length - 1)) * 100}%`;

  if (currentSlide === 1) setTimeout(animateCounters, 600);
  if (slides[currentSlide].querySelector('#scratchCanvas'))  setTimeout(initScratch, 600);
  if (slides[currentSlide].querySelector('#quizContainer')) setTimeout(initQuiz, 300);
  if (slides[currentSlide].querySelector('#wmpContainer'))  setTimeout(initWmp, 300);
}

// ── NAVEGAÇÃO ──
function nextSlide() { if (currentSlide < slides.length - 1) { currentSlide++; update(); } }
function prevSlide() { if (currentSlide > 0) { currentSlide--; update(); } }

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft')  prevSlide();
});

// ── CONTADOR ──
function animateCounters() {
  const diff = Date.now() - new Date('2023-06-24').getTime();
  const days = Math.floor(diff / 86400000);
  animateValue('count-days',  0, days,      2000);
  animateValue('count-hours', 0, Math.floor(days / 7), 2000);
}

function animateValue(id, start, end, duration) {
  const el = document.getElementById(id);
  if (!el || el.dataset.animated) return;
  el.dataset.animated = 'true';
  let t0 = null;
  const step = ts => {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / duration, 1);
    el.textContent = Math.floor(p * (end - start) + start).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── RASPADINHA ──
let isScratching = false, scratchInitialized = false;

function initScratch() {
  const canvas = document.getElementById('scratchCanvas');
  const wrap   = document.getElementById('scratch-wrapper');
  if (!canvas || !wrap || scratchInitialized) return;
  scratchInitialized = true;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width  = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
  ctx.fillStyle = '#b3b3b3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '20px Segoe UI';
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  ctx.fillText('Raspe aqui', canvas.width / 2, canvas.height / 2);

  function getPos(e) {
    const r   = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function scratch(e) {
    if (!isScratching) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    checkReveal();
  }

  function checkReveal() {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    for (let i = 3; i < data.length; i += 16) if (data[i] === 0) transparent++;
    if ((transparent / (data.length / 16)) * 100 > 45) {
      wrap.classList.add('scratch-revealed');
      document.getElementById('scratch-text').innerHTML = 'O dinossauro mais lindo que eu já vi na vida. Te amo minha lindona! ❤️';
      isScratching = false;
    }
  }

  canvas.addEventListener('mousedown',  () => isScratching = true);
  canvas.addEventListener('mouseup',    () => isScratching = false);
  canvas.addEventListener('mousemove',  scratch);
  canvas.addEventListener('touchstart', e => { isScratching = true; scratch(e); }, { passive: false });
  canvas.addEventListener('touchend',   () => isScratching = false);
  canvas.addEventListener('touchmove',  scratch, { passive: false });
  wrap.classList.add('scratch-ready');
}

// ── PARTÍCULAS ──
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  ['❤️', '✨', '🌸', '💕'].forEach(sym => {
    for (let i = 0; i < 4; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.innerHTML = sym;
      p.style.cssText = `left:${Math.random()*100}vw;font-size:${10+Math.random()*15}px;animation-duration:${4+Math.random()*3}s;animation-delay:${Math.random()*5}s`;
      container.appendChild(p);
    }
  });
}
window.addEventListener('load', createParticles);

// ── TICKET ──
let ticketOpened = false;
function openTicket() {
  if (ticketOpened) return;
  ticketOpened = true;
  document.getElementById('ticketBody').classList.add('open');
  document.getElementById('tapHint').classList.add('hidden');
  const wrap   = document.getElementById('confetti');
  const colors = ['#ff4d6d', '#ffb3c0', '#ff8fa3', '#fff0f3', '#ff6b81'];
  for (let i = 0; i < 28; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.cssText = `left:${20+Math.random()*60}%;top:${10+Math.random()*30}%;background:${colors[Math.random()*colors.length|0]};animation-delay:${Math.random()*.4}s;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px`;
    wrap.appendChild(el);
    setTimeout(() => el.classList.add('pop'), 50);
  }
}

// ── HELPER: PROGRESS UPDATER GENÉRICO ──
function makeProgressUpdater(fillId, labelId, getData) {
  return function () {
    const fill  = document.getElementById(fillId);
    const label = document.getElementById(labelId);
    if (!fill || !label) return;
    const { current, total } = getData();
    fill.style.width  = (current / total * 100) + '%';
    label.textContent = `${current}/${total}`;
  };
}

// ── QUIZ ──
const QUIZ_DATA = [
  { q: 'Quando foi nosso primeiro beijo?',               options: ['Agosto', 'Maio', 'Janeiro'],                       correct: 1 },
  { q: 'Onde foi nosso primeiro beijo?',                 options: ['No Bentos', 'Cinema', 'Na rua'],                   correct: 1 },
  { q: 'O que mais gosto de fazer com você?',            options: ['Ignorar você', 'Te amolar', 'Ficar em silêncio'],  correct: 1 },
  { q: 'Onde foi nossa primeira "viagem" juntos?',       options: ['Piedade das Gerais', 'Inhotim', 'Nunca viajamos'], correct: 0 },
  { q: 'O que nunca pode faltar quando estamos juntos?', options: ['Distância', 'Abraços', 'Silêncio'],                correct: 1 },
  { q: 'O que acho mais lindo em você?',                 options: ['Sorriso', 'Nada', 'Sua raiva'],                    correct: 0 },
  { q: 'Qual é a bebida que marcou nossa história?',     options: ['Coca', 'Água', 'Café'],                           correct: 0 },
  { q: 'Nossa primeira aparição em público foi aonde?',  options: ['Festa de alguma amiga sua', 'EAC', 'Bentos'],      correct: 1 },
  { q: 'O que você significa pra mim?',                  options: ['Tanto faz', 'Tudo', 'Só mais uma pessoa'],         correct: 1 },
  { q: 'O que eu mais sinto quando estou com você?',     options: ['Felicidade', 'Raiva', 'Tédio'],                    correct: 0 },
  { q: 'O que eu nunca quero perder?',                   options: ['Qualquer coisa', 'Você', 'Dinheiro'],              correct: 1 },
  { q: 'O que sinto quando você não está comigo?',       options: ['Alívio', 'Saudade', 'Indiferença'],               correct: 1 },
];

const QUIZ_OK   = ['Isso mesmo minha princesinha! ❤️', 'Boaaa minha lindona! 🎯', 'É claro que você sabia! 😍', 'Perfeito! 💕', 'Você me conhece bem! ✨'];
const QUIZ_FAIL = ['Errou uma fácil dessas minha lindona? 😅', 'Vix, aí deu ruim! 😄', 'Errou hein minha princesinha!', 'Tá me testando? 😂'];

let quizCurrent = 0, quizScore = 0, quizAnswered = false, quizInitialized = false;

const updateQuizProgress = makeProgressUpdater('quizProgressFill', 'quizProgressLabel',
  () => ({ current: quizCurrent, total: QUIZ_DATA.length }));

function initQuiz() {
  const c = document.getElementById('quizContainer');
  if (!c || quizInitialized) return;
  quizInitialized = true;
  quizCurrent = 0; quizScore = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quizContainer');
  const win       = document.getElementById('quizWin');
  if (!container) return;
  if (quizCurrent >= QUIZ_DATA.length) {
    container.innerHTML = '';
    win.classList.add('show');
    document.getElementById('quizWinText').innerHTML = quizEndMsg(quizScore, QUIZ_DATA.length);
    updateQuizProgress();
    return;
  }
  quizAnswered = false;
  const d = QUIZ_DATA[quizCurrent];
  container.innerHTML = `
    <div class="quiz-question-block">
      <div class="quiz-question-num">Pergunta ${quizCurrent + 1} de ${QUIZ_DATA.length}</div>
      <div class="quiz-question-text">${d.q}</div>
      <div class="quiz-options">
        ${d.options.map((o, i) => `<button class="quiz-option" onclick="answerQuiz(${i})">${o}</button>`).join('')}
      </div>
      <div class="quiz-feedback" id="quizFeedback"></div>
    </div>`;
  updateQuizProgress();
}

function answerQuiz(sel) {
  if (quizAnswered) return;
  quizAnswered = true;
  const d    = QUIZ_DATA[quizCurrent];
  const btns = document.querySelectorAll('.quiz-option');
  const fb   = document.getElementById('quizFeedback');
  btns.forEach(b => b.disabled = true);
  if (sel === d.correct) {
    btns[sel].classList.add('correct'); quizScore++;
    fb.className = 'quiz-feedback ok';
    fb.textContent = QUIZ_OK[Math.random() * QUIZ_OK.length | 0];
  } else {
    btns[sel].classList.add('wrong');
    btns[d.correct].classList.add('reveal');
    fb.className = 'quiz-feedback err';
    fb.textContent = QUIZ_FAIL[Math.random() * QUIZ_FAIL.length | 0];
  }
  const btn = document.createElement('button');
  btn.className = 'quiz-next-btn';
  btn.textContent = quizCurrent + 1 < QUIZ_DATA.length ? 'Próxima →' : 'Ver resultado 🎉';
  btn.onclick = () => { quizCurrent++; renderQuizQuestion(); };
  document.querySelector('.quiz-question-block').appendChild(btn);
}

function quizEndMsg(s, t) {
  if (s === t)    return `${s}/${t} — Você me conhece de cor e salteado! Eu te amo demais! 💕`;
  if (s >= t - 2) return `${s}/${t} — Quase perfeita! Me conhece muito bem. ❤️`;
  if (s >= t / 2) return `${s}/${t} — Boa! Mas ainda tem coisa pra aprender sobre mim. 😄`;
  return            `${s}/${t} — Hm... precisamos passar mais tempo juntos! 😂`;
}

// ── WMP ──
const WMP_DATA = [
  { cat: '🥊 Dia a Dia',               q: 'Quem demora mais para se arrumar para uma festa?',                         correct: 'DUDA' },
  { cat: '🥊 Dia a Dia',               q: 'Quem é o primeiro a sentir fome, mesmo tendo acabado de comer?',           correct: 'FAEL' },
  { cat: '🥊 Dia a Dia',               q: 'Quem tem mais chance de esquecer onde estacionou o carro (ou a moto)?',    correct: 'FAEL' },
  { cat: '🎮 Hobbies e Personalidade', q: 'Quem é mais competitivo quando decidimos jogar juntos?',         correct: 'DUDA' },
  { cat: '🎮 Hobbies e Personalidade', q: 'Quem tem o gosto musical mais duvidoso?',                                  correct: 'DUDA' },
  { cat: '🎮 Hobbies e Personalidade', q: 'Quem é mais provável de gastar dinheiro com algo "inútil" só porque achou legal?', correct: 'DUDA' },
  { cat: '💖 Relacionamento',          q: 'Quem deu o primeiro passo para o namoro começar?',                         correct: 'FAEL' },
  { cat: '💖 Relacionamento',          q: 'Quem é o mais carinhoso e "grudento"?',                                    correct: 'FAEL' },
  { cat: '💖 Relacionamento',          q: 'Quem é o mais sociável e faz amizade com todo mundo na rua?',              correct: 'FAEL' },
  { cat: '💖 Relacionamento',          q: 'Quem é o mais ciumento (mesmo que não admita)?',                           correct: 'DUDA' },
];

const WMP_OK   = ['É, até que você sabe 😂', 'Isso mesmo! ❤️', 'Haha, verdade! 😄', 'Sem surpresas aqui! 😏', 'Exatamente! 💕'];
const WMP_FAIL = ['Hm, era o outro! 😅', 'Quase... mas errou! 😂', 'Que surpresa né? 😄', 'Não dessa vez! 😏'];

let wmpCurrent = 0, wmpScore = 0, wmpAnswered = false, wmpInitialized = false;

const updateWmpProgress = makeProgressUpdater('wmpProgressFill', 'wmpProgressLabel',
  () => ({ current: wmpCurrent, total: WMP_DATA.length }));

function initWmp() {
  const c = document.getElementById('wmpContainer');
  if (!c || wmpInitialized) return;
  wmpInitialized = true;
  wmpCurrent = 0; wmpScore = 0;
  renderWmpQuestion();
}

function renderWmpQuestion() {
  const container = document.getElementById('wmpContainer');
  const win       = document.getElementById('wmpWin');
  if (!container) return;
  if (wmpCurrent >= WMP_DATA.length) {
    container.innerHTML = '';
    win.classList.add('show');
    document.getElementById('wmpWinText').innerHTML = wmpEndMsg(wmpScore, WMP_DATA.length);
    updateWmpProgress();
    return;
  }
  wmpAnswered = false;
  const d = WMP_DATA[wmpCurrent];
  container.innerHTML = `
    <div class="wmp-question-block">
      <div class="wmp-num">Pergunta ${wmpCurrent + 1} de ${WMP_DATA.length}</div>
      <div class="wmp-category">${d.cat}</div>
      <div class="wmp-question-text">${d.q}</div>
      <div class="wmp-options">
        <button class="wmp-btn" onclick="answerWmp('DUDA')" id="wmpBtnDuda"><span class="wmp-emoji">👧</span><span class="wmp-btn-label">Opção</span>DUDA</button>
        <button class="wmp-btn" onclick="answerWmp('FAEL')" id="wmpBtnFael"><span class="wmp-emoji">👦</span><span class="wmp-btn-label">Opção</span>FAEL</button>
      </div>
      <div class="wmp-feedback" id="wmpFeedback"></div>
    </div>`;
  updateWmpProgress();
}

function answerWmp(chosen) {
  if (wmpAnswered) return;
  wmpAnswered = true;
  const d          = WMP_DATA[wmpCurrent];
  const btnDuda    = document.getElementById('wmpBtnDuda');
  const btnFael    = document.getElementById('wmpBtnFael');
  const fb         = document.getElementById('wmpFeedback');
  const chosenBtn  = chosen === 'DUDA' ? btnDuda : btnFael;
  const correctBtn = d.correct === 'DUDA' ? btnDuda : btnFael;
  btnDuda.disabled = btnFael.disabled = true;
  if (chosen === d.correct) {
    chosenBtn.classList.add('correct'); wmpScore++;
    fb.className = 'wmp-feedback ok';
    fb.textContent = WMP_OK[Math.random() * WMP_OK.length | 0];
  } else {
    chosenBtn.classList.add('wrong');
    correctBtn.classList.add('reveal');
    fb.className = 'wmp-feedback err';
    fb.textContent = WMP_FAIL[Math.random() * WMP_FAIL.length | 0];
  }
  // FIX: usa .quiz-next-btn sem id, sem conflito com o nextBtn da navegação
  const btn = document.createElement('button');
  btn.className = 'quiz-next-btn';
  btn.textContent = wmpCurrent + 1 < WMP_DATA.length ? 'Próxima →' : 'Ver resultado 🎉';
  btn.onclick = () => { wmpCurrent++; renderWmpQuestion(); };
  document.querySelector('.wmp-question-block').appendChild(btn);
}

function wmpEndMsg(s, t) {
  if (s === t)    return `${s}/${t} — Perfeita! Você nos conhece demais. Isso é amor! 💕`;
  if (s >= t - 2) return `${s}/${t} — Quase perfeita! Me conhece muito bem. ❤️`;
  if (s >= t / 2) return `${s}/${t} — Razoável... mas ainda tem coisa pra aprender! 😄`;
  return            `${s}/${t} — Hmm, precisamos conversar mais! 😂`;
}

// ══════════════════════════════════════════
// SLIDE UNIVERSO EM NÚMEROS
// ══════════════════════════════════════════

(function () {
  let uvReady = false;   // garante inicialização única
  let uvPhase = 0;       // 0=intro 1=numeros 2=final
  let uvNumStep = 0;     // qual card de número está visível
  let starsAnim = null;  // requestAnimationFrame handle
  let stars = [], shoots = [];

  // ── Detecta quando o slide do universo fica ativo ──
  // O script.js principal chama update() toda vez que muda de slide.
  // Usamos MutationObserver no slider para saber quando o slide-universo fica visível.
  const uvSlide = document.querySelector('.slide-universo');
  if (!uvSlide) return;

  const uvObserver = new MutationObserver(() => {
    const isActive = uvSlide.classList.contains('active');
    if (isActive && !uvReady) {
      uvInit();
    }
    // Para o canvas quando sai do slide (economiza CPU)
    if (!isActive && starsAnim) {
      cancelAnimationFrame(starsAnim);
      starsAnim = null;
    }
    if (isActive && uvReady && !starsAnim) {
      drawStars();
    }
  });
  uvObserver.observe(uvSlide, { attributes: true, attributeFilter: ['class'] });

  function uvInit() {
    uvReady = true;
    uvPhase = 0;
    uvNumStep = 0;
    initCanvas();
    drawStars();
    showUvPhase(0);

    // Clique no botão avança as fases
    document.getElementById('uvBtn').addEventListener('click', uvAdvance);
    // Toque em qualquer lugar do slide também avança
    uvSlide.addEventListener('click', function (e) {
      if (e.target === document.getElementById('uvBtn')) return;
      if (uvPhase < 2) uvAdvance();
    });
  }

  // ── Canvas de estrelas ──
  function initCanvas() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    canvas.width  = uvSlide.offsetWidth  || window.innerWidth;
    canvas.height = uvSlide.offsetHeight || window.innerHeight;
    generateStars(canvas);
    window.addEventListener('resize', () => {
      canvas.width  = uvSlide.offsetWidth  || window.innerWidth;
      canvas.height = uvSlide.offsetHeight || window.innerHeight;
      generateStars(canvas);
    });
  }

  function generateStars(canvas) {
    stars = [];
    const n = Math.floor((canvas.width * canvas.height) / 4200);
    for (let i = 0; i < n; i++) {
      const base = Math.random() * .5 + .15;
      stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + .2, op: base, base, dir: 1, speed: Math.random() * .012 + .004 });
    }
    shoots = [];
  }

  function drawStars() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Estrelas fixas com brilho pulsante
    stars.forEach(s => {
      s.op += s.speed * s.dir;
      if (s.op > s.base + .32 || s.op < s.base - .12) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, s.op))})`;
      ctx.fill();
    });

    // Estrelas cadentes ocasionais
    if (Math.random() > .994) {
      shoots.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height * .45, vx: 3 + Math.random() * 4, vy: 1.5 + Math.random() * 2, len: 70 + Math.random() * 100, life: 1 });
    }
    shoots = shoots.filter(s => s.life > 0);
    shoots.forEach(s => {
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * .4);
      g.addColorStop(0, `rgba(255,180,200,${s.life})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y - s.len * .4);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      s.x += s.vx; s.y += s.vy; s.life -= .02;
    });

    starsAnim = requestAnimationFrame(drawStars);
  }

  // ── Fases ──
  function showUvPhase(n) {
    const phases = ['uvIntro', 'uvNumbers', 'uvFinal'];
    phases.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (i === n) {
        el.classList.remove('uv-hidden');
        void el.offsetWidth; // força reflow para animação CSS
      } else {
        el.classList.add('uv-hidden');
      }
    });
    uvPhase = n;
  }

  function uvAdvance() {
    // Intro → primeiro número
    if (uvPhase === 0) {
      showUvPhase(1);
      uvNumStep = 0;
      ['uvCard0', 'uvCard1', 'uvCard2'].forEach((id, i) => {
        document.getElementById(id).classList.toggle('uv-hidden', i !== 0);
      });
      return;
    }

    // Números → próximo número ou fase final
    if (uvPhase === 1) {
      uvNumStep++;
      if (uvNumStep <= 2) {
        const card = document.getElementById('uvCard' + uvNumStep);
        card.classList.remove('uv-hidden');
        void card.offsetWidth;
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = '';
        // Escurece os anteriores
        for (let i = 0; i < uvNumStep; i++) {
          const prev = document.getElementById('uvCard' + i);
          prev.style.opacity   = '.3';
          prev.style.transform = 'scale(.94)';
          prev.style.transition = 'opacity .5s ease, transform .5s ease';
        }
      } else {
        // Esconde botão e vai pro final
        document.getElementById('uvBtn').classList.add('uv-hidden');
        setTimeout(() => showUvPhase(2), 350);
      }
      return;
    }
  }

})();

// ══════════════════════════════════════════
// SLIDE LUA — DUDA
// ══════════════════════════════════════════
(function () {

  const slide = document.querySelector('.slide-lua');
  if (!slide) return;

  let ready = false, bgAnim = null, luaAnim = null, phase = 0;
  let bgStars = [], bgShoots = [];

  new MutationObserver(() => {
    const on = slide.classList.contains('active');
    if (on && !ready) init();
    if (!on && bgAnim)  { cancelAnimationFrame(bgAnim);  bgAnim = null; }
    if (!on && luaAnim) { cancelAnimationFrame(luaAnim); luaAnim = null; }
    if (on && ready && !bgAnim) drawBg();
  }).observe(slide, { attributes: true, attributeFilter: ['class'] });

  // ─── INIT ───
  function init() {
    ready = true; phase = 0;
    setupBg(); drawBg();
    showPhase('luaGrow');
    startMoonPhases(); // já começa animando as fases da lua no fundo

    document.getElementById('luaBtn').addEventListener('click', advance);
    slide.addEventListener('click', e => {
      if (e.target === document.getElementById('luaBtn')) return;
      if (phase < 2) advance();
    });
  }

  // ─── FUNDO DE ESTRELAS ───
  function setupBg() {
    const c = document.getElementById('luaCanvas');
    c.width  = slide.offsetWidth  || window.innerWidth;
    c.height = slide.offsetHeight || window.innerHeight;
    bgStars = [];
    const n = Math.floor((c.width * c.height) / 3800);
    for (let i = 0; i < n; i++) {
      const b = Math.random() * .45 + .1;
      bgStars.push({ x: Math.random()*c.width, y: Math.random()*c.height,
        r: Math.random()*1.4+.2, op: b, base: b, dir: 1, sp: Math.random()*.01+.003 });
    }
  }

  function drawBg() {
    const c = document.getElementById('luaCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    bgStars.forEach(s => {
      s.op += s.sp * s.dir;
      if (s.op > s.base+.28 || s.op < s.base-.08) s.dir *= -1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0,Math.min(1,s.op))})`; ctx.fill();
    });
    if (Math.random() > .996) bgShoots.push({
      x: Math.random()*c.width, y: Math.random()*c.height*.35,
      vx: 3+Math.random()*4, vy: 1.2+Math.random()*2,
      len: 60+Math.random()*90, life: 1
    });
    bgShoots = bgShoots.filter(s => s.life > 0);
    bgShoots.forEach(s => {
      const g = ctx.createLinearGradient(s.x,s.y,s.x-s.len,s.y-s.len*.4);
      g.addColorStop(0,`rgba(255,230,160,${s.life})`);
      g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.len,s.y-s.len*.4);
      ctx.strokeStyle=g; ctx.lineWidth=1.3; ctx.stroke();
      s.x+=s.vx; s.y+=s.vy; s.life-=.022;
    });
    bgAnim = requestAnimationFrame(drawBg);
  }

  // ─── FASES DA LUA (fase 0: lua crescendo no fundo da tela) ───
  let moonPhaseAnim = null;
  let moonPhase = 0; // 0..1  — 0=nova, 1=cheia

  function startMoonPhases() {
    const c = document.getElementById('luaCanvas');
    if (!c) return;

    function drawMoon(pct) {
      // pct 0=meia esquerda visível → 1=cheia
      const ctx = c.getContext('2d');
      const cx  = c.width / 2;
      const cy  = c.height * .46;
      const R   = Math.min(c.width, c.height) * .28;

      // Glow suave ao redor da lua
      const glowR = R * (1 + .6 * pct);
      const glow = ctx.createRadialGradient(cx, cy, R*.5, cx, cy, glowR);
      glow.addColorStop(0, `rgba(255,230,120,${.18*pct})`);
      glow.addColorStop(1, 'rgba(255,200,60,0)');
      ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI*2);
      ctx.fillStyle = glow; ctx.fill();

      // Corpo da lua (gradiente dourado)
      const moonGrad = ctx.createRadialGradient(cx-R*.25, cy-R*.2, R*.1, cx, cy, R);
      moonGrad.addColorStop(0, '#fff8d6');
      moonGrad.addColorStop(.4, '#f5d97a');
      moonGrad.addColorStop(1, '#c89020');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
      ctx.fillStyle = moonGrad; ctx.fill();

      // Sombra da fase: cobre parte da lua com o céu
      // pct=0: cobre quase tudo (lua nova), pct=1: não cobre nada (lua cheia)
      if (pct < 0.98) {
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, R+2, 0, Math.PI*2); ctx.clip();

        // A sombra se move da esquerda para fora à direita
        // offset negativo = sombra cobre a lua; positivo = sumiu
        const shadowOffsetX = R * 2 * (pct - 0.5) * 2.2;

        ctx.beginPath();
        ctx.arc(cx + shadowOffsetX, cy, R * 1.05, 0, Math.PI*2);
        ctx.fillStyle = '#020510';
        ctx.fill();
        ctx.restore();
      }

      // Crateras (aparecem só quando a lua está quase cheia)
      if (pct > .72) {
        const craterAlpha = (pct - .72) / .28;
        const crateras = [
          { x: cx - R*.28, y: cy - R*.12, r: R*.09 },
          { x: cx + R*.18, y: cy + R*.25, r: R*.065 },
          { x: cx - R*.1,  y: cy + R*.38, r: R*.05 },
          { x: cx + R*.38, y: cy - R*.3,  r: R*.055 },
          { x: cx - R*.42, y: cy + R*.22, r: R*.042 },
          { x: cx + R*.05, y: cy - R*.44, r: R*.038 },
        ];
        crateras.forEach(cr => {
          const cg = ctx.createRadialGradient(cr.x-cr.r*.3,cr.y-cr.r*.3,0,cr.x,cr.y,cr.r);
          cg.addColorStop(0, `rgba(160,115,20,${.55*craterAlpha})`);
          cg.addColorStop(.6, `rgba(140,100,15,${.4*craterAlpha})`);
          cg.addColorStop(1, `rgba(200,160,60,${.1*craterAlpha})`);
          ctx.beginPath(); ctx.arc(cr.x, cr.y, cr.r, 0, Math.PI*2);
          ctx.fillStyle = cg; ctx.fill();
        });
      }

      // Borda suave
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,220,100,${.25*pct})`;
      ctx.lineWidth = 1.5; ctx.stroke();
    }

    function step() {
      if (moonPhase < 1) {
        moonPhase = Math.min(moonPhase + .006, 1);
        drawMoon(moonPhase);
        moonPhaseAnim = requestAnimationFrame(step);
      } else {
        drawMoon(1); // garante lua cheia final
      }
    }
    moonPhaseAnim = requestAnimationFrame(step);
  }

  // ─── LUA CHEIA COM NOME "DUDA" SURGINDO NAS MANCHAS ───
  function drawMoonWithName() {
    const c = document.getElementById('luaCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const cx = W/2, cy = H * .46;
    const R  = Math.min(W, H) * .28;

    // Pontos do "DUDA" posicionados dentro da lua
    // Cada letra é um conjunto de pontos relativos ao centro da lua
    // Coordenadas em [-1,1] multiplicadas por R*.7
    const scale = R * .68;

    // Definição das letras com traços limpos
    const letters = [
      // D (x de -0.85 a -0.45)
      { pts: [[-0.85,-0.55],[-0.85,0.55],[-0.55,0.55],[-0.35,0.3],[-0.35,-0.3],[-0.55,-0.55]],
        edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
      // U (x de -0.30 a 0.05)
      { pts: [[-0.30,-0.55],[-0.30,0.25],[-0.15,0.55],[0.05,0.25],[0.05,-0.55]],
        edges: [[0,1],[1,2],[2,3],[3,4]] },
      // D (x de 0.12 a 0.52)
      { pts: [[0.12,-0.55],[0.12,0.55],[0.40,0.55],[0.60,0.3],[0.60,-0.3],[0.40,-0.55]],
        edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
      // A (x de 0.65 a 1.0)
      { pts: [[0.825,-0.58],[0.65,0.55],[1.00,0.55],[0.69,0.05],[0.96,0.05]],
        edges: [[0,1],[0,2],[3,4]] },
    ];

    let tick = 0;
    const TOTAL = 90;

    function frame() {
      ctx.clearRect(0, 0, W, H);

      // Redesenha as estrelas de fundo (só as fixas, sem shooting stars)
      bgStars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${s.op})`; ctx.fill();
      });

      // Blobs
      const gb1 = ctx.createRadialGradient(W*.8,-H*.1,0,W*.8,-H*.1,W*.45);
      gb1.addColorStop(0,'rgba(15,30,100,.35)'); gb1.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=gb1; ctx.fillRect(0,0,W,H);

      // Glow
      const glowR2 = R*1.45;
      const glow2 = ctx.createRadialGradient(cx,cy,R*.5,cx,cy,glowR2);
      glow2.addColorStop(0,'rgba(255,230,120,.22)');
      glow2.addColorStop(1,'rgba(255,200,60,0)');
      ctx.beginPath(); ctx.arc(cx,cy,glowR2,0,Math.PI*2);
      ctx.fillStyle=glow2; ctx.fill();

      // Lua cheia
      const mg = ctx.createRadialGradient(cx-R*.25,cy-R*.2,R*.1,cx,cy,R);
      mg.addColorStop(0,'#fff8d6'); mg.addColorStop(.4,'#f5d97a'); mg.addColorStop(1,'#c89020');
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.fillStyle=mg; ctx.fill();

      // Crateras de fundo
      const crateras = [
        {x:cx-R*.28,y:cy-R*.12,r:R*.09},{x:cx+R*.18,y:cy+R*.25,r:R*.065},
        {x:cx-R*.1,y:cy+R*.38,r:R*.05},{x:cx+R*.38,y:cy-R*.3,r:R*.055},
        {x:cx-R*.42,y:cy+R*.22,r:R*.042},{x:cx+R*.05,y:cy-R*.44,r:R*.038},
      ];
      crateras.forEach(cr => {
        const cg = ctx.createRadialGradient(cr.x-cr.r*.3,cr.y-cr.r*.3,0,cr.x,cr.y,cr.r);
        cg.addColorStop(0,'rgba(160,115,20,.5)'); cg.addColorStop(1,'rgba(200,160,60,.08)');
        ctx.beginPath(); ctx.arc(cr.x,cr.y,cr.r,0,Math.PI*2);
        ctx.fillStyle=cg; ctx.fill();
      });

      // Borda
      ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,220,100,.22)'; ctx.lineWidth=1.5; ctx.stroke();

      // NOME — clip dentro da lua
      ctx.save();
      ctx.beginPath(); ctx.arc(cx,cy,R*.92,0,Math.PI*2); ctx.clip();

      const letterDelay = 18;
      letters.forEach((letter, li) => {
        const startTick = li * letterDelay;

        // Linhas
        letter.edges.forEach(([a, b], ei) => {
          const edgeTick = startTick + 8 + ei * 2;
          if (tick < edgeTick) return;
          const prog = Math.min((tick - edgeTick) / 14, 1);
          const pa = letter.pts[a], pb = letter.pts[b];
          const ax = cx + pa[0]*scale, ay = cy + pa[1]*scale;
          const bx = cx + pb[0]*scale, by = cy + pb[1]*scale;
          const ex = ax + (bx-ax)*prog, ey = ay + (by-ay)*prog;
          ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(ex,ey);
          ctx.strokeStyle = `rgba(80,40,0,${.65*prog})`;
          ctx.lineWidth = 2.2; ctx.lineCap='round'; ctx.stroke();
          // brilho dourado por cima
          ctx.strokeStyle = `rgba(255,200,60,${.5*prog})`;
          ctx.lineWidth = .8; ctx.stroke();
        });

        // Pontos
        letter.pts.forEach((pt, pi) => {
          const ptTick = startTick + pi * 3;
          if (tick < ptTick) return;
          const prog = Math.min((tick - ptTick) / 8, 1);
          const px = cx + pt[0]*scale, py = cy + pt[1]*scale;
          // halo
          const halo = ctx.createRadialGradient(px,py,0,px,py,7*prog);
          halo.addColorStop(0,`rgba(255,220,80,${.6*prog})`);
          halo.addColorStop(1,'rgba(255,180,40,0)');
          ctx.beginPath(); ctx.arc(px,py,7*prog,0,Math.PI*2);
          ctx.fillStyle=halo; ctx.fill();
          // ponto
          ctx.beginPath(); ctx.arc(px,py,2.4*prog,0,Math.PI*2);
          ctx.fillStyle=`rgba(255,240,180,${prog})`; ctx.fill();
        });
      });

      ctx.restore();

      tick++;
      if (tick <= TOTAL) {
        luaAnim = requestAnimationFrame(frame);
      } else {
        // Animação terminou
        const hint = document.getElementById('luaHint');
        if (hint) { hint.textContent = 'toque para continuar'; hint.style.opacity='1'; }
      }
    }
    luaAnim = requestAnimationFrame(frame);
  }

  // ─── CONTROLE DE FASES ───
  function showPhase(id) {
    ['luaGrow','luaName','luaEnd'].forEach(pid => {
      const el = document.getElementById(pid);
      if (!el) return;
      pid === id ? el.classList.remove('lua-hide') : el.classList.add('lua-hide');
      if (pid === id) void el.offsetWidth;
    });
  }

  function advance() {
    if (phase === 0) {
      phase = 1;
      if (moonPhaseAnim) { cancelAnimationFrame(moonPhaseAnim); moonPhaseAnim = null; }
      showPhase('luaName');
      setTimeout(drawMoonWithName, 100);
    } else if (phase === 1) {
      phase = 2;
      if (luaAnim) { cancelAnimationFrame(luaAnim); luaAnim = null; }
      document.getElementById('luaBtn').classList.add('lua-hide');
      setTimeout(() => showPhase('luaEnd'), 300);
    }
  }

})();

// ══════════════════════════════════════════
// SLIDE MAPA
// ══════════════════════════════════════════
(function () {

  const slide = document.querySelector('.slide-mapa');
  if (!slide) return;

  let ready = false, phase = 0, animId = null;

  new MutationObserver(() => {
  if (slide.classList.contains('active')) {
    if (!ready) { init(); }
    else { resetMapa(); }
  }
}).observe(slide, { attributes: true, attributeFilter: ['class'] });

  // ─── ESTRELAS CSS ───
  function createStars() {
    const c = document.getElementById('mpBgStars');
    if (!c || c.children.length) return;
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('div');
      s.className = 'mp-star';
      const sz = Math.random() * 1.8 + .4;
      s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${2+Math.random()*4}s;--delay:${Math.random()*6}s;--min-op:${(.04+Math.random()*.12).toFixed(2)};--max-op:${(.3+Math.random()*.5).toFixed(2)};`;
      c.appendChild(s);
    }
  }

  function init() {
    ready = true; phase = 0;
    createStars();
    showPhase('mpIntro');
    startIntroLines();
    document.getElementById('mpBtn').addEventListener('click', advance);
  }

  // ─── FASE 0 ───
  function startIntroLines() {
    [['mpL2',1100],['mpL3',2300],['mpL4',3600]].forEach(([id,delay]) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.classList.add('mp-line-show');
      }, delay);
    });
    setTimeout(() => {
      const btn = document.getElementById('mpBtn');
      if (btn) btn.style.opacity = '1';
    }, 10);
  }

  // ─── FASE 1: ANIMAÇÃO SVG ───
  function animateMap() {
    const svg = document.getElementById('mpSvg');
    if (!svg) return;

    // Coordenadas no viewBox 300x380 (geradas matematicamente das lat/lon reais)
    const ITAUNA = { x: 219.3, y: 240.9 };
    const SP     = { x: 204.6, y: 273.2 };
    const BH     = { x: 224.2, y: 239.3 };

    // Cidades — coordenadas SVG reais
    const cities = [
      [204.6,273.2], [224.2,239.3], [219.3,240.9], [229.2,267.5],
      [195.2,200.8], [263.2,173.6], [289.3,127.5], [263.2,87.1],
      [107.7,81.4],  [190.9,65.5],  [171.3,334.3], [185.1,291.0],
      [185.1,209.3], [146.7,244.0], [135.9,198.9], [283.5,143.5],
      [287.1,106.8], [232.1,100.2], [221.3,75.8],  [172.1,52.3],
      [102.6,26.0],  [79.5,135.0],  [190.9,311.7],
    ];

    const dotsG = document.getElementById('mpDots');
    dotsG.innerHTML = '';
    cities.forEach(([cx,cy]) => {
      const isNearItauna = Math.hypot(cx-ITAUNA.x, cy-ITAUNA.y) < 15;
      const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
      c.setAttribute('cx', cx);
      c.setAttribute('cy', cy);
      c.setAttribute('r', isNearItauna ? '2' : '1.2');
      c.setAttribute('fill', isNearItauna ? '#ff8fa3' : 'rgba(160,200,255,0.6)');
      c.setAttribute('class','mp-dot');
      c.style.cssText = `--dur:${1.5+Math.random()*3}s;--delay:${Math.random()*3}s;--min:${(.08+Math.random()*.15).toFixed(2)};--max:${(.4+Math.random()*.45).toFixed(2)};`;
      dotsG.appendChild(c);
    });

    const meet  = document.getElementById('mpMeetPoint');
    const dotA  = document.getElementById('mpDotA');
    const dotB  = document.getElementById('mpDotB');
    const lineA = document.getElementById('mpLineA');
    const lineB = document.getElementById('mpLineB');

    meet.setAttribute('opacity','0');
    dotA.setAttribute('opacity','0');
    dotB.setAttribute('opacity','0');

    const T_START  = 1000;
    const T_TRAVEL = 1000;
    const T_ARRIVE = 3500;

    let start = null;

    function lerp(a,b,t){ return a+(b-a)*t; }
    function ease(t){ return t<.5?2*t*t:-1+(4-2*t)*t; }

    function frame(ts) {
      if (!start) start = ts;
      const el = ts - start;

      if (el > T_START) {
        dotA.setAttribute('opacity','1');
        dotB.setAttribute('opacity','1');
      }

      if (el > T_START && el < T_ARRIVE) {
        const t = Math.min((el - T_START) / (T_ARRIVE - T_START - T_TRAVEL), 1);
        const e = ease(t);
        const ax = lerp(SP.x, ITAUNA.x, e);
        const ay = lerp(SP.y, ITAUNA.y, e);
        const bx = lerp(BH.x, ITAUNA.x, e);
        const by = lerp(BH.y, ITAUNA.y, e);
        dotA.setAttribute('cx',ax); dotA.setAttribute('cy',ay);
        dotB.setAttribute('cx',bx); dotB.setAttribute('cy',by);
        lineA.setAttribute('x2',ax); lineA.setAttribute('y2',ay);
        lineB.setAttribute('x2',bx); lineB.setAttribute('y2',by);
      }

      if (el >= T_ARRIVE) {
        dotA.setAttribute('opacity','0');
        dotB.setAttribute('opacity','0');
        lineA.setAttribute('x2', lineA.getAttribute('x1'));
        lineA.setAttribute('y2', lineA.getAttribute('y1'));
        lineB.setAttribute('x2', lineB.getAttribute('x1'));
        lineB.setAttribute('y2', lineB.getAttribute('y1'));
        meet.setAttribute('opacity','1');
        const btn = document.getElementById('mpBtn');
        if (btn) btn.style.opacity='1';
        cancelAnimationFrame(animId);
        return;
      }

      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);
  }

  function showPhase(id) {
    ['mpIntro','mpMap','mpEnd'].forEach(pid => {
      const el = document.getElementById(pid);
      if (!el) return;
      pid===id ? el.classList.remove('mp-hide') : el.classList.add('mp-hide');
      if (pid===id) void el.offsetWidth;
    });
  }

  function advance() {
    if (phase===0) {
      phase=1;
      document.getElementById('mpBtn').style.opacity='0';
      showPhase('mpMap');
      setTimeout(animateMap, 400);
    } else if (phase===1) {
      phase=2;
      if (animId) { cancelAnimationFrame(animId); animId=null; }
      document.getElementById('mpBtn').classList.add('mp-hide');
      setTimeout(()=>showPhase('mpEnd'),300);
    }
  }

})();

// ── SLIDE CONSTELAÇÃO ──
(function () {

  const slide = document.querySelector('.slide-const');
  if (!slide) return;

  // ─── Pontos que formam as letras D-U-D-A no canvas ───
  // Cada letra tem ~8-12 estrelas. Coordenadas em % (0..1) do canvas.
  // O desenho fica centralizado horizontalmente e posicionado
  // na metade superior do céu.

  const LETTERS = {
    D: [
      [.10,.28],[.10,.38],[.10,.48],[.10,.58],[.10,.68],
      [.13,.25],[.20,.26],[.24,.30],[.26,.35],[.26,.44],
      [.26,.53],[.24,.60],[.20,.65],[.13,.66]
    ],
    U: [
      [.32,.28],[.32,.38],[.32,.48],[.32,.58],[.32,.63],
      [.35,.68],[.40,.70],[.44,.68],[.47,.63],
      [.47,.28],[.47,.38],[.47,.48],[.47,.58]
    ],
    D2: [
      [.53,.28],[.53,.38],[.53,.48],[.53,.58],[.53,.68],
      [.56,.25],[.63,.26],[.67,.30],[.69,.35],[.69,.44],
      [.69,.53],[.67,.60],[.63,.65],[.56,.66]
    ],
    A: [
      [.76,.68],[.79,.58],[.82,.48],[.85,.38],[.88,.28],
      [.91,.38],[.93,.48],[.95,.58],[.98,.68],
      [.78,.52],[.96,.52]
    ]
  };

  // Junta todos em array com índice de letra para colorir diferente
  const ALL_POINTS = [];
  const LETTER_KEYS = ['D','U','D2','A'];
  LETTER_KEYS.forEach((k, li) => {
    LETTERS[k].forEach(([px, py]) => {
      ALL_POINTS.push({ px, py, li, x:0, y:0 });
    });
  });

  // Linhas de constelação (índices dentro de ALL_POINTS)
  // Geradas automaticamente: conecta pontos consecutivos dentro da mesma letra
  const LINES = [];
  let offset = 0;
  LETTER_KEYS.forEach(k => {
    const len = LETTERS[k].length;
    for (let i = 0; i < len - 1; i++) {
      LINES.push([offset + i, offset + i + 1]);
    }
    // fecha a letra D (última → primeira)
    if (k === 'D' || k === 'D2') {
      LINES.push([offset, offset + len - 1]);
    }
    offset += len;
  });

  let constPhase = 0;
  let constAnim  = null;
  let constInited = false;

  // ─── Inicialização disparada pelo update() principal ───
  function initConst() {
    if (constInited) return;
    constInited = true;
    runConstIntro();
  }

  // Registra para o update() central chamar quando chegar nesse slide
  const origUpdate = window._constHooked;
  if (!origUpdate) {
    window._constHooked = true;
    const _origUpdate = window.update;   // guarda referência
    // Adiciona gatilho no update existente via patch de slides observer
    const constSlideEl = slide;
    const observer = new MutationObserver(() => {
      if (constSlideEl.classList.contains('active')) {
        setTimeout(initConst, 400);
      }
    });
    observer.observe(constSlideEl, { attributes: true, attributeFilter: ['class'] });
  }

  // ─── Fase 0: texto intro com linhas aparecendo em sequência ───
  function runConstIntro() {
    showConstPhase('constIntro');
    const l2 = document.getElementById('cL2');
    const l3 = document.getElementById('cL3');
    const tap = document.getElementById('constTap');

    setTimeout(() => { l2 && l2.classList.add('const-show'); }, 1200);
    setTimeout(() => { l3 && l3.classList.add('const-show'); }, 2400);
    setTimeout(() => {
      if (tap) { tap.style.transition = 'opacity .6s ease'; tap.style.opacity = '1'; }
    }, 3400);
  }

  // ─── Avança fases ao clicar no botão ───
  const btn = document.getElementById('constBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (constPhase === 0) {
        constPhase = 1;
        showConstPhase('constMap');
        drawConstellation();
      } else if (constPhase === 1) {
        constPhase = 2;
        if (constAnim) { cancelAnimationFrame(constAnim); constAnim = null; }
        btn.classList.add('const-hide');
        setTimeout(() => showConstPhase('constEnd'), 300);
      }
    });
  }

  // ─── Desenha a constelação no canvas ───
  function drawConstellation() {
    const canvas = document.getElementById('constCanvas');
    if (!canvas) return;

    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d');

    // Resolve coordenadas reais — letras ficam centradas verticalmente
    // na faixa y: 20%..75% e ocupam largura total com margem
    const marginX = W * .04;
    const yTop    = H * .18;
    const yBot    = H * .72;
    const xRange  = W - marginX * 2;
    const yRange  = yBot - yTop;

    ALL_POINTS.forEach(p => {
      p.x = marginX + p.px * xRange;
      p.y = yTop    + p.py * yRange;
    });

    // Estrelas de fundo (geradas 1x)
    const BG_STARS = Array.from({ length: 200 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.2 + .3,
      a:  Math.random(),
      ph: Math.random() * Math.PI * 2,
      sp: .008 + Math.random() * .015
    }));

    // Lua
    const moonX = W * .78;
    const moonY = H * .18;
    const moonR = Math.min(W, H) * .085;

    // Animação por tick
    let tick = 0;
    const REVEAL_START = 40;  // tick em que as estrelas começam a aparecer
    const REVEAL_EACH  = 6;   // ticks entre cada estrela
    const LINE_DELAY   = ALL_POINTS.length * REVEAL_EACH + REVEAL_START + 20;
    const DONE_TICK    = LINE_DELAY + LINES.length * 4 + 60;

    function frame() {
      ctx.clearRect(0, 0, W, H);

      // ── fundo: estrelas ──
      BG_STARS.forEach(s => {
        const a = s.a * (.4 + .6 * Math.sin(tick * s.sp + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });

      // ── lua ──
      const moonGrad = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR);
      moonGrad.addColorStop(0,   'rgba(255,248,220,.18)');
      moonGrad.addColorStop(.7,  'rgba(255,240,180,.08)');
      moonGrad.addColorStop(1,   'rgba(255,220,120,0)');
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();
      // borda lunar
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * .72, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,245,200,.28)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── estrelas da constelação ──
      const revealed = Math.max(0, Math.floor((tick - REVEAL_START) / REVEAL_EACH));

      for (let i = 0; i < Math.min(revealed, ALL_POINTS.length); i++) {
        const p = ALL_POINTS[i];
        const age  = tick - (REVEAL_START + i * REVEAL_EACH);
        const prog = Math.min(age / 20, 1);               // 0→1 nos primeiros 20 ticks
        const pulse = .7 + .3 * Math.sin(tick * .08 + i);

        // halo exterior
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10 * prog * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,77,109,${.12 * prog * pulse})`;
        ctx.fill();

        // estrela
        ctx.beginPath();
        ctx.arc(p.x, p.y, (3 + prog * 2) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,230,200,${prog})`;
        ctx.fill();

        // brilho central branco
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${prog})`;
        ctx.fill();
      }

      // ── linhas da constelação ──
      if (tick >= LINE_DELAY) {
        const linesRevealed = Math.floor((tick - LINE_DELAY) / 4);
        for (let li = 0; li < Math.min(linesRevealed, LINES.length); li++) {
          const [ai, bi] = LINES[li];
          const a = ALL_POINTS[ai];
          const b = ALL_POINTS[bi];
          const lineAge  = tick - (LINE_DELAY + li * 4);
          const lineProg = Math.min(lineAge / 16, 1);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(
            a.x + (b.x - a.x) * lineProg,
            a.y + (b.y - a.y) * lineProg
          );
          ctx.strokeStyle = `rgba(255,180,150,${.35 * lineProg})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // ── hint: mostra quando termina ──
      if (tick >= DONE_TICK) {
        const hint = document.getElementById('constHint');
        if (hint && hint.style.opacity !== '0') {
          hint.style.transition = 'opacity .6s ease';
          hint.style.opacity = '0';
        }
        // botão some para avançar para fase 2
        if (btn && !btn._constReady) {
          btn._constReady = true;
          btn.style.opacity = '1';
        }
      }

      tick++;
      constAnim = requestAnimationFrame(frame);
    }

    constAnim = requestAnimationFrame(frame);
  }

  // ─── Utilitário de fases ───
  function showConstPhase(id) {
    ['constIntro','constMap','constEnd'].forEach(pid => {
      const el = document.getElementById(pid);
      if (!el) return;
      if (pid === id) {
        el.classList.remove('const-hide');
        void el.offsetWidth;
      } else {
        el.classList.add('const-hide');
      }
    });
  }

})();

// ── INICIALIZAÇÃO ──
update(true);

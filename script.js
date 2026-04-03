// ── ELEMENTOS ──
const slider      = document.getElementById('slider');
const slides      = document.querySelectorAll('.slide');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress');

let currentSlide = parseInt(sessionStorage.getItem('capituloSalvo')) || 0;

// ── ATUALIZAÇÃO CENTRAL ──
function update() {
  sessionStorage.setItem('capituloSalvo', currentSlide);
  slider.style.transform = `translateX(-${currentSlide * 100}vw)`;

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
  animateValue('count-hours', 0, days * 24, 2000);
}

function animateValue(id, start, end, duration) {
  const el = document.getElementById(id);
  if (!el || el.dataset.animated) return;
  el.dataset.animated = 'true';
  let t0 = null;
  const step = ts => {
    if (!t0) t0 = ts;
    const p = Math.min((ts - t0) / duration, 1);
    el.textContent = Math.floor(p * (end - start) + start).toLocaleString();
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

// ── INICIALIZAÇÃO ──
update();

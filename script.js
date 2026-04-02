// 1. SELEÇÃO DE ELEMENTOS
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress');

// Tenta carregar o slide salvo. Se não houver, começa do 0.
let currentSlide = parseInt(localStorage.getItem('capituloSalvo')) || 0;

// 2. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
function update() {
    // Salva a posição atual no navegador para não perder ao atualizar
    localStorage.setItem('capituloSalvo', currentSlide);

    // Move o carrossel
    slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
    
    // Gerencia a classe 'active' para as animações de escala e opacidade
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Atualiza estado dos botões
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;

    // Atualiza barra de progresso
    const progress = (currentSlide / (slides.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // Dispara animação de números no slide 1
    if (currentSlide === 1) {
        setTimeout(animateCounters, 600);
    }
}

// 3. FUNÇÕES DE NAVEGAÇÃO
function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        update();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        update();
    }
}

function avancarPeloCoracao() {
    nextSlide();
}

// 4. EVENTOS (CLIQUE, TECLADO, SWIPE)
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// Suporte para deslizar o dedo no celular
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, {passive: true});

document.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    const swipeDistance = touchstartX - touchendX;
    if (swipeDistance > 50) nextSlide();
    if (swipeDistance < -50) prevSlide();
}, {passive: true});

// 5. LÓGICA DO CONTADOR
function animateCounters() {
    const dataInicio = new Date("2023-06-24");
    const hoje = new Date();
    const diffEmMs = hoje - dataInicio;
    const diasTotal = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));
    const horasTotal = diasTotal * 24;

    animateValue("count-days", 0, diasTotal, 2000);
    animateValue("count-hours", 0, horasTotal, 2000);
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj || obj.dataset.animated === "true") return; 
    
    obj.dataset.animated = "true";
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// 6. INICIALIZAÇÃO
update();

function update() {
    localStorage.setItem('capituloSalvo', currentSlide);
    slider.style.transform = `translateX(-${currentSlide * 100}vw)`;
    
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === slides.length - 1;
    const progress = (currentSlide / (slides.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // Contador da página 2
    if (currentSlide === 1) {
        setTimeout(animateCounters, 600);
    }
    
    // NOVO: Inicia a raspadinha se a tela atual tiver uma (evita carregar antes da hora)
    if (slides[currentSlide].querySelector('#scratchCanvas')) {
        setTimeout(initScratch, 600);
    }
    
    // COLE ISSO AQUI:
    if (slides[currentSlide].querySelector('#loveChart')) {
        setTimeout(initLoveChart, 600);
    }
    
}

// --- LÓGICA DA RASPADINHA PRO ---
let isScratching = false;
let scratchInitialized = false;

function initScratch() {
    const canvas = document.getElementById('scratchCanvas');
    const container = document.getElementById('scratch-wrapper');
    if (!canvas || !container || scratchInitialized) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Ajusta o tamanho do canvas para o tamanho exato da div
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Pinta a camada por cima (cor sólida)
    ctx.fillStyle = '#b3b3b3'; // Um cinza elegante
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Adiciona um texto por cima da tinta
    ctx.font = '20px Segoe UI';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Raspe aqui', canvas.width / 2, canvas.height / 2);

    // Função que "apaga" a tinta
    function scratch(e) {
        if (!isScratching) return;
        
        // Evita que a tela role no celular enquanto raspa
        e.preventDefault(); 

        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        // "Apaga" fazendo um círculo transparente
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2); // 25 é a grossura do "dedo"
        ctx.fill();

        checkReveal();
    }

    // Função PRO: Checa se já raspou 50%
    // Usamos um throttle básico (pulando alguns pixels) para não travar o celular
    function checkReveal() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        
        // Pula de 4 em 4 para checar só o canal Alpha (transparência)
        for (let i = 3; i < pixels.length; i += 16) { 
            if (pixels[i] === 0) transparentPixels++;
        }

        const totalCheckedPixels = pixels.length / 16;
        const percentScratched = (transparentPixels / totalCheckedPixels) * 100;

        // Se raspou 40% a 50%, revela o resto!
        if (percentScratched > 45) {
            container.classList.add('scratch-revealed');
            document.getElementById('scratch-text').innerHTML = "O dinossauro mais lindo que eu já vi na vida. Te amo minha lindona! ❤️";
            isScratching = false; // Para de calcular
        }
    }

    // Eventos de Mouse (PC)
    canvas.addEventListener('mousedown', () => isScratching = true);
    canvas.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', scratch);

    // Eventos de Toque (Celular)
    canvas.addEventListener('touchstart', (e) => {
        isScratching = true;
        scratch(e); // Já pinta no primeiro toque
    }, {passive: false});
    canvas.addEventListener('touchend', () => isScratching = false);
    canvas.addEventListener('touchmove', scratch, {passive: false});

    scratchInitialized = true;
}

let myLoveChart = null;

function initLoveChart() {
    const ctx = document.getElementById('loveChart');
    if (!ctx || myLoveChart) return; 

    myLoveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['26/05/2023', '24/06/2023', '24/06/2024', '24/06/2026', 'Futuro'],
            datasets: [{
                label: 'Nível de Felicidade',
                data: [30, 60, 85, 100, 140], 
                borderColor: '#ff4d6d',
                backgroundColor: 'rgba(255, 77, 109, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 4,
                pointRadius: 6,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { display: false, beginAtZero: true },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const msgs = [
                                "O começo de tudo! ❤️",
                                "O dia que eu te pedi em namoro!",
                                "A certeza de que era você.",
                                "Obrigado por ser tão boa pra mim!",
                                "A gente vai casar e nossa família vai crescer..."
                            ];
                            return msgs[context.dataIndex];
                        }
                    }
                }
            }
        }
    });
}
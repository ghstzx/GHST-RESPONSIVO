// 1. SELEÇÃO DE ELEMENTOS
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progress');

let currentSlide = parseInt(sessionStorage.getItem('capituloSalvo')) || 0;

// 2. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO (única e definitiva)
function update() {
    sessionStorage.setItem('capituloSalvo', currentSlide);
    slider.style.transform = `translateX(-${currentSlide * 100}vw)`;

    slides.forEach((slide, index) => {
        index === currentSlide ? slide.classList.add('active') : slide.classList.remove('active');
    });

    // Esconde as setas nos slides 0 e 1
if (currentSlide === 0 || currentSlide === 1) {
    prevBtn.style.visibility = 'hidden';
    nextBtn.style.visibility = 'hidden';
    prevBtn.style.pointerEvents = 'none';
    nextBtn.style.pointerEvents = 'none';
} else {
    prevBtn.style.visibility = 'visible';
    nextBtn.style.visibility = 'visible';
    prevBtn.style.pointerEvents = 'auto';
    nextBtn.style.pointerEvents = 'auto';
    prevBtn.disabled = false;
    nextBtn.disabled = currentSlide === slides.length - 1;
    nextBtn.disabled = currentSlide === slides.length - 1;
}

    // Barra de progresso
    const progress = (currentSlide / (slides.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;

    // Efeitos especiais por slide
    if (currentSlide === 1) {
        setTimeout(animateCounters, 600);
    }
    if (slides[currentSlide].querySelector('#scratchCanvas')) {
        setTimeout(initScratch, 600);
    }
    if (slides[currentSlide].querySelector('#loveChart')) {
        setTimeout(initLoveChart, 600);
    }
}

// 3. NAVEGAÇÃO
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

// 4. EVENTOS
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
});

// 5. CONTADOR
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

// 6. RASPADINHA
let isScratching = false;
let scratchInitialized = false;

function initScratch() {
    const canvas = document.getElementById('scratchCanvas');
    const container = document.getElementById('scratch-wrapper');
    if (!canvas || !container || scratchInitialized) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    ctx.fillStyle = '#b3b3b3';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Segoe UI';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Raspe aqui', canvas.width / 2, canvas.height / 2);

    function scratch(e) {
        if (!isScratching) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();
        checkReveal();
    }

    function checkReveal() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;
        for (let i = 3; i < pixels.length; i += 16) {
            if (pixels[i] === 0) transparentPixels++;
        }
        const totalCheckedPixels = pixels.length / 16;
        const percentScratched = (transparentPixels / totalCheckedPixels) * 100;
        if (percentScratched > 45) {
            container.classList.add('scratch-revealed');
            document.getElementById('scratch-text').innerHTML = "O dinossauro mais lindo que eu já vi na vida. Te amo minha lindona! ❤️";
            isScratching = false;
        }
    }

    canvas.addEventListener('mousedown', () => isScratching = true);
    canvas.addEventListener('mouseup', () => isScratching = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchend', () => isScratching = false);
    canvas.addEventListener('touchmove', scratch, { passive: false });
    container.classList.add('scratch-ready');
    scratchInitialized = true;
}

// 7. GRÁFICO
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

// 8. PARTÍCULAS
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const heartSymbols = ['❤️', '✨', '🌸', '💕'];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
        particle.style.fontSize = (Math.random() * 15 + 10) + 'px';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

window.addEventListener('load', createParticles);

// 9. INICIALIZAÇÃO
update();
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to');
if (guestName) {
    const guestNameEl = document.getElementById('guest-name');
    if (guestNameEl) guestNameEl.innerText = guestName;
}

const invVideo = document.getElementById('invitationVideo');
const bgVideo = document.querySelector('.cover-bg-video');

if (invVideo) { 
    invVideo.playbackRate = 0.75; 
}

const coverPageElement = document.getElementById('cover-page');
let lastTrailTime = 0; 

function createTrail(x, y) {
    if (!coverPageElement) return;
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    let size = Math.random() * 4 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    coverPageElement.appendChild(particle);
    setTimeout(() => { particle.remove(); }, 800);
}

if (coverPageElement) {
    coverPageElement.addEventListener('mousemove', e => {
        let now = Date.now();
        if (now - lastTrailTime > 40 && Math.random() > 0.4) {
            createTrail(e.clientX, e.clientY);
            lastTrailTime = now;
        }
    });

    coverPageElement.addEventListener('touchmove', e => {
        let now = Date.now();
        if (e.touches.length > 0 && now - lastTrailTime > 60 && Math.random() > 0.3) {
            createTrail(e.touches[0].clientX, e.touches[0].clientY);
            lastTrailTime = now;
        }
    }, { passive: true });
}

function openInvitation() {
    const bookScene = document.getElementById('book');
    const coverPage = document.getElementById('cover-page');
    const audio = document.getElementById('bgMusic');
    const guestBox = document.getElementById('guestBox');
    const frameContainer = document.querySelector('.inside-video-frame');
    const watermark = document.querySelector('.watermark');
    
    if (!bookScene || bookScene.classList.contains('is-open')) return;

    // 1. TAHAP PERTAMA: Buka Buku (Animasi CSS berdurasi 1 detik)
    bookScene.classList.add('is-open');
    bookScene.onclick = null; 
    
    if (guestBox) guestBox.style.opacity = '0';
    const frontContent = document.querySelector('.front-content');
    if (frontContent) frontContent.style.opacity = '0';

    // Jeda video background agar tidak lag saat transisi
    if (bgVideo) bgVideo.pause();

    if (invVideo) {
        invVideo.play().catch(e => console.log("Autoplay dicegah browser", e));
    }

    if (audio) {
        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.addEventListener('click', () => audio.play(), { once: true });
            });
        }
    }

    let isIframeLoaded = false;
    let sequenceTimeout1, sequenceTimeout2;

    const loadIframeSPA = (e) => {
        if (e && e.type === 'touchstart') e.preventDefault(); 
        if(isIframeLoaded) return;
        isIframeLoaded = true;

        clearTimeout(sequenceTimeout1);
        clearTimeout(sequenceTimeout2);

        // Hilangkan watermark secara permanen di tahap ini
        if (watermark) watermark.style.display = 'none';

        let iframe = document.createElement('iframe');
        const params = new URLSearchParams(window.location.search);
        params.set('spa', '1');
        iframe.src = 'undangan.html?' + params.toString();
        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.zIndex = '9999998'; 
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 1.2s ease';
        document.body.appendChild(iframe);

        iframe.onload = () => {
            iframe.style.opacity = '1';
            setTimeout(() => {
                if(frameContainer) frameContainer.style.opacity = '0';
                if (coverPage) coverPage.style.opacity = '0';
                
                setTimeout(() => {
                    // --- PERBAIKAN RAM SUPER KETAT ---
                    // Matikan video sepenuhnya ke akar untuk melegakan RAM HP
                    if(invVideo) { 
                        invVideo.pause(); 
                        invVideo.removeAttribute('src'); 
                        invVideo.load(); 
                    }
                    if(bgVideo) { 
                        bgVideo.pause(); 
                        bgVideo.removeAttribute('src'); 
                        bgVideo.load(); 
                    }
                    // ---------------------------------

                    if(frameContainer) frameContainer.remove();
                    if (coverPage) coverPage.remove();
                    iframe.style.zIndex = '1'; 
                }, 1200);
            }, 500);
        };
    };

    const skipAction = (e) => {
        loadIframeSPA(e);
    };

    // TAHAP KEDUA: Buka buku (1 detik) + Diam di buku (1 detik) = Total 2 detik
    sequenceTimeout1 = setTimeout(() => {
        if (!frameContainer) return;
        
        document.body.appendChild(frameContainer);
        frameContainer.classList.add('fullscreen-mode');

        const dateArabic = document.querySelector('.inside-date-arabic');
        if (dateArabic) dateArabic.style.display = 'none';

        if (coverPage) coverPage.style.display = 'none';

        frameContainer.style.cursor = 'pointer';
        frameContainer.addEventListener('click', skipAction);
        frameContainer.addEventListener('touchstart', skipAction, {passive: false});

        // TAHAP KETIGA: Setelah video berjalan tanpa buku 1 detik, load undangan
        sequenceTimeout2 = setTimeout(() => {
            if(!isIframeLoaded) loadIframeSPA();
        }, 1000); 

    }, 2000); 
}

window.addEventListener('message', (event) => {
    if (event.data === 'toggleMusic') {
        const audio = document.getElementById('bgMusic');
        if (audio) {
            if (audio.paused) { audio.play(); } 
            else { audio.pause(); }
        }
    }
});
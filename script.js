/**
 * =========================================================
 * SCRIPT UNTUK HALAMAN SAMPUL (index.html)
 * =========================================================
 */

// ---------------------------------------------------------
// 1. MENANGKAP PARAMETER URL (Nama Tamu)
// ---------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to');
if (guestName) {
    const guestNameEl = document.getElementById('guest-name');
    if (guestNameEl) guestNameEl.innerText = guestName;
}

// Pengaturan kecepatan putar video
const invVideo = document.getElementById('invitationVideo');
if (invVideo) { 
    invVideo.playbackRate = 0.75; 
}

// ---------------------------------------------------------
// 2. EFEK VISUAL (Bintang & Meteor)
// ---------------------------------------------------------
function createStars() {
    const container = document.getElementById('stars-container');
    if (!container) return; 
    
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
        let star = document.createElement('div');
        star.classList.add('star');
        
        let size = Math.random() * 14 + 6;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        star.style.setProperty('--duration', `${Math.random() * 1.5 + 1.2}s`);
        star.style.setProperty('--max-opacity', `${Math.random() * 0.8 + 0.2}`);
        star.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(star);
    }
}

function createMeteors() {
    const container = document.getElementById('meteors-container');
    if (!container) return;

    const meteorCount = 6;
    for (let i = 0; i < meteorCount; i++) {
        let meteor = document.createElement('div');
        meteor.classList.add('meteor');
        meteor.style.left = `${Math.random() * 150}vw`;
        meteor.style.top = `-${Math.random() * 50}vh`;
        meteor.style.setProperty('--duration', `${Math.random() * 2 + 2}s`);
        meteor.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(meteor);
    }
}

createStars();
createMeteors();

// ---------------------------------------------------------
// 3. EFEK INTERAKSI KURSOR (Jejak Bintang)
// ---------------------------------------------------------
const coverPageElement = document.getElementById('cover-page');

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
        if (Math.random() > 0.4) createTrail(e.clientX, e.clientY);
    });

    coverPageElement.addEventListener('touchmove', e => {
        if (e.touches.length > 0 && Math.random() > 0.3) {
            createTrail(e.touches[0].clientX, e.touches[0].clientY);
        }
    });
}

// ---------------------------------------------------------
// 4. LOGIKA UTAMA: ANIMASI BUKU & PINDAH HALAMAN
// ---------------------------------------------------------
function openInvitation() {
    const bookScene = document.getElementById('book');
    const coverPage = document.getElementById('cover-page');
    const audio = document.getElementById('bgMusic');
    const guestBox = document.getElementById('guestBox');
    
    if (!bookScene) return;

    // Mulai animasi buka buku
    bookScene.classList.add('is-open');
    bookScene.style.pointerEvents = 'none';

    // Sembunyikan elemen teks cover
    if (guestBox) guestBox.style.opacity = '0';
    const frontContent = document.querySelector('.front-content');
    if (frontContent) { frontContent.style.opacity = '0'; }

    // Putar musik saat di-klik
    if (audio) {
        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                document.addEventListener('click', () => audio.play(), { once: true });
            });
        }
    }

    // FASE 1: Tunggu 3.5 Detik (Proses buka buku & putar video di dalam)
    setTimeout(() => {
        const frameContainer = document.querySelector('.inside-video-frame');
        const pagesBlock = document.querySelector('.pages-block');
        
        // --- MENGHILANGKAN BACKGROUND SAAT VIDEO MEMBESAR ---
        const moon = document.querySelector('.glowing-moon');
        const stars = document.getElementById('stars-container');
        const meteors = document.getElementById('meteors-container');
        
        if (moon) moon.style.display = 'none';
        if (stars) stars.style.display = 'none';
        if (meteors) meteors.style.display = 'none';
        // Desain by Muhammad Amar tidak di-hide (watermark dihapus dari list display none)
        // ----------------------------------------------------

        if (!frameContainer) return;
        const rect = frameContainer.getBoundingClientRect();
        
        // Lepaskan elemen dari batasan 3D agar bisa di-fullscreen
        if (coverPage) coverPage.style.perspective = 'none';
        bookScene.style.transform = 'none';
        bookScene.style.transformStyle = 'flat';
        bookScene.style.animation = 'none';
        bookScene.style.filter = 'none';
        
        if (pagesBlock) {
            pagesBlock.style.transform = 'none';
            pagesBlock.style.overflow = 'visible';
            pagesBlock.style.boxShadow = 'none';
            pagesBlock.style.background = 'transparent';
        }

        // Sembunyikan semua part buku kecuali video
        document.querySelectorAll('.page, .hardcover-front, .hardcover-back, .book-spine, .monogram-overlay, .inside-date-arabic').forEach(p => {
            if(p) p.style.display = 'none';
        });
        
        // Kunci posisi video sebelum dibesarkan
        frameContainer.style.position = 'fixed';
        frameContainer.style.margin = '0';
        frameContainer.style.top = rect.top + 'px';
        frameContainer.style.left = rect.left + 'px';
        frameContainer.style.width = rect.width + 'px';
        frameContainer.style.height = rect.height + 'px';
        frameContainer.style.zIndex = '999999';
        frameContainer.style.backgroundColor = '#050505';
        
        if (invVideo) invVideo.style.objectFit = 'contain';
        void frameContainer.offsetWidth; 
        
        // FASE 2: Membesar ke layar penuh selama 0.8 Detik
        frameContainer.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        frameContainer.style.top = '0px';
        frameContainer.style.left = '0px';
        frameContainer.style.width = '100vw';
        frameContainer.style.height = '100vh';
        
        // FASE 3: Redirect ke halaman isi undangan setelah 3.5 detik membesar
        setTimeout(() => {
            // --- FITUR LANJUTKAN MUSIK ---
            if (audio) {
                sessionStorage.setItem('savedMusicTime', audio.currentTime);
                sessionStorage.setItem('isMusicPlaying', !audio.paused);
            }
            // -----------------------------

            const queryString = window.location.search; 
            window.location.href = 'undangan.html' + queryString;
        }, 3500);

    }, 3500); // Penyesuaian waktu durasi buku terbuka menjadi 3.5 detik
}
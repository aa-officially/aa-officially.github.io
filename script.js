/**
 * =========================================================
 * SCRIPT UNTUK HALAMAN SAMPUL (index.html)
 * REVISI: Animasi 1 detik & Performa HP (Anti Patah-Patah)
 * =========================================================
 */

// 1. MENANGKAP PARAMETER URL (Nama Tamu)
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

// 2. EFEK INTERAKSI KURSOR (Jejak Bintang Hover)
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

// 3. LOGIKA UTAMA: ANIMASI BUKU & PINDAH HALAMAN
function openInvitation() {
    const bookScene = document.getElementById('book');
    const coverPage = document.getElementById('cover-page');
    const audio = document.getElementById('bgMusic');
    const guestBox = document.getElementById('guestBox');
    const frameContainer = document.querySelector('.inside-video-frame');
    
    // Cegah double klik
    if (!bookScene || bookScene.classList.contains('is-open')) return;

    bookScene.classList.add('is-open');
    bookScene.onclick = null; 
    
    if (guestBox) guestBox.style.opacity = '0';
    const frontContent = document.querySelector('.front-content');
    if (frontContent) { frontContent.style.opacity = '0'; }

    // Paksa video putar
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

    // Variabel dan Fungsi untuk memuat undangan
    let isIframeLoaded = false;
    const loadIframeSPA = (e) => {
        if (e && e.type === 'touchstart') e.preventDefault(); 
        if(isIframeLoaded) return;
        isIframeLoaded = true;

        const iframe = document.createElement('iframe');
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
                    if(frameContainer) frameContainer.remove();
                    if (coverPage) coverPage.remove();
                    iframe.style.zIndex = '1'; 
                }, 1200);
            }, 500); // Dipercepat agar memori HP segera terbebas
        };
    };

    if (frameContainer) {
        frameContainer.style.cursor = 'pointer';
        frameContainer.addEventListener('click', loadIframeSPA);
        frameContainer.addEventListener('touchstart', loadIframeSPA, {passive: false});
    }

    // TAHAP 1: Tunggu 1 DETIK sampai animasi cover buku selesai (sesuai revisi CSS)
    setTimeout(() => {
        if(isIframeLoaded) return; 

        if (!frameContainer) return;
        
        // REVISI ANTI PATAH-PATAH: 
        // Hapus perhitungan bounding client rect dan set interval transisi CSS.
        // Langsung jadikan iframe full screen dengan opacity untuk GPU yang lebih ringan.
        document.body.appendChild(frameContainer);
        
        frameContainer.style.position = 'fixed';
        frameContainer.style.margin = '0';
        frameContainer.style.padding = '0';
        frameContainer.style.top = '0px';
        frameContainer.style.left = '0px';
        frameContainer.style.width = '100vw';
        frameContainer.style.height = window.innerHeight + 'px'; 
        frameContainer.style.zIndex = '999999';
        frameContainer.style.backgroundColor = '#050505';
        frameContainer.style.borderRadius = '0px';
        
        if (invVideo) {
            invVideo.style.position = 'absolute';
            invVideo.style.top = '0';
            invVideo.style.left = '0';
            invVideo.style.width = '100%';
            invVideo.style.height = '100%';
            invVideo.style.objectFit = 'cover'; 
            invVideo.style.borderRadius = '0px';
        }

        const dateArabic = document.querySelector('.inside-date-arabic');
        if (dateArabic) dateArabic.style.display = 'none';

        const watermark = document.querySelector('.watermark');
        if (watermark) {
            document.body.appendChild(watermark);
            watermark.style.position = 'fixed';
            watermark.style.zIndex = '9999999';
        }

        // Matikan efek 3D buku untuk melegakan memori HP
        if (coverPage) {
            coverPage.style.display = 'none'; 
        }

        // TAHAP 2: Auto Load Undangan
        setTimeout(() => {
            if(!isIframeLoaded) loadIframeSPA();
        }, 300);

    }, 1000); // <-- JEDA 1 DETIK MENUNGGU BUKU TERBUKA
}

// Komunikasi kontrol musik
window.addEventListener('message', (event) => {
    if (event.data === 'toggleMusic') {
        const audio = document.getElementById('bgMusic');
        if (audio) {
            if (audio.paused) { audio.play(); } 
            else { audio.pause(); }
        }
    }
});
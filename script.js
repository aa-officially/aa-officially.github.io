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
// 2. EFEK INTERAKSI KURSOR (Jejak Bintang Hover)
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// 3. LOGIKA UTAMA: ANIMASI BUKU & PINDAH HALAMAN (SPA IFRAME)
// ---------------------------------------------------------
function openInvitation() {
    const bookScene = document.getElementById('book');
    const coverPage = document.getElementById('cover-page');
    const audio = document.getElementById('bgMusic');
    const guestBox = document.getElementById('guestBox');
    
    if (!bookScene) return;

    bookScene.classList.add('is-open');
    bookScene.style.pointerEvents = 'none';

    if (guestBox) guestBox.style.opacity = '0';
    const frontContent = document.querySelector('.front-content');
    if (frontContent) { frontContent.style.opacity = '0'; }

    if (audio) {
        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                document.addEventListener('click', () => audio.play(), { once: true });
            });
        }
    }

    setTimeout(() => {
        const frameContainer = document.querySelector('.inside-video-frame');
        const pagesBlock = document.querySelector('.pages-block');
        
        if (!frameContainer) return;
        const rect = frameContainer.getBoundingClientRect();
        
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

        // PERBAIKAN: .inside-date-arabic DIHAPUS DARI DAFTAR AGAR TIDAK MENGHILANG
        document.querySelectorAll('.page, .hardcover-front, .hardcover-back, .book-spine, .monogram-overlay').forEach(p => {
            if(p) p.style.display = 'none';
        });
        
        document.body.appendChild(frameContainer);
        
        frameContainer.style.position = 'fixed';
        frameContainer.style.margin = '0';
        frameContainer.style.padding = '0';
        frameContainer.style.borderRadius = '0'; 
        frameContainer.style.top = rect.top + 'px';
        frameContainer.style.left = rect.left + 'px';
        frameContainer.style.width = rect.width + 'px';
        frameContainer.style.height = rect.height + 'px';
        frameContainer.style.zIndex = '999999';
        frameContainer.style.backgroundColor = '#050505';
        
        if (invVideo) {
            invVideo.style.position = 'absolute';
            invVideo.style.top = '0';
            invVideo.style.left = '0';
            invVideo.style.width = '100%';
            invVideo.style.height = '100%';
            invVideo.style.objectFit = 'cover'; 
            invVideo.style.borderRadius = '0';
        }

        // PERBAIKAN: Atur teks tanggal arab ke atas sedikit agar tetap aman di mode full video
        const dateArabic = document.querySelector('.inside-date-arabic');
        if (dateArabic) {
            dateArabic.style.bottom = '75px'; 
            dateArabic.style.zIndex = '9999999';
        }

        // PERBAIKAN: Pindahkan watermark ke body dengan z-index absolut agar terus menempel
        const watermark = document.querySelector('.watermark');
        if (watermark) {
            document.body.appendChild(watermark);
            watermark.style.position = 'fixed';
            watermark.style.zIndex = '9999999';
        }

        void frameContainer.offsetWidth; 
        
        frameContainer.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        frameContainer.style.top = '0px';
        frameContainer.style.left = '0px';
        frameContainer.style.width = '100vw';
        frameContainer.style.height = window.innerHeight + 'px'; 
        
        // METODE SPA: Memuat isi undangan via Iframe agar Music Index.html tidak terpotong sama sekali
        setTimeout(() => {
            const iframe = document.createElement('iframe');
            const params = new URLSearchParams(window.location.search);
            params.set('spa', '1'); // Penanda mode tanpa jeda
            
            iframe.src = 'undangan.html?' + params.toString();
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            iframe.style.zIndex = '9999998'; // Di bawah layer video agar fade-in mulus
            iframe.style.opacity = '0';
            iframe.style.transition = 'opacity 1.2s ease';
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.style.opacity = '1';
                
                // Menghilangkan elemen transisi (Tanggal, Watermark, & Frame Video) secara berlahan
                setTimeout(() => {
                    frameContainer.style.opacity = '0';
                    if (coverPage) coverPage.style.opacity = '0';
                    if (watermark) watermark.style.opacity = '0';
                    if (dateArabic) dateArabic.style.opacity = '0';
                    
                    setTimeout(() => {
                        frameContainer.remove();
                        if (coverPage) coverPage.remove();
                        if (watermark) watermark.remove();
                        if (dateArabic) dateArabic.remove();
                        
                        iframe.style.zIndex = '1'; // Reset z-index agar web bisa diklik
                    }, 1200);
                }, 800);
            };
        }, 2000); 

    }, 3500); 
}

// Komunikasi kontrol musik dari Undangan.html ke Index.html
window.addEventListener('message', (event) => {
    if (event.data === 'toggleMusic') {
        const audio = document.getElementById('bgMusic');
        if (audio) {
            if (audio.paused) { audio.play(); } 
            else { audio.pause(); }
        }
    }
});
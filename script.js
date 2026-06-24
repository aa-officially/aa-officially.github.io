const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to');
if (guestName) {
    const guestNameEl = document.getElementById('guest-name');
    if (guestNameEl) guestNameEl.innerText = guestName;
}

const invVideo = document.getElementById('invitationVideo');
const bgVideo = document.querySelector('.cover-bg-video');
if (invVideo) { invVideo.playbackRate = 0.75; }

function openInvitation() {
    const bookScene = document.getElementById('book');
    const coverPage = document.getElementById('cover-page');
    const audio = document.getElementById('bgMusic');
    const guestBox = document.getElementById('guestBox');
    const frameContainer = document.querySelector('.inside-video-frame');
    const watermark = document.querySelector('.watermark');
    
    if (!bookScene || bookScene.classList.contains('is-open')) return;

    bookScene.classList.add('is-open');
    bookScene.onclick = null; 
    
    if (guestBox) guestBox.style.opacity = '0';
    const frontContent = document.querySelector('.front-content');
    if (frontContent) frontContent.style.opacity = '0';
    if (watermark) watermark.style.opacity = '0';

    if (bgVideo) bgVideo.pause();

    if (invVideo) {
        invVideo.play().catch(e => console.log("Autoplay ditangguhkan", e));
    }

    if (audio) {
        let playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => { document.addEventListener('click', () => audio.play(), { once: true }); });
        }
    }

    let isIframeLoaded = false;
    let isSkipped = false;
    let seq1, seq2;

    const loadIframeSPA = (e) => {
        if (e && e.type === 'touchstart') e.preventDefault(); 
        if(isIframeLoaded) return;
        isIframeLoaded = true;

        clearTimeout(seq1);
        clearTimeout(seq2);
        if (watermark) watermark.remove();

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
        iframe.style.transition = 'opacity 0.6s ease';
        document.body.appendChild(iframe);

        iframe.onload = () => {
            iframe.style.opacity = '1';
            setTimeout(() => {
                if(invVideo) { invVideo.pause(); invVideo.removeAttribute('src'); invVideo.load(); }
                if(bgVideo) { bgVideo.pause(); bgVideo.removeAttribute('src'); bgVideo.load(); }
                if(frameContainer) frameContainer.remove();
                if (coverPage) coverPage.remove();
                iframe.style.zIndex = '1'; 
            }, 600);
        };
    };

    const skipAction = (e) => {
        if (isSkipped) return;
        isSkipped = true;
        loadIframeSPA(e);
    };

    // Buku terbuka 1 detik, video di dalam buku berjalan 1 detik (Total 2 detik menuju Fullscreen)
    seq1 = setTimeout(() => {
        if (isSkipped) return;
        if (!frameContainer) return;
        
        document.body.appendChild(frameContainer);
        frameContainer.classList.add('fullscreen-mode');

        const dateArabic = document.querySelector('.inside-date-arabic');
        if (dateArabic) dateArabic.style.display = 'none';
        if (coverPage) coverPage.style.display = 'none';

        // Klik layar saat fullscreen langsung skip tanpa delay
        frameContainer.style.cursor = 'pointer';
        frameContainer.addEventListener('click', skipAction);
        frameContainer.addEventListener('touchstart', skipAction, {passive: false});

        // Video berjalan fullscreen selama 1 detik sebelum auto-load
        seq2 = setTimeout(() => {
            if(!isSkipped) loadIframeSPA();
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
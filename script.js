// ==========================================
// 1. ENGINE PARTIKEL EMAS ASLI (HTML5 CANVAS)
// ==========================================
const canvas = document.getElementById("goldLeafCanvas");
const ctx = canvas.getContext("2d");
let goldFlakes = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class GoldFlake {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -50;
        this.size = Math.random() * 4 + 1.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.4 + 0.2;
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = `rgba(197, 160, 89, ${this.opacity})`;
        
        // Menggambar bentuk serpihan organik (bukan bulat sempurna)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.size, this.size / 2);
        ctx.lineTo(this.size / 2, this.size);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}

function initEngine() {
    goldFlakes = [];
    let density = (canvas.width * canvas.height) / 12000;
    for (let i = 0; i < density; i++) {
        goldFlakes.push(new GoldFlake());
    }
}
function runEngine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < goldFlakes.length; i++) {
        goldFlakes[i].update();
        goldFlakes[i].draw();
    }
    requestAnimationFrame(runEngine);
}
initEngine();
runEngine();

// ==========================================
// 2. LOGIKA MEKANISME UNLOCK 3D AMPLUP
// ==========================================
function unlockInvitation() {
    const coverScreen = document.getElementById('cover-screen');
    const mainContainer = document.getElementById('mainContainer');
    const bottomNav = document.getElementById('bottomNav');
    const murottalPill = document.getElementById('murottalPill');

    // Jalankan urutan animasi pembukaan amplop
    coverScreen.classList.add('open-envelope');
    
    setTimeout(() => {
        coverScreen.style.display = 'none';
        mainContainer.classList.add('show');
        bottomNav.classList.add('show');
        murottalPill.classList.add('show');
        
        // Auto-play murottal
        if(player && typeof player.playVideo === 'function'){
            player.playVideo();
            murottalPill.classList.remove('paused');
        }
        
        // Triger animasi AOS setelah layar terbuka
        AOS.init({ once: true, offset: 40, duration: 1200, easing: 'ease-out-cubic' });
    }, 1300);
}

// ==========================================
// 3. AUDIO ENGINE YOUTUBE (MUROTTAL AR-RUM)
// ==========================================
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0', width: '0', 
        videoId: 'L1t2Vn_O15w', // ID Video Murottal Surat Ar-Rum
        playerVars: { 'autoplay': 0, 'controls': 0, 'showinfo': 0, 'rel': 0, 'loop': 1, 'playlist': 'L1t2Vn_O15w' }
    });
}
function toggleMurottal() {
    const pill = document.getElementById("murottalPill");
    if (player && typeof player.getPlayerState === 'function') {
        if (player.getPlayerState() === 1) { 
            player.pauseVideo(); 
            pill.classList.add("paused");
        } else { 
            player.playVideo(); 
            pill.classList.remove("paused");
        }
    }
}

// ==========================================
// 4. INTELLIGENT SCROLL SPY NAVIGATION
// ==========================================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-btn");
window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
        const top = s.offsetTop;
        if (scrollY >= top - 280) current = s.getAttribute("id");
    });
    navLinks.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href").includes(current)) a.classList.add("active");
    });
});

// ==========================================
// 5. HIGH-ACCURACY COUNTDOWN ENGINE
// ==========================================
var destTime = new Date("Jun 29, 2026 09:00:00").getTime();
setInterval(function() {
    var now = new Date().getTime();
    var diff = destTime - now;
    
    if (diff < 0) {
        document.getElementById("hari").innerHTML = "00"; document.getElementById("jam").innerHTML = "00";
        document.getElementById("menit").innerHTML = "00"; document.getElementById("detik").innerHTML = "00";
        return;
    }

    document.getElementById("hari").innerHTML = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById("jam").innerHTML = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById("menit").innerHTML = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById("detik").innerHTML = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}, 1000);

// ==========================================
// 6. DATABASE INTEGRATION ASYNC DATA
// ==========================================
const scriptURL = 'URL_APPS_SCRIPT_DISINI'; 
const form = document.getElementById('rsvpForm');
const btnSubmit = document.getElementById('btnSubmit');

form.addEventListener('submit', e => {
    e.preventDefault();
    btnSubmit.innerHTML = 'MENGIRIM DATA...';
    btnSubmit.disabled = true;

    if(scriptURL === 'URL_APPS_SCRIPT_DISINI') {
        alert("Simulasi berhasil! Hubungkan Web App URL Anda untuk sinkronisasi database Google Sheets.");
        btnSubmit.innerHTML = 'TERKIRIM!';
        form.reset();
        setTimeout(() => { btnSubmit.disabled = false; btnSubmit.innerHTML = 'Kirim Konfirmasi'; }, 2000);
        return;
    }

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            btnSubmit.innerHTML = 'TERKIRIM!';
            alert("Jazakumullahu khairan. Konfirmasi Anda telah masuk database.");
            form.reset();
            setTimeout(() => { btnSubmit.disabled = false; btnSubmit.innerHTML = 'Kirim Konfirmasi'; }, 3000);
        }).catch(error => {
            alert('Gagal mengirim. Silakan periksa jaringan.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'KIRIM ULANG';
        });
});
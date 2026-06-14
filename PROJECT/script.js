// --- 1. DEKLARASI VARIABEL ---
const btnOpen = document.getElementById('btn-open');
const cover = document.getElementById('cover');
const mainContent = document.getElementById('main-content');
const audio = document.getElementById('bg-audio');
const ripAudio = document.getElementById('rip-audio'); // Efek Suara Robek
const musicPlayer = document.getElementById('music-player');
const playBtn = document.getElementById('play-btn');
const disc = document.getElementById('disc');

// --- 2. LOGIKA BUKA KERTAS (PAPER TEAR) ---
btnOpen.addEventListener('click', () => {
    // Putar efek suara kertas dirobek
    ripAudio.play().catch(() => console.log("Sound effect diblokir browser"));
    
    // Tambahkan class .torn untuk memulai animasi robek
    cover.classList.add('torn');
    document.body.classList.remove('locked');
    
    // Set timeout untuk menyembunyikan cover dan menampilkan konten utama
    setTimeout(() => {
        cover.classList.add('hidden'); // Matikan fungsi klik di cover
        mainContent.style.display = 'block';
        
        // Munculkan konten dan widget musik
        setTimeout(() => {
            mainContent.classList.add('visible');
            musicPlayer.classList.add('visible');
            triggerReveal(); // Jalankan animasi konten
        }, 100);

        // Putar musik latar belakang
        audio.play().catch(() => console.log("Autoplay diblokir oleh browser"));
    }, 1200); // Sinkronisasi dengan durasi animasi robek di CSS
});

// --- 3. KONTROL WIDGET MUSIK ---
let isPlaying = true;
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playBtn.innerText = '▶';
        disc.classList.add('paused');
    } else {
        audio.play();
        playBtn.innerText = '⏸';
        disc.classList.remove('paused');
    }
    isPlaying = !isPlaying;
});

// --- 4. ANIMASI SCROLL (REVEAL) ---
function triggerReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    
    reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - 50) {
            reveal.classList.add('active');
        }
    });
}
window.addEventListener('scroll', triggerReveal);

// --- 5. COUNTDOWN TIMER ---
const targetDate = new Date("Jun 14, 2026 09:00:00").getTime();

setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance > 0) {
        document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }
}, 1000);

// --- 6. RSVP FORM SUBMIT ---
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Terima kasih! Pesan dan konfirmasi kehadiran Anda telah terkirim.');
    this.reset();
});
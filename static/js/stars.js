// stars.js — Animated starfield background

const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < 180; i++) {
    stars.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.2 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      color: Math.random() > 0.85 ? '#c084fc' : '#ffffff'
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle    = s.color;
    ctx.globalAlpha  = s.alpha;
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawStars);
}

// Init
resizeCanvas();
initStars();
drawStars();
window.addEventListener('resize', () => { resizeCanvas(); initStars(); });

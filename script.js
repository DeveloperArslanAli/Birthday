/* ============================================================
   EDIT YOUR TEXT HERE
   ============================================================ */
const CONFIG = {
  to: "Mohsin",
  from: "Amna",
  letter: [
    "Happy Birthday! 🎂",
    "Aaj ka din sirf tumhara hai, aur main chahti hoon ke tum jaano tum meri life mein kitne khaas ho.",
    "Tumhari smile, tumhari baatein aur tumhara saath har din ko behtar bana deta hai.",
    "Har yaad jo hum ne saath banayi, meri sab se pyaari yaadon mein hai.",
    "Allah kare tumhari life khushiyon, sehat aur kamyabi se bhari rahe, aur hum aise hi saath rahein.",
    "Once again, happy birthday my love! 🤍"
  ],
  balloonColors: ["#ff6f9c", "#ffd166", "#7fd6c2", "#8ab8ff", "#c9a6ff", "#ff9f6b"]
};

/* ============================================================
   Helpers
   ============================================================ */
const $ = (id) => document.getElementById(id);
const screens = {
  balloons: $("screen-balloons"),
  cake: $("screen-cake"),
  photo: $("screen-photo"),
  letter: $("screen-letter")
};

function show(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

/* ============================================================
   Confetti (canvas)
   ============================================================ */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let rafId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burst(x, y, count = 40, spread = 1) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = (2 + Math.random() * 6) * spread;
    pieces.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 3,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 5,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      c: CONFIG.balloonColors[(Math.random() * CONFIG.balloonColors.length) | 0],
      life: 90 + Math.random() * 40
    });
  }
  if (!rafId) rafId = requestAnimationFrame(tick);
}

function tick() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  pieces = pieces.filter((p) => p.life > 0);
  for (const p of pieces) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.vx *= 0.99; p.r += p.vr; p.life--;
    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life / 30);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }
  rafId = pieces.length ? requestAnimationFrame(tick) : null;
  if (!rafId) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function rain() {
  const w = window.innerWidth;
  for (let i = 0; i < 6; i++) setTimeout(() => burst(Math.random() * w, -10, 25, 0.6), i * 180);
}

/* ============================================================
   Background floating hearts & stars
   ============================================================ */
(function floaties() {
  const box = document.querySelector(".floaties");
  const icons = ["💗", "✨", "🤍", "⭐", "💜"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.textContent = icons[i % icons.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 14 + Math.random() * 18 + "px";
    s.style.animationDuration = 9 + Math.random() * 10 + "s";
    s.style.animationDelay = -Math.random() * 14 + "s";
    box.appendChild(s);
  }
})();

/* ============================================================
   1. Balloons
   ============================================================ */
const field = $("balloon-field");
const balloonHint = $("balloon-hint");
const BALLOON_SPOTS = [
  [8, 6], [40, 0], [72, 8],
  [22, 42], [56, 38], [80, 50]
];
let balloonsLeft = 0;

function setupBalloons() {
  field.innerHTML = "";
  balloonsLeft = BALLOON_SPOTS.length;
  balloonHint.textContent = "Pop them all 🎈";

  BALLOON_SPOTS.forEach(([left, top], i) => {
    const b = document.createElement("button");
    b.className = "balloon";
    b.setAttribute("aria-label", "Pop balloon");
    b.style.left = left + "%";
    b.style.top = top + "%";
    b.style.setProperty("--c", CONFIG.balloonColors[i % CONFIG.balloonColors.length]);
    b.style.setProperty("--delay", -i * 0.55 + "s");
    b.addEventListener("click", (e) => popBalloon(b, e));
    field.appendChild(b);
  });
}

function popBalloon(b, e) {
  if (b.classList.contains("pop")) return;
  b.classList.add("pop");
  const r = b.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 28);
  balloonsLeft--;
  balloonHint.textContent = balloonsLeft > 0 ? `${balloonsLeft} left…` : "Yay! 🎉";
  if (balloonsLeft === 0) {
    rain();
    setTimeout(() => show("cake"), 1300);
  }
}

/* ============================================================
   2. Cake
   ============================================================ */
const cake = $("cake");
const cakeHint = $("cake-hint");
let cakeDone = false;

cake.addEventListener("click", () => {
  if (cakeDone) return;
  cakeDone = true;
  cake.classList.add("blown");
  cakeHint.textContent = "Wish ho gayi! 🎉";
  const r = cake.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height * 0.2, 70, 1.2);
  rain();
  setTimeout(() => show("photo"), 1800);
});

function resetCake() {
  cakeDone = false;
  cake.classList.remove("blown");
  cakeHint.textContent = "Tap the cake to blow the candles";
}

/* ============================================================
   3. Polaroid
   ============================================================ */
const polaroid = $("polaroid");
const photoOverlay = $("photo-overlay");
const photoNext = $("photo-next");

polaroid.addEventListener("click", () => photoOverlay.classList.add("show"));
photoOverlay.addEventListener("click", () => {
  photoOverlay.classList.remove("show");
  photoNext.classList.remove("hidden");
});
photoNext.addEventListener("click", () => show("letter"));

/* ============================================================
   4. Envelope + letter
   ============================================================ */
const envelope = $("envelope");
const letterOverlay = $("letter-overlay");
const lBody = $("l-body");
const lFrom = $("l-from");
const replay2 = $("replay-2");

$("l-to").textContent = `Dear ${CONFIG.to},`;
lFrom.textContent = `— ${CONFIG.from} 🤍`;

envelope.addEventListener("click", () => {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  setTimeout(openLetter, 1100);
});

function openLetter() {
  lBody.innerHTML = "";
  lFrom.classList.remove("show");
  replay2.classList.remove("show");
  letterOverlay.scrollTop = 0;
  letterOverlay.classList.add("show");

  CONFIG.letter.forEach((text, i) => {
    const p = document.createElement("p");
    p.className = "l-line";
    p.textContent = text;
    p.style.animationDelay = 0.5 + i * 0.9 + "s";
    lBody.appendChild(p);
  });

  const end = 0.5 + CONFIG.letter.length * 0.9 + 0.3;
  setTimeout(() => { lFrom.classList.add("show"); burst(window.innerWidth / 2, window.innerHeight / 3, 60); }, end * 1000);
  setTimeout(() => replay2.classList.add("show"), (end + 0.8) * 1000);
}

/* ============================================================
   Replay
   ============================================================ */
function replay() {
  letterOverlay.classList.remove("show");
  photoOverlay.classList.remove("show");
  setTimeout(() => {
    envelope.classList.remove("open");
    photoNext.classList.add("hidden");
    resetCake();
    setupBalloons();
    show("balloons");
  }, 350);
}
$("replay-1").addEventListener("click", replay);
replay2.addEventListener("click", replay);

setupBalloons();

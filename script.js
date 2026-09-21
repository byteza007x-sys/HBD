const openLetter = document.querySelector("#openLetter");
const letterImage = document.querySelector(".letter-image");
const mailStage = document.querySelector("#mailStage");
const letterCard = document.querySelector("#letterCard");
const watchButton = document.querySelector("#watchButton");
const flowerCurtain = document.querySelector("#flowerCurtain");
const surpriseHub = document.querySelector("#surpriseHub");
const surpriseCards = document.querySelectorAll(".surprise-card");
const backButtons = document.querySelectorAll("[data-back-to-hub]");
const giftSections = document.querySelectorAll(".gift-section");
const videoSection = document.querySelector("#videoSection");
const video = document.querySelector("#birthdayVideo");
const videoFallback = document.querySelector("#videoFallback");
const localVideo = document.querySelector("#localVideo");
const voiceAudio = document.querySelector("#voiceAudio");
const voiceCard = document.querySelector(".voice-card");
const cakeStage = document.querySelector("#cakeStage");
const lightCandles = document.querySelector("#lightCandles");
const saveWish = document.querySelector("#saveWish");
const blowCandles = document.querySelector("#blowCandles");
const wishText = document.querySelector("#wishText");
const wishMessage = document.querySelector("#wishMessage");
const audio = document.querySelector("#birthdayAudio");
const musicWidget = document.querySelector("#musicWidget");
const musicToggle = document.querySelector("#musicToggle");
const muteToggle = document.querySelector("#muteToggle");
const musicStatus = document.querySelector("#musicStatus");
const canvas = document.querySelector("#confettiCanvas");
const ctx = canvas.getContext("2d");

let flowers = [];
let flowerFrame = null;
let opened = false;
let choosingGift = false;

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function getEnvelopeCenter() {
  const rect = openLetter.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height * 0.5
  };
}

function createFlowers() {
  const center = getEnvelopeCenter();
  const colors = ["#c98884", "#f0d4a5", "#b9a07b", "#a9636a", "#e7c894", "#73805c", "#d7a0ad", "#efc0c7"];
  const count = Math.min(460, Math.max(240, Math.floor(window.innerWidth / 3.4)));

  flowers = Array.from({ length: count }, (_, index) => {
    const angle = Math.random() * Math.PI * 2;
    const power = 7.5 + Math.random() * 15.5;
    const delay = index * 2.8 + Math.random() * 760;
    const isLargeBloom = Math.random() > 0.72;

    return {
      x: center.x + (-8 + Math.random() * 16),
      y: center.y + (-8 + Math.random() * 16),
      vx: Math.cos(angle) * power,
      vy: Math.sin(angle) * power - 6.5 - Math.random() * 6.2,
      gravity: 0.068 + Math.random() * 0.05,
      drag: 0.989 + Math.random() * 0.006,
      size: isLargeBloom ? 30 + Math.random() * 34 : 14 + Math.random() * 25,
      petals: Math.random() > 0.25 ? 5 : 6,
      rotation: Math.random() * Math.PI * 2,
      spin: -0.045 + Math.random() * 0.09,
      color: colors[Math.floor(Math.random() * colors.length)],
      center: Math.random() > 0.18 ? "#a77945" : "#70442e",
      delay,
      age: 0,
      life: 4700 + Math.random() * 1900
    };
  });
}

function drawPaperFlower(flower, alpha) {
  ctx.save();
  ctx.translate(flower.x, flower.y);
  ctx.rotate(flower.rotation);
  ctx.globalAlpha = alpha;

  for (let i = 0; i < flower.petals; i += 1) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / flower.petals);
    ctx.fillStyle = flower.color;
    ctx.beginPath();
    ctx.ellipse(flower.size * 0.42, 0, flower.size * 0.52, flower.size * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.beginPath();
    ctx.ellipse(flower.size * 0.28, -flower.size * 0.04, flower.size * 0.22, flower.size * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = flower.center;
  ctx.beginPath();
  ctx.arc(0, 0, flower.size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFlowers() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  flowers.forEach((flower) => {
    flower.age += 16;
    if (flower.age < flower.delay) return;

    const activeAge = flower.age - flower.delay;
    const appear = Math.min(1, activeAge / 900);
    const fade = activeAge > flower.life - 900 ? Math.max(0, (flower.life - activeAge) / 900) : 1;
    const alpha = appear * fade;

    flower.vx *= flower.drag;
    flower.vy = flower.vy * flower.drag + flower.gravity;
    flower.x += flower.vx;
    flower.y += flower.vy;
    flower.rotation += flower.spin;

    drawPaperFlower(flower, alpha);
  });

  flowers = flowers.filter((flower) => flower.age - flower.delay < flower.life);

  if (flowers.length) {
    flowerFrame = requestAnimationFrame(drawFlowers);
    return;
  }

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  flowerFrame = null;
}

function burstFlowers() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cancelAnimationFrame(flowerFrame);
  resizeCanvas();
  createFlowers();
  drawFlowers();
}

function updateMusicUi() {
  musicToggle.textContent = audio.paused ? "เล่น" : "หยุด";
  muteToggle.textContent = audio.muted ? "ปิด" : "เสียง";
  musicWidget.classList.toggle("is-playing", !audio.paused && !audio.muted);
}

function playBirthdaySong() {
  video.pause();
  voiceAudio.pause();
  audio.volume = 0.58;
  audio.play()
    .then(() => {
      musicStatus.textContent = "กำลังเล่น";
      updateMusicUi();
    })
    .catch(() => {
      musicStatus.textContent = "แตะเล่น";
      updateMusicUi();
    });
}

function pauseBirthdaySong(statusText = "หยุดไว้") {
  if (!audio.paused) {
    audio.pause();
  }
  musicStatus.textContent = statusText;
  updateMusicUi();
}

function setWishMessage(text) {
  wishMessage.classList.remove("is-updated");
  wishMessage.textContent = text;
  window.requestAnimationFrame(() => wishMessage.classList.add("is-updated"));
}

function revealLetter() {
  document.body.classList.remove("is-blooming");
  document.body.classList.add("is-unlocked");
  letterCard.classList.add("is-visible");
}

function openGift() {
  if (opened) return;
  opened = true;

  document.body.classList.remove("waiting-letter");
  document.body.classList.add("is-blooming");
  mailStage.classList.add("is-open");
  letterImage.src = "assets/watercolor-letter.png";
  letterImage.classList.add("is-opening");
  openLetter.setAttribute("aria-label", "จดหมายเปิดแล้ว");

  burstFlowers();
  playBirthdaySong();
  window.setTimeout(revealLetter, 4300);
}

openLetter.addEventListener("click", openGift);
openLetter.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  openGift();
});

watchButton.addEventListener("click", () => {
  if (choosingGift) return;
  choosingGift = true;

  document.body.classList.add("is-curtain-sweeping");

  window.setTimeout(() => {
    document.body.classList.add("is-choosing-gift");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, 560);

  window.setTimeout(() => {
    document.body.classList.remove("is-curtain-sweeping");
    choosingGift = false;
  }, 1240);
});

surpriseCards.forEach((card) => {
  card.addEventListener("click", () => {
    const target = document.querySelector(`#${card.dataset.target}`);
    if (!target) return;

    video.pause();
    voiceAudio.pause();
    giftSections.forEach((section) => section.classList.remove("is-active"));
    target.classList.add("is-active");
    document.body.classList.add("is-presenting-gift");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));

    if (card.dataset.target !== "videoSection") return;

    window.setTimeout(() => {
      if (!videoFallback.classList.contains("is-visible")) {
        video.play().catch(() => {});
      }
    }, 850);
  });
});

backButtons.forEach((button) => {
  button.addEventListener("click", () => {
    video.pause();
    voiceAudio.pause();
    document.body.classList.remove("is-presenting-gift");
    document.body.classList.add("is-choosing-gift");
    giftSections.forEach((section) => section.classList.remove("is-active"));
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
});

function updateVoiceCassette() {
  voiceCard?.classList.toggle("is-playing", !voiceAudio.paused);
}

voiceAudio.addEventListener("play", () => {
  pauseBirthdaySong("หยุดเพลงไว้");
  video.pause();
  updateVoiceCassette();
});
voiceAudio.addEventListener("pause", updateVoiceCassette);
voiceAudio.addEventListener("ended", updateVoiceCassette);

video.addEventListener("play", () => {
  pauseBirthdaySong("หยุดเพลงไว้");
  voiceAudio.pause();
});

video.addEventListener("error", () => {
  videoFallback.classList.add("is-visible");
});

video.addEventListener("loadedmetadata", () => {
  videoFallback.classList.remove("is-visible");
});

localVideo.addEventListener("change", () => {
  const file = localVideo.files?.[0];
  if (!file) return;

  video.src = URL.createObjectURL(file);
  videoFallback.classList.remove("is-visible");
  video.load();
  video.play().catch(() => {});
});

lightCandles.addEventListener("click", () => {
  cakeStage.classList.remove("is-blown");
  cakeStage.classList.add("is-lit");
  setWishMessage("เทียนติดแล้ว เขียนคำขอพรแล้วส่งไว้ได้เลย");
});

saveWish.addEventListener("click", () => {
  const wish = wishText.value.trim();

  if (!wish) {
    setWishMessage("เขียนคำขอพรก่อนนะ แล้วค่อยส่งคำขอพร");
    wishText.focus();
    return;
  }

  localStorage.setItem("birthdayWish", wish);
  setWishMessage("เก็บคำขอพรไว้แล้ว พร้อมเป่าเทียนได้เลย");
});

blowCandles.addEventListener("click", () => {
  const wish = wishText.value.trim();

  if (!wish) {
    setWishMessage("เขียนคำขอพรก่อนเป่าเทียนนะ");
    wishText.focus();
    return;
  }

  if (!cakeStage.classList.contains("is-lit")) {
    cakeStage.classList.add("is-lit");
  }

  window.setTimeout(() => {
    cakeStage.classList.remove("is-lit");
    cakeStage.classList.add("is-blown");
    localStorage.setItem("birthdayWish", wish);
    setWishMessage("ขอให้คำขอของน้องเป็นจริงทุกประการ");
  }, 500);
});

musicToggle.addEventListener("click", () => {
  if (audio.paused) {
    playBirthdaySong();
    return;
  }

  pauseBirthdaySong("หยุดไว้");
});

muteToggle.addEventListener("click", () => {
  audio.muted = !audio.muted;
  musicStatus.textContent = audio.muted ? "ปิดเสียง" : audio.paused ? "พร้อมเล่น" : "กำลังเล่น";
  updateMusicUi();
});

audio.addEventListener("play", updateMusicUi);
audio.addEventListener("pause", updateMusicUi);
audio.addEventListener("volumechange", updateMusicUi);
audio.addEventListener("error", () => {
  musicStatus.textContent = "ไม่มีไฟล์เพลง";
  updateMusicUi();
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
updateMusicUi();

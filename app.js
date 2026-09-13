const CONFIG = {
  recipientName: "Elizabeth",
  senderName: "alguien que te desea un buen día",
  letterHtml: `
    <p>Quise preparar este pequeño detalle por el 21 de septiembre. Sé que en su momento fuiste clara conmigo, y quiero que sepas que respeto lo que me dijiste.</p>
    <p>Esto no busca cambiar nada, insistir ni abrir una conversación pendiente. Tampoco necesitas responder o agradecerlo.</p>
    <p>Solo deseo que estas flores amarillas te regalen un momento agradable y que tengas un buen día.</p>
  `
};

const slides = [...document.querySelectorAll("[data-slide]")];
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const qrDialog = document.querySelector("#qrDialog");
const toast = document.querySelector("#toast");
let currentSlide = 0;

document.querySelectorAll("[data-copy]").forEach((element) => {
  const value = CONFIG[element.dataset.copy];
  if (typeof value !== "string") return;
  if (element.dataset.copy === "letterHtml") element.innerHTML = value;
  else element.textContent = value;
});

function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
    slide.toggleAttribute("inert", slideIndex !== currentSlide);
  });
  progressText.textContent = `${currentSlide + 1} de ${slides.length}`;
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  const heading = slides[currentSlide].querySelector("h1, h2");
  if (heading && currentSlide > 0) {
    heading.setAttribute("tabindex", "-1");
    window.setTimeout(() => heading.focus({ preventScroll: true }), 70);
  }
  if (currentSlide === slides.length - 1) confetti(42);
}

document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => showSlide(currentSlide + 1)));
document.querySelectorAll("[data-back]").forEach((button) => button.addEventListener("click", () => showSlide(currentSlide - 1)));
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => showSlide(Number(button.dataset.go))));

const lightRange = document.querySelector("#lightRange");
const lightValue = document.querySelector("#lightValue");
const lightMeter = document.querySelector("#lightMeter");
const flowerFace = document.querySelector("#flowerFace");
const moodStatus = document.querySelector("#moodStatus");
let celebratedLight = false;

function updateLight() {
  const value = Number(lightRange.value);
  lightValue.textContent = value;
  lightMeter.style.setProperty("--light", value);
  if (value < 25) {
    flowerFace.textContent = "•︵•";
    moodStatus.textContent = "Entonces aquí va un poquito de calma para ti.";
  } else if (value < 55) {
    flowerFace.textContent = "•‿•";
    moodStatus.textContent = "La flor ya empieza a levantar la carita.";
  } else if (value < 85) {
    flowerFace.textContent = "◕‿◕";
    moodStatus.textContent = "Eso se siente mucho más luminoso.";
  } else {
    flowerFace.textContent = "✦‿✦";
    moodStatus.textContent = "¡Así! Que nunca te falte esta luz.";
    if (!celebratedLight) {
      celebratedLight = true;
      confetti(22);
    }
  }
}
lightRange.addEventListener("input", updateLight);
updateLight();

const flowerContinue = document.querySelector("#flowerContinue");
document.querySelectorAll("[data-flower]").forEach((flower) => {
  flower.addEventListener("click", () => {
    flower.classList.toggle("is-open");
    flower.setAttribute("aria-pressed", String(flower.classList.contains("is-open")));
    flowerContinue.disabled = !document.querySelector(".message-flower.is-open");
  });
});

document.querySelector("#openQr").addEventListener("click", () => qrDialog.showModal());
document.querySelector("#closeQr").addEventListener("click", () => qrDialog.close());
qrDialog.addEventListener("click", (event) => {
  if (event.target === qrDialog) qrDialog.close();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("Enlace copiado");
  } catch {
    showToast("Copia el enlace desde la barra del navegador");
  }
}
document.querySelector("#copyLink").addEventListener("click", copyLink);

document.querySelector("#shareButton").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, text: "Unas flores amarillas para alegrarte el día 🌻", url: window.location.href });
    } catch (error) {
      if (error.name !== "AbortError") copyLink();
    }
  } else copyLink();
});

function confetti(amount) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ffd92f", "#ffb703", "#fff3a6", "#6f8d3d", "#f59e0b"];
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty("--drift", `${(Math.random() - .5) * 230}px`);
    piece.style.animationDelay = `${Math.random() * .35}s`;
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 3200);
  }
}

showSlide(0);


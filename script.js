// Menu mobile
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Année footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach((el) => observer.observe(el));

// Lightbox galerie
const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");
const items = Array.from(document.querySelectorAll("[data-gallery] .g-item"));

let currentIndex = 0;

function openLightbox(index) {
  if (!lightbox || !lightboxImg) return;
  currentIndex = index;

  const btn = items[currentIndex];
  const full = btn?.getAttribute("data-full");
  const img = btn?.querySelector("img");
  const alt = img?.getAttribute("alt") || "Image";

  lightboxImg.src = full;
  lightboxImg.alt = alt;

  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  closeBtn?.focus();
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = "";
  items[currentIndex]?.focus?.();
}

function next() {
  const n = items.length;
  openLightbox((currentIndex + 1) % n);
}

function prev() {
  const n = items.length;
  openLightbox((currentIndex - 1 + n) % n);
}

items.forEach((btn, index) => {
  btn.addEventListener("click", () => openLightbox(index));
});

closeBtn?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (e) => {
  // fermer si clic hors image
  if (e.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.hidden) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});

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
/* =========================
   Lightbox (Galerie)
   Fonctionne avec:
   <div class="gallery" data-gallery>
     <button class="g-item" data-full="images/IMG_3989.jpeg">...</button>
   </div>
========================= */

(function () {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll(".g-item[data-full]"));
  if (!items.length) return;

  // --- Création du DOM Lightbox (une seule fois)
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="lightbox__backdrop" data-lb-close></div>
    <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Image agrandie">
      <button class="lightbox__close" type="button" aria-label="Fermer" data-lb-close>×</button>

      <button class="lightbox__nav lightbox__prev" type="button" aria-label="Image précédente" data-lb-prev>‹</button>
      <figure class="lightbox__figure">
        <img class="lightbox__img" alt="" />
        <figcaption class="lightbox__cap"></figcaption>
      </figure>
      <button class="lightbox__nav lightbox__next" type="button" aria-label="Image suivante" data-lb-next>›</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector(".lightbox__img");
  const capEl = overlay.querySelector(".lightbox__cap");
  const panel = overlay.querySelector(".lightbox__panel");

  let currentIndex = 0;
  let lastFocus = null;

  function setImage(index) {
    currentIndex = (index + items.length) % items.length;

    const btn = items[currentIndex];
    const full = btn.getAttribute("data-full");
    const thumbImg = btn.querySelector("img");
    const caption = btn.querySelector(".g-cap")?.textContent?.trim() || "";
    const alt = thumbImg?.getAttribute("alt") || caption || "Image";

    // Force un chargement propre (évite parfois une image "fantôme")
    imgEl.src = "";
    imgEl.alt = alt;
    capEl.textContent = caption;

    // Petit préchargement (optionnel mais propre)
    const pre = new Image();
    pre.onload = () => {
      imgEl.src = full;
    };
    pre.onerror = () => {
      // Si jamais une image manque, on affiche au moins quelque chose
      imgEl.alt = "Impossible de charger l’image.";
      capEl.textContent = "Image introuvable ou chemin incorrect.";
    };
    pre.src = full;
  }

  function openLightbox(index) {
    lastFocus = document.activeElement;

    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");

    setImage(index);

    // Focus sur le panneau pour accessibilité
    panel.setAttribute("tabindex", "-1");
    panel.focus({ preventScroll: true });
  }

  function closeLightbox() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function next() {
    setImage(currentIndex + 1);
  }

  function prev() {
    setImage(currentIndex - 1);
  }

  // --- Click sur une vignette
  items.forEach((btn, idx) => {
    btn.addEventListener("click", () => openLightbox(idx));
  });

  // --- Boutons overlay
  overlay.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.matches("[data-lb-close]")) closeLightbox();
    if (t && t.matches("[data-lb-next]")) next();
    if (t && t.matches("[data-lb-prev]")) prev();
  });

  // --- Clavier (ESC / flèches)
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("is-open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // --- Swipe mobile
  let startX = 0;
  let startY = 0;
  let isSwiping = false;

  panel.addEventListener(
    "touchstart",
    (e) => {
      if (!overlay.classList.contains("is-open")) return;
      const t = e.touches?.[0];
      if (!t) return;
      startX = t.clientX;
      startY = t.clientY;
      isSwiping = true;
    },
    { passive: true }
  );

  panel.addEventListener(
    "touchmove",
    (e) => {
      if (!isSwiping) return;
      const t = e.touches?.[0];
      if (!t) return;

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // Si c'est surtout vertical, on laisse scroller
      if (Math.abs(dy) > Math.abs(dx)) return;

      // sinon on bloque le scroll horizontal de la page pendant swipe
      e.preventDefault();
    },
    { passive: false }
  );

  panel.addEventListener(
    "touchend",
    (e) => {
      if (!isSwiping) return;
      isSwiping = false;

      const t = e.changedTouches?.[0];
      if (!t) return;

      const dx = t.clientX - startX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    },
    { passive: true }
  );
})();

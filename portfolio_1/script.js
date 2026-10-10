const loader = document.querySelector(".page-loader");
const menu = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");
const navbar = document.querySelector(".navbar");
const progress = document.querySelector(".scroll-progress");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");

let loaderDismissed = false;
function hideLoader() {
  if (loaderDismissed) return;
  loaderDismissed = true;
  setTimeout(() => loader?.classList.add("done"), 650);
}
if (document.readyState === "complete") {
  hideLoader();
} else {
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 3000);
}

menu?.addEventListener("click", () => {
  nav?.classList.toggle("open");
  menu?.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", () => {
    nav?.classList.remove("open");
    menu?.classList.remove("open");
  });
});

/* Scroll progress + floating navbar */
function updateScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progress) progress.style.width = `${pct}%`;
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 45);
}
window.addEventListener("scroll", updateScrollUI, {passive:true});
updateScrollUI();

/* Reveal on scroll */
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("show"));
}

/* Active navigation based on visible section */
const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

if ("IntersectionObserver" in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navItems.forEach(link => link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${entry.target.id}`
      ));
    });
  }, {rootMargin:"-35% 0px -55% 0px"});

  sections.forEach(section => sectionObserver.observe(section));
}

/* Smooth magnetic cursor */
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

const hasFinePointer = window.matchMedia("(pointer:fine)").matches;
if (hasFinePointer && (cursorDot || cursorRing)) {
  window.addEventListener("pointermove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * .16;
    ringY += (mouseY - ringY) * .16;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll("a,button,.skill,.project").forEach(el => {
    el.addEventListener("mouseenter", () => cursorRing?.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorRing?.classList.remove("hover"));
  });
}

/* Subtle 3D card movement, disabled on touch devices */
if (window.matchMedia("(pointer:fine)").matches) {
  document.querySelectorAll(".tilt-card").forEach(card => {
    card.addEventListener("pointermove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform =
        `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* Parallax hero image */
const heroVisual = document.querySelector(".hero-visual");
window.addEventListener("scroll", () => {
  if (!heroVisual || window.innerWidth < 701) return;
  const y = Math.min(window.scrollY * .07, 35);
  heroVisual.style.transform = `translateY(${y}px)`;
}, {passive:true});

// ===================== THEME TOGGLE =====================

(function () {
  const btn = document.getElementById("themeToggleBtn");
  const STORAGE_KEY = "portfolio-theme";

  // Apply saved theme immediately (before page paint)
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (btn) {
    btn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    });
  }

  // Listen for messages from a parent window (e.g. builder.html)
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.type === "themeChange") {
      if (message.theme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  });
})();

// ===================== CAROUSEL =====================

let index = 0;
const carousel = document.getElementById("carousel");
let autoScroll = null;
let messageShown = false;
let holdTimer = null;
let isHolding = false;

document.addEventListener("DOMContentLoaded", () => {
  const projectTemplates = document.getElementById("project-templates");
  const projectBoxes = Array.from(projectTemplates.querySelectorAll(".project-box"));

  renderAllProjects(projectBoxes);
  setupArrowHoldListeners(document.querySelector(".arrow.left"));
  setupArrowHoldListeners(document.querySelector(".arrow.right"));
  typeEffect();
});

function renderAllProjects(projectBoxes) {
  const projectsContainer = document.getElementById("projects-container");
  projectsContainer.innerHTML = "";
  projectBoxes.forEach(box => {
    const clone = box.cloneNode(true);
    projectsContainer.appendChild(clone);
  });
}

function scrollToSlide(slideIndex) {
  index = slideIndex;
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

function scrollCarousel(direction) {
  const total = document.querySelectorAll(".carousel > div").length;
  index = (index + direction + total) % total;
  scrollToSlide(index);

  if (!messageShown) {
    showHoldMessage();
    messageShown = true;
  }
}

function showHoldMessage() {
  const msg = document.createElement("div");
  msg.textContent = "Hold to view in slideshow";
  msg.className = "hold-popup";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 4000);
}

function startAutoScroll() {
  autoScroll = setInterval(() => scrollCarousel(1), 4000);
}

function stopAutoScroll() {
  clearInterval(autoScroll);
  autoScroll = null;
}

function toggleSlideshow() {
  autoScroll ? stopAutoScroll() : startAutoScroll();
}

function setupArrowHoldListeners(arrow) {
  if (!arrow) return;
  arrow.addEventListener("mousedown", startHold);
  arrow.addEventListener("mouseup", cancelHold);
  arrow.addEventListener("mouseleave", cancelHold);
  arrow.addEventListener("touchstart", startHold);
  arrow.addEventListener("touchend", cancelHold);
}

function startHold() {
  isHolding = true;
  holdTimer = setTimeout(() => isHolding && toggleSlideshow(), 2000);
}

function cancelHold() {
  isHolding = false;
  clearTimeout(holdTimer);
}

// ===================== TYPEWRITER =====================

const texts = ["Web Developer", "Python Developer"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 100, delay = 2000, blankDelay = 500;

function typeEffect() {
  const currentText = texts[textIndex];
  const output = currentText.substring(0, charIndex);
  const elem = document.getElementById("typewriter");
  if (elem) elem.textContent = output;

  if (isDeleting) {
    if (charIndex > 0) {
      charIndex--;
      setTimeout(typeEffect, speed / 2);
    } else {
      setTimeout(() => {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(typeEffect, speed);
      }, blankDelay);
    }
  } else {
    if (charIndex < currentText.length) {
      charIndex++;
      setTimeout(typeEffect, speed);
    } else {
      isDeleting = true;
      setTimeout(typeEffect, delay);
    }
  }
}

// ===================== NAV BUTTONS =====================

document.querySelectorAll('.nav-btn').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);

    if (targetId === 'about-me' || targetId === 'skills') {
      scrollToSlide(1);
    } else if (targetId === 'projects') {
      scrollToSlide(2);
    } else if (targetId === 'contact') {
      scrollToSlide(3);
    }

    setTimeout(() => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const card = targetElement.closest('.card1, .card2, .card3');
        if (card) {
          const cardRect = card.getBoundingClientRect();
          const elementRect = targetElement.getBoundingClientRect();
          const scrollPosition = elementRect.top - cardRect.top + card.scrollTop;
          card.scrollTo({ top: scrollPosition - 20, behavior: 'smooth' });
        }
      }
    }, 500);
  });
});
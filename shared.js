/* =========================================================
   TMC – SHARED GLOBAL SCRIPT
   Navigation • Transitions • Animations • Utilities
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initPage();
  initNavigation();
  initScrollAnimations();
});

/* ---------------------------------------------------------
   1. PAGE INITIALIZATION
---------------------------------------------------------- */
function initPage() {
  document.body.classList.add('page');
}

/* ---------------------------------------------------------
   2. NAVIGATION LOGIC
---------------------------------------------------------- */
function initNavigation() {
  const links = document.querySelectorAll('a[href]');
  const currentPage = location.pathname.split('/').pop();

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }

    // Page transition
    if (!href.startsWith('#') && !href.startsWith('http')) {
      link.addEventListener('click', e => {
        if (href === currentPage) return;
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    }
  });
}

/* ---------------------------------------------------------
   3. SCROLL-BASED ANIMATIONS
---------------------------------------------------------- */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.stagger, .fade-in').forEach(el => {
    observer.observe(el);
  });
}

/* ---------------------------------------------------------
   4. WHATSAPP HELPER
---------------------------------------------------------- */
function openWhatsApp(message) {
  const phone = '256785385262'; // TMC official
  const url =
    'https://wa.me/' +
    phone +
    '?text=' +
    encodeURIComponent(message);
  window.open(url, '_blank');
}

/* ---------------------------------------------------------
   5. DATA FETCH HELPER (SHEETS + FALLBACK)
---------------------------------------------------------- */
async function fetchData(primaryUrl, fallbackUrl) {
  try {
    const res = await fetch(primaryUrl);
    if (!res.ok) throw new Error('Primary source failed');
    return await res.json();
  } catch (err) {
    console.warn('Using fallback data:', err.message);
    if (!fallbackUrl) return null;
    const fallbackRes = await fetch(fallbackUrl);
    return await fallbackRes.json();
  }
}

/* ---------------------------------------------------------
   6. DATE FORMATTER
---------------------------------------------------------- */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/* ---------------------------------------------------------
   7. TEXT UTILITIES
---------------------------------------------------------- */
function truncateText(text, length = 120) {
  return text.length > length
    ? text.substring(0, length) + '...'
    : text;
}

/* ---------------------------------------------------------
   8. AUDIO CONTROL UTILITIES
---------------------------------------------------------- */
let activeAudio = null;

function playAudio(audio) {
  if (activeAudio && activeAudio !== audio) {
    activeAudio.pause();
  }
  audio.play();
  activeAudio = audio;
}

function stopAllAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
}

/* ---------------------------------------------------------
   9. LOADING / REVEAL ITEMS
---------------------------------------------------------- */
function revealItems(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  requestAnimationFrame(() => {
    container.classList.add('loaded');
  });
}

/* ---------------------------------------------------------
   10. SIMPLE DEVICE CHECK
---------------------------------------------------------- */
function isMobile() {
  return window.innerWidth < 768;
}

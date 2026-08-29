// =====================================================================
// Live status-bar clock
// =====================================================================
function updateStatusClock() {
  const el = document.getElementById('statusClock');
  if (!el) return;
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  el.textContent = `${h}:${m}`;
}
updateStatusClock();
setInterval(updateStatusClock, 1000 * 30);

// =====================================================================
// Footer year
// =====================================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =====================================================================
// Mobile nav toggle
// =====================================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// =====================================================================
// Active nav link on scroll (IntersectionObserver)
// =====================================================================
const sections = document.querySelectorAll('main section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(section => navObserver.observe(section));

// =====================================================================
// Scroll reveal
// =====================================================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// =====================================================================
// Skill bar fill animation (once visible)
// =====================================================================
const skillFills = document.querySelectorAll('.skill-bar__fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(el => skillObserver.observe(el));

// =====================================================================
// Ripple effect on buttons
// =====================================================================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// =====================================================================
// Contact form submission
// NOTE: This form posts to Formspree (https://formspree.io). Sign up for
// a free account, create a form, and replace the placeholder URL in the
// <form action="..."> attribute in index.html with your real endpoint.
// GitHub Pages is static hosting — it cannot receive form submissions
// on its own, so a service like Formspree (or EmailJS) is required.
// =====================================================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const contactSubmit = document.getElementById('contactSubmit');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (contactForm.action.includes('YOUR_FORM_ID')) {
      formStatus.textContent = 'Contact form not connected yet — replace the Formspree endpoint in index.html.';
      formStatus.style.color = '#e07a5f';
      return;
    }

    const originalText = contactSubmit.innerHTML;
    contactSubmit.innerHTML = 'Sending…';
    contactSubmit.disabled = true;
    formStatus.textContent = '';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formStatus.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
        formStatus.style.color = '';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
        formStatus.style.color = '#e07a5f';
      }
    } catch (err) {
      formStatus.textContent = 'Network error — please check your connection and try again.';
      formStatus.style.color = '#e07a5f';
    } finally {
      contactSubmit.innerHTML = originalText;
      contactSubmit.disabled = false;
    }
  });
}

// Shared nav behaviour: hamburger toggle + close on scroll
export const USER_ICON = `<svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;

export function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  // Toggle open/close on hamburger tap
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('open');
    // Animate the 3 bars into an X when open
    hamburger.classList.toggle('open');
  });

  // Close when tapping anywhere outside the nav
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-nav')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });

  // Close on scroll
  window.addEventListener('scroll', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }, { passive: true });

  // Close when a nav link is tapped (navigating away)
  navLinks.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

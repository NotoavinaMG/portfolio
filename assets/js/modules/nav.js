/**
 * Navigation :
 * - filet discret dès que la page défile ;
 * - se retire quand on descend, revient dès qu'on remonte ;
 * - souligne le lien de la section en cours.
 */
import { rafThrottle } from './motion.js';

const HIDE_AFTER = 0.8; // fraction de la hauteur d'écran avant de masquer
const DELTA = 6;        // px ignorés (tremblements du trackpad)

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;

  const targets = [...nav.querySelectorAll('.nav__links a[href^="#"]')]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((entry) => entry.section);

  let lastY = scrollY;
  let focusInside = false;

  const update = () => {
    const y = scrollY;
    nav.dataset.scrolled = String(y > 8);

    const delta = y - lastY;
    if (Math.abs(delta) > DELTA) {
      nav.dataset.hidden = String(delta > 0 && y > innerHeight * HIDE_AFTER && !focusInside);
      lastY = y;
    }
    if (y < 10) nav.dataset.hidden = 'false';

    let active = null;
    for (const { link, section } of targets) {
      if (section.getBoundingClientRect().top <= innerHeight * 0.4) active = link;
    }
    for (const { link } of targets) {
      if (link === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  nav.addEventListener('focusin', () => {
    focusInside = true;
    nav.dataset.hidden = 'false';
  });
  nav.addEventListener('focusout', () => {
    focusInside = false;
  });

  addEventListener('scroll', rafThrottle(update), { passive: true });
  addEventListener('resize', rafThrottle(update));
  update();
}

/**
 * Menu plein écran sur <dialog> natif : focus piégé, Échap et
 * arrière-plan inerte sont fournis par le navigateur.
 */
import { prefersReducedMotion } from './motion.js';

export function initMenu() {
  const dialog = document.getElementById('menu');
  const opener = document.querySelector('[data-menu-open]');
  if (!dialog || !opener || typeof dialog.showModal !== 'function') return;

  opener.addEventListener('click', () => {
    dialog.showModal();
    opener.setAttribute('aria-expanded', 'true');
  });

  dialog.addEventListener('close', () => {
    opener.setAttribute('aria-expanded', 'false');
  });

  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());

  // Le menu ne sert qu'en dessous de 960 px : on le ferme si l'écran s'élargit.
  matchMedia('(min-width: 960px)').addEventListener('change', (event) => {
    if (event.matches && dialog.open) dialog.close();
  });

  dialog.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    event.preventDefault();
    dialog.close();
    history.pushState(null, '', link.hash);
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    target.focus({ preventScroll: true });
  });
}

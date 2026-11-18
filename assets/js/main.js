/**
 * Point d'entrée. Chaque module est indépendant : si l'un échoue,
 * les autres continuent, et la page reste lisible sans aucun d'eux.
 * La langue passe en premier, avant que quoi que ce soit ne s'affiche.
 */
import { initI18n } from './modules/i18n.js';
import { initClock } from './modules/clock.js';
import { initHero } from './modules/hero.js';
import { initReveal } from './modules/reveal.js';
import { initNav } from './modules/nav.js';
import { initMenu } from './modules/menu.js';
import { initCopy } from './modules/copy.js';

window.__ntBooted = true;

for (const init of [initI18n, initClock, initHero, initReveal, initNav, initMenu, initCopy]) {
  try {
    init();
  } catch (error) {
    console.error(`[${init.name}]`, error);
  }
}

// Filet de sécurité : la page ne reste jamais masquée.
document.documentElement.classList.remove('i18n-pending');

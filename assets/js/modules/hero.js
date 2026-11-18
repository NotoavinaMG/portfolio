/**
 * Intro de l'accueil : on attend les polices (le titre est composé pour
 * Newsreader) avant de lever le rideau, avec un délai maximal.
 */

const MAX_WAIT = 1600;

export function initHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;

  const fonts = document.fonts
    ? Promise.all([
        document.fonts.load('350 1em Newsreader'),
        document.fonts.load('italic 350 1em Newsreader'),
        document.fonts.load('400 1em Archivo'),
      ])
    : Promise.resolve();

  const timeout = new Promise((resolve) => setTimeout(resolve, MAX_WAIT));

  Promise.race([fonts, timeout])
    .catch(() => {})
    .then(() => {
      // Deux images : la mise en page définitive est posée avant la transition.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => hero.classList.add('is-ready'));
      });
    });
}

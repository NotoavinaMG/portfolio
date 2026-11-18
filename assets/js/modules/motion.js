/** Préférences de mouvement et de pointeur, lues à la demande. */

const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const finePointerQuery = matchMedia('(hover: hover) and (pointer: fine)');

export const prefersReducedMotion = () => reducedQuery.matches;
export const hasFinePointer = () => finePointerQuery.matches;

/** Exécute `fn` au plus une fois par image. */
export function rafThrottle(fn) {
  let frame = 0;
  return (...args) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...args);
    });
  };
}

/** Heure d'Antananarivo, recalée sur chaque changement de minute. */

const format = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Indian/Antananarivo',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function initClock() {
  const nodes = document.querySelectorAll('[data-clock]');
  if (!nodes.length) return;

  const tick = () => {
    const now = new Date();
    const text = format.format(now);
    for (const node of nodes) {
      node.textContent = text;
      node.setAttribute('datetime', text);
    }
    const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    setTimeout(tick, msToNextMinute + 50);
  };

  tick();
}

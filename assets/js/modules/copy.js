/** Copie de l'adresse e-mail, avec retour visuel et annonce vocale. */
import { t } from './i18n.js';

const RESET = 2200;

export function initCopy() {
  const status = document.querySelector('[data-copy-status]');

  document.querySelectorAll('[data-copy]').forEach((button) => {
    let timer = 0;

    button.addEventListener('click', async () => {
      const copied = await copyText(button.dataset.copy);

      if (status) status.textContent = t(copied ? 'copy.success' : 'copy.error');
      if (!copied) return;

      button.dataset.state = 'copied';
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.dataset.state = '';
        if (status) status.textContent = '';
      }, RESET);
    });
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.append(area);
    area.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    area.remove();
    return copied;
  }
}

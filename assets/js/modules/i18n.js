/**
 * Bascule de langue FR / EN.
 *
 * - Le français est la source : au démarrage, on mémorise le contenu des
 *   éléments [data-i18n] et des attributs [data-i18n-attr] tels qu'écrits
 *   dans le HTML. L'anglais vient de i18n/en.js.
 * - La langue initiale est choisie par le script en ligne du <head>
 *   (?lang=…, puis préférence enregistrée, sinon français) et posée sur
 *   <html data-lang>, ce qui évite tout flash.
 * - Le choix est mémorisé et reflété dans l'URL (?lang=en) pour le partage.
 */
import { en } from '../i18n/en.js';
import { fr } from '../i18n/fr.js';

const LANGS = ['fr', 'en'];
const STORAGE_KEY = 'nt-lang';
const SWAP_MS = 160;

const root = document.documentElement;
const originals = new Map(); // élément -> { html?, attrs: [[attr, clé, valeur fr]] }
let current = 'fr';
let switchToken = 0;

export const getLang = () => current;

/** Texte d'interface produit par le JS, dans la langue courante. */
export function t(key) {
  const dict = current === 'en' ? en : fr;
  return dict[key] ?? fr[key] ?? key;
}

export function initI18n() {
  capture();
  checkKeys();

  const initial = LANGS.includes(root.dataset.lang) ? root.dataset.lang : 'fr';
  render(initial);
  syncUrl(initial); // un lien copié s'ouvre dans la même langue
  root.classList.remove('i18n-pending');

  for (const button of document.querySelectorAll('[data-lang-set]')) {
    button.addEventListener('click', () => switchTo(button.dataset.langSet));
  }
}

/* ------------------------------------------------------------------------ */

function capture() {
  for (const el of document.querySelectorAll('[data-i18n]')) {
    originals.set(el, { html: el.innerHTML, attrs: [] });
  }
  for (const el of document.querySelectorAll('[data-i18n-attr]')) {
    const entry = originals.get(el) ?? { attrs: [] };
    entry.attrs = el.dataset.i18nAttr.split(',').map((pair) => {
      const [attr, key] = pair.split(':').map((part) => part.trim());
      return [attr, key, el.getAttribute(attr)];
    });
    originals.set(el, entry);
  }
}

function checkKeys() {
  const missing = new Set();
  for (const [el, entry] of originals) {
    if ('html' in entry && !(el.dataset.i18n in en)) missing.add(el.dataset.i18n);
    for (const [, key] of entry.attrs) if (!(key in en)) missing.add(key);
  }
  if (missing.size) console.warn('[i18n] Clés absentes de en.js :', [...missing]);
}

function render(lang) {
  for (const [el, entry] of originals) {
    if ('html' in entry) {
      const html = lang === 'fr' ? entry.html : en[el.dataset.i18n];
      if (html !== undefined && el.innerHTML !== html) el.innerHTML = html;
    }
    for (const [attr, key, original] of entry.attrs) {
      const value = lang === 'fr' ? original : en[key];
      if (value !== undefined && value !== null) el.setAttribute(attr, value);
    }
  }

  for (const button of document.querySelectorAll('[data-lang-set]')) {
    button.setAttribute('aria-pressed', String(button.dataset.langSet === lang));
  }

  root.lang = lang;
  root.dataset.lang = lang;
  current = lang;
}

async function switchTo(lang) {
  if (!LANGS.includes(lang) || lang === current) return;
  const token = ++switchToken;

  // Fondu court : le texte s'efface, change, revient.
  root.classList.add('is-switching');
  await new Promise((resolve) => setTimeout(resolve, SWAP_MS));
  if (token !== switchToken) return;

  render(lang);
  persist(lang);
  requestAnimationFrame(() => root.classList.remove('is-switching'));

  const status = document.querySelector('[data-lang-status]');
  if (status) status.textContent = t('lang.changed');
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function persist(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* stockage indisponible (navigation privée) : on ignore */
  }
  syncUrl(lang);
}

function syncUrl(lang) {
  const url = new URL(location.href);
  const before = url.search;
  if (lang === 'fr') url.searchParams.delete('lang');
  else url.searchParams.set('lang', lang);
  if (url.search !== before) history.replaceState(history.state, '', url);
}

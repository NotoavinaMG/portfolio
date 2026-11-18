# Portfolio — Notoavina Tsiresiharidera

Portfolio de développeur frontend : papier, encre et une seule couleur, la latérite
de l’Île Rouge. Titres en serif, interface en sans-serif, illustrations dessinées en SVG
(soleil sur les rizières en terrasses des hautes terres).

Site statique en HTML, CSS et JavaScript natifs, sans framework ni build, déployable
tel quel. En ligne sur <https://portfolio-nauh.onrender.com>.

## Lancer en local

```bash
python .claude/serve.py 5173
```

Puis ouvrir <http://127.0.0.1:5173>. Ce serveur désactive le cache navigateur. Les
modules ES ne fonctionnent pas en `file://`, d’où le serveur.

## Structure

```
index.html                  tout le contenu (SEO) : accueil, expérience chez, services, projets, méthode, à propos, parcours, compétences, contact
assets/
  css/
    tokens.css              couleurs, typo, espacements, courbes ; ordre des @layer
    base.css                reset, lecture, focus, .sr-only
    components.css          conteneur, surtitres, boutons, navigation, menu mobile, têtes de section, révélations
    sections/*.css          un fichier par section (hero, services, projects, process, about, experience, skills, contact)
  js/
    main.js                 démarre chaque module isolément (la langue d’abord)
    modules/*.js            i18n, clock, hero, reveal, nav, menu, copy (+ motion, utilitaires)
    i18n/en.js              toutes les traductions anglaises
    i18n/fr.js              messages français produits par le JS
  img/
    art/*.svg               illustrations des projets
    favicon.svg, apple-touch-icon.png, og.png
  cv/notoavina-tsiresiharidera-cv.pdf      CV français (accueil et contact, mode FR)
  cv/notoavina-tsiresiharidera-cv-en.pdf   CV anglais (mêmes boutons, mode EN)
design/
  og.html, touch-icon.html  gabarits des images (rendu Chrome headless)
  cv/cv-fr.html, cv-en.html gabarits A4 des CV français et anglais
  cv/cv.css                 styles communs aux deux CV (+ photo et icônes extraites du CV d’origine)
.claude/skills/emil-design-eng   skill de design engineering d’Emil Kowalski (MIT)
```

## Système

- **Palette** : papier `#f3f0ea`, surfaces `#eae5dc`, encre `#1b1815`, texte secondaire
  `#6a6158`, latérite `#b4441f` (accent), braise `#e0703f` (accent sur fond encre).
  Contrastes AA vérifiés.
- **Typographie** : Newsreader (titres, citations, listes) et Archivo (texte, interface).
  Les mots mis en avant dans les titres sont en italique latérite.
- **Grille** : contenu limité à 1280 px, têtes de section identiques partout
  (surtitre numéroté, titre, chapô aligné à droite).
- **Mouvement** : `transform` et `opacity` uniquement, courbes `--ease-*` de `tokens.css`,
  survols limités à `(hover: hover) and (pointer: fine)`, `prefers-reduced-motion` respecté.
  L’illustration d’accueil se lève à l’arrivée et suit le défilement en parallaxe légère.

## Langues (FR / EN)

- Le **français est la source** : il est écrit dans `index.html`. Chaque texte traduisible
  porte `data-i18n="clé"` (contenu, balises comme `<em>` autorisées) ou
  `data-i18n-attr="aria-label:clé"` (attributs).
- L’**anglais** est dans `assets/js/i18n/en.js`, sous les mêmes clés. Une clé présente dans
  le HTML mais absente de `en.js` est signalée dans la console.
- Pour ajouter ou modifier un texte : l’écrire en français dans le HTML avec sa clé, puis
  ajouter la même clé en anglais dans `en.js`.
- Langue au chargement : `?lang=en` dans l’URL, sinon la préférence enregistrée
  (`localStorage`), sinon le français. Le lien `https://portfolio-nauh.onrender.com/?lang=en`
  peut être envoyé directement à un recruteur anglophone.

## Mise à jour du contenu

- Projets mis en avant : `index.html`, liste `.cards` (une illustration par carte dans
  `assets/img/art/`). Autres projets : liste `.more__list`.
- Parcours : liste `.jobs` (le poste actuel porte `job--current`). Compétences :
  `.skills__grid`, la stack principale porte la classe `is-core`.
- CV : modifier `design/cv/cv-fr.html` et/ou `design/cv/cv-en.html` (styles dans `cv.css`),
  lancer le serveur local, puis régénérer les PDF (une page A4 chacun) :

  ```bash
  "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=assets/cv/notoavina-tsiresiharidera-cv.pdf http://127.0.0.1:5173/design/cv/cv-fr.html
  ```

  ```bash
  "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=assets/cv/notoavina-tsiresiharidera-cv-en.pdf http://127.0.0.1:5173/design/cv/cv-en.html
  ```
- Domaine : si le site quitte `portfolio-nauh.onrender.com`, mettre à jour `canonical`,
  les `hreflang`, `og:url`, `og:image`, le JSON-LD, `robots.txt` et `sitemap.xml`.

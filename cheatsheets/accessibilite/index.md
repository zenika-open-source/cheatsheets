::: column
# Référentiels
[RGAA: Régérentiel général d'amélioration de l'accessibilité](https://accessibilite.numerique.gouv.fr/): Obligations légales, critères de contrôles et tests\
[WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/): Standards internationaux\
[ARA](https://ara.numerique.gouv.fr/): Plateforme d'audit, avec une valeur légale

# Légal
Concerne les **organismes publics**
Mais également les **entreprises privées**
  - Avec un chiffre d'affaire supérieur à 250 millions d'euros par an
  - Certaines liées au secteur public ou subventionnés 

Et à partir de **Juin 2025**: extension des obligations
  - Pour le e-commerce, guichets automatiques (banques, transports), liseuses, logiciels, terminaux de paiement, services de téléphonie et messagerie, billetterie en ligne notamment.
  - Jusqu'à 2030 pour s'y conformer pour les services existants avant le 28 Juin 2025. Obligatoire dès 2025 pour les nouveaux services.

Des sanctions:
  - Jusqu'à **50 000 euros** d'amendes par service non conforme **RGAA** - renouvelable tous les 6 mois
  - **25 000 euros** d'amende supplémentaire si aucune communication du niveau d'accessibilité et aucune planification.

# Guidelines

## Stucture HTML

**Spécifier la langue de la page** 
```html
<html lang="fr">
```
*Facilite la vocalisation correcte du contenu par les lecteurs d’écran.*\
\
**Utiliser une seule balise `<title>` et `<h1>` par page**     
```html
<title>Accueil - Site</title>
<h1>Ma Page</h1>
```
*Clarifie l’intitulé dans l’onglet et structurer visuellement le contenu.*\
\
**Respecter la hiérarchie des titres dans le DOM**
```html
<h1>Services</h1>
<h2>Consulting</h2>
<h3>Offre PME</h3>
```
*La hiérarchie est utilisée pour naviguer selon l'importance du contenu. C'est facilement testable avec un plugin comme [HeadingsMap](https://chrome.google.com/webstore/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi)*

:::
::: column

**Utiliser les balises HTML sémantiques natives**
```html
<nav>...</nav>
<main>...</main>
<aside>...</aside>
...
```
*⚠️ Les attributs ARIA sont à ajouter uniquement si nécessaire, en complément de la sémantique native.*\
\
**Utiliser les tag HTML en spécifiant les rôles**
```html
<header role="banner"></header>
<footer role="contentinfo"></footer>
```
*⚠️ Les rôles doivent être uniques*\
\
**Structurer les menus ou fil d’Ariane avec des listes (`<ul>`, `<ol>`, `<li>`)**
```html
<nav>
  <ul>
    <li><a href="/">Accueil</a></li>
    <li><a href="/services">Services</a></li>
  </ul>
</nav>
```
*Aide à la vocalisation et à la navigation*\
\
**Identifier la page active dans un menu**
```html
<a href="/contact" aria-current="page">Contact</a>
```
*Il est important de signaler explicitement l’état actif.*

## Visuel et CSS

**Utiliser des unités relatives (rem, %, em)**
```css
font-size: 1rem;
```
*Permettre un zoom efficace et lisible.*\
\
**Conserver l'outline par défaut des éléments focusables**
⚠️ Eviter `outline:none !important`
*L'outline est nécessaire pour le focus visuel à la navigation*\
\
**Vérifier les contrastes de couleurs**
```css
color: #000;
background-color: #fff;
```
*Respecter un ratio minimum de 4.5:1 pour le texte. (niveau AA du WCAG). Testable avec un plugin comme [WCAG Color contrast checker](https://chromewebstore.google.com/detail/wcag-color-contrast-check/plnahcmalebffmaghcpcmpaciebdhgdf)*\
\
**Ne pas utiliser ::before ou ::after pour du contenu informatif**
```
::before {
  content: "⚠️";
}
```
*Les contenus générés par les pseudo éléments ne sont pas toujours lus par les lecteurs d’écran.*\
\
**Assurer une lisibilité du contenu des page jusqu'à 200 % de zoom sans perte d'information ou de fonctionnalité**\
\
**Ne pas transmettre l'information uniquement par la couleur**\
*Indiquer par exemple des erreurs de formulaire ou des informations d'état via le texte en complément d'une couleur*

:::
::: column

**S'adapter aux différentes tailles d'écran**\
*Proposer un design responsive ou adaptative si possible*\
\
**Eviter les éléments trop petits ou trop rapprochés pour les clics**\
*Mettre en place des paddings/marges sur les éléments interactifs*

## Images

**Fournir un attribut `alt` pertinent**
```html
<img src="profil.jpg" alt="Portrait de Michel michel">
```
*Laisser l'attribut `alt` à vide si l'image est uniquement décorative. Elle sera alors ignorée par les vocalisateurs*\
\
**Utiliser `role="img"` sur les SVG porteurs d'information**
```html
<svg role="img" aria-label="Logo de l'entreprise">...</svg>
```
*Permettre la vocalisation du contenu SVG*\
\
**Retirer de la navigation/vocalisation les svg uniquement décoratifs**
```html
<svg aria-hidden="true" focusable="false">...</svg>
```
ou
```html
<svg tabindex="-1">...</svg>
```

## Navigation

**Garantir l’accès clavier à tous les éléments interactifs**
*Tout ce qui est cliquable doit être navigable avec Tab et activable avec Entrée/Espace.*\
\
**Ajouter un lien d’évitement ([skiplink](https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/lien-d-evitement/))**
```html
<a href="#main" class="sr-only sr-only-focusable">Aller au contenu</a>
```
*Faciliter l'accès direct au contenu pour les utilisateurs clavier.*\
\
**Suivre un ordre de tabulation logique**
```html
<header>
  <nav>...</nav>
</header>
<main>...</main>
<footer>...</footer>
```
*L’ordre DOM doit correspondre à l’ordre visuel et logique.*\
\
**Boucler le focus dans les modales**\
*Empêcher le focus de sortir de la modale tant qu’elle est ouverte.*\
\
**Ne pas forcer un tabindex supérieur à 0**
```html
<div tabindex="0">Focusable</div>
```
*Éviter tabindex="1" ou plus pour ne pas casser l’ordre naturel.*\
\
**Masquer les éléments inutiles au focus**
```html
<div tabindex="-1" aria-hidden="true"></div>
```
*Éviter la navigation sur les éléments décoratifs ou inactifs.*

:::
::: column

**Différencier clairement liens et boutons**
```html
<a href="/contact">Page Contact</a>
<button type="submit">Envoyer</button>
```
*Utiliser les balises pour ce pourquoi elles sont prévues.*\
\
**Rendre explicite le comportement d’un lien**
```html
<a href="cv.pdf" aria-label="Télécharger le CV (PDF, 300 Ko)">CV</a>
```
*Préciser si téléchargement, nouvelle fenêtre ou format particulier.*

## Formulaires

**Accompagner les champs d’un label et d'un format clair**
```html
<label for="date">
  Date de naissance <span>(jj/mm/aaaa)</span>
</label>
<input type="date" id="date">
```
*Préciser le format attendu sans se reposer uniquement sur le placeholder.*\
\
**Grouper les champs connexes**
```html
  <fieldset>
    <legend>Adresse</legend>
    ...
  </fieldset>
```
*Aider à la compréhension et à la vocalisation. Voir la [documentation de fieldset](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements/fieldset)*\
\
**Ajouter des indications si besoin avec aria-describedby**
```html
<input id="file" aria-describedby="fileHelp">
<p id="fileHelp">Formats acceptés : PDF, DOC</p>
```
*Fournir une aide supplémentaire pour la saisie.*\
\
**Utiliser autocomplete là où pertinent**
```html
<input type="text" autocomplete="given-name">
```
*Améliorer l’expérience utilisateur et la saisie. Voir la documentation de [l'autocomplete](https://developer.mozilla.org/fr/docs/Web/HTML/Attributes/autocomplete)*\
\
**Indiquer les erreurs associées aux champs requis**
```html
<input type="text" required aria-describedby="error">
<span id="error">Ce champ est obligatoire</span>
```
*Signaler visuellement et vocalement l’erreur.*

# Outils/Aides
[MDN](https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements)\
[WCAG Color contrast checker](https://chromewebstore.google.com/detail/wcag-color-contrast-check/plnahcmalebffmaghcpcmpaciebdhgdf)\
[Headingsmap](https://chromewebstore.google.com/detail/headingsmap/flbjommegcjonpdmenkdiocclhjacmbi)\
[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview?hl=fr)\
[JAWS](https://www.freedomscientific.com/products/software/jaws/)\
[NVDA](https://www.nvaccess.org/)

:::
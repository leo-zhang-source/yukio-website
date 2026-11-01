# Yukio website

The English / Chinese promotional website for [Yukio](https://github.com/leo-zhang-source/yukio-desktop-pet), with original character artwork, twelve animations, a draggable companion, workbench previews and Mac downloads.

Public website: https://leo-zhang-source.github.io/yukio-website/

## Local preview

Run `npm run dev`, then open http://127.0.0.1:4173. No npm dependencies or build step are needed. The deployable website is `dist/`.

## Editing and validation

The active theme is `dist/taste.css`. Homepage copy is in `dist/brand-copy.js`; run `node scripts/sync-copy.mjs` after editing it to update the initial English HTML. `dist/download-page.js` contains the installation page translations. English is the default; the Chinese switch remembers the visitor's choice. Keep the website silent.

Run `npm run check` to validate JavaScript, local assets, animation timelines and installer integrity. `npm run test:physics` and `npm run test:demo` check dragging and the animation cycle.

The removed source guide has no navigation entry. `dist/source.html` only redirects old links to the homepage. The footer links directly to the desktop application's GitHub repository.

## Downloads

Apple silicon Mac: Yukio 5.3, 76,480,917 bytes, SHA-256 `9f674e169273521b0033f0daff19a0af0ebdf0151ea45da702bdce7fd129c700`. The original ZIP is hosted in five parts under `dist/downloads/`. The browser downloads, verifies and combines them; JavaScript is required. `scripts/prepare-download.mjs` accepts only that exact archive. The download entry is `download.html?package=mac-arm64`, with installation help at `download.html#install`.

Intel Mac downloads point to the desktop application's v0.4.6 release. Windows downloads are unavailable. Preserve those platform distinctions and do not replace published installer bytes during website edits.

## Hosting and assets

GitHub Pages is deployed by `.github/workflows/pages.yml`. This repository is separate from the desktop application. `scripts/` records the original asset provenance; character artwork belongs to the Yukio project. Self-hosted font licenses are retained in `dist/assets/`. No project license is inferred from public repository access.

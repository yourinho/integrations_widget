# Albato Apps Widget

Embeddable widget for Albato Embedded clients — shows integrations gallery on landing pages.

## Table of Contents

- [Development](#development)
- [Build](#build)
- [Embedding](#embedding)
- [Размещение на GitHub](#размещение-на-github)

---

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build           # standard widget
npm run build:global    # global variant (regions 2,3 by default; no ru locale)
npm run build:all       # both variants
```

Output:
- `dist/albato-widget.iife.js` — standard
- `dist/albato-widget-global.iife.js` — global variant

## Embedding

```html
<div id="albato-widget"></div>
<script src="https://yourinho.github.io/integrations_widget/albato-widget.iife.js"></script>
<script>
  AlbatoWidget.initWidget({
    container: document.getElementById('albato-widget'),
    regions: [2, 3],           // optional: only partners with region 2 or 3
    font: "'Open Sans', sans-serif",  // optional: custom font
    colors: { primary: '#1a56db', textMuted: '#6b7280' }  // optional: brand colors
  });
</script>
```

**Options:**
- `container` (required) — DOM element to mount the widget
- `regions` (optional) — array of region IDs to filter partners (e.g. `[2, 3]` for BR and Global). Omit to show all.
- `partnerIds` (optional) — allowlist of partner IDs (e.g. `[5, 10, 15]`)
- `language` (optional) — locale: `'de'`, `'en'`, `'es'`, `'fr'`, `'pt'`, `'tr'`. Default: `'en'`
- `font` (optional) — font-family (e.g. `"'Open Sans', sans-serif"`)
- `colors` (optional) — color overrides: `primary`, `background`, `surface`, `text`, `textMuted`, `border`, `textOnPrimary`, `cardBackground`, `detailCardBackground`, plus extended keys (see [EMBEDDING_TUTORIAL.md](EMBEDDING_TUTORIAL.md))
- `cardSize`, `detailCardSize` (optional) — `'l'` | `'m'` | `'s'`
- `detailLayout` (optional) — `'stacked'` | `'columns'`
- `align` (optional) — `'center'` | `'left'` | `'right'`
- `cardRadius`, `detailCardRadius` (optional) — CSS value (e.g. `"16px"`)
- `typography` (optional) — font sizes and weights per element
- `texts` (optional) — UI string overrides
- `showGalleryTitle`, `showSearch`, `showShowMore`, etc. (optional) — visibility toggles
- `maxWidth`, `galleryPadding`, `galleryGap`, etc. (optional) — layout spacing

See [EMBEDDING_TUTORIAL.md](EMBEDDING_TUTORIAL.md) for full reference and `examples/embed-all-options.html` for all options.

## Размещение на GitHub

Подробная инструкция по публикации виджета на GitHub Pages — в файле [GITHUB_PAGES.md](GITHUB_PAGES.md).

Кратко:

1. Соберите проект: `npm run build`
2. Опубликуйте папку `dist/` на GitHub Pages (ветка `gh-pages` или GitHub Actions)
3. Виджет будет доступен по адресу: `https://yourinho.github.io/integrations_widget/albato-widget.iife.js`

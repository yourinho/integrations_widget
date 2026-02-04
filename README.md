# Albato Apps Widget

Embeddable widget for Albato Embedded clients — shows integrations gallery on landing pages.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
```

Output: `dist/albato-widget.iife.js`

## Embedding

```html
<div id="albato-widget"></div>
<script src="path/to/albato-widget.iife.js"></script>
<script>
  AlbatoWidget.initWidget({
    container: document.getElementById('albato-widget'),
    regions: [2, 3],           // optional: only partners with region 2 or 3
    font: "'Open Sans', sans-serif"  // optional: custom font
  });
</script>
```

**Options:**
- `container` (required) — DOM element to mount the widget
- `regions` (optional) — array of region IDs to filter partners (e.g. `[2, 3]`). Omit to show all.
- `font` (optional) — font-family string (e.g. `"Inter, sans-serif"` or `"'Open Sans', sans-serif"`). Load the font on your page first (e.g. via Google Fonts).

See `examples/embed.html` for a full example.

## Размещение на GitHub

Подробная инструкция по публикации виджета на GitHub Pages — в файле [GITHUB_PAGES.md](GITHUB_PAGES.md).

Кратко:

1. Соберите проект: `npm run build`
2. Опубликуйте папку `dist/` на GitHub Pages (ветка `gh-pages` или GitHub Actions)
3. Виджет будет доступен по адресу: `https://USERNAME.github.io/REPO/albato-widget.iife.js`

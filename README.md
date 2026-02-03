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
<script>AlbatoWidget.initWidget({ container: document.getElementById('albato-widget') });</script>
```

See `examples/embed.html` for a full example.

## Размещение на GitHub

Подробная инструкция по публикации виджета на GitHub Pages — в файле [GITHUB_PAGES.md](GITHUB_PAGES.md).

Кратко:

1. Соберите проект: `npm run build`
2. Опубликуйте папку `dist/` на GitHub Pages (ветка `gh-pages` или GitHub Actions)
3. Виджет будет доступен по адресу: `https://USERNAME.github.io/REPO/albato-widget.iife.js`

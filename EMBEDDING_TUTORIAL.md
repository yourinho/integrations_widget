# Albato Apps Widget — Embedding Tutorial

This guide explains how to embed the Albato Apps Widget on your website. The widget displays a gallery of integrations and allows visitors to browse available services, triggers, and actions.

---

## Quick Start

To embed the widget, add two things to your page:

1. A **container element** (e.g. a `<div>`) where the widget will render
2. A **script tag** that loads the widget and initializes it

### Minimal Example

```html
<div id="albato-widget"></div>
<script src="https://yourinho.github.io/integrations_widget/albato-widget.iife.js"></script>
<script>
  AlbatoWidget.initWidget({
    container: document.getElementById('albato-widget')
  });
</script>
```

Place the container where you want the widget to appear. Load the script (either in `<head>` or before `</body>`), then call `AlbatoWidget.initWidget()` after the DOM is ready.

---

## Full Example Page

Here is a complete HTML page with the widget embedded:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page with Integrations</title>
  <style>
    .widget-container {
      width: 100%;
      max-width: 1200px;
      min-height: 400px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <h1>Available Integrations</h1>
  <div id="albato-widget" class="widget-container"></div>

  <script src="https://yourinho.github.io/integrations_widget/albato-widget.iife.js"></script>
  <script>
    AlbatoWidget.initWidget({
      container: document.getElementById('albato-widget')
    });
  </script>
</body>
</html>
```

**Important:** The script must run **after** the container element exists in the DOM. Placing it at the end of `<body>` (as above) ensures this.

---

## Configuration Options

`initWidget()` accepts an object with the following options:

| Option     | Required | Description |
|-----------|----------|-------------|
| `container` | **Yes** | The DOM element where the widget will be mounted. Usually a `<div>`. |
| `regions`   | No      | Array of region IDs to filter integrations. `2` = BR (Brazil), `3` = global. Omit to show all. |
| `font`      | No      | Custom font-family for the widget (e.g. `"Inter, sans-serif"`). Load the font on your page first. |

### Example with All Options

```html
<script src="https://yourinho.github.io/integrations_widget/albato-widget.iife.js"></script>
<script>
  AlbatoWidget.initWidget({
    container: document.getElementById('albato-widget'),
    regions: [2, 3],
    font: "'Open Sans', sans-serif"
  });
</script>
```

---

## Option Details

### `container` (required)

The HTML element that will hold the widget. The widget will fill the width of this element and adapt to its size.

```javascript
container: document.getElementById('albato-widget')
```

Or with a different selector:

```javascript
container: document.querySelector('.my-widget-placeholder')
```

---

### `regions` (optional)

If you need to show only integrations from specific regions, pass an array of region IDs:

```javascript
regions: [2, 3]
```

Region IDs:
- **2** — BR (Brazil)
- **3** — Global

Integrations whose `region` includes any of the specified IDs will be displayed. Omit this option to show all integrations.

---

### `font` (optional)

To match the widget’s typography to your site, pass a `font-family` value:

```javascript
font: "'Open Sans', sans-serif"
```

Load the font on your page first, for example via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

If `font` is omitted, the widget uses Inter by default.

---

## Live Examples

- **Basic embed:** [https://yourinho.github.io/integrations_widget/](https://yourinho.github.io/integrations_widget/)
- Additional examples are available in the `examples/` folder of this repository.

---

## Styling Tips

- Give the container a `min-height` (e.g. 400px) to avoid layout shifts while the widget loads.
- The widget is responsive; use `max-width` on the container to limit width on large screens.
- The widget uses `box-sizing: border-box` and adapts to the container’s width.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget does not appear | Ensure the script loads after the container exists. Check the browser console for errors. |
| Wrong integrations shown | Verify the `regions` option if you use it. Use only numeric IDs, e.g. `[2, 3]`. |
| Font looks different | Load your font (e.g. from Google Fonts) before the widget script, and pass the `font` option. |

---

## Script URL

Use this URL to load the widget script:

```
https://yourinho.github.io/integrations_widget/albato-widget.iife.js
```

Do not modify or host this file yourself unless you have a custom deployment setup.

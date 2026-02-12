# Albato Apps Widget — Embedding Tutorial

This guide explains how to embed the Albato Apps Widget on your website. The widget displays a gallery of integrations and allows visitors to browse available services, triggers, and actions.

## Table of Contents

- [Quick Start](#quick-start)
- [Full Example Page](#full-example-page)
- [Configuration Options](#configuration-options)
- [Option Details](#option-details)
  - [container](#container-required)
  - [regions](#regions-optional)
  - [font](#font-optional)
  - [colors](#colors-optional)
  - [cardSize](#cardsize-optional)
  - [detailCardSize](#detailcardsize-optional)
  - [detailLayout](#detaillayout-optional)
  - [partnerIds](#partnerids-optional)
  - [align](#align-optional)
  - [cardRadius](#cardradius-optional)
  - [detailCardRadius](#detailcardradius-optional)
- [Live Examples](#live-examples)
- [Styling Tips](#styling-tips)
- [Resilient embed](#resilient-embed-handling-script-load-failure)
- [Troubleshooting](#troubleshooting)
- [Script URL](#script-url)

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

Here is a complete HTML page with the widget embedded, styled like the [demo page](https://yourinho.github.io/integrations_widget/):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page with Integrations</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 32px 20px 48px;
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .demo-header {
      text-align: center;
      margin-bottom: 24px;
      max-width: 600px;
    }
    .demo-header h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 700;
      color: #2C3534;
    }
    .demo-header p {
      margin: 0;
      font-size: 15px;
      line-height: 1.5;
      color: #6b7280;
    }
    .demo-label {
      display: inline-block;
      margin-bottom: 12px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      background: #e5e7eb;
      border-radius: 6px;
    }
    .widget-wrapper {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      overflow-x: hidden;
      width: 100%;
      max-width: 1200px;
    }
    .widget-container {
      width: 100%;
      max-width: 1200px;
      min-height: 400px;
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="demo-header">
    <span class="demo-label">Demo page</span>
    <h1>Albato Apps Widget</h1>
    <p>This page demonstrates the embeddable integrations gallery. The widget is loaded into the container below. Copy the HTML structure to embed it on your own site.</p>
  </header>
  <div class="widget-wrapper">
    <div id="albato-widget" class="widget-container"></div>
  </div>

  <!-- INSERT WIDGET SCRIPT BELOW: Load the widget and initialize it in your container -->
  <script src="https://yourinho.github.io/integrations_widget/albato-widget.iife.js"></script>
  <script>
    // Mount the widget into the container (change "albato-widget" if you use a different id)
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
| `colors`    | No      | Object with color overrides for branding: `primary`, `background`, `surface`, `text`, `textMuted`, `border`, `textOnPrimary`. |
| `cardSize`      | No      | Partner card size: `'l'` (180px, default), `'m'` (150px), `'s'` (120px). |
| `detailCardSize`| No      | Trigger/action card size: `'l'` (330×136px, default), `'m'` (270×112px), `'s'` (210×88px). |
| `detailLayout`  | No      | Detail view layout: `'stacked'` (default), `'columns'` (triggers and actions in two columns, no tabs). |
| `partnerIds`    | No      | Allowlist of partner IDs to show (e.g. `[5, 10, 15]`). For paid clients with a limited set. |
| `align`         | No      | Content alignment: `'center'` (default), `'left'`, `'right'`. |
| `cardRadius`    | No      | Border radius for partner cards (e.g. `"16px"`, `"8px"`, `"0"`). Default: `"16px"`. |
| `detailCardRadius` | No    | Border radius for trigger/action cards (e.g. `"16px"`, `"8px"`, `"0"`). Default: `"16px"`. |

### Example with All Options

```html
<script src="https://yourinho.github.io/integrations_widget/albato-widget.iife.js"></script>
<script>
  AlbatoWidget.initWidget({
    container: document.getElementById('albato-widget'),
    regions: [2, 3],                          // optional
    font: "'Open Sans', sans-serif",          // optional
    colors: { primary: '#1a56db', textMuted: '#6b7280' },
    cardSize: 'm',                            // optional: 'l' | 'm' | 's'
    detailCardSize: 'm',                      // optional: 'l' | 'm' | 's'
    detailLayout: 'columns',                  // optional: 'stacked' | 'columns'
    partnerIds: [5, 10, 15],                 // optional: allowlist
    align: 'left',                            // optional: 'center' | 'left' | 'right'
    cardRadius: '12px',                       // optional: partner card radius
    detailCardRadius: '8px'                   // optional: trigger/action card radius
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

### `colors` (optional)

To match the widget’s colors to your brand, pass an object with one or more of these keys:

| Key | Role | Default |
|-----|------|---------|
| `primary` | Active tab, hover states, accents | `#2C3534` |
| `background` | Panels, inputs; fallback for card backgrounds | `#FFFFFF` |
| `surface` | Card footers, hover areas | `#F4F5F6` |
| `text` | Main text | `#2C3534` |
| `textMuted` | Secondary text, placeholders | `#A0A4B1` |
| `border` | Borders, dividers | `#E6E8EC` |
| `textOnPrimary` | Text on primary background | `#FFFFFF` |
| `cardBackground` | Partner card background in gallery | Same as `background` |
| `detailCardBackground` | Trigger/action card background on detail page | Same as `background` |

You can override only the colors you need:

```javascript
colors: { primary: '#1a56db', textMuted: '#6b7280' }
```

Values must be valid CSS color strings (hex, rgb, etc.).

---

### `cardSize` (optional)

Choose the size of partner cards in the gallery:

| Value | Size | Description |
|-------|------|-------------|
| `'l'` | 180×180px | Large (default) |
| `'m'` | 150×150px | Medium |
| `'s'` | 120×120px | Small |

```javascript
cardSize: 'm'
```

On mobile, cards adapt to fit the screen width regardless of this setting.

---

### `detailCardSize` (optional)

Choose the size of trigger and action cards on the service detail page:

| Value | Size | Description |
|-------|------|-------------|
| `'l'` | 330×136px | Large (default) |
| `'m'` | 270×112px | Medium |
| `'s'` | 210×88px | Small |

```javascript
detailCardSize: 'm'
```

On mobile, cards adapt to fit the screen width regardless of this setting.

---

### `detailLayout` (optional)

Choose how triggers and actions are displayed on the service detail page:

| Value | Description |
|-------|-------------|
| `'stacked'` | Blocks one under another, with tabs (Triggers&Actions, Triggers, Actions). Default. |
| `'columns'` | Two columns side by side: triggers on the left, actions on the right. Tab bar is hidden, both sections always visible. Use `align` to position columns (left/center/right). |

```javascript
detailLayout: 'columns'
```

On screens under 900px, columns stack vertically.

---

### `partnerIds` (optional)

For paid clients who have access only to a limited set of integrations, pass an array of partner IDs. Only those partners will be displayed:

```javascript
partnerIds: [5, 10, 15, 20]
```

You can combine `partnerIds` with `regions` — the widget will show partners that match both filters. Pass numeric IDs; string IDs like `"10"` are also accepted.

---

### `align` (optional)

Choose content alignment for the gallery and detail view:

| Value | Description |
|-------|-------------|
| `'center'` | Centered (default) |
| `'left'` | Left-aligned |
| `'right'` | Right-aligned |

```javascript
align: 'left'
```

---

### `cardRadius` (optional)

Border radius for partner cards in the gallery. Pass a CSS value (e.g. `"16px"`, `"8px"`, `"0"`):

```javascript
cardRadius: '12px'
```

Default: `"16px"`.

---

### `detailCardRadius` (optional)

Border radius for trigger and action cards on the service detail page:

```javascript
detailCardRadius: '8px'
```

Default: `"16px"`.

---

## Live Examples

- **Basic embed:** [https://yourinho.github.io/integrations_widget/](https://yourinho.github.io/integrations_widget/)
- **Examples** in the `examples/` folder: `embed.html`, `embed-regions-filter.html`, `embed-dark-theme.html`, `embed-card-size.html`, `embed-card-radius.html`, `embed-card-background.html`, `embed-detail-columns.html`, `embed-partner-ids.html`, `embed-align-left.html`.

---

## Styling Tips

- Give the container a `min-height` (e.g. 400px) to avoid layout shifts while the widget loads.
- The widget is responsive; use `max-width` on the container to limit width on large screens.
- The widget uses `box-sizing: border-box` and adapts to the container’s width.

---

## Resilient embed (handling script load failure)

If the widget script fails to load (network issues, CDN down, ad blocker, etc.), the embed area may appear empty or broken. To avoid this, use dynamic loading with a fallback:

```html
<div id="albato-widget" class="widget-container">
  <p>Loading integrations...</p>
</div>

<script>
  (function() {
    var container = document.getElementById('albato-widget');
    var script = document.createElement('script');
    script.src = 'https://yourinho.github.io/integrations_widget/albato-widget.iife.js';

    script.onload = function() {
      container.innerHTML = '';
      AlbatoWidget.initWidget({
        container: container,
        regions: [2, 3],  // optional
        font: "'Inter', sans-serif"  // optional
      });
    };

    script.onerror = function() {
      // Show fallback content if the script fails to load
      container.innerHTML = '<p>View our <a href="/integrations">available integrations</a>.</p>';
    };

    document.head.appendChild(script);
  })();
</script>
```

**What this does:**
- Loads the widget script dynamically
- On success: clears the container and initializes the widget
- On failure: replaces the content with fallback HTML (e.g. a link to your integrations page)

Customize the fallback content in `onerror` to match your site (link, message, or hide the block).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Widget does not appear | Ensure the script loads after the container exists. Check the browser console for errors. |
| Script fails to load | Use the [Resilient embed](#resilient-embed-handling-script-load-failure) pattern with fallback content. |
| Wrong integrations shown | Verify the `regions` or `partnerIds` option if you use them. Use numeric IDs, e.g. `[2, 3]` or `[5, 10, 15]`. |
| Font looks different | Load your font (e.g. from Google Fonts) before the widget script, and pass the `font` option. |

---

## Script URL

Use this URL to load the widget script:

```
https://yourinho.github.io/integrations_widget/albato-widget.iife.js
```

Do not modify or host this file yourself unless you have a custom deployment setup.

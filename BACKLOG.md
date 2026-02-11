# Backlog

Planned features for the Albato Apps Widget.

## Table of Contents

- [1. Hide/show headers in views](#1-hideshow-headers-in-views)
- [2. Font size](#2-font-size)
- [3. Try button — show/hide and custom link](#3-try-button--showhide-and-custom-link)
- [4. Partners per page](#4-partners-per-page)
- [5. Widget background color](#5-widget-background-color)
- [6. Card corner radius](#6-card-corner-radius)
- [7. Contract ID filter (API)](#7-contract-id-filter-api)
- [8. Custom stylesheet (CSS)](#8-custom-stylesheet-css)
- [9. Container dimensions (min/max width/height)](#9-container-dimensions-minmax-widthheight)
- [10. Hide/show sections: search, Show more, pagination](#10-hideshow-sections-search-show-more-pagination)
- [11. Dark / light theme](#11-dark--light-theme)
- [12. Localization — language and custom texts](#12-localization--language-and-custom-texts)
- [13. Callbacks / events on card click](#13-callbacks--events-on-card-click)
- [14. Cards per row (2–4)](#14-cards-per-row-24)

---

## Script parameters for customization

### 1. Hide/show headers in views

**Description:** Add a parameter to show or hide headers (e.g. "Available integrations", "Triggers and actions for...") in the gallery and service detail views.

**Proposed parameter:** `showHeaders: boolean` (default: `true`)

---

### 2. Font size

**Description:** Add a parameter to change the font size used across widget views.

**Proposed parameter:** `fontSize: string | number` (e.g. `"14px"`, `16`)

---

### 3. Try button — show/hide and custom link

**Description:** Add a "Try" button to cards (or another placement). Option to show/hide it and pass a URL for redirect on click.

**Proposed parameters:**
- `showTryButton: boolean` (default: `false`)
- `tryButtonUrl: string` — URL for redirect when the button is clicked (optional, can be a template with placeholders e.g. `{partnerId}`)

---

### 4. Partners per page

**Description:** Allow changing the number of partners displayed per page (currently 12).

**Proposed parameter:** `partnersPerPage: number` (default: `12`)

---

### 5. Widget background color

**Description:** Add a parameter to change the background color of the widget container.

**Proposed parameter:** `backgroundColor: string` (e.g. `"#ffffff"`, `"#f8f9fa"`)

---

### 6. Card corner radius

**Description:** Add a parameter to change the border radius of partner and trigger/action cards.

**Proposed parameter:** `cardRadius: string | number` (e.g. `"16px"`, `8`)

---

### 7. Contract ID filter (API)

**Description:** Filter partners by contract ID via API so only partners available to the given contract are returned. Requires API support for a contract/contractId filter.

**Proposed parameter:** `contractId: string | number` — passed to the API for filtering

**Note:** Depends on API capability. Verify if the partners API accepts a contract/contractId parameter.

---

### 8. Custom stylesheet (CSS)

**Description:** Allow clients to inject their own CSS for advanced styling. Load a custom stylesheet URL or accept inline CSS.

**Proposed parameters:**
- `customCssUrl: string` — URL to a stylesheet to load
- or `customCss: string` — inline CSS string

---

### 9. Container dimensions (min/max width/height)

**Description:** Set min/max width and height for the widget container to control layout and prevent overflow.

**Proposed parameters:**
- `minWidth: string`, `maxWidth: string`
- `minHeight: string`, `maxHeight: string` (e.g. `"400px"`, `"100%"`)

---

### 10. Hide/show sections: search, Show more, pagination

**Description:** Toggle visibility of UI sections: search bar, "Show more" button, pagination (if applicable).

**Proposed parameters:**
- `showSearch: boolean` (default: `true`)
- `showShowMore: boolean` (default: `true`)
- `showPagination: boolean` (default: `true`, if pagination exists)

---

### 11. Dark / light theme

**Description:** Add a theme parameter for dark or light mode. Widget adjusts colors (background, text, borders, cards) accordingly.

**Proposed parameter:** `theme: "light" | "dark"` (default: `"light"`)

---

### 12. Localization — language and custom texts

**Description:** Support multiple languages and allow overriding text strings (titles, placeholder, button labels, empty states, etc.).

**Proposed parameters:**
- `locale: string` (e.g. `"en"`, `"pt-BR"`) — predefined translations
- `texts: object` — override specific strings, e.g. `{ searchPlaceholder: "Search...", showMore: "Load more" }`

---

### 13. Callbacks / events on card click

**Description:** Fire a callback or custom event when a user clicks a partner card or trigger/action card. Enables analytics (e.g. GA4) or custom actions.

**Proposed parameters:**
- `onPartnerClick: (partner) => void` — callback with partner data
- `onTriggerClick: (trigger, partner) => void`, `onActionClick: (action, partner) => void`
- Or emit custom DOM events for framework-agnostic integration

---

### 14. Cards per row (2–4)

**Description:** Control how many cards are displayed per row in the gallery and detail views (responsive breakpoints may apply).

**Proposed parameter:** `cardsPerRow: 2 | 3 | 4` (default: `3` for gallery, or auto based on width)

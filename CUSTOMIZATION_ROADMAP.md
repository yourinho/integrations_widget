# Roadmap: Кастомизация виджета (Фазы 1 и 2)

Предложение по поэтапному добавлению параметров кастомизации виджета для клиентов.

## Table of Contents

- [Фаза 1: Базовая кастомизация](#фаза-1-базовая-кастомизация)
  - [Typography (fontSize по элементам)](#typography-fontsize-по-элементам)
  - [Visibility (show*)](#visibility-show)
  - [Texts (локализация)](#texts-локализация)
- [Фаза 2: Расширенная кастомизация](#фаза-2-расширенная-кастомизация)
  - [Расширение colors](#расширение-colors)
  - [Layout (padding, gap)](#layout-padding-gap)
- [Структура API для фаз 1 и 2](#структура-api-для-фаз-1-и-2)

---

## Фаза 1: Базовая кастомизация

### Typography (fontSize по элементам)

| Параметр | Элемент | Дефолт | UI элемент |
|----------|---------|--------|------------|
| `typography.galleryTitleSize` | «Available integrations» | `56px` (32px mobile) | Input (текст), placeholder: `56px` |
| `typography.galleryTitleWeight` | | `700` | Select: 400, 500, 600, 700 |
| `typography.searchSize` | Поле поиска | `15px` | Input (текст), placeholder: `15px` |
| `typography.cardTitleSize` | Название в карточке партнёра | `14px` (L), `15px` (M), `11px` (S) | Input (текст), placeholder: `14px` |
| `typography.cardTitleWeight` | | `400` | Select: 400, 500, 600, 700 |
| `typography.detailTitleSize` | Название сервиса | `32px` (24px mobile) | Input (текст), placeholder: `32px` |
| `typography.detailTitleWeight` | | `700` | Select: 400, 500, 600, 700 |
| `typography.detailSubtitleSize` | Описание сервиса | `17px` | Input (текст), placeholder: `17px` |
| `typography.tabSize` | Вкладки (Triggers, Actions) | `15px` | Input (текст), placeholder: `15px` |
| `typography.sectionTitleSize` | «Triggers», «Actions» | `20px` | Input (текст), placeholder: `20px` |
| `typography.detailCardNameSize` | Название триггера/экшена | `17px` | Input (текст), placeholder: `17px` |
| `typography.detailCardTypeSize` | Trigger/Action в футере карточки | `17px` | Input (текст), placeholder: `17px` |
| `typography.showMoreSize` | Кнопка «Show more» | `17px` | Input (текст), placeholder: `17px` |
| `typography.backSize` | Кнопка «Back» | `17px` | Input (текст), placeholder: `17px` |

Опционально: `typography.galleryTitleColor`, `typography.cardTitleColor` и т.п. — если нужна раздельная настройка цвета текста по элементам (иначе наследуют из `colors`).

---

### Visibility (show*)

| Параметр | Описание | Дефолт | UI элемент |
|----------|----------|--------|------------|
| `showGalleryTitle` | Заголовок «Available integrations» | `true` | Checkbox |
| `showSearch` | Поле поиска | `true` | Checkbox |
| `showShowMore` | Кнопка «Show more» | `true` | Checkbox |
| `showDetailTitle` | Название сервиса на странице детали | `true` | Checkbox |
| `showDetailSubtitle` | Описание сервиса | `true` | Checkbox |
| `showDetailTabs` | Вкладки Triggers/Actions (при layout stacked) | `true` | Checkbox |
| `showSectionTitles` | Заголовки «Triggers» и «Actions» | `true` | Checkbox |
| `showCardLogos` | Логотипы в карточках партнёров | `true` | Checkbox |
| `showDetailCardType` | Текст Trigger/Action в карточке триггера/экшена | `true` | Checkbox |

---

### Texts (локализация)

| Параметр | Дефолт | UI элемент |
|----------|--------|------------|
| `texts.galleryTitle` | `"Available integrations"` | Input (текст) |
| `texts.searchPlaceholder` | `"Search integrations"` | Input (текст) |
| `texts.showMore` | `"Show more"` | Input (текст) |
| `texts.back` | `"Back"` | Input (текст) |
| `texts.triggersTab` | `"Triggers"` | Input (текст) |
| `texts.actionsTab` | `"Actions"` | Input (текст) |
| `texts.triggersAndActionsTab` | `"Triggers & Actions"` | Input (текст) |
| `texts.emptyGallery` | `"No integrations available"` | Input (текст) |
| `texts.emptySearch` | `"No services found"` | Input (текст) |
| `texts.emptyTriggers` | `"This service has no available triggers"` | Input (текст) |
| `texts.emptyActions` | `"This service has no available actions"` | Input (текст) |
| `texts.errorGeneral` | `"We couldn't load integrations right now."` | Textarea |
| `texts.errorServices` | `"Failed to load services"` | Input (текст) |
| `texts.retry` | `"Try again"` | Input (текст) |

---

## Фаза 2: Расширенная кастомизация

### Расширение colors

Дополнительные ключи в объекте `colors` (к уже существующим):

| Параметр | Элемент | UI элемент |
|----------|---------|------------|
| `galleryBackground` | Фон области галереи | Color picker + hex input |
| `detailBackground` | Фон страницы детали сервиса | Color picker + hex input |
| `searchBackground` | Фон поля поиска | Color picker + hex input |
| `searchBorderColor` | Граница поля поиска | Color picker + hex input |
| `searchFocusBorderColor` | Граница поля поиска в фокусе | Color picker + hex input |
| `cardBorderColor` | Граница карточки партнёра | Color picker + hex input |
| `cardHoverBorderColor` | Граница карточки при hover | Color picker + hex input |
| `cardHoverShadow` | Тень карточки при hover (CSS box-shadow) | Input (текст), placeholder: `0 4px 12px rgba(0,0,0,0.08)` |
| `tabBackground` | Фон неактивных вкладок | Color picker + hex input |
| `tabActiveBackground` | Фон активной вкладки | Color picker + hex input |
| `tabBorderColor` | Граница вкладок | Color picker + hex input |
| `detailCardFooterBackground` | Фон футера карточки триггера/экшена | Color picker + hex input |
| `emptyTextColor` | Текст empty-state | Color picker + hex input |
| `errorTextColor` | Текст error-state | Color picker + hex input |
| `skeletonColor` | Цвет skeleton loader (gradient) | Input (текст) или пресеты: light/dark |
| `backButtonHoverBackground` | Фон кнопки Back при hover | Color picker + hex input |
| `showMoreBackground` | Фон кнопки «Show more» | Color picker + hex input |
| `showMoreBorderColor` | Граница кнопки «Show more» | Color picker + hex input |

---

### Layout (padding, gap)

| Параметр | Элемент | Дефолт | UI элемент |
|----------|---------|--------|------------|
| `maxWidth` | Максимальная ширина контента | `"1040px"` | Input (текст), placeholder: `1040px` или `100%` |
| `galleryPadding` | Отступы области галереи | `"80px"` | Input (текст), placeholder: `80px` |
| `galleryGap` | Расстояние между блоками (заголовок, поиск, карточки) | `"32px"` | Input (текст), placeholder: `32px` |
| `galleryCardsGap` | Расстояние между карточками партнёров | `"32px"` | Input (текст), placeholder: `32px` |
| `detailPadding` | Отступы страницы сервиса | `"80px"` | Input (текст), placeholder: `80px` |
| `detailGap` | Расстояние между блоками на странице сервиса | `"32px"` | Input (текст), placeholder: `32px` |
| `detailCardsGap` | Расстояние между карточками триггеров/экшенов | `"25px"` | Input (текст), placeholder: `25px` |

---

## Структура API для фаз 1 и 2

```javascript
initWidget({
  container,
  // Существующие параметры
  regions, partnerIds, font, colors,
  cardSize, detailCardSize, detailLayout,
  cardRadius, detailCardRadius, align,

  // --- Фаза 1 ---
  typography: {
    galleryTitleSize: '56px',
    galleryTitleWeight: 700,
    searchSize: '15px',
    cardTitleSize: '14px',
    cardTitleWeight: 400,
    detailTitleSize: '32px',
    detailTitleWeight: 700,
    detailSubtitleSize: '17px',
    tabSize: '15px',
    sectionTitleSize: '20px',
    detailCardNameSize: '17px',
    detailCardTypeSize: '17px',
    showMoreSize: '17px',
    backSize: '17px'
  },

  showGalleryTitle: true,
  showSearch: true,
  showShowMore: true,
  showDetailTitle: true,
  showDetailSubtitle: true,
  showDetailTabs: true,
  showSectionTitles: true,
  showCardLogos: true,
  showDetailCardType: true,

  texts: {
    galleryTitle: 'Available integrations',
    searchPlaceholder: 'Search integrations',
    showMore: 'Show more',
    back: 'Back',
    triggersTab: 'Triggers',
    actionsTab: 'Actions',
    triggersAndActionsTab: 'Triggers & Actions',
    emptyGallery: 'No integrations available',
    emptySearch: 'No services found',
    emptyTriggers: 'This service has no available triggers',
    emptyActions: 'This service has no available actions',
    errorGeneral: "We couldn't load integrations right now.",
    errorServices: 'Failed to load services',
    retry: 'Try again'
  },

  // --- Фаза 2 ---
  maxWidth: '1040px',
  galleryPadding: '80px',
  galleryGap: '32px',
  galleryCardsGap: '32px',
  detailPadding: '80px',
  detailGap: '32px',
  detailCardsGap: '25px',

  // Расширенные colors (дополнительно к текущим)
  colors: {
    primary, background, surface, text, textMuted, border,
    textOnPrimary, cardBackground, detailCardBackground,
    galleryBackground, detailBackground,
    searchBackground, searchBorderColor, searchFocusBorderColor,
    cardBorderColor, cardHoverBorderColor, cardHoverShadow,
    tabBackground, tabActiveBackground, tabBorderColor,
    detailCardFooterBackground,
    emptyTextColor, errorTextColor, skeletonColor,
    backButtonHoverBackground,
    showMoreBackground, showMoreBorderColor
  }
});
```

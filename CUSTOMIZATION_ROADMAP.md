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

| Параметр | Элемент | Дефолт |
|----------|---------|--------|
| `typography.galleryTitleSize` | «Available integrations» | `56px` (32px mobile) |
| `typography.galleryTitleWeight` | | `700` |
| `typography.searchSize` | Поле поиска | `15px` |
| `typography.cardTitleSize` | Название в карточке партнёра | `14px` (L), `15px` (M), `11px` (S) |
| `typography.cardTitleWeight` | | `400` |
| `typography.detailTitleSize` | Название сервиса | `32px` (24px mobile) |
| `typography.detailTitleWeight` | | `700` |
| `typography.detailSubtitleSize` | Описание сервиса | `17px` |
| `typography.tabSize` | Вкладки (Triggers, Actions) | `15px` |
| `typography.sectionTitleSize` | «Triggers», «Actions» | `20px` |
| `typography.detailCardNameSize` | Название триггера/экшена | `17px` |
| `typography.detailCardTypeSize` | Trigger/Action в футере карточки | `17px` |
| `typography.showMoreSize` | Кнопка «Show more» | `17px` |
| `typography.backSize` | Кнопка «Back» | `17px` |

Опционально: `typography.galleryTitleColor`, `typography.cardTitleColor` и т.п. — если нужна раздельная настройка цвета текста по элементам (иначе наследуют из `colors`).

---

### Visibility (show*)

| Параметр | Описание | Дефолт |
|----------|----------|--------|
| `showGalleryTitle` | Заголовок «Available integrations» | `true` |
| `showSearch` | Поле поиска | `true` |
| `showShowMore` | Кнопка «Show more» | `true` |
| `showDetailTitle` | Название сервиса на странице детали | `true` |
| `showDetailSubtitle` | Описание сервиса | `true` |
| `showDetailTabs` | Вкладки Triggers/Actions (при layout stacked) | `true` |
| `showSectionTitles` | Заголовки «Triggers» и «Actions» | `true` |
| `showCardLogos` | Логотипы в карточках партнёров | `true` |
| `showDetailCardType` | Текст Trigger/Action в карточке триггера/экшена | `true` |

---

### Texts (локализация)

| Параметр | Дефолт |
|----------|--------|
| `texts.galleryTitle` | `"Available integrations"` |
| `texts.searchPlaceholder` | `"Search integrations"` |
| `texts.showMore` | `"Show more"` |
| `texts.back` | `"Back"` |
| `texts.triggersTab` | `"Triggers"` |
| `texts.actionsTab` | `"Actions"` |
| `texts.triggersAndActionsTab` | `"Triggers & Actions"` |
| `texts.emptyGallery` | `"No integrations available"` |
| `texts.emptySearch` | `"No services found"` |
| `texts.emptyTriggers` | `"This service has no available triggers"` |
| `texts.emptyActions` | `"This service has no available actions"` |
| `texts.errorGeneral` | `"We couldn't load integrations right now."` |
| `texts.errorServices` | `"Failed to load services"` |
| `texts.retry` | `"Try again"` |

---

## Фаза 2: Расширенная кастомизация

### Расширение colors

Дополнительные ключи в объекте `colors` (к уже существующим):

| Параметр | Элемент |
|----------|---------|
| `galleryBackground` | Фон области галереи |
| `detailBackground` | Фон страницы детали сервиса |
| `searchBackground` | Фон поля поиска |
| `searchBorderColor` | Граница поля поиска |
| `searchFocusBorderColor` | Граница поля поиска в фокусе |
| `cardBorderColor` | Граница карточки партнёра |
| `cardHoverBorderColor` | Граница карточки при hover |
| `cardHoverShadow` | Тень карточки при hover (CSS box-shadow) |
| `tabBackground` | Фон неактивных вкладок |
| `tabActiveBackground` | Фон активной вкладки |
| `tabBorderColor` | Граница вкладок |
| `detailCardFooterBackground` | Фон футера карточки триггера/экшена |
| `emptyTextColor` | Текст empty-state |
| `errorTextColor` | Текст error-state |
| `skeletonColor` | Цвет skeleton loader (gradient) |
| `backButtonHoverBackground` | Фон кнопки Back при hover |
| `showMoreBackground` | Фон кнопки «Show more» |
| `showMoreBorderColor` | Граница кнопки «Show more» |

---

### Layout (padding, gap)

| Параметр | Элемент | Дефолт |
|----------|---------|--------|
| `maxWidth` | Максимальная ширина контента | `"1040px"` |
| `galleryPadding` | Отступы области галереи | `"80px"` |
| `galleryGap` | Расстояние между блоками (заголовок, поиск, карточки) | `"32px"` |
| `galleryCardsGap` | Расстояние между карточками партнёров | `"32px"` |
| `detailPadding` | Отступы страницы сервиса | `"80px"` |
| `detailGap` | Расстояние между блоками на странице сервиса | `"32px"` |
| `detailCardsGap` | Расстояние между карточками триггеров/экшенов | `"25px"` |

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

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

| Параметр | Элемент | Element (EN) | Дефолт | UI элемент | Описание | Description (EN) |
|----------|---------|--------------|--------|------------|---------|------------------|
| `typography.galleryTitleSize` | «Available integrations» | Gallery title | `56px` (32px mobile) | Input (текст), placeholder: `56px` | Размер заголовка галереи.<br>На мобильных автоматически уменьшается.<br>Поддерживает px, rem, em. | Size of the gallery heading.<br>Reduces on mobile.<br>Supports px, rem, em. |
| `typography.galleryTitleWeight` | | Gallery title | `700` | Select: 400, 500, 600, 700 | Жирность шрифта заголовка галереи.<br>400 — normal, 700 — bold. | Font weight of the gallery heading.<br>400 — normal, 700 — bold. |
| `typography.searchSize` | Поле поиска | Search input | `15px` | Input (текст), placeholder: `15px` | Размер текста в поле поиска и placeholder. | Font size of the search field and placeholder. |
| `typography.cardTitleSize` | Название в карточке партнёра | Partner card title | `14px` (L), `15px` (M), `11px` (S) | Input (текст), placeholder: `14px` | Размер названия сервиса в карточке.<br>При разных cardSize применяется свой размер. | Size of service name in partner card.<br>Varies by cardSize. |
| `typography.cardTitleWeight` | | Partner card title | `400` | Select: 400, 500, 600, 700 | Жирность названия в карточке партнёра. | Font weight of the partner card title. |
| `typography.detailTitleSize` | Название сервиса | Service detail title | `32px` (24px mobile) | Input (текст), placeholder: `32px` | Размер заголовка на странице детали сервиса (название интеграции). | Size of the service name on the detail page. |
| `typography.detailTitleWeight` | | Service detail title | `700` | Select: 400, 500, 600, 700 | Жирность заголовка страницы детали. | Font weight of the detail page heading. |
| `typography.detailSubtitleSize` | Описание сервиса | Service description | `17px` | Input (текст), placeholder: `17px` | Размер текста описания сервиса под заголовком. | Size of the service description below the heading. |
| `typography.tabSize` | Вкладки (Triggers, Actions) | Tabs | `15px` | Input (текст), placeholder: `15px` | Размер текста во вкладках (Triggers, Actions, Triggers & Actions). | Font size of the tab labels. |
| `typography.sectionTitleSize` | «Triggers», «Actions» | Section titles | `20px` | Input (текст), placeholder: `20px` | Размер заголовков секций «Triggers» и «Actions» над списком карточек. | Size of "Triggers" and "Actions" section headings. |
| `typography.detailCardNameSize` | Название триггера/экшена | Trigger/action card name | `17px` | Input (текст), placeholder: `17px` | Размер названия триггера или экшена в карточке на странице детали. | Size of trigger/action name in the detail card. |
| `typography.detailCardTypeSize` | Trigger/Action в футере карточки | Trigger/action card type label | `17px` | Input (текст), placeholder: `17px` | Размер подписи «Trigger» или «Action» в нижней части карточки. | Size of "Trigger"/"Action" label in card footer. |
| `typography.showMoreSize` | Кнопка «Show more» | Show more button | `17px` | Input (текст), placeholder: `17px` | Размер текста кнопки подгрузки следующих карточек. | Font size of the load-more button. |
| `typography.backSize` | Кнопка «Back» | Back button | `17px` | Input (текст), placeholder: `17px` | Размер текста кнопки «Back» на странице детали. | Font size of the back button. |

Опционально: `typography.galleryTitleColor`, `typography.cardTitleColor` и т.п. — если нужна раздельная настройка цвета текста по элементам (иначе наследуют из `colors`).

---

### Visibility (show*)

| Параметр | Что скрывает | Element (EN) | Дефолт | UI элемент | Описание | Description (EN) |
|----------|--------------|--------------|--------|------------|---------|------------------|
| `showGalleryTitle` | Заголовок «Available integrations» | Gallery title | `true` | Checkbox | Показывать или скрывать заголовок над галереей.<br>Полезно, если заголовок уже есть на странице клиента. | Show or hide the gallery heading.<br>Useful when the page already has its own title. |
| `showSearch` | Поле поиска | Search input | `true` | Checkbox | Включает или отключает поле поиска интеграций. | Enable or disable the search field. |
| `showShowMore` | Кнопка «Show more» | Show more button | `true` | Checkbox | Показывать кнопку подгрузки или скрыть (все карточки сразу, если позволяет пагинация). | Show or hide the load-more button. |
| `showDetailTitle` | Название сервиса | Service detail title | `true` | Checkbox | Скрыть название интеграции на странице детали. | Hide the service name on the detail page. |
| `showDetailSubtitle` | Описание сервиса | Service description | `true` | Checkbox | Скрыть описание интеграции под заголовком. | Hide the service description below the heading. |
| `showDetailTabs` | Вкладки Triggers/Actions | Tabs | `true` | Checkbox | Работает при layout stacked.<br>Скрывает переключатель вкладок — обе секции отображаются сразу. | For stacked layout. Hides tab bar — both sections shown at once. |
| `showSectionTitles` | «Triggers», «Actions» | Section titles | `true` | Checkbox | Скрыть заголовки секций над списками триггеров и экшенов. | Hide "Triggers" and "Actions" section headings. |
| `showCardLogos` | Логотипы в карточках | Partner card logos | `true` | Checkbox | Показывать или скрывать логотипы сервисов в галерее.<br>При скрытии — только названия. | Show or hide service logos in the gallery. |
| `showDetailCardType` | Trigger/Action в карточке | Trigger/action type label | `true` | Checkbox | Скрыть подпись «Trigger» или «Action» в футере карточки на странице детали. | Hide "Trigger"/"Action" label in detail card footer. |

---

### Texts (локализация)

| Параметр | Element (EN) | Дефолт | UI элемент | Описание | Description (EN) |
|----------|--------------|--------|------------|---------|------------------|
| `texts.galleryTitle` | Gallery title | `"Available integrations"` | Input (текст) | Заголовок над галереей интеграций.<br>Для локализации или замены на свой текст. | Heading above the integrations gallery.<br>For localization or custom text. |
| `texts.searchPlaceholder` | Search placeholder | `"Search integrations"` | Input (текст) | Placeholder в поле поиска. | Placeholder in the search field. |
| `texts.showMore` | Show more button | `"Show more"` | Input (текст) | Текст кнопки подгрузки следующих карточек. | Label of the load-more button. |
| `texts.back` | Back button | `"Back"` | Input (текст) | Текст кнопки возврата на странице детали. | Label of the back button on the detail page. |
| `texts.triggersTab` | Triggers tab | `"Triggers"` | Input (текст) | Надпись на вкладке «Только триггеры». | Label of the triggers-only tab. |
| `texts.actionsTab` | Actions tab | `"Actions"` | Input (текст) | Надпись на вкладке «Только экшены». | Label of the actions-only tab. |
| `texts.triggersAndActionsTab` | Triggers & Actions tab | `"Triggers & Actions"` | Input (текст) | Надпись на вкладке «Триггеры и экшены». | Label of the combined tab. |
| `texts.emptyGallery` | Empty gallery message | `"No integrations available"` | Input (текст) | Текст, когда интеграций нет. | Text when no integrations are available. |
| `texts.emptySearch` | Empty search message | `"No services found"` | Input (текст) | Текст, когда поиск не дал результатов. | Text when search returns no results. |
| `texts.emptyTriggers` | Empty triggers message | `"This service has no available triggers"` | Input (текст) | Текст, когда у сервиса нет триггеров. | Text when the service has no triggers. |
| `texts.emptyActions` | Empty actions message | `"This service has no available actions"` | Input (текст) | Текст, когда у сервиса нет экшенов. | Text when the service has no actions. |
| `texts.errorGeneral` | General error message | `"We couldn't load integrations right now."` | Textarea | Сообщение при общей ошибке загрузки виджета.<br>Может быть длинным, используется Textarea. | Message when the widget fails to load.<br>Can be long; use Textarea. |
| `texts.errorServices` | Services load error message | `"Failed to load services"` | Input (текст) | Сообщение при ошибке загрузки списка сервисов. | Message when services list fails to load. |
| `texts.retry` | Retry button | `"Try again"` | Input (текст) | Текст кнопки повторной попытки при ошибках. | Label of the retry button on error states. |

---

## Фаза 2: Расширенная кастомизация

### Расширение colors

Дополнительные ключи в объекте `colors` (к уже существующим):

| Параметр | Элемент | Element (EN) | UI элемент | Описание | Description (EN) |
|----------|---------|--------------|------------|---------|------------------|
| `galleryBackground` | Фон области галереи | Gallery background | Color picker + hex input | Фон всей области галереи (под карточками, поиском, заголовком).<br>Отдельно от background — если нужен другой цвет только для галереи. | Background of the gallery area.<br>Override when gallery needs a different color than general background. |
| `detailBackground` | Фон страницы детали | Detail page background | Color picker + hex input | Фон страницы детали сервиса (триггеры, экшены, описание). | Background of the service detail page. |
| `searchBackground` | Фон поля поиска | Search input background | Color picker + hex input | Заливка внутри поля поиска.<br>По умолчанию совпадает с background. | Background inside the search field. Defaults to background. |
| `searchBorderColor` | Граница поля поиска | Search border | Color picker + hex input | Цвет рамки поля поиска в обычном состоянии. | Border color of the search field in default state. |
| `searchFocusBorderColor` | Граница в фокусе | Search focus border | Color picker + hex input | Цвет рамки при фокусе ввода.<br>Обычно ярче основной границы. | Border color when search is focused. Usually brighter. |
| `cardBorderColor` | Граница карточки партнёра | Partner card border | Color picker + hex input | Цвет рамки карточки сервиса в галерее. | Border color of the partner card in the gallery. |
| `cardHoverBorderColor` | Граница при hover | Partner card hover border | Color picker + hex input | Цвет рамки карточки при наведении.<br>Обычно primary или accent. | Border color of partner card on hover. Usually primary. |
| `cardHoverShadow` | Тень при hover | Partner card hover shadow | Input (текст) | CSS box-shadow при наведении на карточку.<br>Например: `0 4px 12px rgba(0,0,0,0.08)`. | CSS box-shadow when hovering over the card. |
| `tabBackground` | Фон неактивных вкладок | Tab background | Color picker + hex input | Фон вкладок Triggers / Actions в невыбранном состоянии. | Background of inactive tabs. |
| `tabActiveBackground` | Фон активной вкладки | Active tab background | Color picker + hex input | Фон выбранной вкладки.<br>Обычно primary. | Background of the active tab. Usually primary. |
| `tabBorderColor` | Граница вкладок | Tab border | Color picker + hex input | Цвет рамки вкладок. | Border color of the tabs. |
| `detailCardFooterBackground` | Фон футера карточки | Detail card footer background | Color picker + hex input | Фон нижней полосы карточки триггера/экшена (подпись Trigger/Action).<br>По умолчанию surface. | Background of the trigger/action card footer. Defaults to surface. |
| `emptyTextColor` | Текст empty-state | Empty state text | Color picker + hex input | Цвет текста при пустых списках (нет сервисов, нет результатов поиска и т.п.). | Text color for empty states (no services, no search results). |
| `errorTextColor` | Текст error-state | Error state text | Color picker + hex input | Цвет текста сообщений об ошибках. | Text color for error messages. |
| `skeletonColor` | Skeleton loader | Skeleton loader | Input (текст) | Цвет или градиент скелетона при загрузке.<br>Можно задать gradient или использовать пресеты light/dark. | Color or gradient for the loading skeleton. Can use light/dark presets. |
| `backButtonHoverBackground` | Back при hover | Back button hover background | Color picker + hex input | Фон кнопки «Back» при наведении. | Background of back button on hover. |
| `showMoreBackground` | Фон кнопки Show more | Show more button background | Color picker + hex input | Фон кнопки «Show more». | Background of the show more button. |
| `showMoreBorderColor` | Граница Show more | Show more button border | Color picker + hex input | Цвет рамки кнопки «Show more». | Border color of the show more button. |

---

### Layout (padding, gap)

| Параметр | Элемент | Element (EN) | Дефолт | UI элемент | Описание | Description (EN) |
|----------|---------|--------------|--------|------------|---------|------------------|
| `maxWidth` | Максимальная ширина контента | Max content width | `"1040px"` | Input (текст) | Ограничение ширины виджета (заголовок, поиск, карточки).<br>Можно задать px, %, vw. | Max width of widget content. Supports px, %, vw. |
| `galleryPadding` | Отступы галереи | Gallery padding | `"80px"` | Input (текст) | Внутренние отступы области галереи со всех сторон.<br>На мобильных уменьшаются до 24px 16px. | Inner padding of the gallery area. Reduced on mobile. |
| `galleryGap` | Расстояние между блоками галереи | Gallery gap | `"32px"` | Input (текст) | Расстояние между заголовком, поиском и сеткой карточек. | Spacing between heading, search, and card grid. |
| `galleryCardsGap` | Расстояние между карточками | Gallery cards gap | `"32px"` | Input (текст) | Gap между карточками партнёров в сетке (по горизонтали и вертикали). | Gap between partner cards in the grid. |
| `detailPadding` | Отступы страницы детали | Detail page padding | `"80px"` | Input (текст) | Внутренние отступы страницы детали сервиса. | Inner padding of the service detail page. |
| `detailGap` | Расстояние между блоками детали | Detail page gap | `"32px"` | Input (текст) | Расстояние между заголовком, вкладками, секциями на странице детали. | Spacing between heading, tabs, and sections on the detail page. |
| `detailCardsGap` | Расстояние между карточками триггеров/экшенов | Detail cards gap | `"25px"` | Input (текст) | Gap между карточками триггеров и экшенов в сетке. | Gap between trigger/action cards in the grid. |

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

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

| Параметр | Элемент | Дефолт | UI элемент | Описание |
|----------|---------|--------|------------|---------|
| `typography.galleryTitleSize` | «Available integrations» | `56px` (32px mobile) | Input (текст), placeholder: `56px` | Размер заголовка галереи.<br>На мобильных автоматически уменьшается.<br>Поддерживает px, rem, em. |
| `typography.galleryTitleWeight` | | `700` | Select: 400, 500, 600, 700 | Жирность шрифта заголовка галереи.<br>400 — normal, 700 — bold. |
| `typography.searchSize` | Поле поиска | `15px` | Input (текст), placeholder: `15px` | Размер текста в поле поиска и placeholder. |
| `typography.cardTitleSize` | Название в карточке партнёра | `14px` (L), `15px` (M), `11px` (S) | Input (текст), placeholder: `14px` | Размер названия сервиса в карточке.<br>При разных cardSize применяется свой размер. |
| `typography.cardTitleWeight` | | `400` | Select: 400, 500, 600, 700 | Жирность названия в карточке партнёра. |
| `typography.detailTitleSize` | Название сервиса | `32px` (24px mobile) | Input (текст), placeholder: `32px` | Размер заголовка на странице детали сервиса (название интеграции). |
| `typography.detailTitleWeight` | | `700` | Select: 400, 500, 600, 700 | Жирность заголовка страницы детали. |
| `typography.detailSubtitleSize` | Описание сервиса | `17px` | Input (текст), placeholder: `17px` | Размер текста описания сервиса под заголовком. |
| `typography.tabSize` | Вкладки (Triggers, Actions) | `15px` | Input (текст), placeholder: `15px` | Размер текста во вкладках (Triggers, Actions, Triggers & Actions). |
| `typography.sectionTitleSize` | «Triggers», «Actions» | `20px` | Input (текст), placeholder: `20px` | Размер заголовков секций «Triggers» и «Actions» над списком карточек. |
| `typography.detailCardNameSize` | Название триггера/экшена | `17px` | Input (текст), placeholder: `17px` | Размер названия триггера или экшена в карточке на странице детали. |
| `typography.detailCardTypeSize` | Trigger/Action в футере карточки | `17px` | Input (текст), placeholder: `17px` | Размер подписи «Trigger» или «Action» в нижней части карточки. |
| `typography.showMoreSize` | Кнопка «Show more» | `17px` | Input (текст), placeholder: `17px` | Размер текста кнопки подгрузки следующих карточек. |
| `typography.backSize` | Кнопка «Back» | `17px` | Input (текст), placeholder: `17px` | Размер текста кнопки «Back» на странице детали. |

Опционально: `typography.galleryTitleColor`, `typography.cardTitleColor` и т.п. — если нужна раздельная настройка цвета текста по элементам (иначе наследуют из `colors`).

---

### Visibility (show*)

| Параметр | Что скрывает | Дефолт | UI элемент | Описание |
|----------|--------------|--------|------------|---------|
| `showGalleryTitle` | Заголовок «Available integrations» | `true` | Checkbox | Показывать или скрывать заголовок над галереей.<br>Полезно, если заголовок уже есть на странице клиента. |
| `showSearch` | Поле поиска | `true` | Checkbox | Включает или отключает поле поиска интеграций. |
| `showShowMore` | Кнопка «Show more» | `true` | Checkbox | Показывать кнопку подгрузки или скрыть (все карточки сразу, если позволяет пагинация). |
| `showDetailTitle` | Название сервиса | `true` | Checkbox | Скрыть название интеграции на странице детали. |
| `showDetailSubtitle` | Описание сервиса | `true` | Checkbox | Скрыть описание интеграции под заголовком. |
| `showDetailTabs` | Вкладки Triggers/Actions | `true` | Checkbox | Работает при layout stacked.<br>Скрывает переключатель вкладок — обе секции отображаются сразу. |
| `showSectionTitles` | «Triggers», «Actions» | `true` | Checkbox | Скрыть заголовки секций над списками триггеров и экшенов. |
| `showCardLogos` | Логотипы в карточках | `true` | Checkbox | Показывать или скрывать логотипы сервисов в галерее.<br>При скрытии — только названия. |
| `showDetailCardType` | Trigger/Action в карточке | `true` | Checkbox | Скрыть подпись «Trigger» или «Action» в футере карточки на странице детали. |

---

### Texts (локализация)

| Параметр | Дефолт | UI элемент | Описание |
|----------|--------|------------|---------|
| `texts.galleryTitle` | `"Available integrations"` | Input (текст) | Заголовок над галереей интеграций.<br>Для локализации или замены на свой текст. |
| `texts.searchPlaceholder` | `"Search integrations"` | Input (текст) | Placeholder в поле поиска. |
| `texts.showMore` | `"Show more"` | Input (текст) | Текст кнопки подгрузки следующих карточек. |
| `texts.back` | `"Back"` | Input (текст) | Текст кнопки возврата на странице детали. |
| `texts.triggersTab` | `"Triggers"` | Input (текст) | Надпись на вкладке «Только триггеры». |
| `texts.actionsTab` | `"Actions"` | Input (текст) | Надпись на вкладке «Только экшены». |
| `texts.triggersAndActionsTab` | `"Triggers & Actions"` | Input (текст) | Надпись на вкладке «Триггеры и экшены». |
| `texts.emptyGallery` | `"No integrations available"` | Input (текст) | Текст, когда интеграций нет. |
| `texts.emptySearch` | `"No services found"` | Input (текст) | Текст, когда поиск не дал результатов. |
| `texts.emptyTriggers` | `"This service has no available triggers"` | Input (текст) | Текст, когда у сервиса нет триггеров. |
| `texts.emptyActions` | `"This service has no available actions"` | Input (текст) | Текст, когда у сервиса нет экшенов. |
| `texts.errorGeneral` | `"We couldn't load integrations right now."` | Textarea | Сообщение при общей ошибке загрузки виджета.<br>Может быть длинным, используется Textarea. |
| `texts.errorServices` | `"Failed to load services"` | Input (текст) | Сообщение при ошибке загрузки списка сервисов. |
| `texts.retry` | `"Try again"` | Input (текст) | Текст кнопки повторной попытки при ошибках. |

---

## Фаза 2: Расширенная кастомизация

### Расширение colors

Дополнительные ключи в объекте `colors` (к уже существующим):

| Параметр | Элемент | UI элемент | Описание |
|----------|---------|------------|---------|
| `galleryBackground` | Фон области галереи | Color picker + hex input | Фон всей области галереи (под карточками, поиском, заголовком).<br>Отдельно от background — если нужен другой цвет только для галереи. |
| `detailBackground` | Фон страницы детали | Color picker + hex input | Фон страницы детали сервиса (триггеры, экшены, описание). |
| `searchBackground` | Фон поля поиска | Color picker + hex input | Заливка внутри поля поиска.<br>По умолчанию совпадает с background. |
| `searchBorderColor` | Граница поля поиска | Color picker + hex input | Цвет рамки поля поиска в обычном состоянии. |
| `searchFocusBorderColor` | Граница в фокусе | Color picker + hex input | Цвет рамки при фокусе ввода.<br>Обычно ярче основной границы. |
| `cardBorderColor` | Граница карточки партнёра | Color picker + hex input | Цвет рамки карточки сервиса в галерее. |
| `cardHoverBorderColor` | Граница при hover | Color picker + hex input | Цвет рамки карточки при наведении.<br>Обычно primary или accent. |
| `cardHoverShadow` | Тень при hover | Input (текст) | CSS box-shadow при наведении на карточку.<br>Например: `0 4px 12px rgba(0,0,0,0.08)`. |
| `tabBackground` | Фон неактивных вкладок | Color picker + hex input | Фон вкладок Triggers / Actions в невыбранном состоянии. |
| `tabActiveBackground` | Фон активной вкладки | Color picker + hex input | Фон выбранной вкладки.<br>Обычно primary. |
| `tabBorderColor` | Граница вкладок | Color picker + hex input | Цвет рамки вкладок. |
| `detailCardFooterBackground` | Фон футера карточки | Color picker + hex input | Фон нижней полосы карточки триггера/экшена (подпись Trigger/Action).<br>По умолчанию surface. |
| `emptyTextColor` | Текст empty-state | Color picker + hex input | Цвет текста при пустых списках (нет сервисов, нет результатов поиска и т.п.). |
| `errorTextColor` | Текст error-state | Color picker + hex input | Цвет текста сообщений об ошибках. |
| `skeletonColor` | Skeleton loader | Input (текст) | Цвет или градиент скелетона при загрузке.<br>Можно задать gradient или использовать пресеты light/dark. |
| `backButtonHoverBackground` | Back при hover | Color picker + hex input | Фон кнопки «Back» при наведении. |
| `showMoreBackground` | Фон кнопки Show more | Color picker + hex input | Фон кнопки «Show more». |
| `showMoreBorderColor` | Граница Show more | Color picker + hex input | Цвет рамки кнопки «Show more». |

---

### Layout (padding, gap)

| Параметр | Элемент | Дефолт | UI элемент | Описание |
|----------|---------|--------|------------|---------|
| `maxWidth` | Максимальная ширина контента | `"1040px"` | Input (текст) | Ограничение ширины виджета (заголовок, поиск, карточки).<br>Можно задать px, %, vw. |
| `galleryPadding` | Отступы галереи | `"80px"` | Input (текст) | Внутренние отступы области галереи со всех сторон.<br>На мобильных уменьшаются до 24px 16px. |
| `galleryGap` | Расстояние между блоками галереи | `"32px"` | Input (текст) | Расстояние между заголовком, поиском и сеткой карточек. |
| `galleryCardsGap` | Расстояние между карточками | `"32px"` | Input (текст) | Gap между карточками партнёров в сетке (по горизонтали и вертикали). |
| `detailPadding` | Отступы страницы детали | `"80px"` | Input (текст) | Внутренние отступы страницы детали сервиса. |
| `detailGap` | Расстояние между блоками детали | `"32px"` | Input (текст) | Расстояние между заголовком, вкладками, секциями на странице детали. |
| `detailCardsGap` | Расстояние между карточками триггеров/экшенов | `"25px"` | Input (текст) | Gap между карточками триггеров и экшенов в сетке. |

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

# PRD: Albato Apps Widget (for Embedded clients)

## Table of Contents

- [1. Overview](#1-overview)
- [2. Goals & Success Criteria](#2-goals--success-criteria)
- [3. Scope](#3-scope)
- [4. User Flow](#4-user-flow)
- [5. Functional Requirements](#5-functional-requirements)
  - [5.1 Services Gallery](#51-services-gallery)
  - [5.2 Service Details Page](#52-service-details-page)
- [6. API Integration](#6-api-integration)
  - [6.1 Services List API](#61-services-list-api)
  - [6.2 Triggers & Actions API](#62-triggers--actions-api)
- [7. Non-Functional Requirements](#7-non-functional-requirements)
- [8. Edge Cases](#8-edge-cases)
- [9. Embedding](#9-embedding)
  - [9.1 Technical Decisions](#91-technical-decisions)
  - [9.2 Navigation](#92-navigation)
- [10. UI States](#10-ui-states)
  - [10.1 Global Widget States](#101-global-widget-states)
  - [10.2 Services Gallery States](#102-services-gallery-states)
  - [10.3 Service Details Page States](#103-service-details-page-states)
  - [10.4 Pagination States](#104-pagination-states)
  - [10.5 Network & Data States](#105-network--data-states)
- [11. UI Copy](#11-ui-copy)

---

## 1. Overview

**Albato Apps Widget** — встраиваемый виджет для клиентов Albato Embedded, предназначенный для размещения на лендингах клиентов.

Виджет позволяет:
- показать список сервисов, с которыми интегрируется продукт клиента через Albato
- продемонстрировать доступные триггеры и экшены для каждого сервиса
- автоматически отображать актуальные данные из Albato без ручного обновления

---

## 2. Goals & Success Criteria

### Goals
- Дать клиентам Albato Embedded простой способ показать интеграционные возможности продукта
- Повысить прозрачность и доверие потенциальных пользователей
- Убрать необходимость вручную поддерживать списки интеграций

### Success Criteria
- Виджет корректно встраивается на лендинг клиента
- Данные загружаются без авторизации
- Пользователь может:
  - найти нужный сервис через поиск
  - открыть страницу сервиса
  - увидеть список триггеров и экшенов

---

## 3. Scope

### In Scope
- Галерея сервисов
- Детальная страница сервиса
- Поиск и пагинация
- Загрузка данных через публичный API Albato

### Out of Scope
- Авторизация пользователей
- Кастомизация дизайна под бренд клиента
- Аналитика и event tracking
- Привязка к конкретному аккаунту Albato Embedded

---

## 4. User Flow

1. Пользователь открывает страницу лендинга клиента
2. Виджет загружается и отображает галерею сервисов
3. Пользователь:
   - ищет сервис по названию **или**
   - листает список сервисов
4. Пользователь кликает на карточку сервиса
5. Открывается детальная страница сервиса со списком триггеров и экшенов

---

## 5. Functional Requirements

### 5.1 Services Gallery

**Description:**  
Основное представление виджета со списком доступных сервисов.

**UI Elements:**
- карточка сервиса:
  - логотип
  - название сервиса

**Functional Requirements:**
- отображение списка сервисов (исключая deprecated и partnerId=1)
- поиск по названию сервиса (substring)
- пагинация
- обработка состояния загрузки
- обработка пустого состояния (нет результатов поиска)

**Interactions:**
- клик по карточке сервиса открывает детальную страницу сервиса

---

### 5.2 Service Details Page

**Description:**  
Экран с подробной информацией о выбранном сервисе.

**Displayed Data:**
- кнопка Back (возврат в галерею)
- логотип сервиса
- название сервиса
- описание сервиса
- список триггеров
- список экшенов

**Triggers & Actions Lists:**
- триггеры и экшены отображаются отдельными списками
- для каждого элемента отображается:
  - название
  - описание
- элементы с `deprecated = true` не отображаются
- поддерживается пагинация
- поддерживаются состояния загрузки и пустые состояния

---

## 6. API Integration

### 6.1 Services List API

**Endpoint:**
```
GET https://api.albato.com/partners/info
```

**Authentication:**  
Not required

**Query Parameters:**
- `filter[title][like]=<string>` — поиск по названию сервиса (substring)
- `per-page=<number>` — количество элементов на странице (default: 12)
- `page=<number>` — номер страницы (например, `page=2` для второй страницы)

**Response Structure:**  
`{ success, data[], meta: { page, totalPages, totalItemsCount } }`

**Response Fields (used):**
- `partnerId` — уникальный идентификатор сервиса
- `title` — название сервиса
- `description` / `descriptionEn` — описание сервиса (использовать `descriptionEn` если `description` пустой)
- `logo` — объект: `{ "100x100": "<url>", "original": "<url>" }`
  - `logo["100x100"]` — для карточек в галерее
  - `logo["original"]` — для детальной страницы сервиса
- `deprecated` — партнёры с `deprecated=true` исключаются из отображения
- партнёр с `partnerId=1` исключается из отображения

**Data Handling:**
- Описания (description) могут содержать HTML — отображать с санитизацией

---

### 6.2 Triggers & Actions API

**Endpoint:**
```
GET https://api.albato.com/partners/trigger-actions/info
```

**Authentication:**  
Not required

**Query Parameters:**
- `filter[partnerId]=<number>` — идентификатор сервиса
- `filter[isAction]=<0|1>` — `0` для триггеров, `1` для экшенов (отдельная пагинация)
- `per-page=<number>` — количество элементов на странице (default: 10)
- `page=<number>` — номер страницы

**Response Structure:**  
`{ success, data[], meta: { page, totalPages, totalItemsCount } }`  
Для отдельной пагинации триггеров и экшенов — два запроса с `filter[isAction]=0` и `filter[isAction]=1`.

**Response Fields (used):**
- `name` — название триггера / экшена
- `description` / `descriptionEn` — описание (использовать `descriptionEn` если `description` пустой)
- `isAction` — тип элемента:
  - `true` — action
  - `false` — trigger
- `deprecated` — если `true`, элемент не отображается

**Data Handling:**
- Описания могут содержать HTML — отображать с санитизацией

---

## 7. Non-Functional Requirements

- Виджет должен работать без авторизации
- Виджет должен корректно работать при встраивании на внешние сайты
- Все данные загружаются напрямую из Albato API
- Виджет должен корректно обрабатывать:
  - ошибки сети
  - пустые ответы API
  - частичные данные

---

## 8. Edge Cases

- партнёр с `partnerId=1` или `deprecated=true` (исключаются из галереи)
- сервис без триггеров или экшенов
- все триггеры или экшены сервиса помечены как deprecated
- поиск не возвращает результатов
- API временно недоступно

---

## 9. Embedding

- **Формат встраивания:** JS + div (клиент подключает скрипт и размещает div-контейнер на лендинге)
- **Размеры:** ориентир 1200×600 px
- **Адаптивность:** поддержка мобильных устройств

---

### 9.1 Technical Decisions

| Тема | Решение |
|------|---------|
| URL / History | Не используется — навигация внутри виджета без изменения URL |
| per-page (services) | 12 |
| per-page (triggers/actions) | 10 |
| Дизайн | Ориентир — оформление сайта albato.com |
| Стек | Vanilla JS |
| Поддержка старых браузеров | Не требуется |
| Локализация | Только английский язык |
| Rate limiting API | Не предусмотрен |
| CORS | Данные загружаются напрямую из Albato API. При возникновении CORS-ошибок при встраивании на внешние сайты — рассматривать прокси |
| Фильтрация partners | Исключать партнёров с `deprecated=true` и `partnerId=1` |
| Logo | `logo["100x100"]` для галереи, `logo["original"]` для детальной страницы |
| HTML в descriptions | Рендер с санитизацией |
| Поиск | Substring (filter[title][like]) |
| Fallback description | `descriptionEn` если `description` пустой (partners и trigger-actions) |

---

### 9.2 Navigation

- **Back button:** на детальной странице сервиса отображается явная кнопка Back для возврата в галерею сервисов

---
## 10. UI States

### 10.1 Global Widget States

#### Loading (Initial Load)
Отображается при первой загрузке виджета.

- skeleton / loader
- пользовательские действия недоступны

#### Error (Global)
Ошибка загрузки виджета целиком (например, API недоступно).

- отображается error-state
- отображается кнопка Retry

---

### 10.2 Services Gallery States

#### Loading
- отображается skeleton карточек сервисов
- количество соответствует `per-page`

#### Loaded (Default)
- отображается список карточек сервисов
- активны:
  - поиск
  - пагинация

#### Empty (No Services)
API вернул пустой список сервисов.

- отображается empty-state
- поиск недоступен

#### Empty (Search Results)
Поиск не вернул результатов.

- отображается empty-state
- пользователь может изменить запрос

#### Error
Ошибка загрузки списка сервисов.

- отображается error-state
- кнопка Retry

---

### 10.3 Service Details Page States

#### Loading
- skeleton:
  - информации о сервисе
  - списков триггеров и экшенов

#### Loaded (Default)
- отображается:
  - логотип
  - название
  - описание сервиса
  - списки триггеров и экшенов
- элементы с `deprecated = true` не отображаются

#### Empty (No Triggers)
Сервис не имеет активных триггеров.

- отображается empty-state внутри секции Triggers

#### Empty (No Actions)
Сервис не имеет активных экшенов.

- отображается empty-state внутри секции Actions

#### Empty (All Deprecated)
Все триггеры или экшены помечены как deprecated.

- deprecated-элементы не отображаются
- отображается empty-state

#### Error (Partial)
Ошибка загрузки одного из списков (triggers / actions).

- информация о сервисе отображается
- проблемный список показывает error-state
- возможен retry только для этого списка

#### Error (Full)
Ошибка загрузки страницы сервиса целиком.

- отображается error-state
- кнопка Retry

---

### 10.4 Pagination States

#### Loading Next Page
- отображается loader
- текущий список:
  - либо дизейблится
  - либо заменяется skeleton’ом

#### Disabled
- пагинация недоступна, если:
  - элементов меньше `per-page`
  - достигнута последняя страница

---

### 10.5 Network & Data States

#### Slow Network
- loader отображается до ответа API
- layout не должен «прыгать»

#### Partial / Invalid Data
- отсутствие отдельных полей не ломает UI
- используются placeholder’ы:
  - для логотипа
  - для описания

---

## 11. UI Copy

### 11.1 Global

| State | Text |
|------|------|
| Global Error | We couldn’t load integrations right now. |
| Retry Button | Try again |

---

### 11.2 Services Gallery

| State | Text |
|------|------|
| Empty (No Services) | No integrations available |
| Empty (Search Results) | No services found |
| Error | Failed to load services |

---

### 11.3 Service Details

#### Triggers

| State | Text |
|------|------|
| Empty (No Triggers) | This service has no available triggers |
| Empty (All Deprecated) | No active triggers available |
| Error | Failed to load triggers |

#### Actions

| State | Text |
|------|------|
| Empty (No Actions) | This service has no available actions |
| Empty (All Deprecated) | No active actions available |
| Error | Failed to load actions |

---

### 11.4 Buttons & Labels

| Element | Text |
|------|------|
| Retry button | Try again |
| Search placeholder | Search integrations |
| Pagination next | Next |
| Pagination previous | Previous |
| Back button | Back |

---

# Размещение виджета на GitHub Pages

## Вариант 1: Ручная публикация

### Шаг 1. Соберите проект

```bash
npm run build
```

Будут созданы:
- `dist/albato-widget.iife.js` — виджет
- `dist/index.html` — демо-страница (нужна для работы GitHub Pages)

### Шаг 2. Залейте содержимое dist на ветку gh-pages

**Способ A — через пакет gh-pages (проще):**

```bash
npx gh-pages -d dist
```

**Способ B — вручную:**

```bash
cd dist
git init
git add -A
git commit -m "Deploy widget to GitHub Pages"
git push -f git@github.com:USERNAME/REPO.git main:gh-pages
cd ..
```

**Важно:** замените `USERNAME` и `REPO` на ваш username и название репозитория.

Ветка `gh-pages` будет создана автоматически при первой публикации.

### Шаг 3. Включите GitHub Pages

1. Откройте репозиторий на GitHub
2. **Settings** → **Pages**
3. В разделе **Source** выберите **Deploy from a branch**
4. В **Branch** выберите `gh-pages` и папку `/ (root)` (ветка появится в списке после Шага 2)
5. Нажмите **Save**

### Шаг 4. URL виджета

После выполнения шагов 1–3 GitHub автоматически задеплоит содержимое ветки `gh-pages`. Обычно это занимает 1–2 минуты.

Виджет будет доступен по адресу:

```
https://USERNAME.github.io/REPO/albato-widget.iife.js
```

**Повторный деплой при обновлении виджета:**

1. `npm run build`
2. `npx gh-pages -d dist`

Команда из шага 2 перезапишет ветку `gh-pages` новым содержимым папки `dist/`, после чего GitHub Pages автоматически обновится.

### Пример встраивания

```html
<div id="albato-widget"></div>
<script src="https://USERNAME.github.io/REPO/albato-widget.iife.js"></script>
<script>AlbatoWidget.initWidget({ container: document.getElementById('albato-widget') });</script>
```

---

## Вариант 2: Автоматический деплой через GitHub Actions

Создайте файл `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

После добавления workflow в репозиторий:

1. Откройте **Settings** → **Pages**
2. В **Source** выберите **GitHub Actions**
3. При каждом пуше в ветку `main` виджет будет автоматически собираться и публиковаться

---

## Проверка

1. Откройте `https://USERNAME.github.io/REPO/` — должна загружаться демо-страница с виджетом
2. Откройте `https://USERNAME.github.io/REPO/albato-widget.iife.js` — должен загружаться JS-файл

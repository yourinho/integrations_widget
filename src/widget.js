/**
 * Albato Apps Widget - Embeddable integrations gallery
 * @see Albato_apps_widget_prd.md
 */

import { fetchPartners, fetchTriggers, fetchActions, getPartnerTitle } from './api.js';
import DOMPurify from 'dompurify';
import styles from './styles.css?inline';

const CSS_PREFIX = 'aw';
const PER_PAGE = 12;
const DEBOUNCE_MS = 300;

let searchTimeout;

function focusSearchInput(input) {
  if (!input) return;
  input.focus();
  const len = input.value.length;
  input.setSelectionRange(len, len);
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function sanitizeHtml(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'] });
}

function getDescription(obj) {
  return obj.description || obj.descriptionEn || '';
}

function getTriggerActionName(item, lang) {
  if (!item) return '';
  const n = item.names && typeof item.names === 'object' ? item.names : {};
  const v = n[lang];
  if (typeof v === 'string' && v.trim()) return v.trim();
  const en = n.en;
  if (typeof en === 'string' && en.trim()) return en.trim();
  return item.name || item.nameEn || '';
}

const COLOR_KEYS = [
  'primary', 'background', 'surface', 'text', 'textMuted', 'border', 'textOnPrimary',
  'cardBackground', 'detailCardBackground',
  'galleryBackground', 'detailBackground', 'searchBackground', 'searchBorderColor', 'searchFocusBorderColor',
  'cardBorderColor', 'cardHoverBorderColor', 'cardHoverShadow',
  'tabBackground', 'tabActiveBackground', 'tabBorderColor',
  'detailCardFooterBackground', 'detailCardFooterLabelColor',
  'emptyTextColor', 'errorTextColor', 'skeletonColor',
  'backButtonHoverBackground', 'showMoreBackground', 'showMoreBorderColor'
];
const CARD_SIZES = ['s', 'm', 'l'];
const DETAIL_LAYOUTS = ['stacked', 'columns'];
const ALIGN_OPTIONS = ['left', 'center', 'right'];

const DEFAULT_TEXTS = {
  galleryTitle: 'Available integrations',
  searchPlaceholder: 'Search integrations',
  detailTitleTemplate: 'Triggers and actions for {name} integrations',
  detailSubtitleTemplate: 'Triggers detect changes in {name}, and actions respond instantly — moving data or sending updates',
  showMore: 'Show more',
  back: 'Back',
  triggersTab: 'Triggers',
  actionsTab: 'Actions',
  triggersAndActionsTab: 'Triggers & Actions',
  triggerLabel: 'Trigger',
  actionLabel: 'Action',
  emptyGallery: 'No integrations available',
  emptySearch: 'No services found',
  emptyTriggers: 'This service has no available triggers',
  emptyActions: 'This service has no available actions',
  errorGeneral: "We couldn't load integrations right now.",
  errorServices: 'Failed to load services',
  retry: 'Try again',
};

const DEFAULT_TEXTS_RU = {
  ...DEFAULT_TEXTS,
  galleryTitle: 'Доступные сервисы',
  searchPlaceholder: 'Поиск по названию...',
  detailTitleTemplate: 'Триггеры и экшены для {name}',
  detailSubtitleTemplate: 'Триггеры фиксируют изменения в {name}, а действия автоматически реагируют — передавая данные и выполняя нужные обновления',
  showMore: 'Показать еще',
  back: 'Назад',
  triggersTab: 'Триггеры',
  actionsTab: 'Действия',
  triggersAndActionsTab: 'Всё',
  triggerLabel: 'Триггер',
  actionLabel: 'Действие',
};

const DEFAULT_TYPOGRAPHY = {
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
  detailCardTypeWeight: 600,
  showMoreSize: '17px',
  backSize: '17px',
};

const DEFAULT_LAYOUT = {
  maxWidth: '1040px',
  galleryPadding: '80px',
  galleryGap: '32px',
  galleryCardsGap: '32px',
  detailPadding: '80px',
  detailGap: '32px',
  detailCardsGap: '25px',
};

const DEFAULT_VISIBILITY = {
  showGalleryTitle: true,
  showSearch: true,
  showShowMore: true,
  showDetailTitle: true,
  showDetailSubtitle: true,
  showDetailTabs: true,
  showSectionTitles: true,
  showCardLogos: true,
  showDetailCardType: true,
  showDetailCardFooter: true,
};

function getOpt(opts, key, defaultValue) {
  if (opts && key in opts && opts[key] !== undefined) return opts[key];
  return defaultValue;
}

function applyOptionsToContainer(container, opts) {
  const size = typeof opts.cardSize === 'string' && CARD_SIZES.includes(opts.cardSize.toLowerCase()) ? opts.cardSize.toLowerCase() : 'l';
  const detailSize = typeof opts.detailCardSize === 'string' && CARD_SIZES.includes(opts.detailCardSize.toLowerCase()) ? opts.detailCardSize.toLowerCase() : 'l';
  const layout = typeof opts.detailLayout === 'string' && DETAIL_LAYOUTS.includes(opts.detailLayout.toLowerCase()) ? opts.detailLayout.toLowerCase() : 'stacked';
  const alignVal = typeof opts.align === 'string' && ALIGN_OPTIONS.includes(opts.align.toLowerCase()) ? opts.align.toLowerCase() : 'center';

  container.setAttribute('data-card-size', size);
  container.setAttribute('data-detail-card-size', detailSize);
  container.setAttribute('data-detail-layout', layout);
  container.setAttribute('data-align', alignVal);

  ['showGalleryTitle', 'showSearch', 'showShowMore', 'showDetailTitle', 'showDetailSubtitle', 'showDetailTabs', 'showSectionTitles', 'showCardLogos', 'showDetailCardType', 'showDetailCardFooter'].forEach((key) => {
    const v = opts[key];
    container.setAttribute(`data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, String(v !== false));
  });

  if (opts.font) container.style.fontFamily = opts.font;
  if (opts.colors && typeof opts.colors === 'object') {
    COLOR_KEYS.forEach((key) => {
      const value = opts.colors[key];
      if (typeof value === 'string' && value.trim()) {
        const varName = `--aw-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        container.style.setProperty(varName, value.trim());
      }
    });
  }
  if (typeof opts.cardRadius === 'string' && opts.cardRadius.trim()) container.style.setProperty('--aw-card-radius', opts.cardRadius.trim());
  if (typeof opts.detailCardRadius === 'string' && opts.detailCardRadius.trim()) container.style.setProperty('--aw-detail-card-radius', opts.detailCardRadius.trim());

  const typo = opts.typography && typeof opts.typography === 'object' ? opts.typography : {};
  Object.entries(DEFAULT_TYPOGRAPHY).forEach(([k, def]) => {
    const v = typo[k] ?? def;
    if (v !== undefined && v !== null) container.style.setProperty(`--aw-font-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}`, String(v));
  });

  Object.entries(DEFAULT_LAYOUT).forEach(([k, def]) => {
    const v = opts[k] ?? def;
    if (typeof v === 'string' && v.trim()) container.style.setProperty(`--aw-${k.replace(/([A-Z])/g, '-$1').toLowerCase()}`, v.trim());
  });
}

/**
 * Initialize and mount the widget
 * @param {Object} options
 * @param {HTMLElement} options.container - DOM element to mount the widget into
 * @param {number[]} [options.regions] - filter partners by region (e.g. [2, 3]). Omit to show all.
 * @param {string} [options.font] - font-family for the widget (e.g. "Inter, sans-serif" or "'Open Sans', sans-serif")
 * @param {Object} [options.colors] - color overrides (primary, background, surface, text, textMuted, border, textOnPrimary, cardBackground, detailCardBackground, galleryBackground, detailBackground, etc.)
 * @param {string} [options.cardSize] - partner card size: 'l' (180px, default), 'm' (150px), 's' (120px)
 * @param {string} [options.detailCardSize] - trigger/action card size: 'l' (330×136px, default), 'm' (270×112px), 's' (210×88px)
 * @param {string} [options.detailLayout] - detail view layout: 'stacked' (default), 'columns'
 * @param {number[]} [options.partnerIds] - allowlist of partner IDs to show (for paid clients with limited set)
 * @param {string} [options.align] - content alignment: 'center' (default), 'left', 'right'
 * @param {string} [options.cardRadius] - border radius for partner cards. Default: "16px"
 * @param {string} [options.detailCardRadius] - border radius for trigger/action cards. Default: "16px"
 * @param {Object} [options.typography] - typography overrides (galleryTitleSize, galleryTitleWeight, searchSize, cardTitleSize, etc.)
 * @param {boolean} [options.showGalleryTitle] - show gallery title. Default: true
 * @param {boolean} [options.showSearch] - show search field. Default: true
 * @param {boolean} [options.showShowMore] - show "Show more" button. Default: true
 * @param {boolean} [options.showDetailTitle] - show service title on detail page. Default: true
 * @param {boolean} [options.showDetailSubtitle] - show service description. Default: true
 * @param {boolean} [options.showDetailTabs] - show Triggers/Actions tabs. Default: true
 * @param {boolean} [options.showSectionTitles] - show section titles. Default: true
 * @param {boolean} [options.showCardLogos] - show logos in partner cards. Default: true
 * @param {boolean} [options.showDetailCardType] - show Trigger/Action label in card footer. Default: true
 * @param {boolean} [options.showDetailCardFooter] - show card footer in detail view. Default: true
 * @param {Object} [options.texts] - text overrides (galleryTitle, searchPlaceholder, showMore, back, triggersTab, actionsTab, etc.)
 * @param {string} [options.maxWidth] - max content width. Default: "1040px"
 * @param {string} [options.galleryPadding] - gallery padding. Default: "80px"
 * @param {string} [options.galleryGap] - gallery block gap. Default: "32px"
 * @param {string} [options.galleryCardsGap] - gap between partner cards. Default: "32px"
 * @param {string} [options.detailPadding] - detail page padding. Default: "80px"
 * @param {string} [options.detailGap] - detail block gap. Default: "32px"
 * @param {string} [options.detailCardsGap] - gap between trigger/action cards. Default: "25px"
 * @param {string} [options.language] - locale for partner titles and trigger/action names (de, en, es, fr, pt, ru, tr). Fallback: en. Default: "en"
 */
export function initWidget(opts = {}) {
  const { container, regions, partnerIds } = opts;
  if (!container) {
    console.error('Albato Widget: container is required');
    return;
  }
  container.classList.add('albato-widget');

  const supportedLanguages = ['de', 'en', 'es', 'fr', 'pt', 'ru', 'tr'];
  const language = supportedLanguages.includes(opts.language) ? opts.language : 'en';
  const baseTexts = language === 'ru' ? DEFAULT_TEXTS_RU : DEFAULT_TEXTS;
  const texts = { ...baseTexts, ...(opts.texts && typeof opts.texts === 'object' ? opts.texts : {}) };
  const typography = { ...DEFAULT_TYPOGRAPHY, ...(opts.typography && typeof opts.typography === 'object' ? opts.typography : {}) };
  const visibility = { ...DEFAULT_VISIBILITY, ...Object.fromEntries(Object.keys(DEFAULT_VISIBILITY).map((k) => [k, getOpt(opts, k, DEFAULT_VISIBILITY[k])])) };

  const size = typeof opts.cardSize === 'string' && CARD_SIZES.includes(opts.cardSize.toLowerCase()) ? opts.cardSize.toLowerCase() : 'l';
  const detailSize = typeof opts.detailCardSize === 'string' && CARD_SIZES.includes(opts.detailCardSize.toLowerCase()) ? opts.detailCardSize.toLowerCase() : 'l';
  const layout = typeof opts.detailLayout === 'string' && DETAIL_LAYOUTS.includes(opts.detailLayout.toLowerCase()) ? opts.detailLayout.toLowerCase() : 'stacked';
  const alignVal = typeof opts.align === 'string' && ALIGN_OPTIONS.includes(opts.align.toLowerCase()) ? opts.align.toLowerCase() : 'center';

  const partnerIdsList = Array.isArray(partnerIds) ? partnerIds.filter((id) => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))).map(Number) : undefined;

  const merged = {
    ...opts,
    regions: Array.isArray(regions) ? regions : undefined,
    partnerIds: partnerIdsList?.length ? partnerIdsList : undefined,
    language,
    cardSize: size,
    detailCardSize: detailSize,
    detailLayout: layout,
    align: alignVal,
    texts,
    typography,
    ...visibility,
    maxWidth: opts.maxWidth ?? DEFAULT_LAYOUT.maxWidth,
    galleryPadding: opts.galleryPadding ?? DEFAULT_LAYOUT.galleryPadding,
    galleryGap: opts.galleryGap ?? DEFAULT_LAYOUT.galleryGap,
    galleryCardsGap: opts.galleryCardsGap ?? DEFAULT_LAYOUT.galleryCardsGap,
    detailPadding: opts.detailPadding ?? DEFAULT_LAYOUT.detailPadding,
    detailGap: opts.detailGap ?? DEFAULT_LAYOUT.detailGap,
    detailCardsGap: opts.detailCardsGap ?? DEFAULT_LAYOUT.detailCardsGap,
  };
  container._awOptions = merged;
  applyOptionsToContainer(container, merged);

  if (!document.getElementById('albato-widget-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'albato-widget-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
  container.innerHTML = `
    <div class="${CSS_PREFIX}-root">
      ${renderLoadingState('', merged)}
    </div>
  `;
  mountGallery(container, { page: 1, search: '', regions: merged.regions, partnerIds: merged.partnerIds });
}

const SEARCH_ICON = `<svg class="${CSS_PREFIX}-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M14 14l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function renderSearchBar(search, disabled = false, opts = {}) {
  const t = opts?.texts || DEFAULT_TEXTS;
  const placeholder = t.searchPlaceholder || DEFAULT_TEXTS.searchPlaceholder;
  return `
    <div class="${CSS_PREFIX}-search">
      <div class="${CSS_PREFIX}-search-wrap">
        ${SEARCH_ICON}
        <input type="text" class="${CSS_PREFIX}-search-input" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(search)}" ${disabled ? 'disabled' : ''} />
      </div>
    </div>
  `;
}

function renderGallerySkeletons(count) {
  return Array.from({ length: count }, () => `
    <div class="${CSS_PREFIX}-skeleton-card ${CSS_PREFIX}-skeleton">
      <div class="${CSS_PREFIX}-skeleton-logo ${CSS_PREFIX}-skeleton"></div>
      <div class="${CSS_PREFIX}-skeleton-line ${CSS_PREFIX}-skeleton"></div>
    </div>
  `).join('');
}

function renderLoadingState(search = '', opts = {}) {
  const t = opts?.texts || DEFAULT_TEXTS;
  const showTitle = opts?.showGalleryTitle !== false;
  const showSearch = opts?.showSearch !== false;
  const title = t.galleryTitle || DEFAULT_TEXTS.galleryTitle;
  return `
    <div class="${CSS_PREFIX}-gallery-wrap">
      ${showTitle ? `<h2 class="${CSS_PREFIX}-gallery-title">${escapeHtml(title)}</h2>` : ''}
      ${showSearch ? renderSearchBar(search, false, opts) : ''}
      <div class="${CSS_PREFIX}-gallery">
        ${renderGallerySkeletons(PER_PAGE)}
      </div>
    </div>
  `;
}

function mountGallery(container, { page = 1, search = '', accumulatedData = [], regions: regionsParam, partnerIds: partnerIdsParam } = {}) {
  const root = container.querySelector(`.${CSS_PREFIX}-root`);
  const regions = regionsParam ?? container._awOptions?.regions;
  const partnerIds = partnerIdsParam ?? container._awOptions?.partnerIds;
  const hasClientFilter = (Array.isArray(regions) && regions.length > 0) || (Array.isArray(partnerIds) && partnerIds.length > 0);

  const searchEl = root?.querySelector(`.${CSS_PREFIX}-search-input`);
  if (searchEl) searchEl.disabled = false;

  const isLoadMore = page > 1 && accumulatedData.length > 0;
  const hadSearchFocus = document.activeElement?.closest?.('.albato-widget')?.querySelector(`.${CSS_PREFIX}-search-input`) === document.activeElement;

  const opts = container._awOptions || {};
  if (!isLoadMore) {
    root.innerHTML = renderLoadingState(search, opts);
    if (hadSearchFocus) {
      requestAnimationFrame(() => focusSearchInput(root.querySelector(`.${CSS_PREFIX}-search-input`)));
    }
    if (!partnerIds?.length) container._awPartnerContinuation = null;
  }

  const hasPartnerIdsFilter = Array.isArray(partnerIds) && partnerIds.length > 0;
  let continuation = null;
  if (hasPartnerIdsFilter) {
    if (!container._awPartnersByIdsCache) container._awPartnersByIdsCache = { all: null };
    continuation = { cache: container._awPartnersByIdsCache };
  } else if (isLoadMore && hasClientFilter) {
    continuation = container._awPartnerContinuation;
  }

  const language = opts.language || 'en';
  fetchPartners(page, search, regions, partnerIds, continuation, language)
    .then(({ data, meta, continuation: nextContinuation }) => {
      if (hasClientFilter && nextContinuation) {
        container._awPartnerContinuation = nextContinuation;
      }
      const mergedData = isLoadMore ? [...accumulatedData, ...data] : data;
      const isEmpty = mergedData.length === 0;
      const isSearchEmpty = search && isEmpty;
      const totalPages = meta?.totalPages ?? 0;
      const hasNext = totalPages > 0 && page < totalPages;
      const searchHadFocus = document.activeElement === root.querySelector(`.${CSS_PREFIX}-search-input`);

      const t = opts.texts || DEFAULT_TEXTS;
      const showTitle = opts.showGalleryTitle !== false;
      const showSearchEl = opts.showSearch !== false;
      const showMoreBtn = opts.showShowMore !== false && hasNext;
      const showLogos = opts.showCardLogos !== false;
      const emptyText = isSearchEmpty ? (t.emptySearch || 'No services found') : (t.emptyGallery || 'No integrations available');

      root.innerHTML = `
        <div class="${CSS_PREFIX}-gallery-wrap">
          ${showTitle ? `<h2 class="${CSS_PREFIX}-gallery-title">${escapeHtml(t.galleryTitle || 'Available integrations')}</h2>` : ''}
          ${showSearchEl ? renderSearchBar(search, isEmpty && !isSearchEmpty, opts) : ''}
          ${isEmpty
            ? `
            <div class="${CSS_PREFIX}-empty">
              <p>${escapeHtml(emptyText)}</p>
            </div>
          `
            : `
            <div class="${CSS_PREFIX}-gallery">
              ${mergedData.map((p) => {
                const pt = getPartnerTitle(p, language);
                return `
                <div class="${CSS_PREFIX}-card" data-partner-id="${p.partnerId}">
                  <div class="${CSS_PREFIX}-card-inner">
                    ${showLogos ? `<img src="${(p.logo && p.logo['100x100']) || ''}" alt="" class="${CSS_PREFIX}-card-logo" onerror="this.style.display='none'" />` : ''}
                    <span class="${CSS_PREFIX}-card-title" title="${escapeHtml(pt)}">${escapeHtml(pt)}</span>
                  </div>
                </div>
              `;
              }).join('')}
            </div>
            ${showMoreBtn ? `<button class="${CSS_PREFIX}-show-more">${escapeHtml(t.showMore || 'Show more')}</button>` : ''}
          `}
        </div>
      `;

      const attachSearchHandler = () => {
        const input = root.querySelector(`.${CSS_PREFIX}-search-input`);
        if (input && !input.disabled) {
          input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(
              () => mountGallery(container, { page: 1, search: e.target.value.trim(), regions, partnerIds }),
              DEBOUNCE_MS
            );
          });
          if (searchHadFocus) {
            requestAnimationFrame(() => focusSearchInput(input));
          }
        }
      };
      attachSearchHandler();

      if (!isEmpty) {
        root.querySelectorAll(`.${CSS_PREFIX}-card`).forEach((card) => {
          const partner = mergedData.find((p) => String(p.partnerId) === card.dataset.partnerId);
          card.addEventListener('click', () => mountServiceDetail(container, partner));
        });
        const showMoreBtn = root.querySelector(`.${CSS_PREFIX}-show-more`);
        if (showMoreBtn) {
          showMoreBtn.addEventListener('click', () => {
            showMoreBtn.disabled = true;
            showMoreBtn.textContent = 'Loading...';
            mountGallery(container, { page: page + 1, search, accumulatedData: mergedData, regions, partnerIds });
          });
        }
      }
    })
    .catch(() => {
      const searchHadFocus = document.activeElement === root.querySelector(`.${CSS_PREFIX}-search-input`);

      const t = opts.texts || DEFAULT_TEXTS;
      const showTitle = opts.showGalleryTitle !== false;
      const showSearchEl = opts.showSearch !== false;
      root.innerHTML = `
        <div class="${CSS_PREFIX}-gallery-wrap">
          ${showTitle ? `<h2 class="${CSS_PREFIX}-gallery-title">${escapeHtml(t.galleryTitle || 'Available integrations')}</h2>` : ''}
          ${showSearchEl ? renderSearchBar(search, false, opts) : ''}
          <div class="${CSS_PREFIX}-error">
            <p>${escapeHtml(t.errorServices || 'Failed to load services')}</p>
            <button class="${CSS_PREFIX}-retry">${escapeHtml(t.retry || 'Try again')}</button>
          </div>
        </div>
      `;
      const errInput = root.querySelector(`.${CSS_PREFIX}-search-input`);
      if (errInput) {
        errInput.addEventListener('input', (e) => {
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(() => mountGallery(container, { page: 1, search: e.target.value.trim(), regions, partnerIds }), DEBOUNCE_MS);
        });
        if (searchHadFocus) {
          requestAnimationFrame(() => focusSearchInput(errInput));
        }
      }
      root.querySelector(`.${CSS_PREFIX}-retry`).addEventListener('click', () => mountGallery(container, { page, search, regions, partnerIds }));
    });
}

function renderDetailCards(items, logoUrl, typeLabel, opts = {}) {
  if (!items.length) return '';
  const showFooter = opts.showDetailCardFooter !== false;
  const showType = opts.showDetailCardType !== false;
  const lang = opts.language || 'en';
  return `
    <div class="${CSS_PREFIX}-detail-gallery">
      ${items.map((item) => {
        const itemName = getTriggerActionName(item, lang);
        return `
        <div class="${CSS_PREFIX}-detail-card">
          <div class="${CSS_PREFIX}-detail-card-top">
            <img src="${logoUrl || ''}" alt="" class="${CSS_PREFIX}-detail-card-logo" onerror="this.style.display='none'" />
            <div class="${CSS_PREFIX}-detail-card-name">${escapeHtml(itemName)}</div>
          </div>
          ${showFooter ? `
          <div class="${CSS_PREFIX}-detail-card-footer">
            ${showType ? `<span class="${CSS_PREFIX}-detail-card-type">${escapeHtml(typeLabel)}</span>` : ''}
          </div>
          ` : ''}
        </div>
      `;
      }).join('')}
    </div>
  `;
}

const BACK_ICON = `<svg class="${CSS_PREFIX}-detail-back-icon" viewBox="0 0 20 20" fill="none"><path d="M12 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function mountServiceDetail(container, partner) {
  const partnerId = partner.partnerId;
  const root = container.querySelector(`.${CSS_PREFIX}-root`);
  const opts = container._awOptions || {};
  const backLabel = escapeHtml((opts.texts || DEFAULT_TEXTS).back || 'Back');
  root.innerHTML = `
    <div class="${CSS_PREFIX}-detail">
      <div class="${CSS_PREFIX}-detail-header">
        <button class="${CSS_PREFIX}-detail-back">${BACK_ICON}${backLabel}</button>
      </div>
      <div class="${CSS_PREFIX}-skeleton-detail ${CSS_PREFIX}-skeleton">
        <div class="${CSS_PREFIX}-skeleton-detail-title ${CSS_PREFIX}-skeleton"></div>
        <div class="${CSS_PREFIX}-skeleton-detail-subtitle ${CSS_PREFIX}-skeleton"></div>
        <div class="${CSS_PREFIX}-skeleton-detail-cards">
          ${Array.from({ length: 6 }, () => `<div class="${CSS_PREFIX}-skeleton-detail-card ${CSS_PREFIX}-skeleton"></div>`).join('')}
        </div>
      </div>
    </div>
  `;

  root.querySelector(`.${CSS_PREFIX}-detail-back`)?.addEventListener('click', () => {
    container.innerHTML = `<div class="${CSS_PREFIX}-root">${renderLoadingState('', opts)}</div>`;
    mountGallery(container, { page: 1, search: '', regions: opts.regions, partnerIds: opts.partnerIds });
  });

  Promise.allSettled([fetchTriggers(partnerId, 1), fetchActions(partnerId, 1)])
    .then(([triggersResult, actionsResult]) => {
      const title = getPartnerTitle(partner, opts.language || 'en') || 'Service';
      const logoUrl = partner?.logo?.['100x100'] || '';

      const triggersRes = triggersResult.status === 'fulfilled' ? triggersResult.value : null;
      const actionsRes = actionsResult.status === 'fulfilled' ? actionsResult.value : null;

      const triggers = triggersRes?.data || [];
      const actions = actionsRes?.data || [];

      const opts2 = container._awOptions || {};
      const t = opts2.texts || DEFAULT_TEXTS;
      const showDetailTitle = opts2.showDetailTitle !== false;
      const showDetailSubtitle = opts2.showDetailSubtitle !== false;
      const showDetailTabs = opts2.showDetailTabs !== false;
      const showSectionTitles = opts2.showSectionTitles !== false;

      const renderSection = (res, emptyMsg, errorMsg, retryType, typeLabel) => {
        if (!res) return `<div class="${CSS_PREFIX}-detail-error" data-retry="${retryType}"><p>${escapeHtml(errorMsg)}</p><button class="${CSS_PREFIX}-retry">${escapeHtml(t.retry || 'Try again')}</button></div>`;
        if (!res.data?.length) return `<div class="${CSS_PREFIX}-detail-empty"><p>${escapeHtml(emptyMsg)}</p></div>`;
        return renderDetailCards(res.data, logoUrl, typeLabel, opts2);
      };

      const triggersHtml = renderSection(triggersRes, t.emptyTriggers || 'This service has no available triggers', 'Failed to load triggers', 'triggers', t.triggerLabel || 'Trigger');
      const actionsHtml = renderSection(actionsRes, t.emptyActions || 'This service has no available actions', 'Failed to load actions', 'actions', t.actionLabel || 'Action');

      const layout = opts2.detailLayout || 'stacked';
      const isColumns = layout === 'columns';

      const sectionTitle = (label, count) => showSectionTitles ? `<h3 class="${CSS_PREFIX}-detail-section-title">${escapeHtml(label)}: ${count}</h3>` : '';
      const sectionTitleT = (label, count) => showSectionTitles ? `<h3 class="${CSS_PREFIX}-detail-section-title">${escapeHtml(label)}: ${count}</h3>` : '';

      const contentHtml = isColumns
        ? `
        <div class="${CSS_PREFIX}-detail-columns">
          <div class="${CSS_PREFIX}-detail-column">
            ${sectionTitleT(t.triggersTab || 'Triggers', triggers.length)}
            ${triggersHtml}
          </div>
          <div class="${CSS_PREFIX}-detail-column">
            ${sectionTitleT(t.actionsTab || 'Actions', actions.length)}
            ${actionsHtml}
          </div>
        </div>
      `
        : showDetailTabs
          ? `
        <div class="${CSS_PREFIX}-detail-tabs">
          <button class="${CSS_PREFIX}-detail-tab active" data-tab="all">${escapeHtml(t.triggersAndActionsTab || 'Triggers & Actions')}</button>
          <button class="${CSS_PREFIX}-detail-tab" data-tab="triggers">${escapeHtml(t.triggersTab || 'Triggers')}</button>
          <button class="${CSS_PREFIX}-detail-tab" data-tab="actions">${escapeHtml(t.actionsTab || 'Actions')}</button>
        </div>
        <div class="${CSS_PREFIX}-detail-section" data-section="all">
          <div class="${CSS_PREFIX}-detail-block">
            ${sectionTitle(t.triggersTab || 'Triggers', triggers.length)}
            ${triggersHtml}
          </div>
          <div class="${CSS_PREFIX}-detail-block">
            ${sectionTitle(t.actionsTab || 'Actions', actions.length)}
            ${actionsHtml}
          </div>
        </div>
        <div class="${CSS_PREFIX}-detail-section hidden" data-section="triggers">
          ${sectionTitle(t.triggersTab || 'Triggers', triggers.length)}
          ${triggersHtml}
        </div>
        <div class="${CSS_PREFIX}-detail-section hidden" data-section="actions">
          ${sectionTitle(t.actionsTab || 'Actions', actions.length)}
          ${actionsHtml}
        </div>
      `
          : `
        <div class="${CSS_PREFIX}-detail-section" data-section="all">
          <div class="${CSS_PREFIX}-detail-block">
            ${sectionTitle(t.triggersTab || 'Triggers', triggers.length)}
            ${triggersHtml}
          </div>
          <div class="${CSS_PREFIX}-detail-block">
            ${sectionTitle(t.actionsTab || 'Actions', actions.length)}
            ${actionsHtml}
          </div>
        </div>
      `;

      const backLabel = escapeHtml(t.back || 'Back');
      const detailTitleTmpl = t.detailTitleTemplate || DEFAULT_TEXTS.detailTitleTemplate;
      const detailSubtitleTmpl = t.detailSubtitleTemplate || DEFAULT_TEXTS.detailSubtitleTemplate;
      const detailTitleHtml = showDetailTitle ? `<h2 class="${CSS_PREFIX}-detail-title">${escapeHtml((detailTitleTmpl || '').replace(/\{name\}/g, title))}</h2>` : '';
      const detailSubtitleHtml = showDetailSubtitle ? `<p class="${CSS_PREFIX}-detail-subtitle">${escapeHtml((detailSubtitleTmpl || '').replace(/\{name\}/g, title))}</p>` : '';

      root.innerHTML = `
        <div class="${CSS_PREFIX}-detail">
          <div class="${CSS_PREFIX}-detail-header">
            <button class="${CSS_PREFIX}-detail-back">${BACK_ICON}${backLabel}</button>
          </div>
          ${detailTitleHtml}
          ${detailSubtitleHtml}
          ${contentHtml}
        </div>
      `;

      root.querySelector(`.${CSS_PREFIX}-detail-back`).addEventListener('click', () => {
        container.innerHTML = `<div class="${CSS_PREFIX}-root">${renderLoadingState('', container._awOptions || {})}</div>`;
        mountGallery(container, { page: 1, search: '' });
      });

      if (!isColumns) {
        root.querySelectorAll(`.${CSS_PREFIX}-detail-tab`).forEach((tab) => {
          tab.addEventListener('click', () => {
            root.querySelectorAll(`.${CSS_PREFIX}-detail-tab`).forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            root.querySelectorAll(`.${CSS_PREFIX}-detail-section`).forEach((s) => s.classList.add('hidden'));
            root.querySelector(`.${CSS_PREFIX}-detail-section[data-section="${tab.dataset.tab}"]`).classList.remove('hidden');
          });
        });
      }

      root.querySelectorAll(`[data-retry]`).forEach((el) => {
        const btn = el.querySelector(`.${CSS_PREFIX}-retry`);
        if (btn) btn.addEventListener('click', () => mountServiceDetail(container, partner));
      });
    })
    .catch(() => {
      const errOpts = container._awOptions || {};
      const errBack = escapeHtml((errOpts.texts || DEFAULT_TEXTS).back || 'Back');
      root.innerHTML = `
        <div class="${CSS_PREFIX}-detail">
          <div class="${CSS_PREFIX}-detail-header">
            <button class="${CSS_PREFIX}-detail-back">${BACK_ICON}${errBack}</button>
          </div>
          <div class="${CSS_PREFIX}-error">
            <p>We couldn't load integrations right now.</p>
            <button class="${CSS_PREFIX}-retry">Try again</button>
          </div>
        </div>
      `;
      root.querySelector(`.${CSS_PREFIX}-detail-back`).addEventListener('click', () => {
        container.innerHTML = `<div class="${CSS_PREFIX}-root">${renderLoadingState('', container._awOptions || {})}</div>`;
        mountGallery(container, { page: 1, search: '' });
      });
      root.querySelector(`.${CSS_PREFIX}-retry`).addEventListener('click', () => mountServiceDetail(container, partner));
    });
}

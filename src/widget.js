/**
 * Albato Apps Widget - Embeddable integrations gallery
 * @see Albato_apps_widget_prd.md
 */

import { fetchPartners, fetchTriggers, fetchActions } from './api.js';
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

const COLOR_KEYS = ['primary', 'background', 'surface', 'text', 'textMuted', 'border', 'textOnPrimary'];
const CARD_SIZES = ['s', 'm', 'l'];
const DETAIL_LAYOUTS = ['stacked', 'columns'];
const ALIGN_OPTIONS = ['left', 'center', 'right'];

/**
 * Initialize and mount the widget
 * @param {Object} options
 * @param {HTMLElement} options.container - DOM element to mount the widget into
 * @param {number[]} [options.regions] - filter partners by region (e.g. [2, 3]). Omit to show all.
 * @param {string} [options.font] - font-family for the widget (e.g. "Inter, sans-serif" or "'Open Sans', sans-serif")
 * @param {Object} [options.colors] - optional color overrides: primary, background, surface, text, textMuted, border, textOnPrimary
 * @param {string} [options.cardSize] - partner card size: 'l' (180px, default), 'm' (150px), 's' (120px)
 * @param {string} [options.detailCardSize] - trigger/action card size: 'l' (330×136px, default), 'm' (270×112px), 's' (210×88px)
 * @param {string} [options.detailLayout] - detail view layout: 'stacked' (blocks under each other, default), 'columns' (triggers and actions in two columns)
 * @param {number[]} [options.partnerIds] - allowlist of partner IDs to show (for paid clients with limited set)
 * @param {string} [options.align] - content alignment: 'center' (default), 'left', 'right'
 */
export function initWidget({ container, regions, font, colors, cardSize, detailCardSize, detailLayout, partnerIds, align }) {
  if (!container) {
    console.error('Albato Widget: container is required');
    return;
  }
  container.classList.add('albato-widget');
  const size = typeof cardSize === 'string' && CARD_SIZES.includes(cardSize.toLowerCase()) ? cardSize.toLowerCase() : 'l';
  container.setAttribute('data-card-size', size);
  const detailSize = typeof detailCardSize === 'string' && CARD_SIZES.includes(detailCardSize.toLowerCase()) ? detailCardSize.toLowerCase() : 'l';
  container.setAttribute('data-detail-card-size', detailSize);
  const layout = typeof detailLayout === 'string' && DETAIL_LAYOUTS.includes(detailLayout.toLowerCase()) ? detailLayout.toLowerCase() : 'stacked';
  container.setAttribute('data-detail-layout', layout);
  const alignVal = typeof align === 'string' && ALIGN_OPTIONS.includes(align.toLowerCase()) ? align.toLowerCase() : 'center';
  container.setAttribute('data-align', alignVal);
  if (font) {
    container.style.fontFamily = font;
  }
  if (colors && typeof colors === 'object') {
    COLOR_KEYS.forEach((key) => {
      const value = colors[key];
      if (typeof value === 'string' && value.trim()) {
        const varName = `--aw-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        container.style.setProperty(varName, value.trim());
      }
    });
  }
  const partnerIdsList = Array.isArray(partnerIds) ? partnerIds.filter((id) => typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))).map(Number) : undefined;
  container._awOptions = { regions: Array.isArray(regions) ? regions : undefined, partnerIds: partnerIdsList?.length ? partnerIdsList : undefined, font, colors, cardSize: size, detailCardSize: detailSize, detailLayout: layout, align: alignVal };
  if (!document.getElementById('albato-widget-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'albato-widget-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }
  container.innerHTML = `
    <div class="${CSS_PREFIX}-root">
      ${renderLoadingState()}
    </div>
  `;
  mountGallery(container, { page: 1, search: '', regions: container._awOptions?.regions, partnerIds: container._awOptions?.partnerIds });
}

const SEARCH_ICON = `<svg class="${CSS_PREFIX}-search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M14 14l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function renderSearchBar(search, disabled = false) {
  return `
    <div class="${CSS_PREFIX}-search">
      <div class="${CSS_PREFIX}-search-wrap">
        ${SEARCH_ICON}
        <input type="text" class="${CSS_PREFIX}-search-input" placeholder="Search integrations" value="${escapeHtml(search)}" ${disabled ? 'disabled' : ''} />
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

function renderLoadingState(search = '') {
  return `
    <div class="${CSS_PREFIX}-gallery-wrap">
      <h2 class="${CSS_PREFIX}-gallery-title">Available integrations</h2>
      ${renderSearchBar(search)}
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

  if (!isLoadMore) {
    root.innerHTML = renderLoadingState(search);
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

  fetchPartners(page, search, regions, partnerIds, continuation)
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

      root.innerHTML = `
        <div class="${CSS_PREFIX}-gallery-wrap">
          <h2 class="${CSS_PREFIX}-gallery-title">Available integrations</h2>
          ${renderSearchBar(search, isEmpty && !isSearchEmpty)}
          ${isEmpty
            ? `
            <div class="${CSS_PREFIX}-empty">
              <p>${isSearchEmpty ? 'No services found' : 'No integrations available'}</p>
            </div>
          `
            : `
            <div class="${CSS_PREFIX}-gallery">
              ${mergedData.map((p) => `
                <div class="${CSS_PREFIX}-card" data-partner-id="${p.partnerId}">
                  <div class="${CSS_PREFIX}-card-inner">
                    <img src="${(p.logo && p.logo['100x100']) || ''}" alt="" class="${CSS_PREFIX}-card-logo" onerror="this.style.display='none'" />
                    <span class="${CSS_PREFIX}-card-title" title="${escapeHtml(p.title || '')}">${escapeHtml(p.title || '')}</span>
                  </div>
                </div>
              `).join('')}
            </div>
            ${hasNext ? `<button class="${CSS_PREFIX}-show-more">Show more</button>` : ''}
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

      root.innerHTML = `
        <div class="${CSS_PREFIX}-gallery-wrap">
          <h2 class="${CSS_PREFIX}-gallery-title">Available integrations</h2>
          ${renderSearchBar(search)}
          <div class="${CSS_PREFIX}-error">
            <p>Failed to load services</p>
            <button class="${CSS_PREFIX}-retry">Try again</button>
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

function renderDetailCards(items, logoUrl, typeLabel) {
  if (!items.length) return '';
  return `
    <div class="${CSS_PREFIX}-detail-gallery">
      ${items.map((item) => `
        <div class="${CSS_PREFIX}-detail-card">
          <div class="${CSS_PREFIX}-detail-card-top">
            <img src="${logoUrl || ''}" alt="" class="${CSS_PREFIX}-detail-card-logo" onerror="this.style.display='none'" />
            <div class="${CSS_PREFIX}-detail-card-name">${escapeHtml(item.name || '')}</div>
          </div>
          <div class="${CSS_PREFIX}-detail-card-footer">
            <span class="${CSS_PREFIX}-detail-card-type">${typeLabel}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

const BACK_ICON = `<svg class="${CSS_PREFIX}-detail-back-icon" viewBox="0 0 20 20" fill="none"><path d="M12 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function mountServiceDetail(container, partner) {
  const partnerId = partner.partnerId;
  const root = container.querySelector(`.${CSS_PREFIX}-root`);
  root.innerHTML = `
    <div class="${CSS_PREFIX}-detail">
      <div class="${CSS_PREFIX}-detail-header">
        <button class="${CSS_PREFIX}-detail-back">${BACK_ICON}Back</button>
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
    container.innerHTML = `<div class="${CSS_PREFIX}-root">${renderLoadingState()}</div>`;
    mountGallery(container, { page: 1, search: '' });
  });

  Promise.allSettled([fetchTriggers(partnerId, 1), fetchActions(partnerId, 1)])
    .then(([triggersResult, actionsResult]) => {
      const title = partner?.title || 'Service';
      const logoUrl = partner?.logo?.['100x100'] || '';

      const triggersRes = triggersResult.status === 'fulfilled' ? triggersResult.value : null;
      const actionsRes = actionsResult.status === 'fulfilled' ? actionsResult.value : null;

      const triggers = triggersRes?.data || [];
      const actions = actionsRes?.data || [];

      const renderSection = (res, emptyMsg, errorMsg, retryType, typeLabel) => {
        if (!res) return `<div class="${CSS_PREFIX}-detail-error" data-retry="${retryType}"><p>${errorMsg}</p><button class="${CSS_PREFIX}-retry">Try again</button></div>`;
        if (!res.data?.length) return `<div class="${CSS_PREFIX}-detail-empty"><p>${emptyMsg}</p></div>`;
        return renderDetailCards(res.data, logoUrl, typeLabel);
      };

      const triggersHtml = renderSection(triggersRes, 'This service has no available triggers', 'Failed to load triggers', 'triggers', 'Trigger');
      const actionsHtml = renderSection(actionsRes, 'This service has no available actions', 'Failed to load actions', 'actions', 'Action');

      const layout = container._awOptions?.detailLayout || 'stacked';
      const isColumns = layout === 'columns';

      const contentHtml = isColumns
        ? `
        <div class="${CSS_PREFIX}-detail-columns">
          <div class="${CSS_PREFIX}-detail-column">
            <h3 class="${CSS_PREFIX}-detail-section-title">TRIGGERS: ${triggers.length}</h3>
            ${triggersHtml}
          </div>
          <div class="${CSS_PREFIX}-detail-column">
            <h3 class="${CSS_PREFIX}-detail-section-title">ACTIONS: ${actions.length}</h3>
            ${actionsHtml}
          </div>
        </div>
      `
        : `
        <div class="${CSS_PREFIX}-detail-tabs">
          <button class="${CSS_PREFIX}-detail-tab active" data-tab="all">Triggers&amp;Actions</button>
          <button class="${CSS_PREFIX}-detail-tab" data-tab="triggers">Triggers</button>
          <button class="${CSS_PREFIX}-detail-tab" data-tab="actions">Actions</button>
        </div>
        <div class="${CSS_PREFIX}-detail-section" data-section="all">
          <div class="${CSS_PREFIX}-detail-block">
            <h3 class="${CSS_PREFIX}-detail-section-title">TRIGGERS: ${triggers.length}</h3>
            ${triggersHtml}
          </div>
          <div class="${CSS_PREFIX}-detail-block">
            <h3 class="${CSS_PREFIX}-detail-section-title">ACTIONS: ${actions.length}</h3>
            ${actionsHtml}
          </div>
        </div>
        <div class="${CSS_PREFIX}-detail-section hidden" data-section="triggers">
          <h3 class="${CSS_PREFIX}-detail-section-title">TRIGGERS: ${triggers.length}</h3>
          ${triggersHtml}
        </div>
        <div class="${CSS_PREFIX}-detail-section hidden" data-section="actions">
          <h3 class="${CSS_PREFIX}-detail-section-title">ACTIONS: ${actions.length}</h3>
          ${actionsHtml}
        </div>
      `;

      root.innerHTML = `
        <div class="${CSS_PREFIX}-detail">
          <div class="${CSS_PREFIX}-detail-header">
            <button class="${CSS_PREFIX}-detail-back">${BACK_ICON}Back</button>
          </div>
          <h2 class="${CSS_PREFIX}-detail-title">Triggers and actions for ${escapeHtml(title)} integrations</h2>
          <p class="${CSS_PREFIX}-detail-subtitle">Triggers detect changes in ${escapeHtml(title)}, and actions respond instantly — moving data or sending updates</p>
          ${contentHtml}
        </div>
      `;

      root.querySelector(`.${CSS_PREFIX}-detail-back`).addEventListener('click', () => {
        container.innerHTML = `<div class="${CSS_PREFIX}-root">${renderLoadingState()}</div>`;
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
      root.innerHTML = `
        <div class="${CSS_PREFIX}-detail">
          <div class="${CSS_PREFIX}-detail-header">
            <button class="${CSS_PREFIX}-detail-back">${BACK_ICON}Back</button>
          </div>
          <div class="${CSS_PREFIX}-error">
            <p>We couldn't load integrations right now.</p>
            <button class="${CSS_PREFIX}-retry">Try again</button>
          </div>
        </div>
      `;
      root.querySelector(`.${CSS_PREFIX}-detail-back`).addEventListener('click', () => {
        container.innerHTML = `<div class="${CSS_PREFIX}-root">${renderLoadingState()}</div>`;
        mountGallery(container, { page: 1, search: '' });
      });
      root.querySelector(`.${CSS_PREFIX}-retry`).addEventListener('click', () => mountServiceDetail(container, partner));
    });
}

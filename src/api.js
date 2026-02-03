/**
 * Albato API client
 */

const API_BASE = 'https://api.albato.com';
const PER_PAGE_SERVICES = 12;
const PER_PAGE_TRIGGERS_ACTIONS = 10;
const EXCLUDED_PARTNER_ID = 1;

function buildUrl(path, params = {}) {
  const url = new URL(path, API_BASE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

/**
 * @param {number} page
 * @param {string} search
 * @returns {Promise<{data: Array, meta: {page, totalPages, totalItemsCount}}>}
 */
export async function fetchPartners(page = 1, search = '') {
  const params = {
    'per-page': PER_PAGE_SERVICES,
    page: String(page),
  };
  if (search) {
    params['filter[title][like]'] = search;
  }
  const url = buildUrl('/partners/info', params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error('API returned success: false');
  const filtered = (json.data || []).filter(
    (p) => !p.deprecated && p.partnerId !== EXCLUDED_PARTNER_ID
  );
  return {
    data: filtered,
    meta: json.meta || { page: 1, totalPages: 1, totalItemsCount: filtered.length },
  };
}

/**
 * @param {number} partnerId
 * @param {number} page
 * @returns {Promise<{data: Array, meta}>}
 */
export async function fetchTriggers(partnerId, page = 1) {
  const url = buildUrl('/partners/trigger-actions/info', {
    'filter[partnerId]': String(partnerId),
    'filter[isAction]': '0',
    'per-page': String(PER_PAGE_TRIGGERS_ACTIONS),
    page: String(page),
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error('API returned success: false');
  const filtered = (json.data || []).filter((item) => !item.deprecated);
  return {
    data: filtered,
    meta: json.meta || { page: 1, totalPages: 1, totalItemsCount: filtered.length },
  };
}

/**
 * @param {number} partnerId
 * @param {number} page
 * @returns {Promise<{data: Array, meta}>}
 */
export async function fetchActions(partnerId, page = 1) {
  const url = buildUrl('/partners/trigger-actions/info', {
    'filter[partnerId]': String(partnerId),
    'filter[isAction]': '1',
    'per-page': String(PER_PAGE_TRIGGERS_ACTIONS),
    page: String(page),
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error('API returned success: false');
  const filtered = (json.data || []).filter((item) => !item.deprecated);
  return {
    data: filtered,
    meta: json.meta || { page: 1, totalPages: 1, totalItemsCount: filtered.length },
  };
}

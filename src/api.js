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

function filterByRegion(partners, regions) {
  if (!Array.isArray(regions) || regions.length === 0) return partners;
  return partners.filter((p) => {
    const partnerRegions = Array.isArray(p.region) ? p.region : (p.region != null ? [p.region] : []);
    return partnerRegions.some((r) => regions.includes(r));
  });
}

function filterByPartnerIds(partners, partnerIds) {
  if (!Array.isArray(partnerIds) || partnerIds.length === 0) return partners;
  const idSet = new Set(partnerIds.map((id) => String(id)));
  return partners.filter((p) => idSet.has(String(p.partnerId)));
}

async function fetchOnePartnersPage(apiPage, search) {
  const params = {
    'per-page': PER_PAGE_SERVICES,
    page: String(apiPage),
  };
  if (search) {
    params['filter[title][like]'] = search;
  }
  const url = buildUrl('/partners/info', params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error('API returned success: false');
  const baseFiltered = (json.data || []).filter(
    (p) => !p.deprecated && p.partnerId !== EXCLUDED_PARTNER_ID
  );
  return {
    data: baseFiltered,
    totalPages: json.meta?.totalPages ?? 1,
  };
}

/**
 * @param {number} page - widget page (1-based), used when no client-side filter
 * @param {string} search
 * @param {number[]|null} [regions]
 * @param {number[]|null} [partnerIds] - allowlist of partner IDs to show (for paid clients)
 * @param {{ leftover: Array, nextApiPage: number }|null} [continuation] - for client-side filter pagination
 * @returns {Promise<{data: Array, meta: {page, totalPages, totalItemsCount}, continuation?: Object}>}
 */
export async function fetchPartners(page = 1, search = '', regions = null, partnerIds = null, continuation = null) {
  const hasClientFilter = (Array.isArray(regions) && regions.length > 0) || (Array.isArray(partnerIds) && partnerIds.length > 0);

  if (!hasClientFilter) {
    const { data: raw, totalPages } = await fetchOnePartnersPage(page, search);
    return {
      data: raw,
      meta: { page, totalPages, totalItemsCount: raw.length },
    };
  }

  const targetCount = PER_PAGE_SERVICES;
  let accumulated = continuation?.leftover ? [...continuation.leftover] : [];
  let apiPage = continuation?.nextApiPage ?? 1;
  let totalApiPages = null;

  const filterData = (raw) => {
    let result = raw;
    if (Array.isArray(regions) && regions.length > 0) {
      result = filterByRegion(result, regions);
    }
    if (Array.isArray(partnerIds) && partnerIds.length > 0) {
      result = filterByPartnerIds(result, partnerIds);
    }
    return result;
  };

  while (accumulated.length < targetCount) {
    const { data: raw, totalPages } = await fetchOnePartnersPage(apiPage, search);
    if (totalApiPages === null) totalApiPages = totalPages;

    const filtered = filterData(raw);
    accumulated = accumulated.concat(filtered);

    if (apiPage >= totalApiPages) break;
    apiPage++;
  }

  const result = accumulated.slice(0, targetCount);
  const leftover = accumulated.slice(targetCount);
  const hasMore = leftover.length > 0 || apiPage < totalApiPages;

  return {
    data: result,
    meta: {
      page,
      totalPages: hasMore ? page + 1 : page,
      totalItemsCount: result.length,
    },
    continuation: {
      leftover,
      nextApiPage: apiPage + 1,
    },
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

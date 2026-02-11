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
 * Fetch a single partner by ID (parallel-friendly for partnerIds filter)
 * Uses filter[partnerId] - API must support this on /partners/info
 */
async function fetchOnePartnerById(partnerId) {
  const params = {
    'filter[partnerId]': String(partnerId),
    'per-page': '1',
    page: '1',
  };
  const url = buildUrl('/partners/info', params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error('API returned success: false');
  const data = (json.data || []).filter(
    (p) => !p.deprecated && p.partnerId !== EXCLUDED_PARTNER_ID && String(p.partnerId) === String(partnerId)
  );
  return data[0] || null;
}

/**
 * Fetch multiple partners by IDs in parallel (one request per partner)
 */
export async function fetchPartnersByIds(partnerIds, search = '') {
  if (!Array.isArray(partnerIds) || partnerIds.length === 0) {
    return { data: [], meta: { page: 1, totalPages: 0, totalItemsCount: 0 } };
  }
  const results = await Promise.all(partnerIds.map((id) => fetchOnePartnerById(id)));
  let data = results.filter(Boolean);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((p) => (p.title || '').toLowerCase().includes(q));
  }
  return {
    data,
    meta: { page: 1, totalPages: 1, totalItemsCount: data.length },
  };
}

/**
 * @param {number} page - widget page (1-based), used when no client-side filter
 * @param {string} search
 * @param {number[]|null} [regions]
 * @param {number[]|null} [partnerIds] - allowlist of partner IDs to show (for paid clients)
 * @param {{ leftover?: Array, nextApiPage?: number, cache?: { all: Array } }|null} [continuation] - for pagination; cache for partnerIds
 * @returns {Promise<{data: Array, meta: {page, totalPages, totalItemsCount}, continuation?: Object}>}
 */
export async function fetchPartners(page = 1, search = '', regions = null, partnerIds = null, continuation = null) {
  const hasPartnerIdsFilter = Array.isArray(partnerIds) && partnerIds.length > 0;
  const hasRegionsFilter = Array.isArray(regions) && regions.length > 0;
  const hasClientFilter = hasRegionsFilter || hasPartnerIdsFilter;

  /* No client filter: use API pagination directly */
  if (!hasClientFilter) {
    const { data: raw, totalPages } = await fetchOnePartnersPage(page, search);
    return {
      data: raw,
      meta: { page, totalPages, totalItemsCount: raw.length },
    };
  }

  /* PartnerIds filter: fetch each partner in parallel, cache, paginate client-side */
  if (hasPartnerIdsFilter) {
    const cache = continuation?.cache || { all: null };
    if (!cache.all) {
      const { data } = await fetchPartnersByIds(partnerIds, '');
      cache.all = filterByRegion(data, regions);
    }
    let filtered = cache.all;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => (p.title || '').toLowerCase().includes(q));
    }
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE_SERVICES));
    const start = (page - 1) * PER_PAGE_SERVICES;
    const result = filtered.slice(start, start + PER_PAGE_SERVICES);
    const hasMore = page < totalPages;

    return {
      data: result,
      meta: { page, totalPages, totalItemsCount: result.length },
      continuation: hasMore ? { cache } : undefined,
    };
  }

  /* Regions filter only: iterate API pages, filter, accumulate */
  const targetCount = PER_PAGE_SERVICES;
  let accumulated = continuation?.leftover ? [...continuation.leftover] : [];
  let apiPage = continuation?.nextApiPage ?? 1;
  let totalApiPages = null;

  while (accumulated.length < targetCount) {
    const { data: raw, totalPages } = await fetchOnePartnersPage(apiPage, search);
    if (totalApiPages === null) totalApiPages = totalPages;

    const filtered = filterByRegion(raw, regions);
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

/**
 * Safely extracts paginated list data from different backend response structures.
 * Works with structures like:
 *
 * { data: { result: { data: [...] } } }
 * { data: { data: [...] } }
 * { result: { data: [...] } }
 * { data: [...] }
 * { ... }
 */

export function safeExtractList(res: any): any[] {
  if (!res) return [];

  // MOST COMMON FORMAT (your current backend)
  if (res.result?.data) return res.result.data;

  // ⭐ EXACT MATCH for your trip sheet API
 if (Array.isArray(res?.data?.result?.items)) {
    return res.data.result.items;
  }

  // sometimes inside "data.result"
  if (res.data?.result?.data) return res.data.result.data;
  if (Array.isArray(res.data?.data?.result?.items)) {
    return res.data.data.result.items;
  }
  // sometimes inside "data.data"
  if (res.data?.data) return res.data.data;

  // direct array inside data
  if (Array.isArray(res.data)) return res.data;

  // direct array inside result
  if (Array.isArray(res.result)) return res.result;

  // NEW: your CVD format -> res.data.data.result
  if (Array.isArray(res.data?.data?.result)) return res.data.data.result;

  // NEW: sometimes result exists one level down
  if (Array.isArray(res.data?.result)) return res.data.result;

  // direct standardResponse format: res.result.data
  if (Array.isArray(res.result?.data)) return res.result.data;

  // direct array inside res.data.data
  if (Array.isArray(res.data?.data)) return res.data.data;

  // fallback patterns
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.result)) return res.result;
  if (Array.isArray(res)) return res;

  // fallback: if response itself is array
  if (Array.isArray(res)) return res;

  console.warn('⚠️ safeExtractList: Unexpected response format', res);

  return [];
}

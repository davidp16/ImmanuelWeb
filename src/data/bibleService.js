// ===== Bible API Service =====
// Using Local Backend API for Zero Cold-Start
const BASE_URL = '/api/bible'

// Cache for fetched chapters (avoid refetching)
const cache = new Map()

/**
 * Fetch the passage list from the API
 * @param {string} version - 'tb' or 'toba'
 * @returns {Promise<Array<{ no: number, abbr: string, name: string, chapter: number }>>}
 */
export async function fetchPassageList(version = 'tb') {
  const cacheKey = `_passage_list_${version}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const response = await fetch(`${BASE_URL}/list?version=${version}`)
  if (!response.ok) {
    throw new Error(`Gagal mengambil daftar kitab: ${response.status}`)
  }

  const json = await response.json()
  const list = json.data || []
  cache.set(cacheKey, list)
  return list
}

/**
 * Fetch a chapter's verses from the API
 * @param {string} abbr - Book abbreviation (e.g. "Kej", "Mat")
 * @param {number} chapter - Chapter number
 * @param {string} version - 'tb' or 'toba'
 * @returns {Promise<{ verses: Array<{ verse: number, text: string, title: string }>, bookName: string, chapter: number, version: string }>}
 */
export async function fetchChapter(abbr, chapter, version = 'tb') {
  const cacheKey = `${abbr}_${chapter}_${version}`

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }

  const url = `${BASE_URL}/passage/${encodeURIComponent(abbr)}/${chapter}?version=${version}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Gagal mengambil data: ${response.status}`)
  }

  const json = await response.json()
  const result = parseBeebleResponse(json, abbr, chapter, version)
  cache.set(cacheKey, result)
  return result
}

/**
 * Parse the Beeble API response into a clean format
 * Beeble returns: { data: { book: { no, name, chapter }, verses: [{ verse, type, content }] } }
 * We normalize to: { verses: [{ verse, text, title }], bookName, chapter, version }
 */
function parseBeebleResponse(json, abbr, chapter, versionParam) {
  const verses = []
  const versionName = versionParam === 'toba' ? 'Batak Toba (TOBA)' : 'Terjemahan Baru (TB)'

  try {
    const data = json.data
    if (!data || !data.verses) {
      return { verses: [], bookName: abbr, chapter, version: versionName }
    }

    let pendingTitle = ''

    for (const item of data.verses) {
      if (item.type === 'title') {
        // Title items (verse: 0) are section headers — attach to next verse
        pendingTitle = item.content || ''
      } else {
        verses.push({
          verse: item.verse,
          text: item.content || '',
          title: pendingTitle,
        })
        pendingTitle = ''
      }
    }

    return {
      verses,
      bookName: data.book?.name || abbr,
      chapter: data.book?.chapter || chapter,
      version: versionName,
      bookAbbr: abbr,
    }
  } catch {
    console.error('Error parsing Beeble response:', json)
    return { verses: [], bookName: abbr, chapter, version: versionName }
  }
}

/**
 * Clear the cache (useful if needed)
 */
export function clearCache() {
  cache.clear()
}

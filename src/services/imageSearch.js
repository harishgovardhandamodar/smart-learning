const WIKI_API = 'https://en.wikipedia.org/w/api.php'
const WIKI_API_NL = 'https://nl.wikipedia.org/w/api.php'

export async function fetchTopicImage(query, locale = 'en') {
  try {
    const api = locale === 'nl' ? WIKI_API_NL : WIKI_API
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: query,
      gsrlimit: 1,
      prop: 'pageimages',
      piprop: 'thumbnail',
      pithumbsize: 400,
      format: 'json',
      origin: '*',
    })
    const res = await fetch(`${api}?${params}`)
    const data = await res.json()
    const pages = data.query?.pages
    if (!pages) return null
    const page = Object.values(pages)[0]
    if (!page?.thumbnail?.source) return null

    const caption = locale === 'nl'
      ? `Afbeelding: ${page.title}`
      : `Image: ${page.title}`

    return {
      url: page.thumbnail.source,
      caption,
      title: page.title,
    }
  } catch {
    return null
  }
}

export function extractSearchQuery(userQuestion, topicTitle) {
  const clean = userQuestion
    .replace(/^(tell me about|how does|what is|why is|explain|vertel me over|hoe werkt|wat is|waarom is|leg uit)\s+/i, '')
    .replace(/[?.!]+$/, '')
    .trim()
  return clean || topicTitle
}

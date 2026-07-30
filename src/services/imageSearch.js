const WIKI_API = 'https://en.wikipedia.org/w/api.php'
const WIKI_API_NL = 'https://nl.wikipedia.org/w/api.php'

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = 'wikiCB' + Date.now()
    window[cb] = (data) => {
      delete window[cb]
      const s = document.getElementById(cb)
      if (s) s.remove()
      resolve(data)
    }
    const sep = url.includes('?') ? '&' : '?'
    const script = document.createElement('script')
    script.id = cb
    script.src = `${url}${sep}format=json&callback=${cb}`
    script.onerror = () => {
      delete window[cb]
      const s = document.getElementById(cb)
      if (s) s.remove()
      reject(new Error('JSONP load failed'))
    }
    document.head.appendChild(script)
  })
}

export async function fetchTopicImage(query, locale = 'en') {
  try {
    const api = locale === 'nl' ? WIKI_API_NL : WIKI_API
    const url = `${api}?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=400&origin=*`

    const data = await jsonp(url)
    const pages = data.query?.pages
    if (!pages) {
      console.warn('[imageSearch] no pages for query:', query)
      return null
    }

    const page = Object.values(pages)[0]
    if (!page?.thumbnail?.source) {
      console.warn('[imageSearch] no thumbnail for page:', page?.title)
      return null
    }

    const caption = locale === 'nl'
      ? `Afbeelding: ${page.title}`
      : `Image: ${page.title}`

    return {
      url: page.thumbnail.source,
      caption,
      title: page.title,
    }
  } catch (err) {
    console.warn('[imageSearch] failed:', err)
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

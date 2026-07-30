import { storage } from '../utils/storage'

const API_BASE = `http://${window.location.hostname}:8081/v1`
const STORAGE_KEY = 'physicsDeepDive_ai'

const headers = { 'Content-Type': 'application/json' }

async function chatCompletion(body) {
  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

const GENERATION_PROMPT_EN = `You are a world-class STEM curriculum designer for children aged 10-11.

Generate a complete, detailed 4-week Physics Deep Dive program. Each week has 7 days. Every day must include:
1. A creative title
2. A clear focus sentence
3. "Morning Phenomenon" — a fun observation or demo to spark curiosity (1-2 paragraphs)
4. "Midday Deep Dive" — the science explanation in simple, engaging language with emojis (2-3 paragraphs)
5. "Evening Field Work" — a hands-on experiment or activity using common household items (step by step)
6. A list of materials needed (as an array of strings)
7. 2-3 reflection questions

The 4 weeks should cover:
- Week 1: Kinematics — Movement, Speed, Velocity, Acceleration
- Week 2: Forces & Energy — Push, Pull, Friction, Gravity, Potential & Kinetic Energy
- Week 3: Waves & Sound — Vibrations, Pitch, Amplitude, How Sound Travels
- Week 4: Light & Optics — How Light Travels, Reflection, Refraction, Colors

Rules:
- Use language an 10-11 year old can understand
- Include emojis throughout 🌟
- Every experiment must use safe household items (string, cups, rubber bands, paper, etc.)
- Make it fun, adventurous, and curiosity-driven
- Output ONLY valid JSON

You MUST respond with ONLY this exact JSON structure (no markdown, no code fences):
{
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "subtitle": "Short subtitle",
      "days": [
        {
          "day": 1,
          "title": "Day title",
          "focus": "Focus sentence",
          "morning": "Morning phenomenon content...",
          "midday": "Midday deep dive content...",
          "evening": "Step-by-step evening activity...",
          "materials": ["item1", "item2"],
          "questions": ["Question 1?", "Question 2?", "Question 3?"]
        }
      ]
    }
  ]
}`

const GENERATION_PROMPT_NL = `Je bent een wereldklasse STEM-curriculumontwerper voor kinderen van 10-11 jaar.

Genereer een compleet, gedetailleerd 4-weeks Natuurkunde Deep Dive-programma. Elke week heeft 7 dagen. Elke dag moet bevatten:
1. Een creatieve titel
2. Een duidelijke focuszin
3. "Ochtendfenomeen" — een leuke observatie of demo om nieuwsgierigheid op te wekken (1-2 alinea's)
4. "Midday Diepe Duik" — de wetenschappelijke uitleg in eenvoudige, boeiende taal met emojis (2-3 alinea's)
5. "Avond Veldwerk" — een praktisch experiment of activiteit met alledaagse spullen (stap voor stap)
6. Een lijst met benodigde materialen (als een lijst met strings)
7. 2-3 reflectievragen

De 4 weken moeten behandelen:
- Week 1: Kinetica — Beweging, Snelheid, Versnelling
- Week 2: Krachten & Energie — Duwen, Trekken, Wrijving, Zwaartekracht, Potentiële & Kinetische Energie
- Week 3: Golven & Geluid — Trillingen, Toonhoogte, Amplitude, Hoe Geluid Reist
- Week 4: Licht & Optica — Hoe Licht Reist, Reflectie, Breking, Kleuren

Regels:
- Gebruik taal die een 10-11 jarige begrijpt
- Gebruik emojis 🌟
- Elk experiment moet veilige huishoudelijke spullen gebruiken (touw, bekers, elastiekjes, papier, etc.)
- Maak het leuk, avontuurlijk en nieuwsgierigheidsgedreven
- Output ALLEEN geldige JSON

Je moet reageren met ALLEEN deze exacte JSON-structuur (geen markdown, geen codefences):
{
  "weeks": [
    {
      "week": 1,
      "title": "Week titel",
      "subtitle": "Korte ondertitel",
      "days": [
        {
          "day": 1,
          "title": "Dag titel",
          "focus": "Focuszin",
          "morning": "Ochtendfenomeen...",
          "midday": "Midday diepe duik...",
          "evening": "Avond veldwerk stap voor stap...",
          "materials": ["item1", "item2"],
          "questions": ["Vraag 1?", "Vraag 2?", "Vraag 3?"]
        }
      ]
    }
  ]
}`

export async function generatePhysicsDeepDive(locale = 'en', model = '') {
  const selectedModel = model || 'nemotron-3-super:latest'
  const prompt = locale === 'nl' ? GENERATION_PROMPT_NL : GENERATION_PROMPT_EN

  const data = await chatCompletion({
    model: selectedModel,
    messages: [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: locale === 'nl'
          ? 'Genereer een complete 4-weken Natuurkunde Deep Dive voor 10-11 jarigen. Alle 4 weken, alle 28 dagen, in het Nederlands.'
          : 'Generate a complete 4-week Physics Deep Dive for 10-11 year olds. All 4 weeks, all 28 days.',
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 16384,
  })

  const raw = data.choices?.[0]?.message?.content || '{}'
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0])
    else throw new Error('Invalid JSON response')
  }

  if (!parsed.weeks || !Array.isArray(parsed.weeks) || parsed.weeks.length === 0) {
    throw new Error('Response missing weeks array')
  }

  parsed._locale = locale
  parsed._generated = Date.now()
  parsed._model = selectedModel

  storage.set(STORAGE_KEY, parsed)
  return parsed
}

export function loadPhysicsDeepDive() {
  return storage.get(STORAGE_KEY, null)
}

export function hasPhysicsDeepDive() {
  return storage.has(STORAGE_KEY)
}

export function clearPhysicsDeepDive() {
  storage.remove(STORAGE_KEY)
}

let loadedFromFile = false

function publicFileForLocale(locale) {
  return locale === 'nl' ? '/physics-deep-dive-nl.json' : '/physics-deep-dive-en.json'
}

export async function loadFromPublicFile(locale) {
  if (loadedFromFile) return
  loadedFromFile = true

  if (hasPhysicsDeepDive()) return

  const urls = [
    publicFileForLocale(locale || 'en'),
    '/physics-deep-dive.json',
  ]

  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue

      const data = await res.json()
      if (!data.weeks || !Array.isArray(data.weeks)) continue

      data._locale = data._locale || locale || 'en'
      data._loadedFromFile = true
      storage.set(STORAGE_KEY, data)
      console.log(`[physicsGenerator] loaded from ${url}`)
      return
    } catch {
    }
  }
}

export async function initPhysicsDeepDive(locale) {
  await loadFromPublicFile(locale)
  return loadPhysicsDeepDive()
}

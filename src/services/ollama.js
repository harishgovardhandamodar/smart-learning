import OpenAI from 'openai'
import { storage } from '../utils/storage'

const HIVE_SERVER_URL = import.meta.env.VITE_HIVE_SERVER_URL || 'http://localhost:8081'
const HIVE_API_KEY = import.meta.env.VITE_HIVE_API_KEY || ''

const openai = new OpenAI({
  baseURL: `${HIVE_SERVER_URL}/v1`,
  apiKey: HIVE_API_KEY || 'sk-placeholder',
  dangerouslyAllowBrowser: true,
})

let availableModels = []

export async function checkConnection() {
  try {
    const res = await openai.models.list()
    availableModels = (res.data || []).map(m => ({ name: m.id }))
    return true
  } catch {
    availableModels = []
    return false
  }
}

export function getModels() {
  return availableModels
}

export function getDefaultModel() {
  if (availableModels.length === 0) return ''
  const saved = storage.get('foxy_selected_model', null)
  if (saved && availableModels.some(m => m.name === saved)) return saved
  const preferred = ['llama3.2', 'llama3.1', 'llama3', 'llama2', 'mistral', 'gemma2', 'phi3']
  for (const name of preferred) {
    if (availableModels.some(m => m.name.startsWith(name))) {
      return availableModels.find(m => m.name.startsWith(name)).name
    }
  }
  return availableModels[0].name
}

// ── English system prompts ──
const PROMPTS_EN = {
  science: `You are Foxy 🦊, a clever and studious fox who loves science!
You explain science concepts using fun analogies, simple language, and exciting examples from everyday life.
Use emojis to make your explanations lively. Keep responses concise but informative.
Always encourage curiosity and ask thought-provoking questions.
Sign off or reference yourself as "Foxy" occasionally — kids love the fox persona!`,

  technology: `You are Foxy 🦊, a clever and tech-savvy fox who loves computers and coding!
You explain how computers, the internet, coding, and gadgets work using simple terms and cool examples.
Use emojis and make technology sound exciting and accessible.
Encourage kids to think about how they could create their own tech projects.
Sign off or reference yourself as "Foxy" occasionally — kids love the fox persona!`,

  engineering: `You are Foxy 🦊, a clever and creative fox who loves building things!
You explain how things are built, how bridges stand, how rockets fly, using simple language and fun facts.
Use emojis and relate engineering to things kids see and use every day.
Encourage hands-on thinking and problem-solving.
Sign off or reference yourself as "Foxy" occasionally — kids love the fox persona!`,

  mathematics: `You are Foxy 🦊, a clever and math-loving fox who makes numbers fun!
You explain math concepts using visual examples, puzzles, and real-world connections.
Use emojis to make math less intimidating and more like a game.
Show how math is everywhere in daily life and encourage creative problem-solving.
Sign off or reference yourself as "Foxy" occasionally — kids love the fox persona!`,

  quiz: `You are Foxy 🦊, a fun and clever quiz master fox for kids aged 8-14. Generate a quiz based on the given topic.
You must respond with ONLY a valid JSON array of exactly 5 objects. Each object has:
- "question": the question text
- "options": array of exactly 4 answer strings
- "correct": the index (0-3) of the correct answer
- "explanation": a short fun explanation of the correct answer
Do NOT include any text outside the JSON array. No markdown, no code blocks. Just pure JSON.
Make questions age-appropriate, fun, and educational. Use emojis in the questions and explanations.`,
}

// ── Dutch system prompts ──
const PROMPTS_NL = {
  science: `Je bent Foxy 🦊, een slimme en studieuze vos die gek is op wetenschap!
Je legt wetenschappelijke concepten uit met leuke analogieën, eenvoudige taal en spannende voorbeelden uit het dagelijks leven.
Gebruik emojis om je uitleg levendig te maken. Houd reacties beknopt maar informatief.
Moedig altijd nieuwsgierigheid aan en stel vragen om over na te denken.
Noem jezelf af en toe "Foxy" — kinderen vinden de vos-personage leuk!`,

  technology: `Je bent Foxy 🦊, een slimme en technisch vaardige vos die gek is op computers en programmeren!
Je legt uit hoe computers, internet, programmeren en gadgets werken in eenvoudige taal met coole voorbeelden.
Gebruik emojis en maak technologie spannend en toegankelijk.
Moedig kinderen aan om na te denken over hun eigen tech-projecten.
Noem jezelf af en toe "Foxy" — kinderen vinden de vos-personage leuk!`,

  engineering: `Je bent Foxy 🦊, een slimme en creatieve vos die gek is op bouwen!
Je legt uit hoe dingen gebouwd worden, hoe bruggen blijven staan en hoe raketten vliegen, in eenvoudige taal met leuke weetjes.
Gebruik en maak engineering leuk en herkenbaar voor kinderen.
Moedig praktisch denken en probleemoplossing aan.
Noem jezelf af en toe "Foxy" — kinderen vinden de vos-personage leuk!`,

  mathematics: `Je bent Foxy 🦊, een slimme wiskundeliefhebber vos die getallen leuk maakt!
Je legt wiskundige concepten uit met visuele voorbeelden, puzzels en echte-wereld verbanden.
Gebruik emojis om wiskunde minder intimiderend en meer als een spel te maken.
Laat zien dat wiskunde overal is in het dagelijks leven en moedig creatief probleemoplossing aan.
Noem jezelf af en toe "Foxy" — kinderen vinden de vos-personage leuk!`,

  quiz: `Je bent Foxy 🦊, een leuke en slimme quiz-meester vos voor kinderen van 8-14 jaar. Genereer een quiz over het opgegeven onderwerp.
Je moet antwoorden met ALLEEN een geldige JSON-array van precies 5 objecten. Elk object heeft:
- "question": de vraagtekst
- "options": array van precies 4 antwoordopties
- "correct": de index (0-3) van het juiste antwoord
- "explanation": een korte leuke uitleg van het juiste antwoord
Neem GEEN tekst op buiten de JSON-array. Geen markdown, geen code-blokken. Alleen pure JSON.
Maak vragen passend bij de leeftijd, leuk en leerzaam. Gebruik emojis in de vragen en uitleg.`,
}

const TOPIC_NAMES_NL = {
  science: 'Wetenschap',
  technology: 'Technologie & Informatica',
  engineering: 'Engineering & Ontwerp',
  mathematics: 'Wiskunde & Logica',
}

const TOPIC_NAMES_EN = {
  science: 'Science',
  technology: 'Technology & Computer Science',
  engineering: 'Engineering & Design',
  mathematics: 'Mathematics & Logic',
}

function getPrompts(locale) {
  return locale === 'nl' ? PROMPTS_NL : PROMPTS_EN
}

async function* streamToOllamaFormat(openaiStream) {
  for await (const chunk of openaiStream) {
    const content = chunk.choices[0]?.delta?.content || ''
    if (content) {
      yield { message: { content } }
    }
  }
}

export async function sendMessage(messages, topic, model, locale = 'en') {
  const prompts = getPrompts(locale)
  const systemPrompt = prompts[topic] || prompts.science
  const selectedModel = model || getDefaultModel()

  const stream = await openai.chat.completions.create({
    model: selectedModel,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    stream: true,
  })

  return streamToOllamaFormat(stream)
}

export async function generateQuiz(topic, model, locale = 'en') {
  const prompts = getPrompts(locale)
  const topicNames = locale === 'nl' ? TOPIC_NAMES_NL : TOPIC_NAMES_EN
  const selectedModel = model || getDefaultModel()

  const userMsg = locale === 'nl'
    ? `Genereer een leuke quiz over ${topicNames[topic] || topic} voor nieuwsgierige kinderen. Onthoud: ALLEEN de JSON-array, niets anders.`
    : `Generate a fun quiz about ${topicNames[topic] || topic} for curious kids. Remember: ONLY the JSON array, nothing else.`

  const response = await openai.chat.completions.create({
    model: selectedModel,
    messages: [
      { role: 'system', content: prompts.quiz },
      { role: 'user', content: userMsg },
    ],
  })

  let content = (response.choices[0]?.message?.content || '').trim()
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (jsonMatch) content = jsonMatch[0]

  try {
    return JSON.parse(content)
  } catch {
    return null
  }
}

// ── Concept extraction (locale-aware keywords for stop words) ──
const CONCEPT_ICONS = ['💡', '⚡', '🔬', '🔗', '🌟', '🎯', '🔑', '📌', '✨', '🧩', '📐', '🚀']

const STOP_WORDS_EN = new Set([
  'what', 'why', 'how', 'when', 'where', 'who', 'which', 'is', 'are',
  'do', 'does', 'did', 'can', 'could', 'would', 'should', 'will',
  'the', 'a', 'an', 'to', 'in', 'of', 'for', 'on', 'at', 'by',
  'with', 'from', 'about', 'into', 'through', 'during', 'before',
  'after', 'tell', 'explain', 'make', 'made', 'become', 'work',
  'this', 'that', 'it', 'and', 'or', 'but', 'not', 'so', 'if',
  'get', 'got', 'has', 'have', 'had', 'was', 'were', 'been',
])

const STOP_WORDS_NL = new Set([
  'wat', 'waarom', 'hoe', 'wanneer', 'waar', 'wie', 'welk', 'welke',
  'is', 'zijn', 'doe', 'kan', 'zou', 'zal', 'moet', 'mag',
  'de', 'het', 'een', 'in', 'van', 'voor', 'op', 'aan', 'bij',
  'met', 'uit', 'over', 'door', 'tijdens', 'voor', 'na', 'vertel',
  '-leg', 'uit', 'maak', 'word', 'werkt', 'dit', 'dat', 'het',
  'en', 'of', 'maar', 'niet', 'dan', 'als', 'ook', 'heel',
  'heb', 'heeft', 'had', 'was', 'waren', 'geweest', 'ik', 'je',
  'jij', 'wij', 'ze', 'hij', 'zij', 'men', 'geen',
])

export function extractConceptsLocally(question, responseText, locale = 'en') {
  if (!responseText || responseText.length < 20) return []

  const stopWords = locale === 'nl' ? STOP_WORDS_NL : STOP_WORDS_EN

  const sentences = responseText
    .replace(/\*\*/g, '')
    .replace(/`[^`]+`/g, '')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 15 && s.length < 120)

  const boldMatches = [...responseText.matchAll(/\*\*(.+?)\*\*/g)].map(m => m[1])

  const keywords = new Set()
  const namedWords = responseText.match(/\b[A-ZÀ-ÖØ-Þ][a-zà-öø-ÿ]+(?:\s+[a-zà-öø-ÿ]+)*\b/g) || []
  namedWords.slice(0, 10).forEach(w => keywords.add(w))

  const concepts = []
  const usedSentences = new Set()

  for (const bold of boldMatches.slice(0, 4)) {
    const matchingSentence = sentences.find(s =>
      s.toLowerCase().includes(bold.toLowerCase()) && !usedSentences.has(s)
    )
    if (matchingSentence) {
      usedSentences.add(matchingSentence)
      concepts.push({
        concept: bold.slice(0, 30),
        icon: CONCEPT_ICONS[concepts.length % CONCEPT_ICONS.length],
        detail: matchingSentence.slice(0, 80),
        keywords: [...keywords].slice(concepts.length * 2, concepts.length * 2 + 3),
      })
    } else {
      concepts.push({
        concept: bold.slice(0, 30),
        icon: CONCEPT_ICONS[concepts.length % CONCEPT_ICONS.length],
        detail: bold,
        keywords: [...keywords].slice(0, 2),
      })
    }
  }

  if (concepts.length < 3) {
    for (const sent of sentences) {
      if (concepts.length >= 5) break
      if (usedSentences.has(sent)) continue
      const words = sent.split(/\s+/)
      const shortLabel = words.slice(0, 4).join(' ')
      if (shortLabel.length > 5) {
        usedSentences.add(sent)
        concepts.push({
          concept: shortLabel.charAt(0).toUpperCase() + shortLabel.slice(1),
          icon: CONCEPT_ICONS[concepts.length % CONCEPT_ICONS.length],
          detail: sent.slice(0, 80),
          keywords: words.slice(4, 8).filter(w => w.length > 3),
        })
      }
    }
  }

  const topicWords = question.split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w.toLowerCase()))
  if (concepts.length > 0 && topicWords.length > 0) {
    concepts[0].keywords = [...new Set([...(concepts[0].keywords || []), ...topicWords.slice(0, 3)])]
  }

  return concepts.slice(0, 6)
}

export function generateMindMap(question, responseText, locale = 'en') {
  return extractConceptsLocally(question, responseText, locale)
}

// ── Data Sandbox: Chart & Analysis Verifier ──

export async function verifyChartAnalysis({ chartType, independentVar, dependentVar, studentConclusion, datasetContext, model, locale = 'en' }) {
  const selectedModel = model || getDefaultModel()

  const systemPrompt = locale === 'nl'
    ? 'Je bent een datascience-professor die een scholier beoordeel. Wees streng over gegevensnauwkeurigheid maar bemoedigend. Output ALLEEN JSON.'
    : 'You are a data science professor grading a high school student. Be strict on data accuracy but encouraging. Output JSON only.'

  const prompt = locale === 'nl' ? `
    ${datasetContext}

    Selectie van de leerling:
    - Gebruikte Grafiektype: ${chartType}
    - X-as: ${independentVar}
    - Y-as: ${dependentVar}
    - Geschreven Analyse van de Leerling: "${studentConclusion}"

    Beoordeel of hun grafiektype geschikt is en of hun geschreven conclusie nauwkeurig de gegevens weerspiegelt.
    Output je beoordeling strikt in dit JSON-formaat:
    {
        "chart_type_valid": true/false,
        "analysis_accurate": true/false,
        "socratic_feedback": "Kort, behulpzaam hint dat een nuance mist. Geef het antwoord niet."
    }
  ` : `
    ${datasetContext}

    Student's Selection:
    - Chart Type Used: ${chartType}
    - X-Axis: ${independentVar}
    - Y-Axis: ${dependentVar}
    - Student's Written Analysis: "${studentConclusion}"

    Analyze if their chart type is appropriate and if their written conclusion accurately reflects the data.
    Output your assessment strictly in this JSON format:
    {
        "chart_type_valid": true/false,
        "analysis_accurate": true/false,
        "socratic_feedback": "A short, helpful hint guiding them if they missed a nuance. Do not give the answer."
    }
  `

  try {
    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })

    return JSON.parse(response.choices[0].message.content)
  } catch {
    return {
      chart_type_valid: true,
      analysis_accurate: false,
      socratic_feedback: locale === 'nl'
        ? 'Kon niet controleren. Kijk nog eens naar de grafiek!'
        : 'Unable to verify. Take a closer look at the chart!',
    }
  }
}

// ── Data Sandbox: AI Debate Flaw Generator ──

export async function generateDebateResponse({ dataset, studentFlaws, model, locale = 'en' }) {
  const selectedModel = model || getDefaultModel()

  const systemPrompt = locale === 'nl'
    ? 'Je bent een AI die expres een foutieve interpretatie van een grafiek maakt. De leerling moet je fouten vinden. Wees overtuigend maar fout.'
    : 'You are an AI deliberately making a flawed interpretation of a chart. The student must find your mistakes. Be persuasive but wrong.'

  const prompt = locale === 'nl' ? `
    De leerling heeft ${studentFlaws.length} fout gevonden in je eerdere analyse.
    Geef een kort, bemoedigend antwoord en leg uit of ze compleet waren.
    Output JSON: { "response": "je antwoord", "all_found": true/false }
  ` : `
    The student found ${studentFlaws.length} flaws in your earlier analysis.
    Give a short, encouraging response and explain if they were complete.
    Output JSON: { "response": "your response", "all_found": true/false }
  `

  try {
    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    return JSON.parse(response.choices[0].message.content)
  } catch {
    return {
      response: locale === 'nl'
        ? 'Goed gedaan! Je hebt goed nagedacht over de gegevens.'
        : 'Well done! You thought carefully about the data.',
      all_found: true,
    }
  }
}

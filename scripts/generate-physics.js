#!/usr/bin/env node

/**
 * CLI script to generate a 4-week physics deep dive via Ollama-compatible API.
 *
 * Generates one week at a time using a delimiter-based text format (not raw JSON)
 * so small models can produce parsable output. Then assembles into the JSON format
 * expected by the web app.
 *
 * Usage:
 *   node scripts/generate-physics.js                    # English (llama3.2:3b)
 *   node scripts/generate-physics.js --locale nl        # Dutch
 *   node scripts/generate-physics.js --both             # Both locales
 *   node scripts/generate-physics.js --model gemma4:31b
 *   node scripts/generate-physics.js --api http://localhost:8081/v1
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs() {
  const args = {}
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const val = process.argv[i + 1]
      if (val && !val.startsWith('--')) { args[key] = val; i++ }
      else { args[key] = true }
    }
  }
  return args
}

const args = parseArgs()
const MODEL = args.model || 'llama3.2:3b'
const API_BASE = args.api || 'http://localhost:8081/v1'
const TIMEOUT_MS = parseInt(args.timeout, 10) || 1800000

function wait(ms) { return new Promise(r => setTimeout(r, ms)) }

function buildPrompt(locale, weekNum, topic) {
  const isNl = locale === 'nl'
  const sep = '---DAY---'

  if (isNl) {
    return `Je bent een STEM-docent voor kinderen van 10-11 jaar.
Genereer WEEK ${weekNum} van 4: ${topic}
Je moet EXACT 7 dag-blokken maken, niet meer, niet minder.
Gebruik voor ELKE dag dit EXACTE formaat (geen andere tekst, geen markdown):

${sep}
TITEL: <creatieve titel>
FOCUS: <focuszin>
OCHTEND: <leuk fenomeen, 2-3 zinnen, met emojis>
MIDDAG: <uitleg, 3-4 zinnen, met emojis>
AVOND: <experiment, 4-5 stappen>
MATERIALEN: <item1>|<item2>|<item3>
VRAGEN: <vraag 1?>|<vraag 2?>

Je moet ALLE 7 dagen geven (dag 1 t/m 7). Geen extra tekst voor of na.`
  }

  return `You are a STEM teacher for children aged 10-11.
Generate WEEK ${weekNum} of 4: ${topic}
You MUST output EXACTLY 7 day blocks, no more, no less.
For EACH day use this EXACT format (no other text, no markdown):

${sep}
TITLE: <creative title>
FOCUS: <focus sentence>
MORNING: <fun phenomenon, 2-3 sentences, with emojis>
MIDDAY: <explanation, 3-4 sentences, with emojis>
EVENING: <experiment, 4-5 steps>
MATERIALS: <item1>|<item2>|<item3>
QUESTIONS: <question 1?>|<question 2?>

Output all 7 days (day 1 through 7). No extra text before or after.`
}

function pipeParse(raw) {
  const blocks = raw
    .split(/\n(?=(?:---|\*\*)\s*(?:DAY|DAG)\s*\d*\s*(?:---|\*\*))/i)
    .filter(b => {
      const t = b.trim()
      return t.length > 20 && /(TITLE|TITEL):/i.test(t)
    })

  const days = []
  for (const block of blocks) {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l)

    const day = { day: days.length + 1, title: '', focus: '', morning: '', midday: '', evening: '', materials: [], questions: [] }

    for (const line of lines) {
      if (line.startsWith('TITLE:') || line.startsWith('TITEL:')) {
        day.title = line.replace(/^TITLE:\s*/i, '').replace(/^TITEL:\s*/i, '').trim()
      } else if (line.startsWith('FOCUS:')) {
        day.focus = line.replace(/^FOCUS:\s*/i, '').trim()
      } else if (line.startsWith('MORNING:') || line.startsWith('OCHTEND:')) {
        day.morning = line.replace(/^MORNING:\s*/i, '').replace(/^OCHTEND:\s*/i, '').trim()
      } else if (line.startsWith('MIDDAY:') || line.startsWith('MIDDAG:')) {
        day.midday = line.replace(/^MIDDAY:\s*/i, '').replace(/^MIDDAG:\s*/i, '').trim()
      } else if (line.startsWith('EVENING:') || line.startsWith('AVOND:')) {
        day.evening = line.replace(/^EVENING:\s*/i, '').replace(/^AVOND:\s*/i, '').trim()
      } else if (line.startsWith('MATERIALS:') || line.startsWith('MATERIALEN:')) {
        const val = line.replace(/^MATERIALS:\s*/i, '').replace(/^MATERIALEN:\s*/i, '').trim()
        day.materials = val.split('|').map(s => s.trim()).filter(Boolean)
      } else if (line.startsWith('QUESTIONS:') || line.startsWith('VRAGEN:')) {
        const val = line.replace(/^QUESTIONS:\s*/i, '').replace(/^VRAGEN:\s*/i, '').trim()
        day.questions = val.split('|').map(s => s.trim()).filter(Boolean)
      }
    }

    if (day.title || day.focus) {
      days.push(day)
    }
  }

  return days
}

async function callModel(messages) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 16384,
    }),
    signal: controller.signal,
  })

  clearTimeout(timer)

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${res.status}: ${text.slice(0, 200) || res.statusText}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

async function warmup() {
  await fetch(`${API_BASE}/models`, { method: 'GET', signal: AbortSignal.timeout(5000) })
}

async function generateWeek(locale, weekNum, topic, attempt = 1) {
  const systemMsg = buildPrompt(locale, weekNum, topic)
  const userMsg = locale === 'nl'
    ? `Genereer ALLE 7 dagen voor Week ${weekNum}: ${topic}. Gebruik het exacte formaat.`
    : `Generate ALL 7 days for Week ${weekNum}: ${topic}. Use the exact format.`

  process.stdout.write(`   ⏳ Week ${weekNum}${attempt > 1 ? ` (attempt ${attempt})` : ''}...`)
  const start = Date.now()

  const raw = await callModel([
    { role: 'system', content: systemMsg },
    { role: 'user', content: userMsg },
  ])

  if (!raw) throw new Error(`Week ${weekNum}: empty response`)

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  const days = pipeParse(raw)

  console.log(` done in ${elapsed}s (${days.length}/${days.length < 7 ? '<' : ''}7 days, ${raw.length} chars)`)

  if (days.length < 7 && attempt < 3) {
    console.log(`   ⚠️  Got ${days.length}/7 days, retrying...`)
    await wait(2000)
    return generateWeek(locale, weekNum, topic, attempt + 1)
  }

  return {
    week: weekNum,
    title: topic.split('—')[0]?.trim() || `Week ${weekNum}`,
    subtitle: topic,
    days,
  }
}

async function generateForLocale(locale) {
  const outputFile = path.resolve(__dirname, '..', 'public', `physics-deep-dive-${locale}.json`)
  const label = locale === 'nl' ? '🇳🇱 Dutch' : '🇬🇧 English'

  const topics = locale === 'nl' ? [
    { week: 1, topic: 'Kinetica — Beweging, Snelheid, Versnelling' },
    { week: 2, topic: 'Krachten & Energie — Duwen, Trekken, Wrijving, Zwaartekracht' },
    { week: 3, topic: 'Golven & Geluid — Trillingen, Toonhoogte, Amplitude' },
    { week: 4, topic: 'Licht & Optica — Reflectie, Breking, Kleuren' },
  ] : [
    { week: 1, topic: 'Kinematics — Movement, Speed, Velocity, Acceleration' },
    { week: 2, topic: 'Forces & Energy — Push, Pull, Friction, Gravity' },
    { week: 3, topic: 'Waves & Sound — Vibrations, Pitch, Amplitude' },
    { week: 4, topic: 'Light & Optics — Reflection, Refraction, Colors' },
  ]

  console.log(`\n--- ${label} ---`)
  console.log(`   Model: ${MODEL}`)
  console.log(`   Output: ${outputFile}\n`)

  const weeks = []
  for (const wt of topics) {
    const w = await generateWeek(locale, wt.week, wt.topic)
    weeks.push(w)
    await wait(1000)
  }

  const result = {
    weeks,
    _locale: locale,
    _generated: Date.now(),
    _model: MODEL,
  }

  const outDir = path.dirname(outputFile)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8')

  console.log(`\n💾 Saved to ${outputFile}`)
  weeks.forEach(w =>
    console.log(`   Week ${w.week}: "${w.title}" — ${w.days.length} days`)
  )
}

async function main() {
  console.log(`\n🔬 Physics Deep Dive Generator`)
  console.log(`   Model: ${MODEL}`)
  console.log(`   API:   ${API_BASE}`)
  await warmup()
  console.log(`   ✅ API reachable\n`)

  if (args.both) {
    await generateForLocale('en')
    await generateForLocale('nl')
    console.log('\n✅ Both locales generated!')
  } else {
    const locale = args.locale || 'en'
    if (locale !== 'en' && locale !== 'nl') {
      console.error(`Unsupported locale "${locale}". Use "en" or "nl".`)
      process.exit(1)
    }
    await generateForLocale(locale)
    console.log('\n✅ Done!')
  }
}

main().catch(err => {
  console.error(`\n❌ ${err.message}`)
  process.exit(1)
})

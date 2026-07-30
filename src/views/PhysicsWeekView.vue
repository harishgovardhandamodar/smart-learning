<template>
  <div class="physics-week" v-if="kidId">
    <header class="pw-header">
      <div class="pw-header-top">
        <router-link to="/engine" class="back-link">← {{ t('adaptive.title') }}</router-link>
        <h1>🔬 {{ t('physics.week1Title') }}</h1>
        <p class="pw-subtitle">{{ t('physics.week1Subtitle') }}</p>
      </div>
      <div class="day-tabs">
        <button v-for="day in days" :key="day.id" class="day-tab" :class="{ active: activeDay === day.id }" @click="activeDay = day.id">
          <span class="day-num">{{ day.id }}</span>
          <span class="day-label">{{ day.label }}</span>
        </button>
      </div>
    </header>

    <div class="pw-body">
      <div class="pw-curriculum">
        <div class="day-card" v-for="day in parsedDays" :key="day.id" v-show="activeDay === day.id || activeDay === 'all'">
          <div class="day-card-header">
            <span class="day-badge" :class="day.stage">Stage {{ day.stageNum }}</span>
            <h2>{{ day.title }}</h2>
            <span class="day-focus">{{ day.focus }}</span>
          </div>

          <div class="day-sections">
            <div class="section" v-for="(section, i) in day.sections" :key="i">
              <h3 v-html="section.heading"></h3>
              <div class="section-content" v-html="section.content"></div>
            </div>
          </div>

          <div class="day-challenge" v-if="day.challenge">
            <h3>🛠️ {{ day.challenge.title }}</h3>
            <div class="challenge-content" v-html="day.challenge.content"></div>
          </div>

          <div class="day-project" v-if="day.project">
            <h3>🚀 {{ day.project.title }}</h3>
            <p>{{ day.project.content }}</p>
          </div>

          <div class="day-exhibition" v-if="day.exhibition">
            <h3>🎭 {{ day.exhibition.title }}</h3>
            <p>{{ day.exhibition.content }}</p>
          </div>

          <div class="day-reflection" v-if="day.reflection">
            <h3>💭 {{ t('physics.reflectionQuestions') }}</h3>
            <ul>
              <li v-for="(q, qi) in day.reflection" :key="qi">{{ q }}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="pw-tutor">
        <div class="tutor-header">
          <h3>🦊 {{ t('physics.tutorTitle') }}</h3>
          <span class="tutor-status" :class="{ online: tutorOnline }">
            {{ tutorOnline ? t('physics.tutorOnline') : t('physics.tutorOffline') }}
          </span>
        </div>

        <div class="tutor-messages" ref="messagesContainer">
          <div v-for="(msg, i) in tutorMessages" :key="i" class="tutor-msg" :class="msg.role">
            <div class="msg-avatar">{{ msg.role === 'user' ? '🧑' : '🦊' }}</div>
            <div class="msg-content" v-html="msg.content"></div>
          </div>
          <div v-if="tutorLoading" class="tutor-msg assistant">
            <div class="msg-avatar">🦊</div>
            <div class="msg-content typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div class="tutor-input-area">
          <div class="quick-prompts">
            <button v-for="(prompt, i) in quickPrompts" :key="i" class="quick-prompt" @click="sendQuickPrompt(prompt)">
              {{ prompt }}
            </button>
          </div>
          <div class="input-row">
            <input
              v-model="userInput"
              :placeholder="t('physics.tutorPlaceholder')"
              @keydown.enter="sendMessage"
              :disabled="tutorLoading || !tutorOnline"
            />
            <button class="send-btn" @click="sendMessage" :disabled="!userInput.trim() || tutorLoading || !tutorOnline">
              {{ tutorLoading ? '⏳' : '→' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="no-kid" v-else>
    <div class="no-kid-icon">🔬</div>
    <h2>{{ t('adaptive.selectKid') }}</h2>
    <p>{{ t('adaptive.selectKidDesc') }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, inject } from 'vue'
import { PHYSICS_WEEK1 } from '../data/physicsCurriculum'
import { sendPhysicsMessage } from '../services/physicsTutor'
import { checkConnection } from '../services/ollama'

const t = inject('t')
const selectedKidId = inject('selectedKidId')
const kidId = computed(() => selectedKidId?.value)

const activeDay = ref(1)
const userInput = ref('')
const tutorMessages = ref([])
const tutorLoading = ref(false)
const tutorOnline = ref(false)
const messagesContainer = ref(null)

const days = [
  { id: 1, label: t('physics.day1') },
  { id: 2, label: t('physics.day2') },
  { id: 3, label: t('physics.day3') },
  { id: 4, label: t('physics.day4') },
  { id: 5, label: t('physics.day5') },
  { id: 6, label: t('physics.day6') },
  { id: 7, label: t('physics.day7') },
]

const quickPrompts = computed(() => [
  t('physics.quickExplain'),
  t('physics.quickExperiment'),
  t('physics.quickQuiz'),
])

const parsedDays = computed(() => {
  const text = PHYSICS_WEEK1.en
  const stageBlocks = text.split(/### 🛠️/)
  const overview = stageBlocks[0]
  const stage1 = stageBlocks[1] || ''
  const stage2 = stageBlocks[2] || ''
  const stage3 = stageBlocks[3] || ''

  const dayParsers = [
    { id: 1, stage: 'explore', stageNum: 1, sections: parseStageDays(stage1, [1]) },
    { id: 2, stage: 'explore', stageNum: 1, sections: parseStageDays(stage1, [2]) },
    { id: 3, stage: 'explore', stageNum: 1, sections: parseStageDays(stage1, [3]) },
    { id: 4, stage: 'manipulate', stageNum: 2, sections: parseManipulationDays(stage2, 4) },
    { id: 5, stage: 'manipulate', stageNum: 2, sections: parseManipulationDays(stage2, 5) },
    { id: 6, stage: 'mastery', stageNum: 3, sections: parseMasteryDays(stage3, 6) },
    { id: 7, stage: 'mastery', stageNum: 3, sections: parseMasteryDays(stage3, 7) },
  ]

  return dayParsers
})

function parseStageDays(block, dayNums) {
  const dayHeader = new RegExp(`\\*\\*Day ${dayNums[0]}\\s*[—–-]`, 'i')
  const nextDay = new RegExp(`\\*\\*Day ${dayNums[0] + 1}\\s*[—–-]`, 'i')

  const sections = []
  const lines = block.split('\n')
  let inDay = false
  let currentSection = null

  for (const line of lines) {
    if (dayHeader.test(line)) inDay = true
    if (nextDay.test(line)) break
    if (!inDay) continue

    const boldMatch = line.match(/\*\*(.+?)\*\*/)
    if (boldMatch) {
      const heading = boldMatch[1]
      if (heading.startsWith('Day')) {
        sections.push({ heading: `📌 ${heading}`, content: '' })
      } else if (heading.includes('Focus:') || heading.includes('Morning') || heading.includes('Midday') || heading.includes('Evening')) {
        sections.push({ heading, content: '' })
      } else {
        sections.push({ heading, content: '' })
      }
    } else if (sections.length > 0 && line.trim()) {
      sections[sections.length - 1].content += line.trim() + '\n'
    }
  }

  const title = sections.length > 0 ? sections[0].heading.replace(/[📌*]/g, '').trim() : `Day ${dayNums[0]}`
  const focus = sections.find(s => s.heading.includes('Focus'))?.content.trim() || ''

  return [{ heading: `Day ${dayNums[0]}: ${title.split('—')[1]?.trim() || title}`, content: focus || sections.map(s => s.content.trim()).filter(Boolean).join('\n\n') }]
}

function parseManipulationDays(block, dayNum) {
  const sections = []
  const dayPattern = new RegExp(`\\*\\*Day ${dayNum}`, 'i')
  const nextDayPattern = new RegExp(`\\*\\*Day ${dayNum + 1}`, 'i')
  const stageEnd = /### 🛠️ STAGE 3/

  const lines = block.split('\n')
  let inDay = false
  let currentSection = null

  for (const line of lines) {
    if (dayPattern.test(line)) inDay = true
    if (nextDayPattern.test(line) || stageEnd.test(line)) break
    if (!inDay) continue

    const boldMatch = line.match(/\*\*(.+?)\*\*/)
    if (boldMatch) {
      const heading = boldMatch[1]
      sections.push({ heading, content: '' })
    } else if (sections.length > 0 && line.trim()) {
      sections[sections.length - 1].content += line.trim() + '\n'
    }
  }

  return sections
}

function parseMasteryDays(block, dayNum) {
  const sections = []
  const dayPattern = new RegExp(`\\*\\*Day ${dayNum}`, 'i')
  const nextDay = dayNum === 6 ? /\*\*Day 7/ : /Reflection/

  const lines = block.split('\n')
  let inDay = false

  for (const line of lines) {
    if (dayPattern.test(line)) inDay = true
    if (nextDay.test(line) && dayNum === 6) break
    if (!inDay) continue

    const boldMatch = line.match(/\*\*(.+?)\*\*/)
    if (boldMatch) {
      sections.push({ heading: boldMatch[1], content: '' })
    } else if (sections.length > 0 && line.trim()) {
      sections[sections.length - 1].content += line.trim() + '\n'
    }
  }

  return sections
}

async function sendMessage() {
  const text = userInput.value.trim()
  if (!text || tutorLoading.value) return

  tutorMessages.value.push({ role: 'user', content: text })
  userInput.value = ''
  tutorLoading.value = true
  await nextTick()
  scrollMessages()

  try {
    const messages = tutorMessages.value.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }))

    const stream = await sendPhysicsMessage(messages, null, 'en')
    let fullResponse = ''

    for await (const chunk of stream) {
      fullResponse += chunk.message.content
      const last = tutorMessages.value[tutorMessages.value.length - 1]
      if (last && last.role === 'assistant' && last.streaming) {
        last.content = fullResponse
      } else {
        tutorMessages.value.push({ role: 'assistant', content: fullResponse, streaming: true })
      }
      await nextTick()
      scrollMessages()
    }

    const last = tutorMessages.value[tutorMessages.value.length - 1]
    if (last && last.streaming) {
      last.streaming = false
    }
  } catch {
    tutorMessages.value.push({
      role: 'assistant',
      content: t('physics.tutorError'),
    })
  } finally {
    tutorLoading.value = false
  }
}

function sendQuickPrompt(prompt) {
  userInput.value = prompt
  sendMessage()
}

function scrollMessages() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(async () => {
  tutorOnline.value = await checkConnection()
  if (tutorOnline.value) {
    tutorMessages.value.push({
      role: 'assistant',
      content: t('physics.tutorWelcome'),
    })
  }
})
</script>

<style scoped>
.physics-week {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  animation: slide-up 0.4s ease;
}

.pw-header { margin-bottom: 1.5rem; }
.pw-header-top { margin-bottom: 1rem; }

.back-link {
  font-size: 0.85rem;
  color: var(--primary, #6C5CE7);
  text-decoration: none;
  display: inline-block;
  margin-bottom: 0.5rem;
}
.back-link:hover { text-decoration: underline; }

.pw-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.25rem;
}
.pw-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary, #64748b);
  margin: 0;
}

.day-tabs {
  display: flex;
  gap: 0.25rem;
  background: var(--chip-bg, #f1f5f9);
  padding: 0.25rem;
  border-radius: 10px;
  overflow-x: auto;
}

.day-tab {
  flex: 1;
  min-width: 70px;
  padding: 0.5rem 0.5rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.8rem;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}
.day-tab.active {
  background: var(--bg-card);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.day-num {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary, #6C5CE7);
}
.day-label {
  font-size: 0.7rem;
  white-space: nowrap;
}

.pw-body {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr 380px;
}
@media (max-width: 800px) {
  .pw-body { grid-template-columns: 1fr; }
}

.pw-curriculum {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.day-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.day-card-header {
  margin-bottom: 1rem;
}
.day-card-header h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  margin: 0.25rem 0;
}
.day-focus {
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
  font-style: italic;
}

.day-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.day-badge.explore { background: #dfe6fd; color: #4a5acf; }
.day-badge.manipulate { background: #fef3cd; color: #b8860b; }
.day-badge.mastery { background: #d4edda; color: #155724; }

.day-sections {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary, #6C5CE7);
  margin: 0 0 0.25rem;
}
.section-content {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  line-height: 1.5;
  white-space: pre-line;
}

.day-challenge, .day-project, .day-exhibition {
  background: var(--chip-bg, #f8fafc);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}
.day-challenge h3, .day-project h3, .day-exhibition h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.5rem;
}
.day-challenge .challenge-content,
.day-project p, .day-exhibition p {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  line-height: 1.5;
  margin: 0;
  white-space: pre-line;
}

.day-reflection h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.5rem;
}
.day-reflection ul {
  margin: 0;
  padding-left: 1.25rem;
}
.day-reflection li {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  line-height: 1.5;
  margin-bottom: 0.35rem;
}

.pw-tutor {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: 80vh;
  position: sticky;
  top: 1rem;
}

.tutor-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--chip-bg, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tutor-header h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}
.tutor-status {
  font-size: 0.75rem;
  color: var(--text-secondary, #94a3b8);
}
.tutor-status.online { color: #10b981; }

.tutor-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
  max-height: 50vh;
}

.tutor-msg {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}
.tutor-msg.user { flex-direction: row-reverse; }

.msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--chip-bg, #f1f5f9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.msg-content {
  background: var(--chip-bg, #f1f5f9);
  border-radius: 12px;
  padding: 0.6rem 0.85rem;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--text-secondary, #334155);
  max-width: 85%;
  white-space: pre-line;
}
.tutor-msg.user .msg-content {
  background: var(--primary, #6C5CE7);
  color: white;
}

.typing {
  display: flex;
  gap: 4px;
  padding: 0.6rem 1rem;
}
.typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-secondary, #94a3b8);
  animation: bounce 1.2s infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
}

.tutor-input-area {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--chip-bg, #e2e8f0);
}

.quick-prompts {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}
.quick-prompt {
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--chip-bg, #e2e8f0);
  background: transparent;
  border-radius: 16px;
  font-size: 0.7rem;
  color: var(--primary, #6C5CE7);
  cursor: pointer;
  transition: all 0.2s;
}
.quick-prompt:hover {
  background: var(--chip-bg, #f1f5f9);
}

.input-row {
  display: flex;
  gap: 0.5rem;
}
.input-row input {
  flex: 1;
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--chip-bg, #e2e8f0);
  border-radius: 10px;
  font-size: 0.85rem;
  background: var(--bg-card);
  color: var(--text);
  outline: none;
}
.input-row input:focus {
  border-color: var(--primary, #6C5CE7);
}
.input-row input:disabled {
  opacity: 0.5;
}

.send-btn {
  padding: 0.55rem 0.85rem;
  background: var(--primary, #6C5CE7);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.no-kid {
  text-align: center;
  padding: 4rem 2rem;
}
.no-kid-icon { font-size: 3rem; margin-bottom: 1rem; }
.no-kid h2 { color: var(--text); margin: 0 0 0.5rem; }
.no-kid p { color: var(--text-secondary, #64748b); }

@keyframes slide-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

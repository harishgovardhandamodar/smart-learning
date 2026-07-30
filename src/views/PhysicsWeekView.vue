<template>
  <div class="physics-week" v-if="kidId">
    <header class="pw-header">
      <div class="pw-header-top">
        <router-link to="/engine" class="back-link">← {{ mode === 'ai' ? t('physics.backToEngine') : t('adaptive.title') }}</router-link>
        <h1>🔬 {{ mode === 'ai' ? displayTitle : t('physics.week1Title') }}</h1>
        <p class="pw-subtitle">{{ mode === 'ai' ? displaySubtitle : t('physics.week1Subtitle') }}</p>
      </div>

      <div class="pw-controls">
        <div class="mode-toggle">
          <button :class="{ active: mode === 'original' }" @click="mode = 'original'; activeDay = 1">📚 {{ t('physics.original') }}</button>
          <button v-if="aiData" :class="{ active: mode === 'ai' }" @click="mode = 'ai'; activeWeek = 1; activeDay = 1">🤖 {{ t('physics.aiDeepDive') }}</button>
        </div>

        <div class="week-tabs" v-if="mode === 'ai' && aiData">
          <button
            v-for="w in aiData.weeks"
            :key="w.week"
            class="week-tab"
            :class="{ active: activeWeek === w.week }"
            @click="activeWeek = w.week; activeDay = 1"
          >
            <span class="week-num">{{ t('physics.week') }} {{ w.week }}</span>
          </button>
        </div>

        <div class="day-tabs">
          <button
            v-for="d in dayTabs"
            :key="d.id"
            class="day-tab"
            :class="{ active: activeDay === d.id }"
            @click="activeDay = d.id"
          >
            <span class="day-num">{{ d.id }}</span>
            <span class="day-label">{{ d.label }}</span>
          </button>
        </div>
      </div>
    </header>

    <div class="pw-body">
      <div class="pw-curriculum">
        <div v-if="!genLoading && !aiData && mode === 'original'" class="generate-banner">
          <div class="gen-icon">🤖</div>
          <h2>{{ t('physics.genTitle') }}</h2>
          <p>{{ t('physics.genDesc') }}</p>
          <div class="gen-form">
            <select v-model="genModel" class="gen-select">
              <optgroup :label="t('physics.genModelLabel')">
                <option v-for="m in availableModels" :key="m.name" :value="m.name">{{ m.name }}</option>
              </optgroup>
            </select>
            <button class="gen-btn" @click="generate" :disabled="genLoading">
              {{ genLoading ? t('physics.genLoading') : t('physics.genButton') }}
            </button>
          </div>
          <button v-if="aiData" class="gen-btn secondary" @click="mode = 'ai'; activeWeek = 1; activeDay = 1">
            {{ t('physics.viewGenerated') }}
          </button>
        </div>

        <div v-if="genLoading" class="gen-progress">
          <span class="loading-spinner large"></span>
          <p>{{ t('physics.genProgress') }}</p>
          <p class="gen-hint">{{ t('physics.genHint') }}</p>
        </div>

        <div v-if="genError" class="gen-error">
          <p>⚠️ {{ genError }}</p>
          <button class="gen-btn" @click="genError = ''; genLoading = false">{{ t('physics.tryAgain') }}</button>
        </div>

        <div class="day-card" v-for="day in currentDays" :key="day.day" v-show="mode === 'ai' && aiData && activeDay === day.day">
          <div class="day-card-header">
            <h2>{{ day.title }}</h2>
            <span class="day-focus">{{ day.focus }}</span>
          </div>

          <div class="day-sections">
            <div class="section">
              <h3>🌅 {{ t('physics.morning') }}</h3>
              <div class="section-content" v-html="renderText(day.morning)"></div>
            </div>
            <div class="section">
              <h3>🔬 {{ t('physics.midday') }}</h3>
              <div class="section-content" v-html="renderText(day.midday)"></div>
            </div>
            <div class="section">
              <h3>🌙 {{ t('physics.evening') }}</h3>
              <div class="section-content" v-html="renderText(day.evening)"></div>
            </div>
          </div>

          <div class="day-materials" v-if="day.materials && day.materials.length">
            <h3>📦 {{ t('physics.materials') }}</h3>
            <ul>
              <li v-for="(item, i) in day.materials" :key="i">{{ item }}</li>
            </ul>
          </div>

          <div class="day-reflection" v-if="day.questions && day.questions.length">
            <h3>💭 {{ t('physics.reflectionQuestions') }}</h3>
            <ul>
              <li v-for="(q, qi) in day.questions" :key="qi">{{ q }}</li>
            </ul>
          </div>
        </div>

        <div class="day-card original" v-for="day in originalDays" :key="day.id" v-show="mode === 'original' && activeDay === day.id">
          <div class="day-card-header">
            <span class="day-badge" :class="day.stage">{{ t('physics.stage') }} {{ day.stageNum }}</span>
            <h2>{{ day.title }}</h2>
            <span class="day-focus" v-if="day.focus">{{ day.focus }}</span>
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
import { checkConnection, getDefaultModel, getModels } from '../services/ollama'
import {
  generatePhysicsDeepDive,
  loadPhysicsDeepDive,
  hasPhysicsDeepDive,
  clearPhysicsDeepDive,
  initPhysicsDeepDive,
} from '../services/physicsGenerator'

const t = inject('t')
const selectedKidId = inject('selectedKidId')
const locale = inject('locale')
const kidId = computed(() => selectedKidId?.value)

const activeDay = ref(1)
const activeWeek = ref(1)
const mode = ref('original')
const userInput = ref('')
const tutorMessages = ref([])
const tutorLoading = ref(false)
const tutorOnline = ref(false)
const messagesContainer = ref(null)
const genLoading = ref(false)
const genError = ref('')
const genModel = ref('')
const availableModels = ref([])

const aiData = ref(null)

const dayTabs = [
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

const displayTitle = computed(() => {
  if (!aiData.value) return ''
  const w = aiData.value.weeks.find(w => w.week === activeWeek.value)
  return w ? `🔬 ${w.title}` : ''
})

const displaySubtitle = computed(() => {
  if (!aiData.value) return ''
  const w = aiData.value.weeks.find(w => w.week === activeWeek.value)
  return w ? w.subtitle : ''
})

const currentDays = computed(() => {
  if (!aiData.value) return []
  const w = aiData.value.weeks.find(w => w.week === activeWeek.value)
  return w ? w.days || [] : []
})

const originalDays = computed(() => {
  const text = PHYSICS_WEEK1.en
  const stageBlocks = text.split(/### 🛠️/)
  const stage1 = stageBlocks[1] || ''
  const stage2 = stageBlocks[2] || ''
  const stage3 = stageBlocks[3] || ''

  return [
    { id: 1, stage: 'explore', stageNum: 1, ...parseDay(stage1, [1]) },
    { id: 2, stage: 'explore', stageNum: 1, ...parseDay(stage1, [2]) },
    { id: 3, stage: 'explore', stageNum: 1, ...parseDay(stage1, [3]) },
    { id: 4, stage: 'manipulate', stageNum: 2, ...parseManipulationDay(stage2, 4) },
    { id: 5, stage: 'manipulate', stageNum: 2, ...parseManipulationDay(stage2, 5) },
    { id: 6, stage: 'mastery', stageNum: 3, ...parseMasteryDay(stage3, 6) },
    { id: 7, stage: 'mastery', stageNum: 3, ...parseMasteryDay(stage3, 7) },
  ]
})

function parseDay(block, dayNums) {
  const sections = []
  const dayHeader = new RegExp(`\\*\\*Day ${dayNums[0]}\\s*[—–-]`, 'i')
  const nextDay = new RegExp(`\\*\\*Day ${dayNums[0] + 1}\\s*[—–-]`, 'i')
  const lines = block.split('\n')
  let inDay = false

  for (const line of lines) {
    if (dayHeader.test(line)) inDay = true
    if (nextDay.test(line)) break
    if (!inDay) continue
    const boldMatch = line.match(/\*\*(.+?)\*\*/)
    if (boldMatch) {
      sections.push({ heading: boldMatch[1], content: '' })
    } else if (sections.length > 0 && line.trim()) {
      sections[sections.length - 1].content += line.trim() + '\n'
    }
  }

  const title = sections.length > 0 ? sections[0].heading.replace(/\*\*/g, '').trim() : `Day ${dayNums[0]}`
  const focus = sections.find(s => s.heading.includes('Focus'))?.content.trim() || ''
  return { title: title.split('—')[1]?.trim() || title, focus, sections }
}

function parseManipulationDay(block, dayNum) {
  const sections = []
  const dayPattern = new RegExp(`\\*\\*Day ${dayNum}`, 'i')
  const nextDayPattern = new RegExp(`\\*\\*Day ${dayNum + 1}`, 'i')
  const stageEnd = /### 🛠️ STAGE 3/
  const lines = block.split('\n')
  let inDay = false

  for (const line of lines) {
    if (dayPattern.test(line)) inDay = true
    if (nextDayPattern.test(line) || stageEnd.test(line)) break
    if (!inDay) continue
    const boldMatch = line.match(/\*\*(.+?)\*\*/)
    if (boldMatch) {
      sections.push({ heading: boldMatch[1], content: '' })
    } else if (sections.length > 0 && line.trim()) {
      sections[sections.length - 1].content += line.trim() + '\n'
    }
  }

  const title = sections.length > 0 ? sections[0].heading.replace(/\*\*/g, '').trim() : `Day ${dayNum}`
  return { title, focus: '', sections, challenge: null }
}

function parseMasteryDay(block, dayNum) {
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

  const title = sections.length > 0 ? sections[0].heading.replace(/\*\*/g, '').trim() : `Day ${dayNum}`
  return { title, focus: '', sections, challenge: null }
}

function renderText(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*!/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

async function generate() {
  genLoading.value = true
  genError.value = ''
  try {
    const result = await generatePhysicsDeepDive(locale.value, genModel.value)
    aiData.value = result
    mode.value = 'ai'
    activeWeek.value = 1
    activeDay.value = 1
  } catch (err) {
    genError.value = err.message || String(err)
  } finally {
    genLoading.value = false
  }
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
    const msgs = tutorMessages.value.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }))
    const stream = await sendPhysicsMessage(msgs, null, 'en')
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
    if (last && last.streaming) last.streaming = false
  } catch {
    tutorMessages.value.push({ role: 'assistant', content: t('physics.tutorError') })
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
  availableModels.value = getModels()
  genModel.value = getDefaultModel() || 'nemotron-3-super:latest'

  if (tutorOnline.value) {
    tutorMessages.value.push({ role: 'assistant', content: t('physics.tutorWelcome') })
  }

  aiData.value = await initPhysicsDeepDive(locale.value)
  if (!aiData.value && hasPhysicsDeepDive()) clearPhysicsDeepDive()
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

.pw-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mode-toggle {
  display: flex;
  gap: 0.25rem;
  background: var(--chip-bg, #f1f5f9);
  padding: 0.25rem;
  border-radius: 10px;
  width: fit-content;
}
.mode-toggle button {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  background: transparent;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.2s;
}
.mode-toggle button.active {
  background: var(--bg-card);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.week-tabs, .day-tabs {
  display: flex;
  gap: 0.25rem;
  background: var(--chip-bg, #f1f5f9);
  padding: 0.25rem;
  border-radius: 10px;
  overflow-x: auto;
}
.week-tab, .day-tab {
  flex: 1;
  min-width: 60px;
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
.week-tab.active, .day-tab.active {
  background: var(--bg-card);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.week-num, .day-num {
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

.day-card-header { margin-bottom: 1rem; }
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
.day-badge.explore { background: rgba(108, 92, 231, 0.15); color: var(--primary); }
.day-badge.manipulate { background: rgba(253, 203, 110, 0.2); color: var(--warning); }
.day-badge.mastery { background: rgba(0, 184, 148, 0.15); color: var(--success); }

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

.day-materials, .day-challenge, .day-project, .day-exhibition, .day-reflection {
  background: var(--chip-bg, #f8fafc);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}
.day-materials h3, .day-challenge h3, .day-project h3, .day-exhibition h3, .day-reflection h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.5rem;
}
.day-materials ul {
  margin: 0;
  padding-left: 1.25rem;
}
.day-materials li {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  line-height: 1.5;
  margin-bottom: 0.25rem;
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
.challenge-content, .day-project p, .day-exhibition p {
  font-size: 0.85rem;
  color: var(--text-secondary, #475569);
  line-height: 1.5;
  margin: 0;
  white-space: pre-line;
}

.generate-banner {
  background: linear-gradient(135deg, #667eea22, #764ba222);
  border: 2px dashed var(--primary, #6C5CE7);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
}
.gen-icon { font-size: 3rem; margin-bottom: 0.5rem; }
.generate-banner h2 { margin: 0 0 0.5rem; color: var(--text); }
.generate-banner p { color: var(--text-secondary, #64748b); margin: 0 0 1rem; font-size: 0.9rem; }
.gen-form {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}
.gen-select {
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border, #e2e8f0);
  border-radius: 10px;
  font-size: 0.85rem;
  background: var(--input-bg);
  color: var(--text);
  outline: none;
  min-width: 200px;
}
.gen-btn {
  padding: 0.5rem 1.25rem;
  background: var(--primary, #6C5CE7);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.gen-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.gen-btn.secondary { background: var(--chip-bg, #f1f5f9); color: var(--primary, #6C5CE7); }

.gen-progress {
  text-align: center;
  padding: 3rem 2rem;
}
.gen-progress p { color: var(--text-secondary, #64748b); }
.gen-hint { font-size: 0.8rem; margin-top: 0.5rem; }

.gen-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
}
.gen-error p { color: #dc2626; margin: 0 0 1rem; }

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(108, 92, 231, 0.15);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-spinner.large {
  width: 32px;
  height: 32px;
  border-width: 3px;
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
.quick-prompt:hover { background: var(--chip-bg, #f1f5f9); }

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
.input-row input:focus { border-color: var(--primary, #6C5CE7); }
.input-row input:disabled { opacity: 0.5; }

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
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

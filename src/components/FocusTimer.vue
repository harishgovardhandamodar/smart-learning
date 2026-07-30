<template>
  <div class="focus-timer">
    <div class="timer-ring-container">
      <svg class="timer-ring" viewBox="0 0 120 120">
        <circle class="timer-ring-bg" cx="60" cy="60" r="54" />
        <circle class="timer-ring-progress" cx="60" cy="60" r="54"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset" />
      </svg>
      <div class="timer-display">
        <span class="timer-time">{{ formatTime(timeLeft) }}</span>
        <span class="timer-label">{{ isBreak ? t('adaptive.break') : t('adaptive.focus') }}</span>
      </div>
    </div>

    <div class="timer-phase">{{ phaseLabel }}</div>

    <div class="timer-controls">
      <button v-if="!isRunning && !isPaused" class="btn-primary" @click="start">
        {{ t('adaptive.startFocus') }}
      </button>
      <button v-else-if="isRunning" class="btn-secondary" @click="pause">
        {{ t('adaptive.pause') }}
      </button>
      <button v-else class="btn-primary" @click="resume">
        {{ t('adaptive.resume') }}
      </button>
      <button class="btn-ghost" @click="reset" :disabled="!isRunning && !isPaused && timeLeft === focusDuration * 60">
        {{ t('adaptive.reset') }}
      </button>
    </div>

    <div class="timer-stats">
      <div class="stat">
        <span class="stat-value">{{ sessionsCompleted }}</span>
        <span class="stat-label">{{ t('adaptive.sessions') }}</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ currentStreak }}</span>
        <span class="stat-label">{{ t('adaptive.streak') }}</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ totalMinutes }}m</span>
        <span class="stat-label">{{ t('adaptive.totalFocus') }}</span>
      </div>
    </div>

    <div class="distraction-lock" v-if="distractionLock">
      <div class="lock-icon">{{ distractionActive ? '🔒' : '🔓' }}</div>
      <span>{{ distractionActive ? t('adaptive.locked') : t('adaptive.distractionLock') }}</span>
      <label class="toggle">
        <input type="checkbox" v-model="distractionActive" />
        <span class="toggle-slider"></span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch, inject } from 'vue'

const t = inject('t')

const props = defineProps({
  focusDuration: { type: Number, default: 25 },
  breakDuration: { type: Number, default: 5 },
  longBreakDuration: { type: Number, default: 15 },
  sessionsBeforeLongBreak: { type: Number, default: 4 },
})

const emit = defineEmits(['sessionComplete', 'focusStart', 'focusEnd'])

const circumference = 2 * Math.PI * 54
const timeLeft = ref(props.focusDuration * 60)
const isRunning = ref(false)
const isPaused = ref(false)
const isBreak = ref(false)
const sessionsCompleted = ref(0)
const currentStreak = ref(0)
const totalMinutes = ref(0)
const distractionLock = ref(true)
const distractionActive = ref(false)

let interval = null

const phaseLabel = computed(() => {
  if (isBreak.value) return `Break — ${Math.ceil(sessionsCompleted.value / props.sessionsBeforeLongBreak) % props.sessionsBeforeLongBreak === 0 && sessionsCompleted.value > 0 ? 'Long' : 'Short'}`
  return `Focus Session #${sessionsCompleted.value + 1}`
})

const progressOffset = computed(() => {
  const total = isBreak.value
    ? ((sessionsCompleted.value % props.sessionsBeforeLongBreak === 0 && sessionsCompleted.value > 0) ? props.longBreakDuration : props.breakDuration) * 60
    : props.focusDuration * 60
  const elapsed = total - timeLeft.value
  return circumference - (elapsed / total) * circumference
})

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function start() {
  isRunning.value = true
  emit('focusStart')
  tick()
}

function tick() {
  interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(interval)
      handleSessionEnd()
    }
  }, 1000)
}

function pause() {
  clearInterval(interval)
  isRunning.value = false
  isPaused.value = true
}

function resume() {
  isRunning.value = true
  isPaused.value = false
  emit('focusStart')
  tick()
}

function reset() {
  clearInterval(interval)
  isRunning.value = false
  isPaused.value = false
  isBreak.value = false
  timeLeft.value = props.focusDuration * 60
  emit('focusEnd')
}

function handleSessionEnd() {
  if (!isBreak.value) {
    sessionsCompleted.value++
    currentStreak.value++
    totalMinutes.value += props.focusDuration
    emit('sessionComplete', { minutes: props.focusDuration, session: sessionsCompleted.value })
    isBreak.value = true
    const isLongBreak = sessionsCompleted.value % props.sessionsBeforeLongBreak === 0
    timeLeft.value = (isLongBreak ? props.longBreakDuration : props.breakDuration) * 60
  } else {
    isBreak.value = false
    timeLeft.value = props.focusDuration * 60
    isRunning.value = false
    currentStreak.value = 0
    return
  }
  tick()
}

onUnmounted(() => {
  clearInterval(interval)
})

defineExpose({ sessionsCompleted, currentStreak, totalMinutes, reset })
</script>

<style scoped>
.focus-timer {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.timer-ring-container {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 1rem;
}

.timer-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-ring-bg {
  fill: none;
  stroke: var(--chip-bg, #e2e8f0);
  stroke-width: 8;
}

.timer-ring-progress {
  fill: none;
  stroke: var(--primary);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}

.timer-display {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-time {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.timer-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timer-phase {
  font-size: 0.9rem;
  color: var(--text-secondary, #64748b);
  margin-bottom: 1rem;
}

.timer-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.btn-primary, .btn-secondary, .btn-ghost {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: white;
}
.btn-primary:hover { opacity: 0.9; }

.btn-secondary {
  background: var(--chip-bg, #e2e8f0);
  color: var(--text);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary, #64748b);
}
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

.timer-stats {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.stat { text-align: center; }
.stat-value { display: block; font-size: 1.25rem; font-weight: 700; color: var(--text); }
.stat-label { font-size: 0.7rem; color: var(--text-secondary, #64748b); text-transform: uppercase; }

.distraction-lock {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  padding: 0.75rem;
  background: var(--chip-bg, #f1f5f9);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
}

.lock-icon { font-size: 1.1rem; }

.toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute;
  inset: 0;
  background: #cbd5e1;
  border-radius: 20px;
  transition: 0.3s;
  cursor: pointer;
}
.toggle-slider::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}
.toggle input:checked + .toggle-slider { background: var(--primary); }
.toggle input:checked + .toggle-slider::before { transform: translateX(16px); }
</style>

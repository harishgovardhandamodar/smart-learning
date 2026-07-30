<template>
  <div class="dashboard-page">
    <div class="container">

      <!-- PIN Gate -->
      <div v-if="!authenticated" class="pin-gate animate-slide-up">
        <div class="pin-card">
          <div class="pin-icon">🔐</div>
          <h1 v-if="!hasExistingPin">{{ t('dashboard.setupTitle') }}</h1>
          <h1 v-else>{{ t('dashboard.pinTitle') }}</h1>
          <p v-if="!hasExistingPin">{{ t('dashboard.setupSubtitle') }}</p>
          <p v-else>{{ t('dashboard.pinSubtitle') }}</p>

          <div class="pin-error" v-if="pinError">{{ pinError }}</div>

          <div class="pin-dots">
            <span v-for="i in 4" :key="i" class="pin-dot" :class="{ filled: pin.length >= i }"></span>
          </div>

          <div class="pin-keypad">
            <button v-for="n in [1,2,3,4,5,6,7,8,9,'',0,'←']" :key="n" class="key-btn"
              :class="{ empty: n === '', backspace: n === '←' }"
              :disabled="n === ''"
              @click="handleKey(n)">
              {{ n === '←' ? '⌫' : n }}
            </button>
          </div>

          <button v-if="!hasExistingPin && pin.length === 4" class="btn btn-primary btn-block" @click="setPin">
            {{ t('dashboard.setPin') }}
          </button>
          <button v-else-if="hasExistingPin && pin.length === 4" class="btn btn-primary btn-block" @click="checkPin">
            {{ t('dashboard.enter') }}
          </button>

          <button v-if="!hasExistingPin" class="btn-text" @click="skipPin">
            {{ t('dashboard.skipPin') }}
          </button>
        </div>
      </div>

      <!-- Authenticated Dashboard -->
      <template v-else>

        <!-- Header -->
        <div class="dash-header">
          <div class="dash-title-row">
            <div>
              <h1 class="page-title">{{ t('dashboard.parentTitle') }}</h1>
              <p class="page-subtitle">{{ t('dashboard.parentSubtitle') }}</p>
            </div>
            <button class="btn btn-ghost" @click="lockDashboard">🔒 {{ t('dashboard.lock') }}</button>
          </div>
        </div>

        <div v-if="!family" class="empty-state">
          <span class="empty-emoji">👨‍👩‍👧‍👦</span>
          <h2>{{ t('dashboard.noKids') }}</h2>
          <p>{{ t('dashboard.noKidsHint') }}</p>
          <router-link to="/enroll" class="btn btn-primary">{{ t('dashboard.enrollFirst') }}</router-link>
        </div>

        <template v-else>

          <!-- Family Overview Cards -->
          <div class="family-overview animate-slide-up">
            <div class="overview-card">
              <span class="ov-icon">👨‍👩‍👧‍👦</span>
              <span class="ov-value">{{ family.kidCount }}</span>
              <span class="ov-label">{{ t('dashboard.kids') }}</span>
            </div>
            <div class="overview-card">
              <span class="ov-icon">💬</span>
              <span class="ov-value">{{ family.totalMessages }}</span>
              <span class="ov-label">{{ t('dashboard.totalMessages') }}</span>
            </div>
            <div class="overview-card">
              <span class="ov-icon">📝</span>
              <span class="ov-value">{{ family.totalQuizzes }}</span>
              <span class="ov-label">{{ t('dashboard.totalQuizzes') }}</span>
            </div>
            <div class="overview-card">
              <span class="ov-icon">🎯</span>
              <span class="ov-value">{{ family.familyAvg }}%</span>
              <span class="ov-label">{{ t('dashboard.familyAvg') }}</span>
            </div>
            <div class="overview-card">
              <span class="ov-icon">⏱️</span>
              <span class="ov-value">{{ formatTime(family.totalTime) }}</span>
              <span class="ov-label">{{ t('dashboard.totalTime') }}</span>
            </div>
            <div class="overview-card" v-if="family.familyStreak > 0">
              <span class="ov-icon">🔥</span>
              <span class="ov-value">{{ family.familyStreak }}</span>
              <span class="ov-label">{{ t('dashboard.familyStreak') }}</span>
            </div>
          </div>

          <!-- Top Performer Banner -->
          <div class="performer-banner animate-slide-up" v-if="family.topPerformer">
            <span class="performer-avatar">{{ family.topPerformer.avatar }}</span>
            <div class="performer-info">
              <span class="performer-label">🏆 {{ t('dashboard.topPerformer') }}</span>
              <span class="performer-name">{{ family.topPerformer.name }}</span>
              <span class="performer-stat">{{ family.topPerformer.avg }}% avg · {{ family.topPerformer.quizzes }} {{ t('dashboard.quizzes') }}</span>
            </div>
          </div>

          <!-- Combined Weekly Activity -->
          <div class="card animate-slide-up">
            <h3 class="card-title">📅 {{ t('dashboard.familyActivity') }}</h3>
            <div class="bar-chart">
              <div v-for="day in family.weeklyActivity" :key="day.date" class="bar-group">
                <div class="bar-stack">
                  <div class="bar bar-quizzes" :style="{ height: (day.quizzes / familyMaxBar) * 100 + '%' }"></div>
                  <div class="bar bar-messages" :style="{ height: (day.messages / familyMaxBar) * 100 + '%' }"></div>
                </div>
                <span class="bar-label">{{ day.day }}</span>
                <span class="bar-value">{{ day.minutes }}m</span>
              </div>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot" style="background: var(--primary)"></span> {{ t('dashboard.messages') }}</span>
              <span class="legend-item"><span class="legend-dot" style="background: var(--accent)"></span> {{ t('dashboard.quizzes') }}</span>
            </div>
          </div>

          <!-- Kids Cards -->
          <h2 class="section-title animate-slide-up">{{ t('dashboard.allExplorers') }}</h2>
          <div class="kids-grid animate-slide-up">
            <div v-for="km in family.kids" :key="km.kid.id" class="kid-card"
              :class="{ expanded: expandedKid === km.kid.id }" @click="toggleKid(km.kid.id)">

              <div class="kid-card-header">
                <span class="kid-avatar">{{ km.kid.avatar }}</span>
                <div class="kid-main-info">
                  <span class="kid-name">{{ km.kid.name }}</span>
                  <span class="kid-level">{{ km.level }}</span>
                </div>
                <div class="kid-quick-stats">
                  <span class="qs" v-if="km.streak > 0">🔥{{ km.streak }}</span>
                  <span class="qs" :style="{ color: getScoreColor(km.avgScore) }">{{ km.avgScore }}%</span>
                  <span class="qs">📝{{ km.quizzesCompleted }}</span>
                </div>
                <span class="expand-arrow" :class="{ open: expandedKid === km.kid.id }">▸</span>
              </div>

              <!-- Expanded Detail -->
              <div v-if="expandedKid === km.kid.id" class="kid-detail" @click.stop>
                <div class="detail-stats">
                  <div class="ds">
                    <span class="ds-val">{{ km.messagesSent }}</span>
                    <span class="ds-lbl">{{ t('dashboard.messages') }}</span>
                  </div>
                  <div class="ds">
                    <span class="ds-val">{{ km.quizzesCompleted }}</span>
                    <span class="ds-lbl">{{ t('dashboard.quizzes') }}</span>
                  </div>
                  <div class="ds">
                    <span class="ds-val">{{ km.topicsExplored }}/4</span>
                    <span class="ds-lbl">{{ t('dashboard.topicsExplored') }}</span>
                  </div>
                  <div class="ds">
                    <span class="ds-val">{{ formatTime(km.totalMinutes) }}</span>
                    <span class="ds-lbl">{{ t('dashboard.timeSpent') }}</span>
                  </div>
                  <div class="ds">
                    <span class="ds-val">{{ km.funFactsViewed }}</span>
                    <span class="ds-lbl">{{ t('dashboard.factsViewed') }}</span>
                  </div>
                </div>

                <!-- Score Ring -->
                <div v-if="km.quizzesCompleted > 0" class="detail-score">
                  <div class="mini-ring">
                    <svg viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="7" />
                      <circle cx="40" cy="40" r="34" fill="none" :stroke="getScoreColor(km.avgScore)" stroke-width="7"
                        :stroke-dasharray="`${km.avgScore * 2.136} 213.6`"
                        stroke-linecap="round" transform="rotate(-90 40 40)" />
                    </svg>
                    <div class="mini-ring-center">
                      <span class="mini-ring-val">{{ km.avgScore }}%</span>
                    </div>
                  </div>
                  <div class="score-mini-details">
                    <span>🏆 {{ t('dashboard.bestScore') }}: {{ km.bestScore }}%</span>
                    <span>📈 {{ t('dashboard.improvement') }}: {{ km.improvement >= 0 ? '+' : '' }}{{ km.improvement }}%</span>
                  </div>
                </div>

                <!-- Topic Bars -->
                <div v-if="km.topicPerformance.length > 0" class="detail-topics">
                  <div v-for="tp in km.topicPerformance" :key="tp.topic" class="topic-row">
                    <div class="topic-row-header">
                      <span>{{ getTopicIcon(tp.topic) }} {{ getTopicName(tp.topic) }}</span>
                      <span :style="{ color: getScoreColor(tp.avg) }">{{ tp.avg }}%</span>
                    </div>
                    <div class="topic-bar-track">
                      <div class="topic-bar-fill" :style="{ width: tp.avg + '%', background: getScoreColor(tp.avg) }"></div>
                    </div>
                  </div>
                </div>

                <!-- Recent Quizzes -->
                <div v-if="km.recentQuizzes.length > 0" class="detail-quizzes">
                  <div v-for="(q, i) in km.recentQuizzes" :key="i" class="quiz-mini-row">
                    <span>{{ getTopicIcon(q.topic) }}</span>
                    <span class="qm-topic">{{ getTopicName(q.topic) }}</span>
                    <span class="qm-date">{{ formatDate(q.date) }}</span>
                    <span class="qm-score" :style="{ color: getScoreColor(q.percentage) }">{{ q.score }}/{{ q.total }}</span>
                    <span class="qm-pct" :style="{ color: getScoreColor(q.percentage) }">{{ q.percentage }}%</span>
                  </div>
                </div>

                <!-- Danger Zone -->
                <div class="danger-zone">
                  <button class="btn btn-danger btn-sm" @click.stop="confirmRemoveKid(km.kid)">
                    🗑️ {{ t('dashboard.removeKid') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Family Quizzes -->
          <div class="card animate-slide-up" v-if="family.recentQuizzes.length > 0">
            <h3 class="card-title">📝 {{ t('dashboard.recentQuizzes') }}</h3>
            <div class="quiz-list">
              <div v-for="(q, idx) in family.recentQuizzes" :key="idx" class="quiz-row">
                <span class="quiz-kid-avatar">{{ q.kidAvatar }}</span>
                <span class="quiz-icon">{{ getTopicIcon(q.topic) }}</span>
                <div class="quiz-info">
                  <span class="quiz-topic">{{ q.kidName }} — {{ getTopicName(q.topic) }}</span>
                  <span class="quiz-date">{{ formatDate(q.date) }}</span>
                </div>
                <div class="quiz-score-badge" :style="{ background: getScoreBg(q.percentage), color: getScoreColor(q.percentage) }">
                  {{ q.score }}/{{ q.total }}
                </div>
                <span class="quiz-pct" :style="{ color: getScoreColor(q.percentage) }">{{ q.percentage }}%</span>
              </div>
            </div>
          </div>

          <!-- Admin Actions -->
          <div class="card admin-card animate-slide-up">
            <h3 class="card-title">⚙️ {{ t('dashboard.settings') }}</h3>
            <div class="admin-actions">
              <button class="btn btn-outline" @click="changePin">{{ t('dashboard.changePin') }}</button>
              <button class="btn btn-outline" @click="removePin">{{ t('dashboard.removePin') }}</button>
              <router-link to="/enroll" class="btn btn-outline">➕ {{ t('dashboard.addKid') }}</router-link>
            </div>
          </div>

        </template>
      </template>

      <!-- Remove Kid Confirm Modal -->
      <div v-if="kidToRemove" class="modal-overlay" @click="kidToRemove = null">
        <div class="modal-card" @click.stop>
          <div class="modal-icon">⚠️</div>
          <h2>{{ t('dashboard.confirmRemove') }}</h2>
          <p>{{ t('dashboard.confirmRemoveDesc') }} <strong>{{ kidToRemove.name }}</strong>?</p>
          <p class="modal-warning">{{ t('dashboard.removeWarning') }}</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" @click="kidToRemove = null">{{ t('dashboard.cancel') }}</button>
            <button class="btn btn-danger" @click="doRemoveKid">{{ t('dashboard.remove') }}</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import {
  getKids, getKidMetrics, getFamilyStats,
  hasParentPin, setParentPin, verifyParentPin, removeParentPin,
  removeKidAndActivity,
} from '../data/kids'
import { TOPIC_NAMES } from '../data/funFacts'

const t = inject('t')
const locale = inject('locale')

const authenticated = ref(false)
const hasExistingPin = ref(false)
const pin = ref('')
const pinError = ref('')
const family = ref(null)
const expandedKid = ref(null)
const kidToRemove = ref(null)
const changingPin = ref(false)

const familyMaxBar = computed(() => {
  if (!family.value) return 1
  return Math.max(...family.value.weeklyActivity.map(d => Math.max(d.quizzes, d.messages)), 1)
})

function handleKey(key) {
  pinError.value = ''
  if (key === '←') {
    pin.value = pin.value.slice(0, -1)
  } else if (pin.value.length < 4) {
    pin.value += String(key)
  }
}

function setPin() {
  if (pin.value.length !== 4) return
  setParentPin(pin.value)
  authenticated.value = true
  loadDashboard()
}

function checkPin() {
  if (pin.value.length !== 4) return
  if (verifyParentPin(pin.value)) {
    authenticated.value = true
    loadDashboard()
  } else {
    pinError.value = t('dashboard.wrongPin')
    pin.value = ''
  }
}

function skipPin() {
  authenticated.value = true
  loadDashboard()
}

function lockDashboard() {
  authenticated.value = false
  pin.value = ''
  pinError.value = ''
}

function changePin() {
  changingPin.value = true
  removeParentPin()
  hasExistingPin.value = false
  authenticated.value = false
  pin.value = ''
  pinError.value = ''
}

function removePin() {
  removeParentPin()
  hasExistingPin.value = false
}

function toggleKid(kidId) {
  expandedKid.value = expandedKid.value === kidId ? null : kidId
}

function confirmRemoveKid(kid) {
  kidToRemove.value = kid
}

function doRemoveKid() {
  if (!kidToRemove.value) return
  removeKidAndActivity(kidToRemove.value.id)
  kidToRemove.value = null
  loadDashboard()
}

function loadDashboard() {
  hasExistingPin.value = hasParentPin()
  family.value = getFamilyStats()
}

function getTopicIcon(topic) {
  const icons = { science: '🔬', technology: '💻', engineering: '🏗️', mathematics: '🧮' }
  return icons[topic] || '📚'
}

function getTopicName(topic) {
  return TOPIC_NAMES[locale.value]?.[topic] || TOPIC_NAMES.en[topic] || topic
}

function getScoreColor(score) {
  if (score >= 80) return 'var(--success)'
  if (score >= 60) return 'var(--warning)'
  return 'var(--danger)'
}

function getScoreBg(score) {
  if (score >= 80) return 'rgba(0, 184, 148, 0.12)'
  if (score >= 60) return 'rgba(253, 203, 110, 0.15)'
  return 'rgba(255, 118, 117, 0.12)'
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(locale.value === 'nl' ? 'nl-NL' : 'en-US', {
    month: 'short', day: 'numeric',
  })
}

onMounted(loadDashboard)
</script>

<style scoped lang="scss">
.dashboard-page { padding: 20px 0 60px; }

/* ── PIN Gate ── */
.pin-gate {
  display: flex; justify-content: center; padding-top: 40px;
}
.pin-card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 40px 32px;
  box-shadow: var(--shadow); max-width: 380px; width: 100%; text-align: center;
}
.pin-icon { font-size: 3.5rem; margin-bottom: 12px; display: block; }
.pin-card h1 { font-size: 1.5rem; margin-bottom: 6px; }
.pin-card p { color: var(--text-light); font-size: 0.9rem; margin-bottom: 24px; }

.pin-error {
  background: rgba(255, 118, 117, 0.1); color: var(--danger); padding: 8px 14px;
  border-radius: 10px; font-size: 0.85rem; font-weight: 600; margin-bottom: 16px;
}

.pin-dots {
  display: flex; justify-content: center; gap: 14px; margin-bottom: 24px;
}
.pin-dot {
  width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--border);
  transition: all 0.2s;
  &.filled { background: var(--primary); border-color: var(--primary); }
}

.pin-keypad {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;
}
.key-btn {
  height: 52px; border-radius: 12px; font-size: 1.3rem; font-weight: 600;
  font-family: var(--font-display); background: var(--chip-bg); color: var(--text);
  border: 2px solid transparent; transition: all 0.15s;
  &:hover:not(:disabled) { background: var(--border); }
  &:active:not(:disabled) { transform: scale(0.95); }
  &.empty { visibility: hidden; }
  &.backspace { font-size: 1.1rem; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.btn-text {
  background: none; border: none; color: var(--text-muted); font-size: 0.85rem;
  font-weight: 600; cursor: pointer; margin-top: 12px; padding: 8px;
  &:hover { color: var(--primary); }
}

/* ── Header ── */
.dash-header { margin-bottom: 24px; }
.dash-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-title { font-size: 2rem; font-weight: 700; }
.page-subtitle { color: var(--text-light); font-size: 0.95rem; margin-top: 4px; }

.empty-state {
  text-align: center; padding: 60px 20px;
  h2 { margin-bottom: 8px; }
  p { color: var(--text-light); margin-bottom: 24px; }
}
.empty-emoji { font-size: 4rem; display: block; margin-bottom: 16px; }

/* ── Family Overview ── */
.family-overview {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 20px;
}
.overview-card {
  background: var(--bg-card); border-radius: var(--radius); padding: 20px; text-align: center;
  box-shadow: var(--shadow); border: 2px solid transparent; transition: all 0.3s;
  &:hover { border-color: var(--border); transform: translateY(-2px); }
}
.ov-icon { font-size: 1.5rem; display: block; margin-bottom: 6px; }
.ov-value { font-family: var(--font-display); font-weight: 700; font-size: 1.6rem; display: block; }
.ov-label { font-size: 0.78rem; color: var(--text-muted); display: block; margin-top: 2px; }

/* ── Top Performer ── */
.performer-banner {
  display: flex; align-items: center; gap: 14px; padding: 18px 24px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 152, 0, 0.06));
  border: 2px solid rgba(255, 215, 0, 0.2); border-radius: var(--radius-lg); margin-bottom: 20px;
}
.performer-avatar { font-size: 2.5rem; }
.performer-info { display: flex; flex-direction: column; }
.performer-label { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
.performer-name { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; }
.performer-stat { font-size: 0.8rem; color: var(--text-light); }

/* ── Cards ── */
.card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px;
  box-shadow: var(--shadow); margin-bottom: 20px;
}
.card-title { font-size: 1.1rem; margin-bottom: 20px; }

/* ── Bar Chart ── */
.bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 160px; padding-bottom: 24px; }
.bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
.bar-stack { flex: 1; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 2px; }
.bar { width: 60%; min-height: 2px; border-radius: 3px; transition: height 0.6s ease; }
.bar-messages { background: var(--primary); }
.bar-quizzes { background: var(--accent); }
.bar-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 6px; font-weight: 600; }
.bar-value { font-size: 0.7rem; color: var(--text-muted); }
.chart-legend { display: flex; gap: 16px; justify-content: center; margin-top: 8px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-light); }
.legend-dot { width: 10px; height: 10px; border-radius: 3px; }

/* ── Section Title ── */
.section-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 16px; }

/* ── Kids Grid ── */
.kids-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

.kid-card {
  background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow);
  border: 2px solid transparent; transition: all 0.3s; overflow: hidden; cursor: pointer;
  &:hover { border-color: var(--border); }
  &.expanded { border-color: var(--primary-light); }
}

.kid-card-header {
  display: flex; align-items: center; gap: 12px; padding: 18px 20px;
}
.kid-avatar { font-size: 2rem; }
.kid-main-info { flex: 1; display: flex; flex-direction: column; }
.kid-name { font-family: var(--font-display); font-weight: 700; font-size: 1rem; }
.kid-level { font-size: 0.8rem; color: var(--text-muted); }
.kid-quick-stats { display: flex; gap: 10px; align-items: center; }
.qs { font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; }
.expand-arrow {
  font-size: 1rem; color: var(--text-muted); transition: transform 0.3s;
  &.open { transform: rotate(90deg); }
}

.kid-detail {
  padding: 0 20px 20px; border-top: 1px solid var(--border); animation: slide-up 0.3s ease;
}

.detail-stats {
  display: flex; gap: 12px; flex-wrap: wrap; margin: 16px 0;
}
.ds {
  flex: 1; min-width: 80px; text-align: center; padding: 10px 6px;
  background: var(--chip-bg); border-radius: 10px;
}
.ds-val { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; display: block; }
.ds-lbl { font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 2px; }

.detail-score {
  display: flex; align-items: center; gap: 20px; margin: 16px 0; flex-wrap: wrap;
}
.mini-ring { position: relative; width: 80px; height: 80px; flex-shrink: 0;
  svg { width: 100%; height: 100%; }
}
.mini-ring-center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.mini-ring-val { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; }
.score-mini-details { display: flex; flex-direction: column; gap: 4px; font-size: 0.85rem; color: var(--text-light); }

.detail-topics { margin: 16px 0; }
.topic-row { margin-bottom: 10px; }
.topic-row-header { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; }
.topic-bar-track { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
.topic-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }

.detail-quizzes { margin: 16px 0; }
.quiz-mini-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 0;
  font-size: 0.85rem; border-bottom: 1px solid var(--border);
  &:last-child { border-bottom: none; }
}
.qm-topic { flex: 1; font-weight: 600; }
.qm-date { color: var(--text-muted); font-size: 0.78rem; }
.qm-score { font-family: var(--font-display); font-weight: 700; }
.qm-pct { font-family: var(--font-display); font-weight: 700; width: 40px; text-align: right; }

/* ── Recent Quizzes (family) ── */
.quiz-list { display: flex; flex-direction: column; gap: 8px; }
.quiz-row {
  display: flex; align-items: center; gap: 10px; padding: 12px 14px;
  border-radius: 10px; background: var(--chip-bg);
}
.quiz-kid-avatar { font-size: 1.2rem; }
.quiz-icon { font-size: 1.1rem; }
.quiz-info { flex: 1; display: flex; flex-direction: column; }
.quiz-topic { font-weight: 600; font-size: 0.85rem; }
.quiz-date { font-size: 0.75rem; color: var(--text-muted); }
.quiz-score-badge {
  padding: 4px 10px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; font-family: var(--font-display);
}
.quiz-pct { font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; width: 40px; text-align: right; }

/* ── Danger Zone ── */
.danger-zone {
  margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255, 118, 117, 0.15);
  display: flex; justify-content: flex-end;
}

/* ── Admin ── */
.admin-actions { display: flex; gap: 10px; flex-wrap: wrap; }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0; z-index: 200; background: rgba(0, 0, 0, 0.5);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  backdrop-filter: blur(4px);
}
.modal-card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 32px;
  box-shadow: var(--shadow); max-width: 400px; width: 100%; text-align: center;
}
.modal-icon { font-size: 3rem; margin-bottom: 12px; display: block; }
.modal-card h2 { font-size: 1.2rem; margin-bottom: 8px; }
.modal-card p { color: var(--text-light); font-size: 0.9rem; margin-bottom: 8px; }
.modal-warning { color: var(--danger); font-size: 0.82rem !important; margin-bottom: 20px !important; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }

/* ── Buttons ── */
.btn {
  padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 0.9rem;
  display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s; cursor: pointer;
}
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); &:hover { transform: translateY(-2px); } }
.btn-ghost { background: transparent; color: var(--text-light); &:hover { background: var(--chip-bg); } }
.btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text); &:hover { border-color: var(--primary); color: var(--primary); } }
.btn-danger { background: rgba(255, 118, 117, 0.1); color: var(--danger); border: 2px solid rgba(255, 118, 117, 0.2); &:hover { background: var(--danger); color: white; } }
.btn-sm { padding: 8px 16px; font-size: 0.82rem; }
.btn-block { width: 100%; }

@media (max-width: 640px) {
  .family-overview { grid-template-columns: repeat(2, 1fr); }
  .detail-stats { gap: 8px; }
}
</style>

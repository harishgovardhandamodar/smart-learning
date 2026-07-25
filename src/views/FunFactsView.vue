<template>
  <div class="fun-facts-page">
    <div class="container">
      <div class="facts-header">
        <router-link to="/" class="back-link">← {{ t('funFacts.backToHome') }}</router-link>
        <h1 class="page-title">{{ t('funFacts.title') }}</h1>
        <p class="page-subtitle">{{ t('funFacts.subtitle') }}</p>
      </div>

      <div class="curiosity-banner" v-if="curiosity">
        <div class="curiosity-content">
          <div class="curiosity-left">
            <div class="curiosity-emoji animate-float">{{ curiosity.level.split(' ').slice(1).join(' ') }}</div>
            <div class="curiosity-info">
              <span class="curiosity-level">{{ curiosity.level.split(' ').slice(0, -1).join(' ') || curiosity.level }}</span>
              <div class="curiosity-bar">
                <div class="curiosity-fill" :style="{ width: curiosity.percentage + '%' }"></div>
              </div>
              <span class="curiosity-count">{{ curiosity.factsExplored }}/{{ curiosity.totalFacts }} {{ t('funFacts.factsExplored') }}</span>
            </div>
          </div>
          <div class="curiosity-right" v-if="nudge">
            <span class="nudge-text">{{ nudge }}</span>
          </div>
        </div>
      </div>

      <div class="topic-filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          class="filter-btn"
          :class="{ active: activeFilter === filter.value }"
          @click="activeFilter = filter.value"
        >
          {{ filter.icon }} {{ filter.label }}
        </button>
      </div>

      <div class="facts-grid">
        <div
          v-for="fact in filteredFacts"
          :key="fact.id"
          class="fact-card"
          :class="{ 'is-read': isRead(fact.id) }"
          :style="{ '--topic-color': getTopicColor(fact.topic).accent }"
          @click="openFact(fact)"
        >
          <div class="fact-card-header">
            <span class="fact-icon">{{ fact.icon }}</span>
            <span class="fact-topic-badge" :style="{ background: getTopicColor(fact.topic).bg, color: getTopicColor(fact.topic).accent, borderColor: getTopicColor(fact.topic).border }">
              {{ getTopicName(fact.topic) }}
            </span>
            <span v-if="isRead(fact.id)" class="read-badge">✓</span>
          </div>
          <h3 class="fact-title">{{ fact[locale].title }}</h3>
          <p class="fact-preview">{{ fact[locale].fact }}</p>
          <div class="fact-action">
            <span>{{ t('funFacts.learnMore') }}</span>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="expandedFact" class="fact-modal-overlay" @click.self="expandedFact = null">
        <div class="fact-modal">
          <button class="modal-close" @click="expandedFact = null">✕</button>
          <div class="modal-header">
            <span class="modal-icon">{{ expandedFact.icon }}</span>
            <span class="modal-topic" :style="{ background: getTopicColor(expandedFact.topic).bg, color: getTopicColor(expandedFact.topic).accent, borderColor: getTopicColor(expandedFact.topic).border }">
              {{ getTopicName(expandedFact.topic) }}
            </span>
          </div>
          <h2 class="modal-title">{{ expandedFact[locale].title }}</h2>
          <p class="modal-fact">{{ expandedFact[locale].fact }}</p>
          <div class="modal-divider"></div>
          <p class="modal-detail">{{ expandedFact[locale].detail }}</p>
          <div class="modal-nav">
            <button class="modal-nav-btn" @click="prevFact">← {{ t('funFacts.previous') }}</button>
            <button class="modal-nav-btn" @click="nextFact">{{ t('funFacts.next') }} →</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { storage } from '../utils/storage'
import { FUN_FACTS, TOPIC_COLORS, TOPIC_NAMES, getCuriosityScore, getNextNudge, markFactSeen } from '../data/funFacts'

const t = inject('t')
const locale = inject('locale')

const activeFilter = ref('all')
const expandedFact = ref(null)
const curiosity = ref(null)
const nudge = ref('')

const filters = computed(() => [
  { value: 'all', icon: '🌟', label: t('funFacts.all') },
  { value: 'science', icon: '🔬', label: t('funFacts.science') },
  { value: 'technology', icon: '💻', label: t('funFacts.technology') },
  { value: 'engineering', icon: '🏗️', label: t('funFacts.engineering') },
  { value: 'mathematics', icon: '🧮', label: t('funFacts.mathematics') },
])

const filteredFacts = computed(() => {
  if (activeFilter.value === 'all') return FUN_FACTS
  return FUN_FACTS.filter(f => f.topic === activeFilter.value)
})

function getTopicColor(topic) {
  return TOPIC_COLORS[topic] || TOPIC_COLORS.science
}

function getTopicName(topic) {
  return TOPIC_NAMES[locale.value]?.[topic] || TOPIC_NAMES.en[topic]
}

function getReadHistory() {
  return storage.get('foxy_fact_history', {})
}

function isRead(id) {
  return !!getReadHistory()[id]
}

function openFact(fact) {
  expandedFact.value = fact
  markFactSeen(fact.id)
}

function prevFact() {
  const list = filteredFacts.value
  const idx = list.findIndex(f => f.id === expandedFact.value.id)
  expandedFact.value = list[(idx - 1 + list.length) % list.length]
  markFactSeen(expandedFact.value.id)
}

function nextFact() {
  const list = filteredFacts.value
  const idx = list.findIndex(f => f.id === expandedFact.value.id)
  expandedFact.value = list[(idx + 1) % list.length]
  markFactSeen(expandedFact.value.id)
}

onMounted(() => {
  curiosity.value = getCuriosityScore()
  nudge.value = getNextNudge()
})
</script>

<style scoped lang="scss">
.fun-facts-page { padding: 20px 0 60px; }

.facts-header { text-align: center; margin-bottom: 32px; }

.back-link {
  font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--text-light);
  display: inline-flex; align-items: center; margin-bottom: 16px; transition: color 0.2s;
  &:hover { color: var(--primary); }
}

.page-title { font-size: 2.2rem; font-weight: 700; margin-bottom: 8px; }
.page-subtitle { color: var(--text-light); font-size: 1.05rem; }

.curiosity-banner {
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.08), rgba(253, 121, 168, 0.08));
  border: 2px solid rgba(108, 92, 231, 0.12);
  border-radius: var(--radius-lg); padding: 20px 28px; margin-bottom: 32px;
}

.curiosity-content { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }

.curiosity-left { display: flex; align-items: center; gap: 16px; }
.curiosity-emoji { font-size: 2.5rem; }
.curiosity-info { display: flex; flex-direction: column; gap: 4px; }
.curiosity-level { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; }
.curiosity-bar { width: 200px; height: 8px; background: rgba(108, 92, 231, 0.12); border-radius: 4px; overflow: hidden; }
.curiosity-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 4px; transition: width 0.8s ease; }
.curiosity-count { font-size: 0.8rem; color: var(--text-muted); }
.curiosity-right { flex-shrink: 0; }
.nudge-text { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--primary); }

.topic-filters { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 32px; }

.filter-btn {
  padding: 8px 20px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
  background: var(--chip-bg); color: var(--text-light); border: 2px solid transparent; transition: all 0.3s;
  &:hover { border-color: var(--primary); color: var(--primary); }
  &.active { background: var(--primary); color: white; }
}

.facts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }

.fact-card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow);
  border: 2px solid transparent; transition: all 0.3s ease; cursor: pointer; position: relative;
  &:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); border-color: var(--topic-color);
    .arrow { transform: translateX(4px); }
  }
  &.is-read { opacity: 0.85; }
}

.fact-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.fact-icon { font-size: 1.8rem; }
.fact-topic-badge {
  font-family: var(--font-display); font-weight: 600; font-size: 0.7rem; padding: 3px 10px;
  border-radius: 10px; border: 1px solid; text-transform: uppercase; letter-spacing: 0.5px;
}
.read-badge { margin-left: auto; color: var(--success); font-size: 1rem; font-weight: 700; }

.fact-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; }
.fact-preview { font-size: 0.88rem; color: var(--text-light); line-height: 1.5; margin-bottom: 12px; }

.fact-action {
  font-family: var(--font-display); font-weight: 600; font-size: 0.85rem; color: var(--primary);
  display: flex; align-items: center; gap: 4px;
  .arrow { transition: transform 0.3s ease; }
}

.fact-modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 1000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  animation: fadeIn 0.2s ease;
}

.fact-modal {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 36px;
  max-width: 560px; width: 100%; position: relative; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease; max-height: 80vh; overflow-y: auto;
}

.modal-close {
  position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%;
  background: var(--chip-bg); color: var(--text-muted); font-size: 1rem; display: flex;
  align-items: center; justify-content: center; &:hover { background: var(--danger); color: white; }
}

.modal-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.modal-icon { font-size: 2.5rem; }
.modal-topic {
  font-family: var(--font-display); font-weight: 600; font-size: 0.75rem; padding: 4px 12px;
  border-radius: 10px; border: 1px solid; text-transform: uppercase;
}

.modal-title { font-size: 1.6rem; font-weight: 700; margin-bottom: 12px; }
.modal-fact { font-size: 1.05rem; color: var(--text); line-height: 1.6; margin-bottom: 16px; font-weight: 600; }
.modal-divider { height: 2px; background: var(--border); margin-bottom: 16px; border-radius: 1px; }
.modal-detail { font-size: 0.95rem; color: var(--text-light); line-height: 1.7; margin-bottom: 24px; }

.modal-nav { display: flex; justify-content: space-between; gap: 12px; }

.modal-nav-btn {
  padding: 10px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;
  background: var(--chip-bg); color: var(--text-light); transition: all 0.2s;
  &:hover { background: var(--primary); color: white; }
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 640px) {
  .curiosity-content { flex-direction: column; align-items: flex-start; }
  .curiosity-bar { width: 160px; }
  .facts-grid { grid-template-columns: 1fr; }
  .fact-modal { padding: 24px; }
}
</style>

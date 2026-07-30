<template>
  <div class="mastery-dashboard">
    <h3>{{ t('adaptive.mastery') }}</h3>

    <div class="level-badge">
      <div class="level-ring">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--chip-bg, #e2e8f0)" stroke-width="6" />
          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--primary)" stroke-width="6"
            stroke-linecap="round" :stroke-dasharray="226" :stroke-dashoffset="226 - (226 * metrics.level.percent / 100)"
            style="transform: rotate(-90deg); transform-origin: center;" />
        </svg>
        <div class="level-num">{{ metrics.level.current }}</div>
      </div>
      <div class="level-info">
        <div class="level-title">Level {{ metrics.level.current }}</div>
        <div class="level-xp">{{ metrics.level.currentXp }} / {{ metrics.level.nextLevelXp }} XP</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📚</div>
        <div class="stat-val">{{ metrics.lessonsCompleted }}</div>
        <div class="stat-lbl">{{ t('adaptive.lessons') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-val">{{ metrics.focusHours }}h</div>
        <div class="stat-lbl">{{ t('adaptive.focusTime') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🧠</div>
        <div class="stat-val">{{ metrics.averageTier }}</div>
        <div class="stat-lbl">{{ t('adaptive.avgTier') }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏅</div>
        <div class="stat-val">{{ metrics.masteredSkills }}/{{ metrics.totalSkills }}</div>
        <div class="stat-lbl">{{ t('adaptive.mastered') }}</div>
      </div>
    </div>

    <div class="certificates" v-if="metrics.certificates && metrics.certificates.length > 0">
      <h4>{{ t('adaptive.certificates') }}</h4>
      <div class="cert-grid">
        <div v-for="cert in metrics.certificates" :key="cert.id" class="cert-card">
          <div class="cert-icon">{{ cert.icon }}</div>
          <div class="cert-title">{{ cert.title }}</div>
          <div class="cert-desc">{{ cert.description }}</div>
        </div>
      </div>
    </div>

    <div class="recommendation" v-if="recommendation">
      <h4>{{ t('adaptive.recommendation') }}</h4>
      <div class="rec-card">
        <div class="rec-focus">
          <span class="rec-label">{{ t('adaptive.suggestedFocus') }}:</span>
          <span class="rec-value">{{ recommendation.suggestedFocusName }}</span>
        </div>
        <div class="rec-pace" :class="recommendation.paceRecommendation">
          {{ formatPace(recommendation.paceRecommendation) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const t = inject('t')

defineProps({
  metrics: Object,
  recommendation: Object,
})

function formatPace(pace) {
  const map = { 'catch-up': '⚡ Catch Up Mode', 'on-track': '✅ On Track', 'ahead': '🚀 Ahead of Schedule' }
  return map[pace] || pace
}
</script>

<style scoped>
.mastery-dashboard {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.mastery-dashboard h3 { margin: 0 0 1rem; font-size: 1.1rem; color: var(--text); }
.mastery-dashboard h4 { margin: 1rem 0 0.5rem; font-size: 0.9rem; color: var(--text); }

.level-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #ede9fe, #e0e7ff);
  border-radius: 12px;
}
.level-ring { width: 64px; height: 64px; position: relative; }
.level-ring svg { width: 100%; height: 100%; }
.level-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}
.level-title { font-weight: 700; font-size: 1rem; color: var(--text); }
.level-xp { font-size: 0.8rem; color: var(--text-secondary, #64748b); }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.stat-card {
  background: var(--chip-bg, #f8fafc);
  border-radius: 10px;
  padding: 0.75rem;
  text-align: center;
}
.stat-icon { font-size: 1.2rem; }
.stat-val { font-size: 1.3rem; font-weight: 700; color: var(--text); }
.stat-lbl { font-size: 0.7rem; color: var(--text-secondary, #94a3b8); text-transform: uppercase; }

.cert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.5rem; }
.cert-card {
  background: linear-gradient(135deg, #fef9c3, #fef3c7);
  border-radius: 10px;
  padding: 0.75rem;
  text-align: center;
}
.cert-icon { font-size: 1.5rem; }
.cert-title { font-weight: 700; font-size: 0.8rem; color: #92400e; margin: 0.25rem 0; }
.cert-desc { font-size: 0.65rem; color: #a16207; }

.rec-card {
  background: var(--chip-bg, #f8fafc);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rec-label { font-size: 0.8rem; color: var(--text-secondary, #64748b); }
.rec-value { font-weight: 600; color: var(--text); }
.rec-pace {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.rec-pace.catch-up { background: #fef3c7; color: #92400e; }
.rec-pace.on-track { background: #d1fae5; color: #065f46; }
.rec-pace.ahead { background: #ede9fe; color: #5b21b6; }
</style>

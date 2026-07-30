<template>
  <div class="goal-setting">
    <h3>{{ t('adaptive.goals') }}</h3>

    <div class="goal-weekly">
      <div class="goal-header">
        <span class="goal-label">{{ t('adaptive.weeklyTarget') }}</span>
        <span class="goal-value">{{ completed }} / {{ target }}</span>
      </div>
      <div class="goal-bar">
        <div class="goal-bar-fill" :style="{ width: Math.min(100, (completed / target) * 100) + '%' }"></div>
      </div>
      <div class="goal-progress-text">
        {{ Math.round((completed / target) * 100) }}% {{ t('adaptive.complete') }}
      </div>
    </div>

    <div class="goal-adjuster">
      <span class="adjuster-label">{{ t('adaptive.setTarget') }}</span>
      <div class="adjuster-controls">
        <button class="adj-btn" @click="adjust(-1)" :disabled="target <= 1">−</button>
        <span class="adj-value">{{ target }}</span>
        <button class="adj-btn" @click="adjust(1)" :disabled="target >= 50">+</button>
      </div>
    </div>

    <div class="encouragement" v-if="encouragement">
      <span class="enc-icon">{{ encouragement.icon }}</span>
      <span class="enc-text">{{ encouragement.text }}</span>
    </div>

    <div class="unlock-progress" v-if="unlockProgress">
      <h4>{{ t('adaptive.unlockedFeatures') }}</h4>
      <div class="unlock-list">
        <div v-for="(info, feature) in unlockProgress" :key="feature" class="unlock-item"
          :class="{ unlocked: info.unlocked }">
          <span class="unlock-icon">{{ info.unlocked ? '🔓' : '🔒' }}</span>
          <span class="unlock-name">{{ formatFeatureName(feature) }}</span>
          <div class="unlock-bar">
            <div class="unlock-bar-fill" :style="{ width: info.percent + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const t = inject('t')

const props = defineProps({
  target: { type: Number, default: 5 },
  completed: { type: Number, default: 0 },
  encouragement: Object,
  unlockProgress: Object,
})

const emit = defineEmits(['setTarget'])

function adjust(delta) {
  emit('setTarget', props.target + delta)
}

function formatFeatureName(name) {
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
</script>

<style scoped>
.goal-setting {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.goal-setting h3 { margin: 0 0 1rem; font-size: 1.1rem; color: var(--text); }
.goal-setting h4 { margin: 0 0 0.5rem; font-size: 0.9rem; color: var(--text); }

.goal-weekly { margin-bottom: 1rem; }
.goal-header { display: flex; justify-content: space-between; margin-bottom: 0.4rem; }
.goal-label { font-size: 0.85rem; color: var(--text-secondary, #64748b); }
.goal-value { font-weight: 700; font-size: 0.9rem; color: var(--text); }

.goal-bar {
  height: 8px;
  background: var(--chip-bg, #e2e8f0);
  border-radius: 8px;
  overflow: hidden;
}
.goal-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #10b981);
  border-radius: 8px;
  transition: width 0.5s ease;
}
.goal-progress-text {
  font-size: 0.75rem;
  color: var(--text-secondary, #94a3b8);
  text-align: right;
  margin-top: 0.2rem;
}

.goal-adjuster {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--chip-bg, #f8fafc);
  border-radius: 10px;
  margin-bottom: 1rem;
}
.adjuster-label { font-size: 0.85rem; color: var(--text-secondary, #64748b); }
.adjuster-controls { display: flex; align-items: center; gap: 0.75rem; }
.adj-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--chip-bg, #e2e8f0);
  background: var(--bg-card);
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
}
.adj-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.adj-value { font-size: 1.1rem; font-weight: 700; min-width: 2ch; text-align: center; color: var(--text); }

.encouragement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--chip-bg);
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--warning);
}
.enc-icon { font-size: 1.3rem; }

.unlock-list { display: flex; flex-direction: column; gap: 0.4rem; }
.unlock-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--text-secondary, #94a3b8);
}
.unlock-item.unlocked { color: var(--text); }
.unlock-icon { font-size: 0.9rem; }
.unlock-name { flex: 1; }
.unlock-bar {
  width: 60px;
  height: 4px;
  background: var(--chip-bg, #e2e8f0);
  border-radius: 4px;
  overflow: hidden;
}
.unlock-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
}
</style>

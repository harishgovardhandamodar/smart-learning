<template>
  <div class="guild-panel">
    <div v-if="!guild" class="guild-browse">
      <h3>{{ t('adaptive.joinGuild') }}</h3>
      <p class="guild-subtitle">{{ t('adaptive.guildSubtitle') }}</p>
      <div class="guild-list">
        <div v-for="g in availableGuilds" :key="g.id" class="guild-card"
          :style="{ '--guild-color': g.color }" @click="$emit('joinGuild', g.id)">
          <div class="guild-icon">{{ g.icon }}</div>
          <div class="guild-info">
            <div class="guild-name">{{ g.name }}</div>
            <div class="guild-challenge">{{ g.challenge }}</div>
          </div>
          <div class="guild-join">→</div>
        </div>
      </div>
    </div>

    <div v-else class="guild-active">
      <div class="guild-header" :style="{ '--guild-color': guild.color }">
        <div class="guild-icon-large">{{ guild.icon }}</div>
        <div>
          <h3>{{ guild.name }}</h3>
          <div class="guild-rank">{{ guild.rank }}</div>
        </div>
        <button class="btn-leave" @click="$emit('leaveGuild')">×</button>
      </div>

      <div class="guild-challenge-box">
        <div class="challenge-label">{{ t('adaptive.weeklyChallenge') }}</div>
        <div class="challenge-text">{{ guild.challenge }}</div>
        <div class="guild-contributions">
          <span class="contrib-count">{{ guild.contributions }}</span>
          <span class="contrib-label">{{ t('adaptive.contributions') }}</span>
        </div>
      </div>

      <div class="guild-ranks">
        <div v-for="rank in ranks" :key="rank.name" class="rank-item"
          :class="{ active: guild.rank === rank.name, locked: rank.order > currentRankOrder }">
          <span class="rank-icon">{{ rank.icon }}</span>
          <span class="rank-name">{{ rank.name }}</span>
          <span class="rank-req">{{ rank.req }}</span>
        </div>
      </div>

      <div class="ghost-race-section">
        <h4>{{ t('adaptive.ghostRacing') }}</h4>
        <p class="ghost-desc">{{ t('adaptive.ghostDesc') }}</p>
        <div v-if="personalBest" class="ghost-best">
          <span class="ghost-icon">👻</span>
          <span>Best: {{ formatTime(personalBest.timeMs) }} ({{ personalBest.score }}%)</span>
        </div>
      </div>

      <button class="btn-contribute" @click="$emit('contribute')">
        {{ t('adaptive.logContribution') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const t = inject('t')

defineProps({
  guild: Object,
  availableGuilds: Array,
  personalBest: Object,
})

defineEmits(['joinGuild', 'leaveGuild', 'contribute'])

const ranks = [
  { name: 'Initiate', icon: '🌱', req: '0 contributions', order: 0 },
  { name: 'Member', icon: '⚔️', req: '5 contributions', order: 1 },
  { name: 'Veteran', icon: '🛡️', req: '10 contributions', order: 2 },
  { name: 'Champion', icon: '🏆', req: '15 contributions', order: 3 },
  { name: 'Legend', icon: '👑', req: '20+ contributions', order: 4 },
]

const currentRankOrder = (guild) => ranks.find(r => r.name === guild?.rank)?.order || 0

function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
</script>

<style scoped>
.guild-panel {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.guild-panel h3 { margin: 0 0 0.25rem; font-size: 1.1rem; color: var(--text); }
.guild-subtitle { font-size: 0.85rem; color: var(--text-secondary, #64748b); margin: 0 0 1rem; }

.guild-list { display: flex; flex-direction: column; gap: 0.5rem; }

.guild-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--chip-bg, #f8fafc);
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.guild-card:hover { border-color: var(--guild-color); transform: translateX(4px); }

.guild-icon { font-size: 1.5rem; }
.guild-name { font-weight: 600; font-size: 0.9rem; color: var(--text); }
.guild-challenge { font-size: 0.75rem; color: var(--text-secondary, #64748b); }
.guild-join { margin-left: auto; font-size: 1.1rem; color: var(--text-secondary, #94a3b8); }

.guild-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--guild-color);
}
.guild-icon-large { font-size: 2rem; }
.guild-rank { font-size: 0.75rem; color: var(--guild-color); font-weight: 600; text-transform: uppercase; }
.btn-leave { margin-left: auto; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary, #94a3b8); }

.guild-challenge-box {
  background: var(--chip-bg, #f8fafc);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}
.challenge-label { font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary, #94a3b8); letter-spacing: 0.05em; }
.challenge-text { font-size: 0.95rem; font-weight: 600; color: var(--text); margin: 0.25rem 0 0.75rem; }
.contrib-count { font-size: 2rem; font-weight: 700; color: var(--primary); }
.contrib-label { display: block; font-size: 0.7rem; color: var(--text-secondary, #94a3b8); }

.guild-ranks { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
.rank-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  background: var(--chip-bg, #f1f5f9);
  color: var(--text-secondary, #94a3b8);
}
.rank-item.active { background: var(--primary); color: white; }
.rank-item.locked { opacity: 0.4; }
.rank-req { font-size: 0.65rem; opacity: 0.7; }

.ghost-race-section { margin-bottom: 1rem; }
.ghost-race-section h4 { font-size: 0.9rem; margin: 0 0 0.25rem; color: var(--text); }
.ghost-desc { font-size: 0.8rem; color: var(--text-secondary, #64748b); margin: 0 0 0.5rem; }
.ghost-best {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--chip-bg, #f8fafc);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text);
}

.btn-contribute {
  width: 100%;
  padding: 0.65rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-contribute:hover { opacity: 0.9; }
</style>

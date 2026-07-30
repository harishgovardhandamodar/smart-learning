<template>
  <div class="skill-tree">
    <div class="skill-tree-header">
      <h3>{{ t('adaptive.skillTree') }}</h3>
      <div class="xp-badge">⭐ {{ totalXp }} XP</div>
    </div>
    <div class="skill-grid">
      <div v-for="(node, id) in tree" :key="id"
        class="skill-node"
        :class="{ 'maxed': node.tier >= 4 }"
        :style="{ '--node-color': node.color }"
        @click="$emit('selectSkill', id)">
        <div class="node-icon">{{ node.icon }}</div>
        <div class="node-name">{{ node.name }}</div>
        <div class="node-tier">{{ node.tiers[node.tier] }}</div>
        <div class="node-bar">
          <div class="node-bar-fill" :style="{ width: xpPercent(node) + '%' }"></div>
        </div>
        <div class="node-xp">{{ node.xp }} / {{ node.nextThreshold }} XP</div>
        <div class="node-stars">
          <span v-for="s in 5" :key="s" :class="{ filled: s <= node.tier + 1 }">★</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'

const t = inject('t')

const props = defineProps({
  tree: { type: Object, required: true },
})

defineEmits(['selectSkill'])

const totalXp = computed(() => Object.values(props.tree).reduce((sum, n) => sum + n.xp, 0))

function xpPercent(node) {
  if (node.nextThreshold === 0) return 100
  const prevThreshold = node.tier > 0 ? [0, 50, 150, 350, 700][node.tier] : 0
  return Math.min(100, Math.round(((node.xp - prevThreshold) / (node.nextThreshold - prevThreshold)) * 100))
}
</script>

<style scoped>
.skill-tree {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.skill-tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.skill-tree-header h3 { margin: 0; font-size: 1.1rem; color: var(--text); }

.xp-badge {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.skill-node {
  background: var(--chip-bg, #f8fafc);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.skill-node::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--node-color);
  opacity: 0.6;
}

.skill-node:hover {
  border-color: var(--node-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.skill-node.maxed {
  border-color: var(--node-color);
  background: linear-gradient(135deg, color-mix(in srgb, var(--node-color) 8%, transparent), var(--chip-bg, #f8fafc));
}

.node-icon { font-size: 1.8rem; margin-bottom: 0.25rem; }
.node-name { font-weight: 600; font-size: 0.8rem; color: var(--text); margin-bottom: 0.15rem; }
.node-tier { font-size: 0.7rem; color: var(--node-color); font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }

.node-bar {
  height: 4px;
  background: var(--chip-bg, #e2e8f0);
  border-radius: 4px;
  margin: 0.4rem 0;
  overflow: hidden;
}

.node-bar-fill {
  height: 100%;
  background: var(--node-color);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.node-xp { font-size: 0.65rem; color: var(--text-secondary, #94a3b8); }

.node-stars {
  margin-top: 0.3rem;
  font-size: 0.7rem;
  color: #cbd5e1;
}

.node-stars .filled { color: #f59e0b; }
</style>

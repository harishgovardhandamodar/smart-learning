<template>
  <div class="adaptive-engine" v-if="kidId">
    <header class="engine-header">
      <h1>{{ t('adaptive.title') }}</h1>
      <div class="tab-bar">
        <button v-for="tab in tabs" :key="tab.id" class="tab" :class="{ active: activeTab === tab.id }" @click="onTabClick(tab)">
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>
    </header>

    <div class="engine-grid" v-if="activeTab === 'overview'">
      <GoalSetting :target="goals.weeklyTarget" :completed="goals.completedThisWeek"
        :encouragement="recommendation.encouragement" :unlockProgress="unlockProgress"
        @setTarget="setTarget" />
      <FocusTimer @sessionComplete="onSessionComplete" />
      <MasteryDashboard :metrics="metrics" :recommendation="recommendation" />
    </div>

    <div class="engine-grid" v-else-if="activeTab === 'skills'">
      <SkillTree :tree="skillTree" @selectSkill="selectedSkill = $event" />
      <div class="skill-detail" v-if="selectedSkill && skillTree[selectedSkill]">
        <h3>{{ skillTree[selectedSkill].icon }} {{ skillTree[selectedSkill].name }}</h3>
        <div class="skill-tier">Tier: {{ skillTree[selectedSkill].tiers[skillTree[selectedSkill].tier] }}</div>
        <div class="skill-xp-bar">
          <div class="skill-xp-fill" :style="{ width: xpPercent(skillTree[selectedSkill]) + '%', background: skillTree[selectedSkill].color }"></div>
        </div>
        <div class="skill-xp-text">{{ skillTree[selectedSkill].xp }} XP</div>
        <div class="skill-all-tiers">
          <div v-for="(tier, i) in skillTree[selectedSkill].tiers" :key="i" class="tier-step"
            :class="{ current: i === skillTree[selectedSkill].tier, done: i < skillTree[selectedSkill].tier }">
            <span class="tier-dot"></span>
            <span>{{ tier }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="engine-grid" v-else-if="activeTab === 'social'">
      <GuildPanel :guild="guild" :availableGuilds="availableGuilds" :personalBest="null"
        @joinGuild="joinGuild" @leaveGuild="leaveGuild" @contribute="onContribute" />
    </div>

    <div class="engine-grid" v-else-if="activeTab === 'mastery'">
      <MasteryDashboard :metrics="metrics" :recommendation="recommendation" />
    </div>
  </div>

  <div class="no-kid" v-else>
    <div class="no-kid-icon">🦊</div>
    <h2>{{ t('adaptive.selectKid') }}</h2>
    <p>{{ t('adaptive.selectKidDesc') }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import FocusTimer from '../components/FocusTimer.vue'
import SkillTree from '../components/SkillTree.vue'
import GuildPanel from '../components/GuildPanel.vue'
import GoalSetting from '../components/GoalSetting.vue'
import MasteryDashboard from '../components/MasteryDashboard.vue'
import {
  getGoals, setWeeklyTarget, recordGoalCompletion,
  getPomodoroState, recordPomodoroSession,
  getSkillTree, getSkillDefinitions,
  getGuild, getAvailableGuilds, joinGuild as joinGuildSvc, leaveGuild as leaveGuildSvc, contributeToGuild,
  getMasteryMetrics, getAdaptiveRecommendation, getUnlockProgress
} from '../services/adaptiveEngine'

const t = inject('t')
const router = useRouter()
const selectedKidId = inject('selectedKidId')
const kidId = computed(() => selectedKidId?.value)

const activeTab = ref('overview')
const selectedSkill = ref(null)

function onTabClick(tab) {
  if (tab.route) {
    router.push(tab.route)
  } else {
    activeTab.value = tab.id
  }
}

const tabs = computed(() => [
  { id: 'overview', icon: '🏠', label: t('adaptive.tabOverview') },
  { id: 'skills', icon: '🌳', label: t('adaptive.tabSkills') },
  { id: 'social', icon: '👥', label: t('adaptive.tabSocial') },
  { id: 'mastery', icon: '🏅', label: t('adaptive.tabMastery') },
  { id: 'physics', icon: '🔬', label: t('adaptive.tabPhysics'), route: '/engine/physics-week' },
])

const goals = ref({ weeklyTarget: 5, completedThisWeek: 0 })
const skillTree = ref({})
const guild = ref(null)
const availableGuilds = ref([])
const metrics = ref({})
const recommendation = ref({ encouragement: { icon: '🚀', text: '' }, suggestedFocusName: '', paceRecommendation: 'on-track' })
const unlockProgress = ref({})

function refresh() {
  if (!kidId.value) return
  goals.value = getGoals(kidId.value)
  skillTree.value = getSkillTree(kidId.value)
  guild.value = getGuild(kidId.value)
  availableGuilds.value = getAvailableGuilds()
  metrics.value = getMasteryMetrics(kidId.value)
  recommendation.value = getAdaptiveRecommendation(kidId.value)
  unlockProgress.value = getUnlockProgress(kidId.value)
}

function setTarget(val) {
  setWeeklyTarget(kidId.value, val)
  refresh()
}

function onSessionComplete({ minutes }) {
  recordPomodoroSession(kidId.value, minutes)
  recordGoalCompletion(kidId.value)
  refresh()
}

function joinGuild(guildId) {
  joinGuildSvc(kidId.value, guildId)
  refresh()
}

function leaveGuild() {
  leaveGuildSvc(kidId.value)
  refresh()
}

function onContribute() {
  contributeToGuild(kidId.value)
  refresh()
}

function xpPercent(node) {
  if (node.nextThreshold === 0) return 100
  const prevThreshold = node.tier > 0 ? [0, 50, 150, 350, 700][node.tier] : 0
  return Math.min(100, Math.round(((node.xp - prevThreshold) / (node.nextThreshold - prevThreshold)) * 100))
}

onMounted(refresh)
</script>

<style scoped>
.adaptive-engine {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
  animation: slide-up 0.4s ease;
}

.engine-header {
  margin-bottom: 1.5rem;
}

.engine-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 1rem;
}

.tab-bar {
  display: flex;
  gap: 0.25rem;
  background: var(--chip-bg, #f1f5f9);
  padding: 0.25rem;
  border-radius: 10px;
  overflow-x: auto;
}

.tab {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary, #64748b);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab.active {
  background: var(--bg-card);
  color: var(--text);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.engine-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.skill-detail {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.skill-detail h3 { margin: 0 0 0.5rem; color: var(--text); }
.skill-tier { font-size: 0.85rem; color: var(--text-secondary, #64748b); margin-bottom: 0.75rem; }

.skill-xp-bar {
  height: 6px;
  background: var(--chip-bg, #e2e8f0);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}
.skill-xp-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s;
}
.skill-xp-text { font-size: 0.75rem; color: var(--text-secondary, #94a3b8); margin-bottom: 1rem; }

.skill-all-tiers { display: flex; flex-direction: column; gap: 0.4rem; }
.tier-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary, #94a3b8);
  padding: 0.3rem 0;
}
.tier-step.done { color: #10b981; }
.tier-step.current { color: var(--primary); font-weight: 600; }
.tier-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--chip-bg, #e2e8f0);
}
.tier-step.done .tier-dot { background: #10b981; }
.tier-step.current .tier-dot { background: var(--primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 30%, transparent); }

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

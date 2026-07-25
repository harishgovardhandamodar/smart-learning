// ── Adaptive Learning Engine Service ──
// Manages: goals, skill trees, guilds, pomodoro state, mastery metrics, ghost racing

import { storage } from '../utils/storage'

const STORAGE_KEY = 'foxy_adaptive_engine'

function getState(kidId) {
  return storage.get(`${STORAGE_KEY}_${kidId}`, createDefault())
}

function saveState(kidId, state) {
  storage.set(`${STORAGE_KEY}_${kidId}`, state)
}

function createDefault() {
  return {
    goals: { weeklyTarget: 5, completedThisWeek: 0, weekStart: getWeekStart() },
    pomodoro: { sessionsCompleted: 0, totalFocusMinutes: 0, currentStreak: 0, bestStreak: 0 },
    skillTree: {},
    guild: null,
    ghostRacing: { personalBests: {}, communityAverages: {} },
    unlockedFeatures: ['goals', 'timer'],
    weeklyHistory: [],
    totalStats: { lessonsCompleted: 0, totalScore: 0, totalQuizzes: 0, focusHours: 0, certificatesEarned: 0 },
  }
}

function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(now.setDate(diff)).toISOString().split('T')[0]
}

// ── Goal Setting (Autonomy) ──

export function getGoals(kidId) {
  const state = getState(kidId)
  const now = getWeekStart()
  if (state.goals.weekStart !== now) {
    state.goals.weekStart = now
    state.goals.completedThisWeek = 0
    state.weeklyHistory.push({ week: state.goals.weekStart, completed: state.goals.completedThisWeek })
    saveState(kidId, state)
  }
  return state.goals
}

export function setWeeklyTarget(kidId, target) {
  const state = getState(kidId)
  state.goals.weeklyTarget = Math.max(1, Math.min(50, target))
  saveState(kidId, state)
  return state.goals
}

export function recordGoalCompletion(kidId) {
  const state = getState(kidId)
  state.goals.completedThisWeek++
  state.totalStats.lessonsCompleted++
  saveState(kidId, state)
  return state.goals
}

// ── Pomodoro Timer ──

export function getPomodoroState(kidId) {
  return getState(kidId).pomodoro
}

export function recordPomodoroSession(kidId, minutes) {
  const state = getState(kidId)
  state.pomodoro.sessionsCompleted++
  state.pomodoro.totalFocusMinutes += minutes
  state.pomodoro.currentStreak++
  if (state.pomodoro.currentStreak > state.pomodoro.bestStreak) {
    state.pomodoro.bestStreak = state.pomodoro.currentStreak
  }
  state.totalStats.focusHours = Math.round(state.pomodoro.totalFocusMinutes / 60 * 10) / 10
  saveState(kidId, state)
  return state.pomodoro
}

export function resetPomodoroStreak(kidId) {
  const state = getState(kidId)
  state.pomodoro.currentStreak = 0
  saveState(kidId, state)
}

// ── Skill Tree (Mastery Engine) ──

const SKILL_NODES = {
  'data-literacy': { name: 'Data Literacy', icon: '📊', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#6C5CE7' },
  'critical-thinking': { name: 'Critical Thinking', icon: '🧠', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#00B894' },
  'mathematical-reasoning': { name: 'Mathematical Reasoning', icon: '🧮', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#FDCB6E' },
  'scientific-method': { name: 'Scientific Method', icon: '🔬', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#E17055' },
  'communication': { name: 'Communication', icon: '💬', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#74B9FF' },
  'creative-design': { name: 'Creative Design', icon: '🎨', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#FD79A8' },
  'tech-engineering': { name: 'Tech & Engineering', icon: '⚙️', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#A29BFE' },
  'financial-literacy': { name: 'Financial Literacy', icon: '💰', tiers: ['Novice', 'Apprentice', 'Analyst', 'Expert', 'Master'], color: '#55EFC4' },
}

const SKILL_THRESHOLDS = [0, 50, 150, 350, 700]

export function getSkillTree(kidId) {
  const state = getState(kidId)
  const tree = {}
  for (const [id, def] of Object.entries(SKILL_NODES)) {
    const xp = state.skillTree[id] || 0
    let tier = 0
    for (let i = SKILL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= SKILL_THRESHOLDS[i]) { tier = i; break }
    }
    tree[id] = { ...def, id, xp, tier, maxXp: SKILL_THRESHOLDS[SKILL_THRESHOLDS.length - 1], nextThreshold: SKILL_THRESHOLDS[Math.min(tier + 1, SKILL_THRESHOLDS.length - 1)] }
  }
  return tree
}

export function awardSkillXp(kidId, skillId, amount) {
  const state = getState(kidId)
  if (!state.skillTree[skillId]) state.skillTree[skillId] = 0
  state.skillTree[skillId] += amount
  saveState(kidId, state)
  return getSkillTree(kidId)[skillId]
}

export function getSkillDefinitions() {
  return SKILL_NODES
}

// ── Guilds & Social ──

const GUILD_TEMPLATES = [
  { id: 'code-crushers', name: 'Code Crushers', icon: '💻', color: '#6C5CE7', challenge: 'Complete 10 coding lessons this week' },
  { id: 'data-detectives', name: 'Data Detectives', icon: '🔍', color: '#00B894', challenge: 'Analyze 5 real-world datasets' },
  { id: 'math-marvels', name: 'Math Marvels', icon: '🧮', color: '#FDCB6E', challenge: 'Solve 20 advanced math problems' },
  { id: 'science-squad', name: 'Science Squad', icon: '🔬', color: '#E17055', challenge: 'Complete 8 science experiments' },
  { id: 'creative-collective', name: 'Creative Collective', icon: '🎨', color: '#FD79A8', challenge: 'Build 3 creative projects' },
]

export function getAvailableGuilds() {
  return GUILD_TEMPLATES
}

export function getGuild(kidId) {
  return getState(kidId).guild
}

export function joinGuild(kidId, guildId) {
  const template = GUILD_TEMPLATES.find(g => g.id === guildId)
  if (!template) return null
  const state = getState(kidId)
  state.guild = { ...template, joinedAt: new Date().toISOString(), contributions: 0, rank: 'Initiate' }
  saveState(kidId, state)
  return state.guild
}

export function leaveGuild(kidId) {
  const state = getState(kidId)
  state.guild = null
  saveState(kidId, state)
}

export function contributeToGuild(kidId) {
  const state = getState(kidId)
  if (!state.guild) return null
  state.guild.contributions++
  const ranks = ['Initiate', 'Member', 'Veteran', 'Champion', 'Legend']
  state.guild.rank = ranks[Math.min(Math.floor(state.guild.contributions / 5), ranks.length - 1)]
  saveState(kidId, state)
  return state.guild
}

// ── Ghost Racing ──

export function recordGhostTime(kidId, lessonId, timeMs, score) {
  const state = getState(kidId)
  const current = state.ghostRacing.personalBests[lessonId]
  if (!current || score > current.score || (score === current.score && timeMs < current.timeMs)) {
    state.ghostRacing.personalBests[lessonId] = { timeMs, score, date: new Date().toISOString() }
    saveState(kidId, state)
  }
  return state.ghostRacing.personalBests[lessonId]
}

export function getGhostTime(kidId, lessonId) {
  return getState(kidId).ghostRacing.personalBests[lessonId] || null
}

// ── Feature Unlocks ──

const FEATURE_THRESHOLDS = {
  goals: 0,
  timer: 0,
  'skill-tree': 1,
  'guilds': 3,
  'ghost-racing': 5,
  'certificates': 10,
  'peer-review': 15,
}

export function getUnlockedFeatures(kidId) {
  const state = getState(kidId)
  const completed = state.totalStats.lessonsCompleted
  const unlocked = []
  for (const [feature, threshold] of Object.entries(FEATURE_THRESHOLDS)) {
    if (completed >= threshold) unlocked.push(feature)
  }
  return unlocked
}

export function getUnlockProgress(kidId) {
  const state = getState(kidId)
  const completed = state.totalStats.lessonsCompleted
  const features = {}
  for (const [feature, threshold] of Object.entries(FEATURE_THRESHOLDS)) {
    features[feature] = {
      unlocked: completed >= threshold,
      required: threshold,
      current: completed,
      percent: Math.min(100, Math.round((completed / Math.max(threshold, 1)) * 100)),
    }
  }
  return features
}

// ── Mastery Dashboard ──

export function getMasteryMetrics(kidId) {
  const state = getState(kidId)
  const tree = getSkillTree(kidId)
  const totalXp = Object.values(tree).reduce((sum, n) => sum + n.xp, 0)
  const maxTierSkills = Object.values(tree).filter(n => n.tier >= 4).length
  const avgTier = Object.values(tree).reduce((sum, n) => sum + n.tier, 0) / Object.keys(tree).length

  return {
    totalXp,
    averageTier: Math.round(avgTier * 10) / 10,
    masteredSkills: maxTierSkills,
    totalSkills: Object.keys(tree).length,
    ...state.totalStats,
    level: calculateLevel(totalXp),
    certificates: generateCertificates(tree, state.totalStats),
  }
}

function calculateLevel(totalXp) {
  const levels = [0, 100, 300, 600, 1000, 1600, 2500, 3500, 5000, 7000, 10000]
  let level = 1
  for (let i = 1; i < levels.length; i++) {
    if (totalXp >= levels[i]) level = i + 1
  }
  const currentThreshold = levels[Math.min(level - 1, levels.length - 1)]
  const nextThreshold = levels[Math.min(level, levels.length - 1)]
  return {
    current: level,
    currentXp: totalXp - currentThreshold,
    nextLevelXp: nextThreshold - currentThreshold,
    percent: Math.round(((totalXp - currentThreshold) / Math.max(nextThreshold - currentThreshold, 1)) * 100),
  }
}

function generateCertificates(tree, stats) {
  const certs = []
  if (stats.lessonsCompleted >= 5) certs.push({ id: 'first-steps', title: 'First Steps', icon: '🌟', description: 'Completed 5 lessons' })
  if (stats.lessonsCompleted >= 25) certs.push({ id: 'dedicated-learner', title: 'Dedicated Learner', icon: '📚', description: 'Completed 25 lessons' })
  if (stats.lessonsCompleted >= 50) certs.push({ id: 'knowledge-seeker', title: 'Knowledge Seeker', icon: '🎓', description: 'Completed 50 lessons' })
  if (stats.lessonsCompleted >= 100) certs.push({ id: 'learning-legend', title: 'Learning Legend', icon: '👑', description: 'Completed 100 lessons' })
  const maxTierSkills = Object.values(tree).filter(n => n.tier >= 3).length
  if (maxTierSkills >= 1) certs.push({ id: 'specialist', title: 'Specialist', icon: '🏅', description: 'Reached Expert tier in any skill' })
  if (maxTierSkills >= 3) certs.push({ id: 'polymath', title: 'Polymath', icon: '🏆', description: 'Reached Expert tier in 3+ skills' })
  if (stats.focusHours >= 10) certs.push({ id: 'focused-mind', title: 'Focused Mind', icon: '🧘', description: 'Logged 10+ hours of focused study' })
  if (stats.totalQuizzes >= 20) certs.push({ id: 'quiz-master', title: 'Quiz Master', icon: '⚡', description: 'Completed 20+ quizzes' })
  return certs
}

// ── Adaptive Difficulty ──

export function getAdaptiveRecommendation(kidId) {
  const state = getState(kidId)
  const tree = getSkillTree(kidId)
  const weakestSkill = Object.entries(tree).sort((a, b) => a[1].tier - b[1].tier || a[1].xp - b[1].xp)[0]
  const completed = state.totalStats.lessonsCompleted
  const goalProgress = state.goals.completedThisWeek / state.goals.weeklyTarget

  return {
    suggestedFocus: weakestSkill ? weakestSkill[0] : 'data-literacy',
    suggestedFocusName: weakestSkill ? weakestSkill[1].name : 'Data Literacy',
    paceRecommendation: goalProgress < 0.5 ? 'catch-up' : goalProgress > 0.8 ? 'ahead' : 'on-track',
    encouragement: getEncouragement(state),
  }
}

function getEncouragement(state) {
  const streak = state.pomodoro.currentStreak
  const goalPct = Math.round((state.goals.completedThisWeek / state.goals.weeklyTarget) * 100)
  if (streak >= 5) return { text: 'Incredible focus streak! You\'re on fire!', icon: '🔥' }
  if (goalPct >= 100) return { text: 'Weekly goal crushed! Time for a bonus challenge!', icon: '🎯' }
  if (goalPct >= 50) return { text: 'Halfway there! Keep the momentum going!', icon: '💪' }
  if (state.totalStats.lessonsCompleted === 0) return { text: 'Welcome! Start your first lesson to begin your journey!', icon: '🚀' }
  return { text: 'Every lesson counts. You\'re building something great!', icon: '⭐' }
}

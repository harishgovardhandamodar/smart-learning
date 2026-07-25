import { storage } from '../utils/storage'
import { getAllActivity, getActivityForKid, saveActivityForKid, removeKidActivity as removeActivity } from '../services/activity'

const STORAGE_KEY_PROFILES = 'foxy_kid_profiles'
const STORAGE_KEY_SELECTED = 'foxy_selected_kid'
const STORAGE_KEY_PARENT_PIN = 'foxy_parent_pin'

// ── Kid Profiles ──

export function getKids() {
  return storage.get(STORAGE_KEY_PROFILES, [])
}

export function saveKids(kids) {
  storage.set(STORAGE_KEY_PROFILES, kids)
}

export function addKid(name, birthYear) {
  const kids = getKids()
  const kid = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: name.trim(),
    birthYear: Number(birthYear),
    enrolledAt: new Date().toISOString(),
    avatar: getAvatarForAge(new Date().getFullYear() - Number(birthYear)),
  }
  kids.push(kid)
  saveKids(kids)
  setSelectedKid(kid.id)
  return kid
}

export function removeKid(kidId) {
  const kids = getKids().filter(k => k.id !== kidId)
  saveKids(kids)
  if (getSelectedKidId() === kidId) {
    setSelectedKid(kids.length > 0 ? kids[0].id : null)
  }
}

export function getSelectedKidId() {
  return storage.get(STORAGE_KEY_SELECTED, null)
}

export function getSelectedKid() {
  const id = getSelectedKidId()
  if (!id) return null
  return getKids().find(k => k.id === id) || null
}

export function setSelectedKid(kidId) {
  if (kidId) storage.set(STORAGE_KEY_SELECTED, kidId)
  else storage.remove(STORAGE_KEY_SELECTED)
}

function getAvatarForAge(age) {
  if (age < 8) return '🧒'
  if (age < 10) return '👦'
  if (age < 12) return '🧑'
  if (age < 14) return '👨'
  return '🧑‍🎓'
}

// ── Activity Tracking ──

export function trackMessage(kidId, topicId) {
  if (!kidId) return
  const act = getActivityForKid(kidId)
  act.messagesSent++
  const today = new Date().toISOString().split('T')[0]
  if (!act.chatHistory.some(c => c.date === today && c.topic === topicId)) {
    act.chatHistory.push({ date: today, topic: topicId, count: 0 })
  }
  const todayEntry = act.chatHistory.find(c => c.date === today && c.topic === topicId)
  if (todayEntry) todayEntry.count++
  saveActivityForKid(kidId, act)
}

export function trackQuizComplete(kidId, topicId, score, total, questions) {
  if (!kidId) return
  const act = getActivityForKid(kidId)
  act.quizzesCompleted++
  act.quizScores.push({
    date: new Date().toISOString(),
    topic: topicId,
    score,
    total,
    percentage: Math.round((score / total) * 100),
    questions: questions || [],
  })
  if (!act.topicsExplored.includes(topicId)) act.topicsExplored.push(topicId)
  saveActivityForKid(kidId, act)
}

export function trackTopicVisit(kidId, topicId) {
  if (!kidId) return
  const act = getActivityForKid(kidId)
  if (!act.topicsExplored.includes(topicId)) act.topicsExplored.push(topicId)
  saveActivityForKid(kidId, act)
}

export function trackFunFact(kidId) {
  if (!kidId) return
  const act = getActivityForKid(kidId)
  act.funFactsViewed++
  saveActivityForKid(kidId, act)
}

export function trackSessionStart(kidId) {
  if (!kidId) return
  const act = getActivityForKid(kidId)
  act.learningSessions.push({
    start: new Date().toISOString(),
    end: null,
  })
  saveActivityForKid(kidId, act)
}

export function trackSessionEnd(kidId) {
  if (!kidId) return
  const act = getActivityForKid(kidId)
  const last = act.learningSessions[act.learningSessions.length - 1]
  if (last && !last.end) {
    last.end = new Date().toISOString()
  }
  saveActivityForKid(kidId, act)
}

// ── Dashboard Metrics ──

export function getKidMetrics(kidId) {
  const kid = getKids().find(k => k.id === kidId)
  if (!kid) return null

  const act = getActivityForKid(kidId)
  const age = new Date().getFullYear() - kid.birthYear

  // Quiz analytics
  const quizScores = act.quizScores || []
  const avgScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((s, q) => s + q.percentage, 0) / quizScores.length)
    : 0

  const bestScore = quizScores.length > 0
    ? Math.max(...quizScores.map(q => q.percentage))
    : 0

  const worstScore = quizScores.length > 0
    ? Math.min(...quizScores.map(q => q.percentage))
    : 0

  // Topic breakdown
  const topicQuizScores = {}
  for (const q of quizScores) {
    if (!topicQuizScores[q.topic]) topicQuizScores[q.topic] = []
    topicQuizScores[q.topic].push(q.percentage)
  }

  const topicPerformance = Object.entries(topicQuizScores).map(([topic, scores]) => ({
    topic,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    count: scores.length,
    best: Math.max(...scores),
    trend: scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : 0,
  }))

  // Learning time
  const sessions = act.learningSessions || []
  const completedSessions = sessions.filter(s => s.start && s.end)
  const totalMinutes = completedSessions.reduce((sum, s) => {
    const ms = new Date(s.end) - new Date(s.start)
    return sum + ms / 60000
  }, 0)

  // Streak calculation
  const sessionDates = [...new Set(sessions.map(s => new Date(s.start).toISOString().split('T')[0]))].sort().reverse()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    if (sessionDates.includes(dateStr)) streak++
    else if (i > 0) break
  }

  // Weekly activity (last 7 days)
  const weeklyActivity = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en', { weekday: 'short' })
    const daySessions = sessions.filter(s => new Date(s.start).toISOString().split('T')[0] === dateStr)
    const dayMinutes = daySessions.reduce((sum, s) => {
      if (!s.end) return sum
      return sum + (new Date(s.end) - new Date(s.start)) / 60000
    }, 0)
    const dayQuizzes = quizScores.filter(q => q.date.split('T')[0] === dateStr).length
    const dayMessages = (act.chatHistory || []).filter(c => c.date === dateStr).reduce((s, c) => s + c.count, 0)
    weeklyActivity.push({ day: dayName, date: dateStr, minutes: Math.round(dayMinutes), quizzes: dayQuizzes, messages: dayMessages })
  }

  // Recent quizzes (last 5)
  const recentQuizzes = quizScores.slice(-5).reverse()

  // Score improvement
  const firstHalf = quizScores.slice(0, Math.floor(quizScores.length / 2))
  const secondHalf = quizScores.slice(Math.floor(quizScores.length / 2))
  const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((s, q) => s + q.percentage, 0) / firstHalf.length : 0
  const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((s, q) => s + q.percentage, 0) / secondHalf.length : 0
  const improvement = Math.round(secondAvg - firstAvg)

  return {
    kid,
    age,
    messagesSent: act.messagesSent,
    quizzesCompleted: act.quizzesCompleted,
    funFactsViewed: act.funFactsViewed,
    topicsExplored: act.topicsExplored.length,
    totalTopics: 4,
    avgScore,
    bestScore,
    worstScore,
    topicPerformance,
    totalMinutes: Math.round(totalMinutes),
    streak,
    weeklyActivity,
    recentQuizzes,
    improvement,
    level: act.quizzesCompleted < 3 ? 'Beginner 🌱' : act.quizzesCompleted < 10 ? 'Explorer 🗺️' : act.quizzesCompleted < 25 ? 'Achiever ⭐' : 'Champion 🏆',
  }
}

export function getAllKidMetrics() {
  return getKids().map(kid => getKidMetrics(kid.id)).filter(Boolean)
}

export function removeKidActivity(kidId) {
  removeActivity(kidId)
}

export function removeKidAndActivity(kidId) {
  removeKid(kidId)
  removeKidActivity(kidId)
}

// ── Parent PIN ──

function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + ch
    hash |= 0
  }
  return 'h_' + Math.abs(hash).toString(36)
}

export function hasParentPin() {
  return storage.has(STORAGE_KEY_PARENT_PIN)
}

export function setParentPin(pin) {
  storage.set(STORAGE_KEY_PARENT_PIN, simpleHash(pin))
}

export function verifyParentPin(pin) {
  const stored = storage.get(STORAGE_KEY_PARENT_PIN, null)
  if (!stored) return false
  return stored === simpleHash(pin)
}

export function removeParentPin() {
  storage.remove(STORAGE_KEY_PARENT_PIN)
}

// ── Family Aggregate Stats ──

export function getFamilyStats() {
  const kids = getKids()
  if (kids.length === 0) return null

  const allMetrics = kids.map(k => getKidMetrics(k.id)).filter(Boolean)

  const totalMessages = allMetrics.reduce((s, m) => s + m.messagesSent, 0)
  const totalQuizzes = allMetrics.reduce((s, m) => s + m.quizzesCompleted, 0)
  const totalTime = allMetrics.reduce((s, m) => s + m.totalMinutes, 0)
  const totalFacts = allMetrics.reduce((s, m) => s + m.funFactsViewed, 0)

  const allQuizScores = allMetrics.flatMap(m => {
    const kid = m.kid
    const act = getActivityForKid(kid.id)
    return (act.quizScores || []).map(q => ({ ...q, kidName: kid.name, kidAvatar: kid.avatar }))
  })

  // Focused learning stats per kid (inline to avoid circular imports)
  let totalFocusLessons = 0
  let totalFocusQuizScore = 0
  let focusQuizCount = 0
  let totalFocusPathsStarted = 0

  const allFocusProg = storage.get('foxy_focus_progress', {})

  for (const m of allMetrics) {
    const kidProg = allFocusProg[m.kid.id] || {}
    for (const pathId of Object.keys(kidProg)) {
      const prog = kidProg[pathId]
      totalFocusPathsStarted++
      totalFocusLessons += (prog.completedLessons || []).length
      for (const idx of Object.keys(prog.quizScores || {})) {
        totalFocusQuizScore += prog.quizScores[idx]
        focusQuizCount++
      }
    }
  }

  const familyAvg = allQuizScores.length > 0
    ? Math.round(allQuizScores.reduce((s, q) => s + q.percentage, 0) / allQuizScores.length)
    : 0

  const allSessionDates = []
  for (const m of allMetrics) {
    const act = getActivityForKid(m.kid.id)
    for (const s of (act.learningSessions || [])) {
      if (s.start) allSessionDates.push(new Date(s.start).toISOString().split('T')[0])
    }
  }
  const uniqueDates = [...new Set(allSessionDates)].sort().reverse()
  let familyStreak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    if (uniqueDates.includes(dateStr)) familyStreak++
    else if (i > 0) break
  }

  // Top quiz performer
  const kidAvgs = allMetrics.filter(m => m.quizzesCompleted > 0).map(m => ({
    name: m.kid.name,
    avatar: m.kid.avatar,
    avg: m.avgScore,
    quizzes: m.quizzesCompleted,
  }))
  const topPerformer = kidAvgs.length > 0 ? kidAvgs.reduce((best, k) => k.avg > best.avg ? k : best) : null

  // Weekly activity combined
  const weeklyActivity = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en', { weekday: 'short' })
    let dayQuizzes = 0
    let dayMessages = 0
    let dayMinutes = 0
    for (const m of allMetrics) {
      const dayData = m.weeklyActivity.find(w => w.date === dateStr)
      if (dayData) {
        dayQuizzes += dayData.quizzes
        dayMessages += dayData.messages
        dayMinutes += dayData.minutes
      }
    }
    weeklyActivity.push({ day: dayName, date: dateStr, minutes: dayMinutes, quizzes: dayQuizzes, messages: dayMessages })
  }

  // Recent quizzes across all kids
  const recentQuizzes = allQuizScores
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)

  // Topics explored across family
  const allTopics = new Set()
  for (const m of allMetrics) {
    const act = getActivityForKid(m.kid.id)
    for (const t of act.topicsExplored) allTopics.add(t)
  }

  return {
    kidCount: kids.length,
    kids: allMetrics,
    totalMessages,
    totalQuizzes,
    totalTime,
    totalFacts,
    familyAvg,
    familyStreak,
    topPerformer,
    weeklyActivity,
    recentQuizzes,
    topicsExplored: allTopics.size,
    totalTopics: 4,
    totalFocusLessons,
    totalFocusPathsStarted,
    averageFocusQuizScore: focusQuizCount > 0 ? Math.round(totalFocusQuizScore / focusQuizCount) : 0,
  }
}

// Pre-generate progress data for the Charts, Graphs & Analysis path
// Writes to localStorage so the path is instantly ready on load

import { storage } from '../utils/storage'
import { CHARTS_PATH } from './learningPaths'

const STORAGE_KEY = 'foxy_focus_progress'
const PREGEN_KEY = 'foxy_charts_pregenerated'

function generateQuizScores(lessonCount) {
  const scores = {}
  const baseScores = [85, 90, 80, 95, 88, 75, 92, 87, 90, 85, 88]
  for (let i = 0; i < lessonCount; i++) {
    scores[i] = baseScores[i] || 80 + Math.floor(Math.random() * 15)
  }
  return scores
}

function generateSpacedRepetition(lessonCount) {
  const lastReviewed = {}
  const nextReview = {}
  const now = Date.now()
  const day = 86400000

  for (let i = 0; i < lessonCount; i++) {
    const offset = (lessonCount - i) * day * 2
    lastReviewed[i] = new Date(now - offset).toISOString()
    nextReview[i] = new Date(now + (i + 1) * day * 3).toISOString()
  }

  return { lastReviewed, nextReview }
}

export function preGenerateChartsProgress(kidId) {
  if (!kidId) return
  if (storage.get(PREGEN_KEY, null) === kidId) return

  const all = storage.get(STORAGE_KEY, {})

  if (!all[kidId]) all[kidId] = {}

  const lessonCount = CHARTS_PATH.lessons.length
  const quizScores = generateQuizScores(lessonCount)
  const { lastReviewed, nextReview } = generateSpacedRepetition(lessonCount)

  const baseTime = new Date()
  baseTime.setDate(baseTime.getDate() - lessonCount * 2)

  all[kidId][CHARTS_PATH.id] = {
    startedAt: baseTime.toISOString(),
    completedLessons: Array.from({ length: lessonCount }, (_, i) => i),
    quizScores,
    currentLesson: lessonCount,
    lastReviewed,
    nextReview,
  }

  storage.set(STORAGE_KEY, all)
  storage.set(PREGEN_KEY, kidId)
}

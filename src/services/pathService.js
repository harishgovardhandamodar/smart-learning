// ── Learning Path Service: Progress, Custom Paths, Lookup ──

import { storage } from '../utils/storage'
import { BUILT_IN_PATHS } from '../data/learningPaths'

const STORAGE_KEY_PROGRESS = 'foxy_focus_progress'
const STORAGE_KEY_CUSTOM_PATHS = 'foxy_custom_paths'

// ── Custom Paths (Parent-Created) ──

export function getCustomPaths() {
  return storage.get(STORAGE_KEY_CUSTOM_PATHS, [])
}

export function saveCustomPaths(paths) {
  storage.set(STORAGE_KEY_CUSTOM_PATHS, paths)
}

export function addCustomPath(path) {
  const paths = getCustomPaths()
  const newPath = {
    id: 'custom-' + Date.now().toString(36),
    icon: path.icon || '📚',
    category: path.category || 'custom',
    difficulty: path.difficulty || 'beginner',
    estimatedHours: path.estimatedHours || 2,
    title: path.title,
    subtitle: path.subtitle || { en: '', nl: '' },
    description: path.description || { en: '', nl: '' },
    isCustom: true,
    createdAt: new Date().toISOString(),
    mindMap: path.mindMap || { nodes: [], connections: [] },
    lessons: path.lessons || []
  }
  paths.push(newPath)
  saveCustomPaths(paths)
  return newPath
}

export function removeCustomPath(pathId) {
  const paths = getCustomPaths().filter(p => p.id !== pathId)
  saveCustomPaths(paths)
}

export function updateCustomPath(pathId, updates) {
  const paths = getCustomPaths()
  const idx = paths.findIndex(p => p.id === pathId)
  if (idx !== -1) {
    paths[idx] = { ...paths[idx], ...updates }
    saveCustomPaths(paths)
  }
}

// ── All Paths (Built-in + Custom) ──

export function getAllPaths() {
  return [...BUILT_IN_PATHS, ...getCustomPaths()]
}

export function getPathById(pathId) {
  return getAllPaths().find(p => p.id === pathId) || null
}

// ── Progress Tracking ──

function getAllProgress() {
  return storage.get(STORAGE_KEY_PROGRESS, {})
}

function saveAllProgress(data) {
  storage.set(STORAGE_KEY_PROGRESS, data)
}

function getProgressForKid(kidId) {
  const all = getAllProgress()
  if (!all[kidId]) {
    all[kidId] = {}
    saveAllProgress(all)
  }
  return all[kidId]
}

export function getPathProgress(kidId, pathId) {
  const kidProg = getProgressForKid(kidId)
  if (!kidProg[pathId]) {
    kidProg[pathId] = {
      startedAt: new Date().toISOString(),
      completedLessons: [],
      quizScores: {},
      currentLesson: 0,
      lastReviewed: {},
      nextReview: {},
    }
    saveAllProgress(kidProg)
  }
  return kidProg[pathId]
}

export function completeLesson(kidId, pathId, lessonIndex, score) {
  const all = getAllProgress()
  if (!all[kidId]) all[kidId] = {}
  const kidProg = all[kidId]
  if (!kidProg[pathId]) {
    kidProg[pathId] = {
      startedAt: new Date().toISOString(),
      completedLessons: [],
      quizScores: {},
      currentLesson: 0,
      lastReviewed: {},
      nextReview: {},
    }
  }
  const prog = kidProg[pathId]
  if (!prog.completedLessons.includes(lessonIndex)) {
    prog.completedLessons.push(lessonIndex)
  }
  prog.quizScores[lessonIndex] = score
  if (lessonIndex >= prog.currentLesson) {
    prog.currentLesson = lessonIndex + 1
  }
  const lessonId = getPathById(pathId)?.lessons[lessonIndex]?.id
  if (lessonId) {
    prog.lastReviewed[lessonId] = new Date().toISOString()
    const intervals = [1, 3, 7, 14, 30]
    const reviewCount = Object.keys(prog.lastReviewed).filter(k => k === lessonId).length
    const nextInterval = intervals[Math.min(reviewCount, intervals.length - 1)]
    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + nextInterval)
    prog.nextReview[lessonId] = nextDate.toISOString()
  }
  saveAllProgress(all)
  return prog
}

export function getPathCompletionPercent(kidId, pathId) {
  const path = getPathById(pathId)
  const prog = getPathProgress(kidId, pathId)
  if (!path || !path.lessons || path.lessons.length === 0) return 0
  return Math.round((prog.completedLessons.length / path.lessons.length) * 100)
}

export function getLessonsDueForReview(kidId) {
  const allProg = getProgressForKid(kidId)
  const now = new Date()
  const due = []
  for (const pathId of Object.keys(allProg)) {
    const path = getPathById(pathId)
    if (!path) continue
    const prog = allProg[pathId]
    for (const lessonId of Object.keys(prog.nextReview || {})) {
      if (new Date(prog.nextReview[lessonId]) <= now) {
        const lesson = path.lessons.find(l => l.id === lessonId)
        if (lesson) {
          const lessonIndex = path.lessons.indexOf(lesson)
          due.push({ pathId, path, lesson, lessonIndex })
        }
      }
    }
  }
  return due
}

export function getKidFocusStats(kidId) {
  const allProg = getProgressForKid(kidId)
  let totalLessonsCompleted = 0
  let totalQuizScore = 0
  let quizCount = 0
  let pathsStarted = 0
  let pathsCompleted = 0

  for (const pathId of Object.keys(allProg)) {
    const path = getPathById(pathId)
    if (!path) continue
    const prog = allProg[pathId]
    pathsStarted++
    totalLessonsCompleted += prog.completedLessons.length
    for (const idx of Object.keys(prog.quizScores || {})) {
      totalQuizScore += prog.quizScores[idx]
      quizCount++
    }
    if (prog.completedLessons.length === path.lessons.length && path.lessons.length > 0) {
      pathsCompleted++
    }
  }

  return {
    pathsStarted,
    pathsCompleted,
    totalLessonsCompleted,
    averageQuizScore: quizCount > 0 ? Math.round(totalQuizScore / quizCount) : 0,
    dueForReview: getLessonsDueForReview(kidId).length,
  }
}

export function removeKidFocusProgress(kidId) {
  const all = getAllProgress()
  delete all[kidId]
  saveAllProgress(all)
}

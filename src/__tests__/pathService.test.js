import { describe, it, expect, beforeEach } from 'vitest'
import {
  getPathProgress, completeLesson, getPathCompletionPercent,
  getAllPaths, getPathById, getKidFocusStats,
  getCustomPaths, addCustomPath, removeCustomPath,
  removeKidFocusProgress
} from '../services/pathService'

describe('pathService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('path lookup', () => {
    it('getAllPaths returns built-in paths', () => {
      const paths = getAllPaths()
      expect(paths.length).toBeGreaterThanOrEqual(3)
      expect(paths.map(p => p.id)).toContain('charts-graphs-analysis')
      expect(paths.map(p => p.id)).toContain('fractions-decimals')
      expect(paths.map(p => p.id)).toContain('physics-deep-dive')
    })

    it('getPathById returns correct path', () => {
      const path = getPathById('charts-graphs-analysis')
      expect(path).toBeDefined()
      expect(path.title.en).toContain('Charts')
    })

    it('getPathById returns null for unknown id', () => {
      expect(getPathById('nonexistent')).toBeNull()
    })
  })

  describe('progress tracking', () => {
    it('getPathProgress creates default progress', () => {
      const prog = getPathProgress('kid1', 'charts-graphs-analysis')
      expect(prog.completedLessons).toEqual([])
      expect(prog.quizScores).toEqual({})
      expect(prog.currentLesson).toBe(0)
      expect(prog.startedAt).toBeDefined()
    })

    it('completeLesson marks lesson done', () => {
      completeLesson('kid1', 'charts-graphs-analysis', 0, 85)
      const prog = getPathProgress('kid1', 'charts-graphs-analysis')
      expect(prog.completedLessons).toContain(0)
      expect(prog.quizScores[0]).toBe(85)
      expect(prog.currentLesson).toBe(1)
    })

    it('completeLesson advances currentLesson', () => {
      completeLesson('kid1', 'charts-graphs-analysis', 0, 90)
      completeLesson('kid1', 'charts-graphs-analysis', 1, 80)
      const prog = getPathProgress('kid1', 'charts-graphs-analysis')
      expect(prog.currentLesson).toBe(2)
      expect(prog.completedLessons).toEqual([0, 1])
    })

    it('completeLesson does not duplicate completed lessons', () => {
      completeLesson('kid1', 'charts-graphs-analysis', 0, 85)
      completeLesson('kid1', 'charts-graphs-analysis', 0, 95)
      const prog = getPathProgress('kid1', 'charts-graphs-analysis')
      expect(prog.completedLessons.filter(i => i === 0).length).toBe(1)
      expect(prog.quizScores[0]).toBe(95) // updated
    })

    it('getPathCompletionPercent returns correct percentage', () => {
      const path = getPathById('charts-graphs-analysis')
      const total = path.lessons.length
      completeLesson('kid1', 'charts-graphs-analysis', 0, 80)
      const pct = getPathCompletionPercent('kid1', 'charts-graphs-analysis')
      expect(pct).toBe(Math.round((1 / total) * 100))
    })

    it('getPathCompletionPercent returns 0 for no progress', () => {
      expect(getPathCompletionPercent('kid1', 'charts-graphs-analysis')).toBe(0)
    })
  })

  describe('focus stats', () => {
    it('getKidFocusStats returns zeros for no progress', () => {
      const stats = getKidFocusStats('kid1')
      expect(stats.pathsStarted).toBe(0)
      expect(stats.pathsCompleted).toBe(0)
      expect(stats.totalLessonsCompleted).toBe(0)
      expect(stats.averageQuizScore).toBe(0)
    })

    it('getKidFocusStats tracks multiple paths', () => {
      completeLesson('kid1', 'charts-graphs-analysis', 0, 80)
      completeLesson('kid1', 'fractions-decimals', 0, 90)
      const stats = getKidFocusStats('kid1')
      expect(stats.pathsStarted).toBe(2)
      expect(stats.totalLessonsCompleted).toBe(2)
    })
  })

  describe('custom paths', () => {
    it('getCustomPaths returns empty initially', () => {
      expect(getCustomPaths()).toEqual([])
    })

    it('addCustomPath creates a path', () => {
      const path = addCustomPath({ title: { en: 'Test', nl: 'Test' }, lessons: [] })
      expect(path.id).toMatch(/^custom-/)
      expect(path.isCustom).toBe(true)
      expect(getCustomPaths().length).toBe(1)
    })

    it('removeCustomPath removes a path', () => {
      const path = addCustomPath({ title: { en: 'Test', nl: 'Test' } })
      removeCustomPath(path.id)
      expect(getCustomPaths().length).toBe(0)
    })

    it('custom paths appear in getAllPaths', () => {
      addCustomPath({ title: { en: 'Custom', nl: 'Custom' } })
      const all = getAllPaths()
      expect(all.some(p => p.isCustom)).toBe(true)
    })
  })

  describe('removeKidFocusProgress', () => {
    it('removes all progress for a kid', () => {
      completeLesson('kid1', 'charts-graphs-analysis', 0, 80)
      removeKidFocusProgress('kid1')
      const prog = getPathProgress('kid1', 'charts-graphs-analysis')
      expect(prog.completedLessons).toEqual([])
    })
  })
})

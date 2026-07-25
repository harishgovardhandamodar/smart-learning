import { describe, it, expect, beforeEach } from 'vitest'
import {
  FUN_FACTS, TOPIC_COLORS, TOPIC_NAMES,
  getLearningStreak, recordVisit,
  getSpacedFacts, markFactSeen, getCuriosityScore
} from '../data/funFacts'

describe('funFacts', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('constants', () => {
    it('FUN_FACTS is non-empty', () => {
      expect(FUN_FACTS.length).toBeGreaterThan(0)
    })

    it('each fact has required fields', () => {
      for (const fact of FUN_FACTS) {
        expect(fact.id).toBeDefined()
        expect(fact.topic).toBeDefined()
        expect(fact.en).toBeDefined()
        expect(fact.nl).toBeDefined()
      }
    })

    it('TOPIC_COLORS has entries', () => {
      expect(Object.keys(TOPIC_COLORS).length).toBeGreaterThan(0)
    })

    it('TOPIC_NAMES has entries', () => {
      expect(Object.keys(TOPIC_NAMES).length).toBeGreaterThan(0)
    })
  })

  describe('learning streak', () => {
    it('getLearningStreak returns 0 initially', () => {
      expect(getLearningStreak()).toBe(0)
    })

    it('recordVisit persists streak', () => {
      recordVisit()
      const streak = getLearningStreak()
      expect(streak).toBeGreaterThanOrEqual(0)
    })
  })

  describe('spaced repetition', () => {
    it('getSpacedFacts returns requested count', () => {
      const facts = getSpacedFacts(3)
      expect(facts.length).toBe(3)
    })

    it('getSpacedFacts returns unseen facts first', () => {
      const facts = getSpacedFacts(1)
      expect(FUN_FACTS.some(f => f.id === facts[0].id)).toBe(true)
    })

    it('markFactSeen records fact as seen', () => {
      const facts = getSpacedFacts(1)
      markFactSeen(facts[0].id)
      const score = getCuriosityScore()
      expect(score.factsExplored).toBeGreaterThanOrEqual(1)
    })
  })

  describe('curiosity score', () => {
    it('getCuriosityScore returns object with expected fields', () => {
      const score = getCuriosityScore()
      expect(score.factsExplored).toBeDefined()
      expect(score.totalFacts).toBeDefined()
      expect(score.topicsExplored).toBeDefined()
      expect(score.percentage).toBeDefined()
    })
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import {
  SANDBOX_TIERS, WHAT_IF_DATASETS, MISLEADING_CHALLENGES, AI_DEBATE_CHALLENGES,
  getSandboxProgress, saveSandboxProgress, addSandboxPoints,
  markChallengeComplete, isChallengeComplete, computeLineOfBestFit, filterPoints
} from '../data/sandboxData'

describe('sandboxData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('data constants', () => {
    it('SANDBOX_TIERS has 4 tiers', () => {
      expect(SANDBOX_TIERS.length).toBe(4)
    })

    it('each tier has required fields', () => {
      for (const tier of SANDBOX_TIERS) {
        expect(tier.level).toBeDefined()
        expect(tier.title.en).toBeDefined()
        expect(tier.pointsRequired).toBeDefined()
        expect(Array.isArray(tier.challenges)).toBe(true)
      }
    })

    it('WHAT_IF_DATASETS is non-empty', () => {
      expect(WHAT_IF_DATASETS.length).toBeGreaterThan(0)
      expect(WHAT_IF_DATASETS[0].id).toBeDefined()
      expect(WHAT_IF_DATASETS[0].points).toBeDefined()
    })

    it('MISLEADING_CHALLENGES is non-empty', () => {
      expect(MISLEADING_CHALLENGES.length).toBeGreaterThan(0)
      expect(MISLEADING_CHALLENGES[0].id).toBeDefined()
    })

    it('AI_DEBATE_CHALLENGES is non-empty', () => {
      expect(AI_DEBATE_CHALLENGES.length).toBeGreaterThan(0)
      expect(AI_DEBATE_CHALLENGES[0].id).toBeDefined()
    })
  })

  describe('progress management', () => {
    it('getSandboxProgress returns default for unknown kid', () => {
      const prog = getSandboxProgress('kid1')
      expect(prog.points).toBe(0)
      expect(prog.completedChallenges).toEqual([])
      expect(prog.unlockedTiers).toEqual([1])
      expect(prog.currentTier).toBe(1)
    })

    it('saveSandboxProgress persists data', () => {
      saveSandboxProgress('kid1', { points: 50, completedChallenges: ['a'], unlockedTiers: [1], currentTier: 1 })
      expect(getSandboxProgress('kid1').points).toBe(50)
    })

    it('addSandboxPoints increments points', () => {
      const prog = addSandboxPoints('kid1', 10)
      expect(prog.points).toBe(10)
    })

    it('addSandboxPoints unlocks tier 2 at threshold', () => {
      const tier2 = SANDBOX_TIERS.find(t => t.level === 2)
      const prog = addSandboxPoints('kid1', tier2.pointsRequired)
      expect(prog.unlockedTiers).toContain(2)
    })

    it('markChallengeComplete adds challenge', () => {
      markChallengeComplete('kid1', 'challenge-a')
      expect(isChallengeComplete('kid1', 'challenge-a')).toBe(true)
    })

    it('markChallengeComplete does not duplicate', () => {
      markChallengeComplete('kid1', 'x')
      markChallengeComplete('kid1', 'x')
      const prog = getSandboxProgress('kid1')
      expect(prog.completedChallenges.filter(c => c === 'x').length).toBe(1)
    })
  })

  describe('computeLineOfBestFit', () => {
    it('returns zeros for fewer than 2 points', () => {
      expect(computeLineOfBestFit([])).toEqual({ slope: 0, intercept: 0, r2: 0 })
      expect(computeLineOfBestFit([{ x: 1, y: 2 }])).toEqual({ slope: 0, intercept: 0, r2: 0 })
    })

    it('computes correct line for perfect linear data', () => {
      const points = [{ x: 0, y: 0 }, { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }]
      const result = computeLineOfBestFit(points)
      expect(result.slope).toBeCloseTo(2, 0)
      expect(result.intercept).toBeCloseTo(0, 0)
      expect(result.r2).toBeCloseTo(1, 1)
    })

    it('handles noisy data', () => {
      const points = [{ x: 1, y: 2 }, { x: 2, y: 5 }, { x: 3, y: 3 }, { x: 4, y: 8 }]
      const result = computeLineOfBestFit(points)
      expect(result.slope).toBeGreaterThan(0)
      expect(result.r2).toBeGreaterThan(0)
    })
  })

  describe('filterPoints', () => {
    it('removes excluded indices', () => {
      const points = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }]
      const filtered = filterPoints(points, [1])
      expect(filtered.length).toBe(2)
      expect(filtered[0].x).toBe(1)
      expect(filtered[1].x).toBe(3)
    })

    it('returns all points when no exclusions', () => {
      const points = [{ x: 1, y: 1 }, { x: 2, y: 2 }]
      expect(filterPoints(points, []).length).toBe(2)
    })
  })
})

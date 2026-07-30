import { describe, it, expect, beforeEach } from 'vitest'
import {
  getGoals, setWeeklyTarget, recordGoalCompletion,
  getPomodoroState, recordPomodoroSession, resetPomodoroStreak,
  getSkillTree, awardSkillXp, getSkillDefinitions,
  getAvailableGuilds, getGuild, joinGuild, leaveGuild, contributeToGuild,
  recordGhostTime, getGhostTime,
  getUnlockedFeatures, getUnlockProgress,
  getMasteryMetrics, getAdaptiveRecommendation
} from '../services/adaptiveEngine'

describe('adaptiveEngine', () => {
  beforeEach(() => { localStorage.clear() })

  describe('goals', () => {
    it('getGoals returns defaults', () => {
      const g = getGoals('k1')
      expect(g.weeklyTarget).toBe(5)
      expect(g.completedThisWeek).toBe(0)
    })

    it('setWeeklyTarget clamps 1-50', () => {
      setWeeklyTarget('k1', 100)
      expect(getGoals('k1').weeklyTarget).toBe(50)
      setWeeklyTarget('k1', 0)
      expect(getGoals('k1').weeklyTarget).toBe(1)
    })

    it('recordGoalCompletion increments', () => {
      recordGoalCompletion('k1')
      expect(getGoals('k1').completedThisWeek).toBe(1)
    })
  })

  describe('pomodoro', () => {
    it('getPomodoroState returns defaults', () => {
      const p = getPomodoroState('k1')
      expect(p.sessionsCompleted).toBe(0)
      expect(p.totalFocusMinutes).toBe(0)
    })

    it('recordPomodoroSession increments', () => {
      recordPomodoroSession('k1', 25)
      const p = getPomodoroState('k1')
      expect(p.sessionsCompleted).toBe(1)
      expect(p.totalFocusMinutes).toBe(25)
      expect(p.currentStreak).toBe(1)
      expect(p.bestStreak).toBe(1)
    })

    it('resetPomodoroStreak resets current only', () => {
      recordPomodoroSession('k1', 25)
      resetPomodoroStreak('k1')
      const p = getPomodoroState('k1')
      expect(p.currentStreak).toBe(0)
      expect(p.bestStreak).toBe(1)
    })
  })

  describe('skill tree', () => {
    it('getSkillTree returns all skills', () => {
      const tree = getSkillTree('k1')
      expect(Object.keys(tree).length).toBe(8)
      expect(tree['data-literacy']).toBeDefined()
    })

    it('each node has tier/xp/name', () => {
      const tree = getSkillTree('k1')
      for (const node of Object.values(tree)) {
        expect(node.name).toBeDefined()
        expect(node.icon).toBeDefined()
        expect(node.tier).toBe(0)
        expect(node.xp).toBe(0)
      }
    })

    it('awardSkillXp increases xp and tier', () => {
      awardSkillXp('k1', 'data-literacy', 60)
      const tree = getSkillTree('k1')
      expect(tree['data-literacy'].xp).toBe(60)
      expect(tree['data-literacy'].tier).toBe(1)
    })

    it('getSkillDefinitions returns 8 skills', () => {
      expect(Object.keys(getSkillDefinitions()).length).toBe(8)
    })
  })

  describe('guilds', () => {
    it('getAvailableGuilds returns 5', () => {
      expect(getAvailableGuilds().length).toBe(5)
    })

    it('getGuild returns null initially', () => {
      expect(getGuild('k1')).toBeNull()
    })

    it('joinGuild sets guild', () => {
      const g = joinGuild('k1', 'code-crushers')
      expect(g.name).toBe('Code Crushers')
      expect(g.rank).toBe('Initiate')
    })

    it('leaveGuild clears guild', () => {
      joinGuild('k1', 'code-crushers')
      leaveGuild('k1')
      expect(getGuild('k1')).toBeNull()
    })

    it('contributeToGuild increments and ranks up', () => {
      joinGuild('k1', 'data-detectives')
      for (let i = 0; i < 6; i++) contributeToGuild('k1')
      expect(getGuild('k1').rank).toBe('Member')
    })
  })

  describe('ghost racing', () => {
    it('getGhostTime returns null initially', () => {
      expect(getGhostTime('k1', 'lesson-1')).toBeNull()
    })

    it('recordGhostTime stores best', () => {
      recordGhostTime('k1', 'lesson-1', 120000, 85)
      const best = getGhostTime('k1', 'lesson-1')
      expect(best.timeMs).toBe(120000)
      expect(best.score).toBe(85)
    })

    it('recordGhostTime only updates on better score', () => {
      recordGhostTime('k1', 'lesson-1', 120000, 85)
      recordGhostTime('k1', 'lesson-1', 100000, 80)
      expect(getGhostTime('k1', 'lesson-1').score).toBe(85)
    })
  })

  describe('feature unlocks', () => {
    it('initially unlocks goals and timer', () => {
      expect(getUnlockedFeatures('k1')).toContain('goals')
      expect(getUnlockedFeatures('k1')).toContain('timer')
    })

    it('unlocks skill-tree at 1 lesson', () => {
      for (let i = 0; i < 1; i++) recordGoalCompletion('k1')
      expect(getUnlockedFeatures('k1')).toContain('skill-tree')
    })

    it('unlockProgress has all features', () => {
      const up = getUnlockProgress('k1')
      expect(up.goals).toBeDefined()
      expect(up.timer).toBeDefined()
      expect(up.guilds).toBeDefined()
    })
  })

  describe('mastery metrics', () => {
    it('returns default metrics', () => {
      const m = getMasteryMetrics('k1')
      expect(m.totalXp).toBe(0)
      expect(m.level).toBeDefined()
      expect(m.level.current).toBe(1)
      expect(m.certificates).toBeDefined()
    })

    it('level increases with xp', () => {
      awardSkillXp('k1', 'data-literacy', 150)
      const m = getMasteryMetrics('k1')
      expect(m.level.current).toBeGreaterThan(1)
    })
  })

  describe('adaptive recommendation', () => {
    it('returns recommendation with expected fields', () => {
      const r = getAdaptiveRecommendation('k1')
      expect(r.suggestedFocus).toBeDefined()
      expect(r.paceRecommendation).toBeDefined()
      expect(r.encouragement).toBeDefined()
      expect(r.encouragement.icon).toBeDefined()
    })
  })
})

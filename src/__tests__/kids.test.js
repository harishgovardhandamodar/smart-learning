import { describe, it, expect, beforeEach } from 'vitest'
import {
  getKids, saveKids, addKid, removeKid,
  getSelectedKidId, setSelectedKid,
  trackMessage, trackQuizComplete, trackTopicVisit, trackFunFact,
  trackSessionStart, trackSessionEnd,
  getKidMetrics, getAllKidMetrics,
  removeKidActivity, removeKidAndActivity,
  hasParentPin, setParentPin, verifyParentPin, removeParentPin
} from '../data/kids'

describe('kids service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('kid profiles', () => {
    it('getKids returns empty array initially', () => {
      expect(getKids()).toEqual([])
    })

    it('addKid creates a kid with required fields', () => {
      const kid = addKid('Alice', 2015)
      expect(kid.name).toBe('Alice')
      expect(kid.birthYear).toBe(2015)
      expect(kid.id).toBeDefined()
      expect(kid.avatar).toBeDefined()
      expect(kid.enrolledAt).toBeDefined()
    })

    it('addKid trims name', () => {
      const kid = addKid('  Bob  ', 2016)
      expect(kid.name).toBe('Bob')
    })

    it('addKid auto-selects the new kid', () => {
      const kid = addKid('Alice', 2015)
      expect(getSelectedKidId()).toBe(kid.id)
    })

    it('removeKid removes a kid', () => {
      const kid = addKid('Alice', 2015)
      removeKid(kid.id)
      expect(getKids()).toEqual([])
    })

    it('removeKid resets selection if removed kid was selected', () => {
      const kid = addKid('Alice', 2015)
      setSelectedKid(kid.id)
      removeKid(kid.id)
      expect(getSelectedKidId()).toBeNull()
    })

    it('removeKid selects next kid if available', () => {
      const k1 = addKid('Alice', 2015)
      const k2 = addKid('Bob', 2016)
      removeKid(k1.id)
      expect(getSelectedKidId()).toBe(k2.id)
    })
  })

  describe('selected kid', () => {
    it('getSelectedKidId returns null initially', () => {
      expect(getSelectedKidId()).toBeNull()
    })

    it('setSelectedKid stores id', () => {
      setSelectedKid('abc')
      expect(getSelectedKidId()).toBe('abc')
    })

    it('setSelectedKid(null) removes selection', () => {
      setSelectedKid('abc')
      setSelectedKid(null)
      expect(getSelectedKidId()).toBeNull()
    })
  })

  describe('activity tracking', () => {
    it('trackMessage increments message count', () => {
      const kid = addKid('Alice', 2015)
      trackMessage(kid.id, 'science')
      trackMessage(kid.id, 'science')
      const metrics = getKidMetrics(kid.id)
      expect(metrics.messagesSent).toBe(2)
    })

    it('trackQuizComplete records quiz score', () => {
      const kid = addKid('Alice', 2015)
      trackQuizComplete(kid.id, 'math', 8, 10, ['q1', 'q2'])
      const metrics = getKidMetrics(kid.id)
      expect(metrics.quizzesCompleted).toBe(1)
      expect(metrics.avgScore).toBe(80)
    })

    it('trackTopicVisit adds topic', () => {
      const kid = addKid('Alice', 2015)
      trackTopicVisit(kid.id, 'science')
      trackTopicVisit(kid.id, 'science') // duplicate ignored
      const metrics = getKidMetrics(kid.id)
      expect(metrics.topicsExplored).toBe(1)
    })

    it('trackFunFact increments count', () => {
      const kid = addKid('Alice', 2015)
      trackFunFact(kid.id)
      trackFunFact(kid.id)
      const metrics = getKidMetrics(kid.id)
      expect(metrics.funFactsViewed).toBe(2)
    })

    it('trackSessionStart/End records session', () => {
      const kid = addKid('Alice', 2015)
      trackSessionStart(kid.id)
      trackSessionEnd(kid.id)
      const metrics = getKidMetrics(kid.id)
      expect(metrics.totalMinutes).toBeGreaterThanOrEqual(0)
    })
  })

  describe('kid metrics', () => {
    it('getKidMetrics returns null for unknown kid', () => {
      expect(getKidMetrics('nonexistent')).toBeNull()
    })

    it('getKidMetrics includes age calculation', () => {
      const currentYear = new Date().getFullYear()
      const kid = addKid('Alice', currentYear - 10)
      const metrics = getKidMetrics(kid.id)
      expect(metrics.age).toBe(10)
    })

    it('getAllKidMetrics returns array', () => {
      addKid('Alice', 2015)
      addKid('Bob', 2016)
      const all = getAllKidMetrics()
      expect(all.length).toBe(2)
    })

    it('removeKidAndActivity removes both', () => {
      const kid = addKid('Alice', 2015)
      trackMessage(kid.id, 'science')
      removeKidAndActivity(kid.id)
      expect(getKids()).toEqual([])
      const metrics = getKidMetrics(kid.id)
      expect(metrics).toBeNull()
    })
  })

  describe('parent PIN', () => {
    it('hasParentPin returns false initially', () => {
      expect(hasParentPin()).toBe(false)
    })

    it('setParentPin and verifyParentPin', () => {
      setParentPin('1234')
      expect(hasParentPin()).toBe(true)
      expect(verifyParentPin('1234')).toBe(true)
      expect(verifyParentPin('0000')).toBe(false)
    })

    it('removeParentPin removes it', () => {
      setParentPin('1234')
      removeParentPin()
      expect(hasParentPin()).toBe(false)
    })
  })
})

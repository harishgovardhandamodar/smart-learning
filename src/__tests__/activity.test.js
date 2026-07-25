import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAllActivity, getActivityForKid, saveActivityForKid,
  removeKidActivity
} from '../services/activity'

describe('activity service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAllActivity returns empty object when no data', () => {
    expect(getAllActivity()).toEqual({})
  })

  it('getActivityForKid creates default activity structure', () => {
    const act = getActivityForKid('kid1')
    expect(act).toEqual({
      messagesSent: 0,
      quizzesCompleted: 0,
      quizScores: [],
      topicsExplored: [],
      funFactsViewed: 0,
      learningSessions: [],
      chatHistory: [],
    })
  })

  it('getActivityForKid persists and retrieves', () => {
    const act = getActivityForKid('kid1')
    act.messagesSent = 5
    saveActivityForKid('kid1', act)

    const retrieved = getActivityForKid('kid1')
    expect(retrieved.messagesSent).toBe(5)
  })

  it('stores multiple kids independently', () => {
    const a1 = getActivityForKid('kid1')
    a1.messagesSent = 10
    saveActivityForKid('kid1', a1)

    const a2 = getActivityForKid('kid2')
    a2.messagesSent = 20
    saveActivityForKid('kid2', a2)

    expect(getActivityForKid('kid1').messagesSent).toBe(10)
    expect(getActivityForKid('kid2').messagesSent).toBe(20)
  })

  it('removeKidActivity deletes kid data', () => {
    const act = getActivityForKid('kid1')
    act.messagesSent = 5
    saveActivityForKid('kid1', act)
    removeKidActivity('kid1')

    const fresh = getActivityForKid('kid1')
    expect(fresh.messagesSent).toBe(0)
  })

  it('removeKidActivity does not affect other kids', () => {
    const a1 = getActivityForKid('kid1')
    a1.messagesSent = 5
    saveActivityForKid('kid1', a1)

    const a2 = getActivityForKid('kid2')
    a2.messagesSent = 10
    saveActivityForKid('kid2', a2)

    removeKidActivity('kid1')
    expect(getActivityForKid('kid2').messagesSent).toBe(10)
  })
})

// ── Centralized kid activity tracking ──
// Used by kids.js track* functions and available for direct use.

import { storage } from '../utils/storage'

const STORAGE_KEY = 'foxy_kid_activity'

export function getAllActivity() {
  return storage.get(STORAGE_KEY, {})
}

export function saveAllActivity(data) {
  storage.set(STORAGE_KEY, data)
}

export function getActivityForKid(kidId) {
  const all = getAllActivity()
  if (!all[kidId]) {
    all[kidId] = {
      messagesSent: 0,
      quizzesCompleted: 0,
      quizScores: [],
      topicsExplored: [],
      funFactsViewed: 0,
      learningSessions: [],
      chatHistory: [],
    }
    saveAllActivity(all)
  }
  return all[kidId]
}

export function saveActivityForKid(kidId, activity) {
  const all = getAllActivity()
  all[kidId] = activity
  saveAllActivity(all)
}

export function removeKidActivity(kidId) {
  const all = getAllActivity()
  delete all[kidId]
  saveAllActivity(all)
}

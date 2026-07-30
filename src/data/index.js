// ── Data Layer Barrel Export ──

// Path templates (data only)
export { CHARTS_PATH, FRACTIONS_PATH, PHYSICS_PATH } from './learningPaths'

// Path service (progress, custom paths, lookup)
export {
  getCustomPaths, saveCustomPaths, addCustomPath,
  removeCustomPath, updateCustomPath, getAllPaths, getPathById,
  getPathProgress, completeLesson, getPathCompletionPercent,
  getLessonsDueForReview, getKidFocusStats, removeKidFocusProgress
} from '../services/pathService'

// Sandbox progression & interactive data
export {
  SANDBOX_TIERS, WHAT_IF_DATASETS, MISLEADING_CHALLENGES, AI_DEBATE_CHALLENGES,
  getSandboxProgress, saveSandboxProgress, addSandboxPoints,
  markChallengeComplete, isChallengeComplete, computeLineOfBestFit, filterPoints
} from './sandboxData'

// Physics curriculum content
export {
  PHYSICS_WEEK1, PHYSICS_WEEK2, PHYSICS_WEEK3, PHYSICS_WEEK4
} from './physicsCurriculum'

// Kid profiles, activity tracking & metrics
export {
  getKids, saveKids, addKid, removeKid,
  getSelectedKidId, getSelectedKid, setSelectedKid,
  trackMessage, trackQuizComplete, trackTopicVisit, trackFunFact,
  trackSessionStart, trackSessionEnd,
  getKidMetrics, getAllKidMetrics,
  removeKidActivity, removeKidAndActivity,
  hasParentPin, setParentPin, verifyParentPin, removeParentPin,
  getFamilyStats
} from './kids'

// Fun facts, streaks, curiosity
export {
  FUN_FACTS, TOPIC_COLORS, TOPIC_NAMES,
  getLearningStreak, recordVisit,
  getSpacedFacts, markFactSeen, getCuriosityScore, getNextNudge, getRandomFacts
} from './funFacts'

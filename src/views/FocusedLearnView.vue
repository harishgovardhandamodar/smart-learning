<template>
  <div class="focus-page">
    <div class="container">

      <!-- PATH DETAIL MODE -->
      <template v-if="pathId && path">
        <div class="page-header animate-slide-up">
          <router-link to="/focus" class="back-link">← {{ t('focus.allPaths') }}</router-link>
          <div class="path-hero">
            <span class="path-hero-icon">{{ path.icon }}</span>
            <div>
              <h1 class="page-title">{{ getPathTitle(path) }}</h1>
              <p class="page-subtitle">{{ getPathDescription(path) }}</p>
              <div class="path-hero-meta">
                <span class="badge" :class="`badge-${path.difficulty}`">{{ path.difficulty }}</span>
                <span>📝 {{ path.lessons.length }} {{ t('focus.lessons') }}</span>
                <span>⏱️ ~{{ path.estimatedHours }}h</span>
                <span v-if="path.isCustom" class="badge badge-custom">{{ t('focus.custom') }}</span>
              </div>
            </div>
          </div>

          <!-- Overall Progress -->
          <div class="path-overall-progress" v-if="kidId">
            <div class="pop-bar">
              <div class="pop-fill" :style="{ width: pathCompletion + '%' }"></div>
            </div>
            <span class="pop-text">{{ pathCompletion }}% {{ t('focus.complete') }}</span>
          </div>
        </div>

        <!-- Lesson List -->
        <div class="lesson-list">
          <div v-for="(lesson, i) in path.lessons" :key="lesson.id"
            class="lesson-item animate-slide-up"
            :class="{
              completed: isLessonDone(i),
              current: kidId && !isLessonDone(i) && (i === 0 || isLessonDone(i - 1)),
              locked: kidId && !isLessonDone(i) && i > 0 && !isLessonDone(i - 1)
            }"
            @click="goToLesson(i)">

            <div class="li-status">
              <span v-if="isLessonDone(i)" class="li-check">✅</span>
              <span v-else-if="kidId && !isLessonDone(i) && (i === 0 || isLessonDone(i - 1))" class="li-play">▶️</span>
              <span v-else class="li-lock">🔒</span>
            </div>

            <div class="li-content">
              <div class="li-header">
                <span class="li-num">{{ i + 1 }}</span>
                <span class="li-icon">{{ lesson.icon }}</span>
                <h3>{{ getLessonTitle(lesson) }}</h3>
              </div>
              <span class="li-duration">⏱️ {{ lesson.duration }}</span>
              <div v-if="isLessonDone(i)" class="li-score">
                {{ t('lesson.score') }}: {{ getLessonScore(i) }}%
              </div>
            </div>

            <span class="li-arrow">›</span>
          </div>
        </div>

        <!-- Mind Map Preview -->
        <div class="card animate-slide-up" v-if="path.mindMap?.nodes?.length > 0">
          <h3 class="card-title">🗺️ {{ t('focus.pathMap') }}</h3>
          <MindMap
            :concepts="path.mindMap.nodes"
            :question="getPathTitle(path)"
            :topic-icon="path.icon"
          />
        </div>
      </template>

      <!-- OVERVIEW MODE -->
      <template v-else>
        <div class="page-header animate-slide-up">
          <router-link to="/" class="back-link">← {{ t('focus.backToHome') }}</router-link>
          <h1 class="page-title">{{ t('focus.title') }}</h1>
          <p class="page-subtitle">{{ t('focus.subtitle') }}</p>
        </div>

        <!-- Due for Review Banner -->
        <div v-if="dueLessons.length > 0" class="review-banner animate-slide-up">
          <span class="review-icon">🔄</span>
          <div class="review-info">
            <strong>{{ t('focus.reviewReady') }}</strong>
            <span>{{ dueLessons.length }} {{ t('focus.lessonsToReview') }}</span>
          </div>
          <router-link :to="`/focus/${dueLessons[0].pathId}/lesson/${dueLessons[0].lessonIndex}`" class="btn btn-primary btn-sm">
            {{ t('focus.startReview') }}
          </router-link>
        </div>

        <!-- Stats Row -->
        <div class="focus-stats animate-slide-up" v-if="kidId">
          <div class="fs-card">
            <span class="fs-icon">📖</span>
            <span class="fs-val">{{ stats.totalLessonsCompleted }}</span>
            <span class="fs-lbl">{{ t('focus.lessonsDone') }}</span>
          </div>
          <div class="fs-card">
            <span class="fs-icon">🎯</span>
            <span class="fs-val">{{ stats.averageQuizScore }}%</span>
            <span class="fs-lbl">{{ t('focus.avgScore') }}</span>
          </div>
          <div class="fs-card">
            <span class="fs-icon">📚</span>
            <span class="fs-val">{{ stats.pathsStarted }}</span>
            <span class="fs-lbl">{{ t('focus.pathsStarted') }}</span>
          </div>
          <div class="fs-card">
            <span class="fs-icon">✅</span>
            <span class="fs-val">{{ stats.pathsCompleted }}</span>
            <span class="fs-lbl">{{ t('focus.pathsCompleted') }}</span>
          </div>
        </div>

        <!-- Active Paths -->
        <h2 class="section-title animate-slide-up" v-if="activePaths.length > 0">{{ t('focus.activePaths') }}</h2>
        <div class="paths-grid animate-slide-up">
          <div v-for="path in activePaths" :key="path.id" class="path-card" @click="$router.push(`/focus/${path.id}`)">
            <div class="path-icon">{{ path.icon }}</div>
            <div class="path-info">
              <h3>{{ getPathTitle(path) }}</h3>
              <p>{{ getPathSubtitle(path) }}</p>
              <div class="path-progress-bar">
                <div class="path-progress-fill" :style="{ width: getCompletionPercent(path.id) + '%' }"></div>
              </div>
              <span class="path-progress-text">{{ getCompletionPercent(path.id) }}% {{ t('focus.complete') }}</span>
            </div>
            <span class="path-arrow">›</span>
          </div>
        </div>

        <!-- All Paths -->
        <h2 class="section-title animate-slide-up">{{ t('focus.allPaths') }}</h2>
        <div class="paths-grid animate-slide-up">
          <div v-for="path in availablePaths" :key="path.id" class="path-card"
            :class="{ 'is-started': isPathStarted(path.id) }"
            @click="$router.push(`/focus/${path.id}`)">
            <div class="path-icon">{{ path.icon }}</div>
            <div class="path-info">
              <div class="path-badge-row">
                <h3>{{ getPathTitle(path) }}</h3>
                <span v-if="path.isCustom" class="badge badge-custom">{{ t('focus.custom') }}</span>
                <span class="badge" :class="`badge-${path.difficulty}`">{{ path.difficulty }}</span>
              </div>
              <p>{{ getPathDescription(path) }}</p>
              <div class="path-meta">
                <span>📝 {{ path.lessons.length }} {{ t('focus.lessons') }}</span>
                <span>⏱️ ~{{ path.estimatedHours }}h</span>
              </div>
            </div>
            <span class="path-arrow">›</span>
          </div>
        </div>

        <!-- Manage Link (Parent) -->
        <div class="manage-link animate-slide-up">
          <router-link to="/focus/manage" class="btn btn-outline">
            {{ t('focus.managePaths') }}
          </router-link>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAllPaths, getPathById, getPathCompletionPercent, getPathProgress, getKidFocusStats, getLessonsDueForReview } from '../services/pathService'
import MindMap from '../components/MindMap.vue'

const route = useRoute()
const router = useRouter()
const t = inject('t')
const locale = inject('locale')
const selectedKidId = inject('selectedKidId')

const pathId = computed(() => route.params.pathId || null)
const path = computed(() => pathId.value ? getPathById(pathId.value) : null)
const allPaths = ref([])
const stats = ref({ totalLessonsCompleted: 0, averageQuizScore: 0, pathsStarted: 0, pathsCompleted: 0 })
const dueLessons = ref([])

const kidId = computed(() => selectedKidId?.value)

const pathCompletion = computed(() => {
  if (!kidId.value || !pathId.value) return 0
  return getPathCompletionPercent(kidId.value, pathId.value)
})

const activePaths = computed(() => {
  if (!kidId.value) return []
  return allPaths.value.filter(p => {
    const c = getPathCompletionPercent(kidId.value, p.id)
    return c > 0 && c < 100
  })
})

const availablePaths = computed(() => {
  if (!kidId.value) return allPaths.value
  return allPaths.value.filter(p => !activePaths.value.find(a => a.id === p.id))
})

function getPathTitle(p) { return p.title[locale.value] || p.title.en }
function getPathSubtitle(p) { return p.subtitle?.[locale.value] || p.subtitle?.en || '' }
function getPathDescription(p) { return p.description[locale.value] || p.description.en }
function getLessonTitle(l) { return l.title[locale.value] || l.title.en }

function isPathStarted(pId) {
  if (!kidId.value) return false
  return getPathCompletionPercent(kidId.value, pId) > 0
}

function getCompletionPercent(pId) {
  if (!kidId.value) return 0
  return getPathCompletionPercent(kidId.value, pId)
}

function isLessonDone(lessonIndex) {
  if (!kidId.value || !pathId.value) return false
  const prog = getPathProgress(kidId.value, pathId.value)
  return prog.completedLessons.includes(lessonIndex)
}

function getLessonScore(lessonIndex) {
  if (!kidId.value || !pathId.value) return 0
  const prog = getPathProgress(kidId.value, pathId.value)
  return prog.quizScores[lessonIndex] || 0
}

function goToLesson(lessonIndex) {
  if (!pathId.value) return
  if (isLessonDone(lessonIndex) || lessonIndex === 0 || isLessonDone(lessonIndex - 1)) {
    router.push(`/focus/${pathId.value}/lesson/${lessonIndex}`)
  }
}

function loadData() {
  allPaths.value = getAllPaths()
  if (kidId.value) {
    stats.value = getKidFocusStats(kidId.value)
    dueLessons.value = getLessonsDueForReview(kidId.value)
  }
}

watch(() => route.params.pathId, loadData)
onMounted(loadData)
</script>

<style scoped lang="scss">
.focus-page { padding: 20px 0 60px; }

.page-header { margin-bottom: 24px; }
.back-link { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--text-light); display: inline-flex; align-items: center; margin-bottom: 12px; transition: color 0.2s; &:hover { color: var(--primary); } }
.page-title { font-size: 2rem; font-weight: 700; }
.page-subtitle { color: var(--text-light); font-size: 0.95rem; margin-top: 4px; }

/* Path Hero */
.path-hero { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
.path-hero-icon { font-size: 3.5rem; flex-shrink: 0; }
.path-hero-meta { display: flex; gap: 12px; align-items: center; margin-top: 8px; flex-wrap: wrap; font-size: 0.85rem; color: var(--text-light); }

.path-overall-progress { margin-bottom: 8px; }
.pop-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
.pop-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 4px; transition: width 0.6s ease; }
.pop-text { font-size: 0.82rem; font-weight: 600; color: var(--primary); }

/* Lesson List */
.lesson-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }

.lesson-item {
  display: flex; align-items: center; gap: 14px; padding: 16px 20px;
  background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow);
  border: 2px solid transparent; cursor: pointer; transition: all 0.3s;
  &:hover { border-color: var(--border); transform: translateX(4px); }
  &.completed { border-color: rgba(0, 184, 148, 0.2); background: rgba(0, 184, 148, 0.03); }
  &.current { border-color: var(--primary); box-shadow: 0 4px 15px rgba(108, 92, 231, 0.15); }
  &.locked { opacity: 0.5; cursor: not-allowed;
    &:hover { transform: none; border-color: transparent; }
  }
}

.li-status { font-size: 1.3rem; flex-shrink: 0; width: 32px; text-align: center; }
.li-content { flex: 1; min-width: 0; }
.li-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.li-num {
  width: 24px; height: 24px; border-radius: 6px; font-size: 0.72rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: var(--chip-bg); color: var(--text-muted);
  .completed & { background: var(--success); color: white; }
  .current & { background: var(--primary); color: white; }
}
.li-icon { font-size: 1.2rem; }
.li-header h3 { font-size: 0.95rem; }
.li-duration { font-size: 0.78rem; color: var(--text-muted); }
.li-score { font-size: 0.78rem; color: var(--success); font-weight: 600; margin-top: 2px; }
.li-arrow { font-size: 1.3rem; color: var(--text-muted); flex-shrink: 0; }

.card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow); margin-bottom: 20px; }
.card-title { font-size: 1.1rem; margin-bottom: 16px; }

/* Overview */
.review-banner {
  display: flex; align-items: center; gap: 14px; padding: 16px 20px;
  background: linear-gradient(135deg, rgba(253, 203, 110, 0.12), rgba(255, 152, 0, 0.08));
  border: 2px solid rgba(255, 152, 0, 0.2); border-radius: var(--radius-lg); margin-bottom: 20px;
}
.review-icon { font-size: 2rem; }
.review-info { flex: 1; display: flex; flex-direction: column; }
.review-info strong { font-size: 0.95rem; }
.review-info span { font-size: 0.82rem; color: var(--text-light); }

.focus-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 24px; }
.fs-card {
  background: var(--bg-card); border-radius: var(--radius); padding: 16px; text-align: center;
  box-shadow: var(--shadow);
}
.fs-icon { font-size: 1.3rem; display: block; margin-bottom: 4px; }
.fs-val { font-family: var(--font-display); font-weight: 700; font-size: 1.4rem; display: block; }
.fs-lbl { font-size: 0.75rem; color: var(--text-muted); }

.section-title { font-size: 1.2rem; font-weight: 700; margin: 20px 0 14px; }

.paths-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }

.path-card {
  display: flex; align-items: center; gap: 16px; padding: 18px 20px;
  background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow);
  border: 2px solid transparent; cursor: pointer; transition: all 0.3s;
  &:hover { border-color: var(--primary-light); transform: translateY(-2px); }
  &.is-started { border-color: rgba(108, 92, 231, 0.15); }
}
.path-icon { font-size: 2.5rem; flex-shrink: 0; }
.path-info { flex: 1; min-width: 0; }
.path-info h3 { font-size: 1.05rem; margin-bottom: 4px; }
.path-info p { font-size: 0.85rem; color: var(--text-light); line-height: 1.4; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.path-badge-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.badge {
  padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
}
.badge-beginner { background: rgba(0, 184, 148, 0.12); color: var(--success); }
.badge-intermediate { background: rgba(253, 203, 110, 0.15); color: #e17055; }
.badge-advanced { background: rgba(255, 118, 117, 0.12); color: var(--danger); }
.badge-custom { background: rgba(108, 92, 231, 0.1); color: var(--primary); }

.path-meta { display: flex; gap: 14px; font-size: 0.78rem; color: var(--text-muted); }

.path-progress-bar { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
.path-progress-fill { height: 100%; background: var(--primary); border-radius: 3px; transition: width 0.6s ease; }
.path-progress-text { font-size: 0.75rem; color: var(--primary); font-weight: 600; }

.path-arrow { font-size: 1.5rem; color: var(--text-muted); flex-shrink: 0; }

.manage-link { text-align: center; margin-top: 12px; }

.btn { padding: 12px 24px; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); &:hover { transform: translateY(-2px); } }
.btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text); &:hover { border-color: var(--primary); color: var(--primary); } }
.btn-sm { padding: 8px 16px; font-size: 0.82rem; }

@media (max-width: 640px) {
  .path-hero { flex-direction: column; }
  .path-card { padding: 14px 16px; gap: 12px; }
  .path-icon { font-size: 2rem; }
}
</style>

<template>
  <div class="manage-page">
    <div class="container">
      <div class="page-header animate-slide-up">
        <router-link to="/focus" class="back-link">← {{ t('manage.backToFocus') }}</router-link>
        <h1 class="page-title">⚙️ {{ t('manage.title') }}</h1>
        <p class="page-subtitle">{{ t('manage.subtitle') }}</p>
      </div>

      <!-- Add New Path -->
      <div class="card animate-slide-up">
        <h3 class="card-title">{{ t('manage.createNew') }}</h3>
        <form @submit.prevent="handleCreatePath" class="create-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('manage.nameEn') }}</label>
              <input v-model="newPath.title.en" type="text" class="form-input" :placeholder="t('manage.nameEnPlaceholder')" required />
            </div>
            <div class="form-group">
              <label>{{ t('manage.nameNl') }}</label>
              <input v-model="newPath.title.nl" type="text" class="form-input" :placeholder="t('manage.nameNlPlaceholder')" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>{{ t('manage.icon') }}</label>
              <div class="icon-picker">
                <button v-for="icon in iconOptions" :key="icon" type="button" class="icon-opt"
                  :class="{ selected: newPath.icon === icon }" @click="newPath.icon = icon">
                  {{ icon }}
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>{{ t('manage.difficulty') }}</label>
              <select v-model="newPath.difficulty" class="form-input">
                <option value="beginner">{{ t('manage.beginner') }}</option>
                <option value="intermediate">{{ t('manage.intermediate') }}</option>
                <option value="advanced">{{ t('manage.advanced') }}</option>
              </select>
            </div>
            <div class="form-group small">
              <label>{{ t('manage.hours') }}</label>
              <input v-model.number="newPath.estimatedHours" type="number" min="1" max="50" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('manage.descriptionEn') }}</label>
            <textarea v-model="newPath.description.en" class="form-input" rows="2" :placeholder="t('manage.descPlaceholder')"></textarea>
          </div>

          <!-- Lessons -->
          <div class="lessons-section">
            <h4>{{ t('manage.lessons') }} ({{ newPath.lessons.length }})</h4>

            <div v-for="(lesson, i) in newPath.lessons" :key="i" class="lesson-editor">
              <div class="le-header" @click="toggleLesson(i)">
                <span class="le-num">{{ i + 1 }}</span>
                <span class="le-title">{{ lesson.title.en || t('manage.unnamedLesson') }}</span>
                <span class="le-toggle">{{ openLessons.includes(i) ? '▾' : '▸' }}</span>
              </div>

              <div v-if="openLessons.includes(i)" class="le-body">
                <div class="form-row">
                  <div class="form-group">
                    <label>{{ t('manage.lessonTitleEn') }}</label>
                    <input v-model="lesson.title.en" class="form-input" required />
                  </div>
                  <div class="form-group">
                    <label>{{ t('manage.lessonTitleNl') }}</label>
                    <input v-model="lesson.title.nl" class="form-input" />
                  </div>
                  <div class="form-group small">
                    <label>{{ t('manage.lessonIcon') }}</label>
                    <input v-model="lesson.icon" class="form-input" maxlength="2" />
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ t('manage.lessonConceptEn') }}</label>
                  <textarea v-model="lesson.concept.en" class="form-input" rows="3" required></textarea>
                </div>
                <div class="form-group">
                  <label>{{ t('manage.lessonConceptNl') }}</label>
                  <textarea v-model="lesson.concept.nl" class="form-input" rows="3"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>{{ t('manage.lessonQuizQ') }} ({{ lesson.quiz.length }})</label>
                    <div v-for="(q, qi) in lesson.quiz" :key="qi" class="quiz-editor">
                      <input v-model="q.question.en" class="form-input sm" :placeholder="t('manage.questionPlaceholder')" />
                      <div class="qe-options">
                        <input v-for="(opt, oi) in q.options" :key="oi" v-model="q.options[oi]" class="form-input sm"
                          :placeholder="['A','B','C','D'][oi]" />
                      </div>
                      <select v-model.number="q.correct" class="form-input sm">
                        <option :value="0">A</option><option :value="1">B</option><option :value="2">C</option><option :value="3">D</option>
                      </select>
                    </div>
                    <button type="button" class="btn btn-sm btn-ghost" @click="addQuizQuestion(i)">+ {{ t('manage.addQuestion') }}</button>
                  </div>
                </div>
                <button type="button" class="btn btn-sm btn-danger" @click="removeLesson(i)">🗑️ {{ t('manage.removeLesson') }}</button>
              </div>
            </div>

            <button type="button" class="btn btn-outline" @click="addLesson">+ {{ t('manage.addLesson') }}</button>
          </div>

          <button type="submit" class="btn btn-primary btn-block">{{ t('manage.savePath') }}</button>
        </form>
      </div>

      <!-- Existing Custom Paths -->
      <div v-if="customPaths.length > 0" class="card animate-slide-up">
        <h3 class="card-title">{{ t('manage.yourPaths') }}</h3>
        <div class="custom-list">
          <div v-for="cp in customPaths" :key="cp.id" class="custom-row">
            <span class="cp-icon">{{ cp.icon }}</span>
            <div class="cp-info">
              <span class="cp-name">{{ cp.title[locale] || cp.title.en }}</span>
              <span class="cp-meta">{{ cp.lessons.length }} {{ t('manage.lessons') }} · {{ cp.difficulty }}</span>
            </div>
            <button class="btn btn-sm btn-danger" @click="handleRemove(cp.id)">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { getCustomPaths, addCustomPath, removeCustomPath } from '../services/pathService'

const t = inject('t')
const locale = inject('locale')

const customPaths = ref([])
const openLessons = ref([])

const iconOptions = ['📚', '🔬', '🧮', '💻', '🎨', '🌍', '🎵', '🧪', '📐', '📊', '🏋️', '🧠']

const newPath = reactive({
  title: { en: '', nl: '' },
  icon: '📚',
  difficulty: 'beginner',
  estimatedHours: 2,
  description: { en: '', nl: '' },
  lessons: []
})

function addLesson() {
  newPath.lessons.push({
    id: 'lesson-' + Date.now().toString(36),
    title: { en: '', nl: '' },
    icon: '📖',
    duration: '15 min',
    concept: { en: '', nl: '' },
    quiz: [{ question: { en: '' }, options: ['', '', '', ''], correct: 0, explanation: { en: '' } }],
    practice: { en: '', nl: '' }
  })
  openLessons.value.push(newPath.lessons.length - 1)
}

function removeLesson(idx) {
  newPath.lessons.splice(idx, 1)
  openLessons.value = openLessons.value.filter(i => i !== idx)
}

function addQuizQuestion(lessonIdx) {
  newPath.lessons[lessonIdx].quiz.push({
    question: { en: '' }, options: ['', '', '', ''], correct: 0, explanation: { en: '' }
  })
}

function toggleLesson(idx) {
  if (openLessons.value.includes(idx)) {
    openLessons.value = openLessons.value.filter(i => i !== idx)
  } else {
    openLessons.value.push(idx)
  }
}

function handleCreatePath() {
  if (!newPath.title.en) return
  addCustomPath(JSON.parse(JSON.stringify(newPath)))
  newPath.title = { en: '', nl: '' }
  newPath.icon = '📚'
  newPath.description = { en: '', nl: '' }
  newPath.lessons = []
  loadCustomPaths()
}

function handleRemove(pathId) {
  removeCustomPath(pathId)
  loadCustomPaths()
}

function loadCustomPaths() {
  customPaths.value = getCustomPaths()
}

onMounted(loadCustomPaths)
</script>

<style scoped lang="scss">
.manage-page { padding: 20px 0 60px; }
.page-header { margin-bottom: 24px; }
.back-link { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--text-light); display: inline-flex; align-items: center; margin-bottom: 12px; transition: color 0.2s; &:hover { color: var(--primary); } }
.page-title { font-size: 2rem; font-weight: 700; }
.page-subtitle { color: var(--text-light); font-size: 0.95rem; margin-top: 4px; }

.card { background: var(--bg-card); border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow); margin-bottom: 20px; }
.card-title { font-size: 1.1rem; margin-bottom: 16px; }

.create-form { display: flex; flex-direction: column; gap: 14px; }
.form-row { display: flex; gap: 14px; flex-wrap: wrap; }
.form-group { flex: 1; min-width: 150px;
  &.small { flex: 0 0 100px; min-width: 80px; }
  label { display: block; font-family: var(--font-display); font-weight: 600; font-size: 0.82rem; color: var(--text-light); margin-bottom: 4px; }
}
.form-input {
  width: 100%; padding: 10px 14px; border-radius: 10px; border: 2px solid var(--border);
  background: var(--input-bg); color: var(--text); font-family: var(--font-body); font-size: 0.9rem;
  outline: none; transition: border-color 0.2s; resize: vertical;
  &:focus { border-color: var(--primary); }
  &.sm { padding: 6px 10px; font-size: 0.82rem; }
}

.icon-picker { display: flex; gap: 6px; flex-wrap: wrap; }
.icon-opt {
  width: 36px; height: 36px; border-radius: 8px; border: 2px solid var(--border); font-size: 1.2rem;
  display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;
  &:hover { border-color: var(--primary); }
  &.selected { border-color: var(--primary); background: rgba(108, 92, 231, 0.1); transform: scale(1.1); }
}

.lessons-section { margin-top: 10px; }
.lessons-section h4 { margin-bottom: 10px; font-size: 0.95rem; }

.lesson-editor { border: 2px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 10px; }
.le-header { display: flex; align-items: center; gap: 10px; padding: 12px 14px; cursor: pointer; background: var(--chip-bg); transition: background 0.2s;
  &:hover { background: var(--border); }
}
.le-num { width: 24px; height: 24px; border-radius: 6px; background: var(--primary); color: white; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.le-title { flex: 1; font-weight: 600; font-size: 0.9rem; }
.le-toggle { color: var(--text-muted); }
.le-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }

.quiz-editor { padding: 8px; background: var(--chip-bg); border-radius: 8px; margin-bottom: 8px; }
.qe-options { display: flex; gap: 6px; margin: 6px 0; }

.custom-list { display: flex; flex-direction: column; gap: 8px; }
.custom-row { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: var(--chip-bg); border-radius: 10px; }
.cp-icon { font-size: 1.5rem; }
.cp-info { flex: 1; display: flex; flex-direction: column; }
.cp-name { font-weight: 600; }
.cp-meta { font-size: 0.78rem; color: var(--text-muted); }

.btn { padding: 10px 20px; border-radius: 10px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: all 0.3s; cursor: pointer; }
.btn-primary { background: var(--primary); color: white; &:hover { transform: translateY(-2px); } }
.btn-outline { background: transparent; border: 2px solid var(--border); color: var(--text); &:hover { border-color: var(--primary); color: var(--primary); } }
.btn-ghost { background: transparent; color: var(--primary); &:hover { background: rgba(108, 92, 231, 0.06); } }
.btn-danger { background: rgba(255, 118, 117, 0.1); color: var(--danger); border: none; &:hover { background: var(--danger); color: white; } }
.btn-sm { padding: 6px 12px; font-size: 0.8rem; }
.btn-block { width: 100%; justify-content: center; }

@media (max-width: 640px) { .form-row { flex-direction: column; } }
</style>

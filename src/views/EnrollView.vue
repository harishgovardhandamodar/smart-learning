<template>
  <div class="enroll-page">
    <div class="enroll-container animate-slide-up">
      <div class="enroll-header">
        <div class="enroll-fox animate-float">🦊</div>
        <h1>{{ t('enroll.title') }}</h1>
        <p>{{ t('enroll.subtitle') }}</p>
      </div>

      <!-- Existing Kids -->
      <div v-if="existingKids.length > 0" class="existing-kids-section">
        <h3>{{ t('enroll.existingKids') }}</h3>
        <div class="kids-grid">
          <button
            v-for="kid in existingKids"
            :key="kid.id"
            class="kid-card"
            :class="{ selected: selectedExisting === kid.id }"
            @click="selectExisting(kid.id)"
          >
            <span class="kid-avatar">{{ kid.avatar }}</span>
            <span class="kid-name">{{ kid.name }}</span>
            <span class="kid-age">{{ getAge(kid) }} {{ t('enroll.yearsOld') }}</span>
          </button>
        </div>
        <button
          v-if="selectedExisting"
          class="btn btn-primary btn-block"
          @click="goWithExisting"
        >
          {{ t('enroll.continueAs') }} {{ getSelectedKidName() }} 🚀
        </button>
        <div class="divider"><span>{{ t('enroll.or') }}</span></div>
      </div>

      <!-- New Kid Form -->
      <form class="enroll-form" @submit.prevent="handleEnroll">
        <h3>{{ existingKids.length > 0 ? t('enroll.addNew') : t('enroll.start') }}</h3>

        <div class="form-group">
          <label>{{ t('enroll.nameLabel') }}</label>
          <input
            v-model="name"
            type="text"
            class="form-input"
            :placeholder="t('enroll.namePlaceholder')"
            required
            minlength="2"
            maxlength="30"
          />
        </div>

        <div class="form-group">
          <label>{{ t('enroll.birthYearLabel') }}</label>
          <select v-model="birthYear" class="form-input" required>
            <option value="" disabled>{{ t('enroll.birthYearPlaceholder') }}</option>
            <option v-for="year in yearOptions" :key="year" :value="year">
              {{ year }} ({{ t('enroll.ageLabel') }} {{ currentYear - year }})
            </option>
          </select>
        </div>

        <div v-if="birthYear" class="age-preview">
          <span class="age-emoji">{{ getAgeEmoji(currentYear - birthYear) }}</span>
          <span>{{ t('enroll.yourAge') }} <strong>{{ currentYear - birthYear }}</strong> {{ t('enroll.yearsOld') }}</span>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="!name.trim() || !birthYear">
          {{ t('enroll.enrollButton') }} 🎉
        </button>
      </form>

      <p class="enroll-note">{{ t('enroll.privacyNote') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getKids, addKid, setSelectedKid } from '../data/kids'

const router = useRouter()
const t = inject('t')
const locale = inject('locale')

const name = ref('')
const birthYear = ref('')
const selectedExisting = ref('')
const existingKids = ref([])
const currentYear = new Date().getFullYear()

const yearOptions = computed(() => {
  const years = []
  for (let y = currentYear - 4; y >= currentYear - 18; y--) years.push(y)
  return years
})

function getAge(kid) {
  return currentYear - kid.birthYear
}

function getAgeEmoji(age) {
  if (age < 8) return '🧒'
  if (age < 10) return '👦'
  if (age < 12) return '🧑'
  if (age < 14) return '👨'
  return '🧑‍🎓'
}

function getSelectedKidName() {
  return existingKids.value.find(k => k.id === selectedExisting.value)?.name || ''
}

function selectExisting(kidId) {
  selectedExisting.value = selectedExisting.value === kidId ? '' : kidId
}

function goWithExisting() {
  setSelectedKid(selectedExisting.value)
  router.push('/')
}

function handleEnroll() {
  if (!name.value.trim() || !birthYear.value) return
  addKid(name.value, birthYear.value)
  router.push('/')
}

onMounted(() => {
  existingKids.value = getKids()
  if (existingKids.value.length === 0) {
    // Auto-select first kid if only one exists
  }
})
</script>

<style scoped lang="scss">
.enroll-page {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(180deg, rgba(108, 92, 231, 0.05) 0%, transparent 100%);
}

.enroll-container {
  max-width: 480px;
  width: 100%;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 40px 32px;
  box-shadow: var(--shadow);
}

.enroll-header {
  text-align: center;
  margin-bottom: 32px;
  h1 { font-size: 1.8rem; margin-bottom: 8px; }
  p { color: var(--text-light); font-size: 0.95rem; }
}

.enroll-fox { font-size: 4rem; margin-bottom: 12px; }

.existing-kids-section {
  margin-bottom: 24px;
  h3 { font-size: 1rem; margin-bottom: 12px; color: var(--text-light); }
}

.kids-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.kid-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--chip-bg);
  border: 2px solid transparent;
  transition: all 0.3s;
  flex: 1;
  min-width: 140px;
  &:hover { border-color: var(--primary-light); }
  &.selected { border-color: var(--primary); background: rgba(108, 92, 231, 0.1); }
}

.kid-avatar { font-size: 1.5rem; }
.kid-name { font-weight: 700; font-size: 0.95rem; }
.kid-age { font-size: 0.8rem; color: var(--text-muted); margin-left: auto; }

.divider {
  text-align: center;
  position: relative;
  margin: 20px 0;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border);
  }
  span {
    position: relative;
    background: var(--bg-card);
    padding: 0 16px;
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 600;
  }
}

.enroll-form {
  h3 { font-size: 1.1rem; margin-bottom: 16px; }
}

.form-group {
  margin-bottom: 16px;
  label {
    display: block;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-light);
    margin-bottom: 6px;
  }
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid var(--border);
  background: var(--input-bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  &:focus { border-color: var(--primary); }
  &::placeholder { color: var(--text-muted); }
}

.age-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(108, 92, 231, 0.06);
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: var(--text-light);
}

.age-emoji { font-size: 1.3rem; }

.btn {
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4); }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
}

.btn-block { width: 100%; }

.enroll-note {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 20px;
  line-height: 1.5;
}
</style>

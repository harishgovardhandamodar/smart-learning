<template>
  <div class="quiz-page">
    <div class="container">
      <div class="quiz-header">
        <router-link :to="`/learn/${topicId}`" class="back-link">← Back to Learning</router-link>
        <div class="topic-badge" :style="{ background: topic.gradient }">
          <span>{{ topic.icon }}</span>
          <h1>{{ topic.title }} Quiz</h1>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-card animate-slide-up">
        <div class="loading-icon animate-wiggle">{{ topic.icon }}</div>
        <h2>Generating your quiz...</h2>
        <p>Our AI is creating fun questions just for you!</p>
        <div class="loading-bar">
          <div class="loading-fill"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-card animate-slide-up">
        <div class="error-icon">😕</div>
        <h2>Oops! Couldn't generate quiz</h2>
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="loadQuiz">Try Again</button>
      </div>

      <!-- Quiz Active -->
      <div v-else-if="questions.length > 0 && !quizComplete" class="quiz-body animate-slide-up">
        <div class="quiz-progress">
          <div class="progress-info">
            <span>Question {{ currentIndex + 1 }} of {{ questions.length }}</span>
            <span class="score-display">Score: {{ score }}/{{ questions.length }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${((currentIndex + 1) / questions.length) * 100}%` }"></div>
          </div>
        </div>

        <div class="question-card">
          <div class="question-number">Q{{ currentIndex + 1 }}</div>
          <h2 class="question-text">{{ questions[currentIndex].question }}</h2>

          <div class="options-list">
            <button
              v-for="(option, index) in questions[currentIndex].options"
              :key="index"
              class="option-btn"
              :class="{
                selected: selectedAnswer === index,
                correct: showResult && index === questions[currentIndex].correct,
                wrong: showResult && selectedAnswer === index && index !== questions[currentIndex].correct,
              }"
              @click="selectAnswer(index)"
              :disabled="showResult"
            >
              <span class="option-letter">{{ ['A', 'B', 'C', 'D'][index] }}</span>
              <span class="option-text">{{ option }}</span>
              <span v-if="showResult && index === questions[currentIndex].correct" class="option-icon">✅</span>
              <span v-else-if="showResult && selectedAnswer === index" class="option-icon">❌</span>
            </button>
          </div>

          <div v-if="showResult" class="explanation-card animate-slide-up">
            <div class="explanation-header">
              <span>{{ selectedAnswer === questions[currentIndex].correct ? '🎉' : '💡' }}</span>
              <strong>{{ selectedAnswer === questions[currentIndex].correct ? 'Correct!' : 'Not quite!' }}</strong>
            </div>
            <p>{{ questions[currentIndex].explanation }}</p>
          </div>

          <div class="quiz-actions">
            <button
              v-if="!showResult && selectedAnswer !== null"
              class="btn btn-primary"
              @click="checkAnswer"
            >
              Check Answer
            </button>
            <button
              v-if="showResult"
              class="btn btn-primary"
              @click="nextQuestion"
            >
              {{ currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results 🏆' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Results -->
      <div v-else-if="quizComplete" class="results-card animate-bounce">
        <div class="results-icon">{{ scorePercentage >= 80 ? '🏆' : scorePercentage >= 50 ? '⭐' : '💪' }}</div>
        <h2 class="results-title">
          {{ scorePercentage >= 80 ? 'Amazing!' : scorePercentage >= 50 ? 'Good Job!' : 'Keep Trying!' }}
        </h2>
        <div class="results-score">
          <span class="score-big">{{ score }}</span>
          <span class="score-divider">/</span>
          <span class="score-total">{{ questions.length }}</span>
        </div>
        <p class="results-message">
          {{ scorePercentage >= 80
            ? "You're a STEM superstar! Keep up the great work!"
            : scorePercentage >= 50
            ? "Nice effort! Review the topics and try again!"
            : "Don't give up! Every expert was once a beginner!" }}
        </p>
        <div class="results-actions">
          <router-link :to="`/learn/${topicId}`" class="btn btn-primary">
            💬 Learn More
          </router-link>
          <button class="btn btn-secondary" @click="resetQuiz">
            🔄 Try Again
          </button>
          <router-link to="/topics" class="btn btn-outline">
            🎯 Other Topics
          </router-link>
        </div>
      </div>

      <!-- Initial State -->
      <div v-else class="start-card animate-slide-up">
        <div class="start-icon animate-float">{{ topic.icon }}</div>
        <h2>Ready for a Challenge?</h2>
        <p>Test your {{ topic.title.toLowerCase }} knowledge with 5 fun questions generated by AI!</p>
        <button class="btn btn-primary btn-lg" @click="loadQuiz">
          🚀 Start Quiz
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { STEM_TOPICS } from '../data/topics'
import { generateQuiz, getModels, getDefaultModel } from '../services/ollama'

const route = useRoute()
const topicId = computed(() => route.params.topicId)
const topic = computed(() => STEM_TOPICS.find(t => t.id === topicId.value) || STEM_TOPICS[0])

const questions = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const showResult = ref(false)
const score = ref(0)
const isLoading = ref(false)
const error = ref('')
const quizComplete = ref(false)

const scorePercentage = computed(() => Math.round((score.value / questions.value.length) * 100))

async function loadQuiz() {
  isLoading.value = true
  error.value = ''
  questions.value = []
  currentIndex.value = 0
  score.value = 0
  quizComplete.value = false

  try {
    const models = getModels()
    const model = getDefaultModel()
    const result = await generateQuiz(topicId.value, model)

    if (!result || !Array.isArray(result) || result.length === 0) {
      throw new Error('Could not generate valid quiz questions. Please try again.')
    }

    questions.value = result
  } catch (e) {
    error.value = e.message || 'Something went wrong. Make sure Ollama is running.'
  } finally {
    isLoading.value = false
  }
}

function selectAnswer(index) {
  if (!showResult.value) {
    selectedAnswer.value = index
  }
}

function checkAnswer() {
  if (selectedAnswer.value === null) return
  showResult.value = true
  if (selectedAnswer.value === questions.value[currentIndex.value].correct) {
    score.value++
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    showResult.value = false
  } else {
    quizComplete.value = true
  }
}

function resetQuiz() {
  questions.value = []
  currentIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  score.value = 0
  quizComplete.value = false
}
</script>

<style scoped lang="scss">
.quiz-page {
  padding: 20px 0 60px;
}

.quiz-header {
  margin-bottom: 24px;
}

.back-link {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text-light);
  display: inline-flex;
  align-items: center;
  margin-bottom: 12px;
  transition: color 0.2s;

  &:hover { color: var(--primary); }
}

.topic-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px 10px 16px;
  border-radius: 16px;
  color: white;

  span { font-size: 1.8rem; }
  h1 { font-size: 1.3rem; font-weight: 700; }
}

/* Loading */
.loading-card, .error-card, .start-card, .results-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 48px 32px;
  box-shadow: var(--shadow);
  text-align: center;
  max-width: 500px;
  margin: 20px auto;
}

.loading-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.loading-bar {
  height: 6px;
  background: rgba(108, 92, 231, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 24px;
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.loading-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0% { width: 0; margin-left: 0; }
  50% { width: 70%; margin-left: 15%; }
  100% { width: 0; margin-left: 100%; }
}

/* Error */
.error-card {
  .error-icon { font-size: 3rem; margin-bottom: 12px; }
  h2 { margin-bottom: 8px; }
  p { color: var(--text-light); margin-bottom: 20px; }
}

/* Quiz Body */
.quiz-body {
  max-width: 700px;
  margin: 0 auto;
}

.quiz-progress {
  margin-bottom: 24px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 8px;
}

.score-display {
  color: var(--primary);
}

.progress-bar {
  height: 8px;
  background: rgba(108, 92, 231, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.question-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow);
}

.question-number {
  display: inline-block;
  background: var(--primary);
  color: white;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 4px 14px;
  border-radius: 10px;
  margin-bottom: 16px;
}

.question-text {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 24px;
  line-height: 1.5;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(108, 92, 231, 0.04);
  border: 2px solid rgba(108, 92, 231, 0.1);
  border-radius: 14px;
  font-family: var(--font-body);
  font-size: 1rem;
  text-align: left;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    background: rgba(108, 92, 231, 0.08);
    transform: translateX(4px);
  }

  &.selected {
    border-color: var(--primary);
    background: rgba(108, 92, 231, 0.1);
  }

  &.correct {
    border-color: var(--success);
    background: rgba(0, 184, 148, 0.1);
  }

  &.wrong {
    border-color: var(--danger);
    background: rgba(255, 118, 117, 0.1);
  }

  &:disabled {
    cursor: default;
  }
}

.option-letter {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(108, 92, 231, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--primary);
  flex-shrink: 0;
}

.option-text {
  flex: 1;
}

.option-icon {
  font-size: 1.2rem;
}

.explanation-card {
  background: rgba(253, 203, 110, 0.1);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 20px;
}

.explanation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  strong {
    font-family: var(--font-display);
    font-size: 1rem;
  }
}

.explanation-card p {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
}

.quiz-actions {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4);
  }
}

.btn-secondary {
  background: rgba(108, 92, 231, 0.08);
  color: var(--primary);

  &:hover {
    background: rgba(108, 92, 231, 0.15);
  }
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(108, 92, 231, 0.2);
  color: var(--primary);

  &:hover {
    border-color: var(--primary);
    background: rgba(108, 92, 231, 0.05);
  }
}

/* Start Card */
.start-card {
  h2 { margin-bottom: 8px; }
  p { color: var(--text-light); margin-bottom: 24px; }
}

.start-icon {
  font-size: 5rem;
  margin-bottom: 16px;
}

/* Results */
.results-icon {
  font-size: 5rem;
  margin-bottom: 16px;
}

.results-title {
  font-size: 2rem;
  margin-bottom: 16px;
}

.results-score {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 16px;
}

.score-big {
  font-family: var(--font-display);
  font-size: 4rem;
  font-weight: 700;
  color: var(--primary);
}

.score-divider {
  font-size: 2rem;
  color: var(--text-muted);
}

.score-total {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--text-muted);
}

.results-message {
  color: var(--text-light);
  margin-bottom: 24px;
  font-size: 1.05rem;
}

.results-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .question-card {
    padding: 20px;
  }

  .question-text {
    font-size: 1.1rem;
  }
}
</style>

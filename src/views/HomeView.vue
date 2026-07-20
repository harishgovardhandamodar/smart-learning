<template>
  <div class="home">
    <section class="hero">
      <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-emoji animate-float">🚀</div>
        <h1 class="hero-title animate-slide-up">{{ t('home.heroTitle') }}</h1>
        <p class="hero-subtitle animate-slide-up">
          {{ t('home.heroSubtitle') }}
          <br>{{ t('home.heroSubtitleBold') }}
        </p>

        <div class="hero-status animate-slide-up" v-if="!connected">
          <div class="status-card warning">
            <span class="status-icon">⚠️</span>
            <div class="status-info">
              <strong>{{ t('home.ollamaWarning') }}</strong>
              <p>{{ t('home.ollamaHint') }} <code>ollama serve</code></p>
            </div>
          </div>
        </div>

        <div class="hero-actions animate-slide-up">
          <router-link to="/topics" class="btn btn-primary btn-lg">
            <span>🎯</span> {{ t('home.startExploring') }}
          </router-link>
          <div class="hero-hint">{{ t('home.heroHint') }}</div>
        </div>

        <div class="hero-features animate-slide-up">
          <div class="feature">
            <span class="feature-icon">🦊</span>
            <span class="feature-text">{{ t('home.aiTutor') }}</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature">
            <span class="feature-icon">🎮</span>
            <span class="feature-text">{{ t('home.funQuizzes') }}</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature">
            <span class="feature-icon">🔒</span>
            <span class="feature-text">{{ t('home.private') }}</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature">
            <span class="feature-icon">💡</span>
            <span class="feature-text">{{ t('home.askAnything') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Fun Facts Carousel -->
    <section class="fun-fact-carousel-section container animate-slide-up">
      <div class="carousel-wrapper">
        <div class="carousel-header">
          <h2 class="carousel-title">💡 {{ t('funFacts.carouselTitle') }}</h2>
          <router-link to="/fun-facts" class="carousel-explore-link">
            {{ t('funFacts.carouselExplore') }} <span>→</span>
          </router-link>
        </div>

        <div class="carousel-track" @mouseenter="pauseAuto" @mouseleave="resumeAuto">
          <button class="carousel-btn carousel-prev" @click="prevFact" aria-label="Previous">‹</button>

          <div class="carousel-card" :key="currentFact?.id" :style="{ '--topic-color': getTopicColor(currentFact?.topic).accent }">
            <div class="carousel-card-inner">
              <div class="carousel-card-top">
                <span class="carousel-fact-icon">{{ currentFact?.icon }}</span>
                <span class="carousel-topic-badge" :style="{ background: getTopicColor(currentFact?.topic).bg, color: getTopicColor(currentFact?.topic).accent, borderColor: getTopicColor(currentFact?.topic).border }">
                  {{ getTopicName(currentFact?.topic) }}
                </span>
              </div>
              <h3 class="carousel-fact-title">{{ currentFact?.[locale]?.title }}</h3>
              <p class="carousel-fact-text">{{ currentFact?.[locale]?.fact }}</p>
              <div class="carousel-card-actions">
                <router-link to="/fun-facts" class="carousel-detail-link" @click="markCurrentSeen">
                  {{ t('funFacts.learnMore') }} <span class="arrow">→</span>
                </router-link>
              </div>
            </div>
          </div>

          <button class="carousel-btn carousel-next" @click="nextFact" aria-label="Next">›</button>
        </div>

        <div class="carousel-dots">
          <button
            v-for="(fact, idx) in displayFacts"
            :key="fact.id"
            class="carousel-dot"
            :class="{ active: idx === currentIndex }"
            @click="goToFact(idx)"
            :aria-label="`Fact ${idx + 1}`"
          ></button>
        </div>
      </div>
    </section>

    <section class="topics-preview container">
      <h2 class="section-title">{{ t('home.chooseAdventure') }}</h2>
      <div class="topics-grid">
        <router-link
          v-for="topic in topics"
          :key="topic.id"
          :to="`/learn/${topic.id}`"
          class="topic-card animate-slide-up"
          :style="{ '--topic-gradient': topic.gradient }"
        >
          <div class="topic-icon-wrapper">
            <span class="topic-icon">{{ topic.icon }}</span>
          </div>
          <h3 class="topic-title">{{ topic.title }}</h3>
          <p class="topic-description">{{ topic.description }}</p>
          <div class="topic-fun-fact">
            <span class="fun-fact-label">💡 {{ t('home.funFact') }}</span>
            <p>{{ topic.funFact }}</p>
          </div>
          <div class="topic-action">
            {{ t('home.explore') }} <span>→</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Curiosity Nudge -->
    <section class="curiosity-nudge-section container animate-slide-up" v-if="nudgeMessage">
      <div class="curiosity-nudge-card">
        <div class="nudge-left">
          <span class="nudge-emoji animate-float">🦊</span>
          <div class="nudge-info">
            <span class="nudge-title">{{ t('funFacts.curiosityTitle') }}</span>
            <span class="nudge-level">{{ curiosityInfo.level }}</span>
          </div>
        </div>
        <div class="nudge-center">
          <div class="mini-curiosity-bar">
            <div class="mini-curiosity-fill" :style="{ width: curiosityInfo.percentage + '%' }"></div>
          </div>
          <span class="mini-curiosity-count">{{ curiosityInfo.factsExplored }}/{{ curiosityInfo.totalFacts }}</span>
        </div>
        <div class="nudge-right">
          <p class="nudge-message">{{ nudgeMessage }}</p>
        </div>
      </div>
    </section>

    <section class="how-it-works container">
      <h2 class="section-title">{{ t('home.howItWorks') }}</h2>
      <div class="steps-grid">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-icon">📋</div>
          <h3>{{ t('home.pickTopic') }}</h3>
          <p>{{ t('home.pickTopicDesc') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-icon">💬</div>
          <h3>{{ t('home.askQuestions') }}</h3>
          <p>{{ t('home.askQuestionsDesc') }}</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-icon">🏆</div>
          <h3>{{ t('home.takeQuiz') }}</h3>
          <p>{{ t('home.takeQuizDesc') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { STEM_TOPICS } from '../data/topics'
import { FUN_FACTS, TOPIC_COLORS, TOPIC_NAMES, getRandomFacts, getCuriosityScore, getNextNudge, markFactSeen, recordVisit } from '../data/funFacts'

const connected = inject('isConnected')
const t = inject('t')
const locale = inject('locale')
const topics = STEM_TOPICS

// ── Fun Fact Carousel ──
const displayFacts = ref([])
const currentIndex = ref(0)
let autoTimer = null
let isPaused = false

const currentFact = computed(() => displayFacts.value[currentIndex.value] || null)

function getTopicColor(topic) {
  return TOPIC_COLORS[topic] || TOPIC_COLORS.science
}

function getTopicName(topic) {
  return TOPIC_NAMES[locale.value]?.[topic] || TOPIC_NAMES.en[topic]
}

function shuffleFacts(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function prevFact() {
  const len = displayFacts.value.length
  currentIndex.value = (currentIndex.value - 1 + len) % len
  resetAutoTimer()
}

function nextFact() {
  const len = displayFacts.value.length
  currentIndex.value = (currentIndex.value + 1) % len
  resetAutoTimer()
}

function goToFact(idx) {
  currentIndex.value = idx
  resetAutoTimer()
}

function markCurrentSeen() {
  if (currentFact.value) markFactSeen(currentFact.value.id)
}

function pauseAuto() {
  isPaused = true
  clearInterval(autoTimer)
}

function resumeAuto() {
  isPaused = false
  startAutoTimer()
}

function startAutoTimer() {
  clearInterval(autoTimer)
  if (!isPaused) {
    autoTimer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % displayFacts.value.length
    }, 6000)
  }
}

function resetAutoTimer() {
  if (!isPaused) startAutoTimer()
}

// ── Curiosity Nudge ──
const curiosityInfo = ref({ factsExplored: 0, totalFacts: 0, percentage: 0, topicsExplored: 0, streak: 0, level: '' })
const nudgeMessage = ref('')

onMounted(() => {
  displayFacts.value = shuffleFacts(FUN_FACTS).slice(0, 6)
  startAutoTimer()
  recordVisit()
  curiosityInfo.value = getCuriosityScore()
  nudgeMessage.value = getNextNudge()
})

onUnmounted(() => {
  clearInterval(autoTimer)
})
</script>

<style scoped lang="scss">
.hero {
  position: relative; padding: 60px 0 80px; overflow: hidden;
  background: linear-gradient(180deg, rgba(108, 92, 231, 0.05) 0%, transparent 100%);
}

.hero-bg-shapes { position: absolute; inset: 0; pointer-events: none; }
.shape {
  position: absolute; border-radius: 50%; opacity: 0.08;
  &-1 { width: 400px; height: 400px; background: var(--primary); top: -100px; right: -100px; animation: float 6s ease-in-out infinite; }
  &-2 { width: 200px; height: 200px; background: var(--secondary); bottom: -50px; left: -50px; animation: float 8s ease-in-out infinite 1s; }
  &-3 { width: 150px; height: 150px; background: var(--accent); top: 50%; left: 50%; animation: float 7s ease-in-out infinite 0.5s; }
}

.hero-content { text-align: center; position: relative; z-index: 1; }
.hero-emoji { font-size: 5rem; display: block; margin-bottom: 16px; }
.hero-title { font-size: 3rem; font-weight: 700; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-subtitle { font-size: 1.2rem; color: var(--text-light); max-width: 600px; margin: 0 auto 24px; line-height: 1.7; strong { color: var(--primary); } }
.hero-status { margin-bottom: 24px; }

.status-card {
  display: inline-flex; align-items: center; gap: 12px; padding: 16px 24px; border-radius: var(--radius); text-align: left; animation: pulse 2s ease-in-out infinite;
  &.warning { background: rgba(253, 203, 110, 0.15); border: 2px solid rgba(253, 203, 110, 0.3); }
}
.status-icon { font-size: 1.5rem; }
.status-info {
  strong { display: block; font-family: var(--font-display); color: #E17055; margin-bottom: 4px; }
  p { font-size: 0.9rem; color: var(--text-light); code { background: var(--code-bg); padding: 2px 8px; border-radius: 6px; font-size: 0.85rem; color: var(--primary); } }
}

.hero-actions { margin-bottom: 40px; }
.btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 32px; border-radius: 14px; font-size: 1.1rem; font-weight: 600; transition: all 0.3s ease;
}
.btn-primary {
  background: var(--primary); color: white; box-shadow: 0 6px 25px rgba(108, 92, 231, 0.35);
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 35px rgba(108, 92, 231, 0.45); }
}
.hero-hint { margin-top: 12px; font-size: 0.9rem; color: var(--text-muted); font-style: italic; }

.hero-features { display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; }
.feature { display: flex; align-items: center; gap: 6px; font-family: var(--font-display); font-weight: 500; color: var(--text-light); font-size: 0.95rem; }
.feature-icon { font-size: 1.3rem; }
.feature-divider { width: 4px; height: 4px; border-radius: 50%; background: var(--text-muted); }

/* ── Fun Fact Carousel ── */
.fun-fact-carousel-section { padding: 40px 20px; }

.carousel-wrapper { background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow); padding: 28px; overflow: hidden; }

.carousel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.carousel-title { font-size: 1.3rem; font-weight: 700; }
.carousel-explore-link {
  font-family: var(--font-display); font-weight: 600; font-size: 0.85rem; color: var(--primary);
  display: flex; align-items: center; gap: 4px; transition: color 0.2s;
  &:hover { color: var(--accent); }
  span { transition: transform 0.3s; }
  &:hover span { transform: translateX(3px); }
}

.carousel-track { display: flex; align-items: center; gap: 16px; position: relative; }

.carousel-btn {
  width: 40px; height: 40px; border-radius: 50%; background: var(--chip-bg); color: var(--text-light);
  font-size: 1.4rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all 0.2s; z-index: 2;
  &:hover { background: var(--primary); color: white; transform: scale(1.1); }
}

.carousel-card {
  flex: 1; min-width: 0; animation: fadeIn 0.4s ease;
}

.carousel-card-inner {
  padding: 16px; border-radius: var(--radius); border: 2px solid rgba(108, 92, 231, 0.08);
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.03), rgba(253, 121, 168, 0.03));
  transition: border-color 0.3s;
  &:hover { border-color: var(--topic-color, var(--primary)); }
}

.carousel-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.carousel-fact-icon { font-size: 2rem; }
.carousel-topic-badge {
  font-family: var(--font-display); font-weight: 600; font-size: 0.7rem; padding: 3px 10px;
  border-radius: 10px; border: 1px solid; text-transform: uppercase; letter-spacing: 0.5px;
}

.carousel-fact-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 6px; }
.carousel-fact-text { font-size: 0.9rem; color: var(--text-light); line-height: 1.5; margin-bottom: 12px; }

.carousel-card-actions {
  display: flex; justify-content: flex-end;
}
.carousel-detail-link {
  font-family: var(--font-display); font-weight: 600; font-size: 0.82rem; color: var(--primary);
  display: flex; align-items: center; gap: 4px;
  .arrow { transition: transform 0.3s; }
  &:hover .arrow { transform: translateX(3px); }
}

.carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 16px; }
.carousel-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--text-muted); transition: all 0.3s;
  &.active { background: var(--primary); width: 24px; border-radius: 4px; }
  &:hover { background: var(--primary-light); }
}

/* ── Curiosity Nudge ── */
.curiosity-nudge-section { padding: 0 20px 40px; }

.curiosity-nudge-card {
  display: flex; align-items: center; gap: 24px; padding: 20px 28px; border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.06), rgba(0, 206, 201, 0.06));
  border: 2px solid rgba(108, 92, 231, 0.1); flex-wrap: wrap;
}

.nudge-left { display: flex; align-items: center; gap: 12px; }
.nudge-emoji { font-size: 2.2rem; }
.nudge-info { display: flex; flex-direction: column; gap: 2px; }
.nudge-title { font-family: var(--font-display); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; }
.nudge-level { font-family: var(--font-display); font-weight: 700; font-size: 1rem; color: var(--primary); }

.nudge-center { display: flex; flex-direction: column; gap: 4px; min-width: 140px; }
.mini-curiosity-bar { width: 100%; height: 6px; background: rgba(108, 92, 231, 0.12); border-radius: 3px; overflow: hidden; }
.mini-curiosity-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 3px; transition: width 0.8s ease; }
.mini-curiosity-count { font-size: 0.75rem; color: var(--text-muted); text-align: center; }

.nudge-right { flex: 1; }
.nudge-message { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--text-light); line-height: 1.5; }

/* ── Topics Preview ── */
.topics-preview { padding: 60px 20px; }
.section-title { text-align: center; font-size: 2rem; font-weight: 700; margin-bottom: 40px; color: var(--text); }
.topics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }

.topic-card {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow); transition: all 0.3s ease; border: 2px solid transparent; position: relative; overflow: hidden;
  &:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); border-color: var(--border); .topic-icon-wrapper { transform: scale(1.1) rotate(5deg); } .topic-action span { transform: translateX(4px); } }
}

.topic-icon-wrapper { width: 64px; height: 64px; border-radius: 18px; background: var(--topic-gradient); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; transition: transform 0.3s ease; }
.topic-icon { font-size: 2rem; }
.topic-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 8px; }
.topic-description { font-size: 0.9rem; color: var(--text-light); margin-bottom: 16px; line-height: 1.5; }

.topic-fun-fact {
  background: rgba(253, 203, 110, 0.1); border-radius: 12px; padding: 12px; margin-bottom: 16px;
  .fun-fact-label { font-family: var(--font-display); font-weight: 600; font-size: 0.8rem; color: #E17055; display: block; margin-bottom: 4px; }
  p { font-size: 0.8rem; color: var(--text-light); line-height: 1.4; }
}

.topic-action { font-family: var(--font-display); font-weight: 600; color: var(--primary); font-size: 0.95rem; display: flex; align-items: center; gap: 4px; span { transition: transform 0.3s ease; } }

/* ── How It Works ── */
.how-it-works { padding: 40px 20px 80px; }
.steps-grid { display: flex; align-items: flex-start; justify-content: center; gap: 16px; flex-wrap: wrap; }

.step {
  text-align: center; padding: 24px; max-width: 220px; position: relative;
  h3 { font-size: 1.1rem; margin-bottom: 8px; }
  p { font-size: 0.9rem; color: var(--text-light); line-height: 1.5; }
}

.step-number { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; font-family: var(--font-display); font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
.step-icon { font-size: 3rem; margin-bottom: 12px; display: block; margin-top: 16px; }
.step-arrow { font-size: 1.5rem; color: var(--primary-light); margin-top: 60px; font-weight: 700; }

@keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

@media (max-width: 640px) {
  .hero-title { font-size: 2rem; }
  .hero-emoji { font-size: 3.5rem; }
  .hero-subtitle { font-size: 1rem; }
  .feature-divider { display: none; }
  .hero-features { gap: 12px; }
  .step-arrow { display: none; }
  .carousel-track { flex-direction: column; }
  .carousel-btn { width: 100%; border-radius: 10px; height: 36px; }
  .carousel-card { width: 100%; }
  .curiosity-nudge-card { flex-direction: column; align-items: flex-start; }
}
</style>

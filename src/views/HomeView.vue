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
        <h1 class="hero-title animate-slide-up">
          Hey, Curious Kid!
        </h1>
        <p class="hero-subtitle animate-slide-up">
          Want to know how rockets fly? Why plants are green? How computers think?
          <br>Dive into <strong>STEM adventures</strong> powered by your own local AI tutor!
        </p>

        <div class="hero-status animate-slide-up" v-if="!connected">
          <div class="status-card warning">
            <span class="status-icon">⚠️</span>
            <div class="status-info">
              <strong>Oops! Ollama is not running</strong>
              <p>Start Ollama on your computer to begin learning: <code>ollama serve</code></p>
            </div>
          </div>
        </div>

        <div class="hero-actions animate-slide-up">
          <router-link to="/topics" class="btn btn-primary btn-lg">
            <span>🎯</span> Start Exploring
          </router-link>
          <div class="hero-hint">
            Choose a topic and ask anything!
          </div>
        </div>

        <div class="hero-features animate-slide-up">
          <div class="feature">
            <span class="feature-icon">🤖</span>
            <span class="feature-text">AI Tutor</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature">
            <span class="feature-icon">🎮</span>
            <span class="feature-text">Fun Quizzes</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature">
            <span class="feature-icon">🔒</span>
            <span class="feature-text">100% Private</span>
          </div>
          <div class="feature-divider"></div>
          <div class="feature">
            <span class="feature-icon">💡</span>
            <span class="feature-text">Ask Anything</span>
          </div>
        </div>
      </div>
    </section>

    <section class="topics-preview container">
      <h2 class="section-title">Choose Your Adventure</h2>
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
            <span class="fun-fact-label">💡 Fun Fact</span>
            <p>{{ topic.funFact }}</p>
          </div>
          <div class="topic-action">
            Explore <span>→</span>
          </div>
        </router-link>
      </div>
    </section>

    <section class="how-it-works container">
      <h2 class="section-title">How It Works</h2>
      <div class="steps-grid">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-icon">📋</div>
          <h3>Pick a Topic</h3>
          <p>Choose from Science, Technology, Engineering, or Math</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-icon">💬</div>
          <h3>Ask Questions</h3>
          <p>Talk to your AI tutor and explore any concept</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-icon">🏆</div>
          <h3>Take a Quiz</h3>
          <p>Test what you learned and become a STEM champion!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { STEM_TOPICS } from '../data/topics'

const connected = inject('isConnected', false)
const topics = STEM_TOPICS
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  padding: 60px 0 80px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(108, 92, 231, 0.05) 0%, transparent 100%);
}

.hero-bg-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;

  &-1 {
    width: 400px;
    height: 400px;
    background: var(--primary);
    top: -100px;
    right: -100px;
    animation: float 6s ease-in-out infinite;
  }

  &-2 {
    width: 200px;
    height: 200px;
    background: var(--secondary);
    bottom: -50px;
    left: -50px;
    animation: float 8s ease-in-out infinite 1s;
  }

  &-3 {
    width: 150px;
    height: 150px;
    background: var(--accent);
    top: 50%;
    left: 50%;
    animation: float 7s ease-in-out infinite 0.5s;
  }
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-emoji {
  font-size: 5rem;
  display: block;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto 24px;
  line-height: 1.7;

  strong {
    color: var(--primary);
  }
}

.hero-status {
  margin-bottom: 24px;
}

.status-card {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: var(--radius);
  text-align: left;
  animation: pulse 2s ease-in-out infinite;

  &.warning {
    background: rgba(253, 203, 110, 0.15);
    border: 2px solid rgba(253, 203, 110, 0.3);
  }
}

.status-icon {
  font-size: 1.5rem;
}

.status-info {
  strong {
    display: block;
    font-family: var(--font-display);
    color: #E17055;
    margin-bottom: 4px;
  }

  p {
    font-size: 0.9rem;
    color: var(--text-light);

    code {
      background: rgba(108, 92, 231, 0.1);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.85rem;
      color: var(--primary);
    }
  }
}

.hero-actions {
  margin-bottom: 40px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 6px 25px rgba(108, 92, 231, 0.35);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 35px rgba(108, 92, 231, 0.45);
  }
}

.hero-hint {
  margin-top: 12px;
  font-size: 0.9rem;
  color: var(--text-muted);
  font-style: italic;
}

.hero-features {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 500;
  color: var(--text-light);
  font-size: 0.95rem;
}

.feature-icon {
  font-size: 1.3rem;
}

.feature-divider {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-muted);
}

/* Topics Preview */
.topics-preview {
  padding: 60px 20px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: var(--text);
}

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.topic-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-hover);
    border-color: rgba(108, 92, 231, 0.15);

    .topic-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .topic-action span {
      transform: translateX(4px);
    }
  }
}

.topic-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: var(--topic-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: transform 0.3s ease;
}

.topic-icon {
  font-size: 2rem;
}

.topic-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.topic-description {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 16px;
  line-height: 1.5;
}

.topic-fun-fact {
  background: rgba(253, 203, 110, 0.1);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;

  .fun-fact-label {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.8rem;
    color: #E17055;
    display: block;
    margin-bottom: 4px;
  }

  p {
    font-size: 0.8rem;
    color: var(--text-light);
    line-height: 1.4;
  }
}

.topic-action {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--primary);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    transition: transform 0.3s ease;
  }
}

/* How it works */
.how-it-works {
  padding: 40px 20px 80px;
}

.steps-grid {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.step {
  text-align: center;
  padding: 24px;
  max-width: 220px;
  position: relative;
}

.step-number {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  font-family: var(--font-display);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.step-icon {
  font-size: 3rem;
  margin-bottom: 12px;
  display: block;
  margin-top: 16px;
}

.step h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.step p {
  font-size: 0.9rem;
  color: var(--text-light);
  line-height: 1.5;
}

.step-arrow {
  font-size: 1.5rem;
  color: var(--primary-light);
  margin-top: 60px;
  font-weight: 700;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-emoji {
    font-size: 3.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .feature-divider {
    display: none;
  }

  .hero-features {
    gap: 12px;
  }

  .step-arrow {
    display: none;
  }
}
</style>

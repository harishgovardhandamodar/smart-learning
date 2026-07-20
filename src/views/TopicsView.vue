<template>
  <div class="topics-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title animate-slide-up">🎯 {{ t('topics.title') }}</h1>
        <p class="page-subtitle animate-slide-up">{{ t('topics.subtitle') }}</p>
      </div>

      <div class="topics-grid">
        <div
          v-for="(topic, index) in topics"
          :key="topic.id"
          class="topic-card-large animate-slide-up"
          :style="{ '--topic-gradient': topic.gradient, animationDelay: `${index * 0.1}s` }"
        >
          <div class="topic-header">
            <div class="topic-icon-big">{{ topic.icon }}</div>
            <h2>{{ topic.title }}</h2>
          </div>
          <p class="topic-desc">{{ topic.description }}</p>
          <div class="subtopics">
            <h4>{{ t('topics.learnAbout') }}</h4>
            <div class="subtopic-tags">
              <span v-for="sub in topic.subtopics" :key="sub" class="subtopic-tag">{{ sub }}</span>
            </div>
          </div>
          <div class="topic-fun-fact">
            <span>💡</span> {{ topic.funFact }}
          </div>
          <div class="topic-actions">
            <router-link :to="`/learn/${topic.id}`" class="btn btn-primary">
              💬 {{ t('topics.chatLearn') }}
            </router-link>
            <router-link :to="`/quiz/${topic.id}`" class="btn btn-secondary">
              🧩 {{ t('topics.takeQuiz') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { STEM_TOPICS } from '../data/topics'
const t = inject('t')
const topics = STEM_TOPICS
</script>

<style scoped lang="scss">
.topics-page { padding: 40px 0 80px; }
.page-header { text-align: center; margin-bottom: 48px; }
.page-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 8px; }
.page-subtitle { font-size: 1.1rem; color: var(--text-light); }
.topics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 28px; }

.topic-card-large {
  background: var(--bg-card); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow); border: 2px solid transparent; transition: all 0.3s ease; position: relative; overflow: hidden;
  &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--topic-gradient); }
  &:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); border-color: var(--border); }
}

.topic-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.topic-icon-big { font-size: 2.8rem; }
.topic-header h2 { font-size: 1.6rem; font-weight: 700; }
.topic-desc { font-size: 0.95rem; color: var(--text-light); line-height: 1.6; margin-bottom: 20px; }

.subtopics { margin-bottom: 16px; h4 { font-size: 0.9rem; color: var(--text); margin-bottom: 10px; font-weight: 600; } }
.subtopic-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.subtopic-tag { background: var(--chip-bg); color: var(--primary); padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }

.topic-fun-fact { background: rgba(253, 203, 110, 0.1); border-radius: 12px; padding: 12px 16px; font-size: 0.85rem; color: var(--text-light); margin-bottom: 20px; line-height: 1.5; span { margin-right: 4px; } }
.topic-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.btn { padding: 10px 22px; border-radius: 12px; font-size: 0.95rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; transition: all 0.3s ease; }
.btn-primary { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3); &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4); } }
.btn-secondary { background: var(--chip-bg); color: var(--primary); &:hover { background: var(--border); transform: translateY(-2px); } }

@media (max-width: 640px) { .page-title { font-size: 1.8rem; } .topics-grid { grid-template-columns: 1fr; } }
</style>

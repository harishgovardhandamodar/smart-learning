<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <span class="footer-brand">🧪 SmartLearning</span>
        <span class="footer-tagline">{{ t('footer.tagline') }}</span>
      </div>
      <div class="footer-powered">
        {{ t('footer.poweredBy') }} <strong>Ollama</strong> + <strong>Vue.js</strong>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject } from 'vue'
const t = inject('t')
</script>

<style scoped lang="scss">
.footer {
  background: linear-gradient(135deg, #2D3436, #636E72);
  color: white;
  padding: 24px 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-brand {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
}

.footer-tagline {
  font-size: 0.9rem;
  opacity: 0.7;
}

.footer-powered {
  font-size: 0.8rem;
  opacity: 0.6;

  strong {
    color: #A29BFE;
    opacity: 1;
  }
}
</style>

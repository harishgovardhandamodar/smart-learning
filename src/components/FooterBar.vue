<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <span class="footer-brand">🧪 SmartLearning</span>
        <span class="footer-tagline">STEM adventures for curious minds!</span>
      </div>
      <div class="footer-powered">
        Powered by <strong>Ollama</strong> + <strong>Vue.js</strong>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: linear-gradient(135deg, #2D3436, #636E72);
  color: white;
  padding: 24px 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
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
    color: var(--primary-light);
    opacity: 1;
  }
}
</style>

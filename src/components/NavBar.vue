<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        <span class="brand-icon">🧪</span>
        <span class="brand-text">Smart<span class="brand-highlight">Learning</span></span>
      </router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link" exact-active-class="active">
          <span class="nav-icon">🏠</span>
          {{ t('nav.home') }}
        </router-link>
        <router-link to="/topics" class="nav-link" active-class="active">
          <span class="nav-icon">🎯</span>
          {{ t('nav.topics') }}
        </router-link>
      </div>

      <div class="nav-actions">
        <button class="lang-btn" @click="cycleLang" :title="locale === 'en' ? 'Nederlands' : 'English'">
          {{ locale === 'en' ? '🇳🇱' : '🇬🇧' }}
        </button>
        <button class="theme-btn" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <div class="connection-badge" :class="{ connected: isConnected }">
          <span class="status-dot"></span>
          <span class="status-text">{{ isConnected ? t('nav.connected') : t('nav.disconnected') }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'

const isConnected = inject('isConnected')
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')
const t = inject('t')
const setLocale = inject('setLocale')
const locale = inject('locale')
const isScrolled = ref(false)

function cycleLang() {
  setLocale(locale.value === 'en' ? 'nl' : 'en')
}

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;

  &.scrolled {
    border-bottom-color: var(--border);
    box-shadow: var(--shadow);
  }
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }
}

.brand-icon {
  font-size: 2rem;
  animation: wiggle 2s ease-in-out infinite;
}

.brand-highlight {
  color: var(--primary);
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 12px;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--text-light);
  transition: all 0.3s ease;

  &:hover {
    background: var(--chip-bg);
    color: var(--primary);
    transform: translateY(-1px);
  }

  &.active {
    background: var(--primary);
    color: white;
    box-shadow: 0 4px 15px rgba(108, 92, 231, 0.3);
  }
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-btn, .theme-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--chip-bg);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: var(--border);
  }
}

.connection-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 118, 117, 0.1);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--danger);

  &.connected {
    background: rgba(0, 184, 148, 0.1);
    color: var(--success);
  }
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--danger);
  animation: pulse 2s ease-in-out infinite;

  .connected & {
    background: var(--success);
  }
}

.status-text {
  display: none;

  @media (min-width: 640px) {
    display: inline;
  }
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0 16px;
  }

  .nav-brand .brand-text {
    display: none;
  }

  .nav-link span:not(.nav-icon) {
    display: none;
  }

  .nav-link {
    padding: 8px 12px;
  }
}
</style>

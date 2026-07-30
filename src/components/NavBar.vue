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
        <router-link to="/focus" class="nav-link" active-class="active">
          <span class="nav-icon">🧠</span>
          {{ t('nav.focus') }}
        </router-link>
        <router-link v-if="selectedKid" to="/dashboard" class="nav-link" active-class="active">
          <span class="nav-icon">📊</span>
          {{ t('nav.dashboard') }}
        </router-link>
      </div>

      <div class="nav-actions">
        <div v-if="selectedKid" class="kid-pill" @click="goToEnroll" :title="selectedKid.name">
          <span>{{ selectedKid.avatar }}</span>
          <span class="kid-pill-name">{{ selectedKid.name }}</span>
        </div>
        <button v-if="!selectedKid" class="lang-btn" @click="goToEnroll" :title="t('nav.enroll')">
          🧒
        </button>
        <button class="lang-btn" @click="cycleLang" :title="locale === 'en' ? 'Nederlands' : 'English'">
          {{ locale === 'en' ? '🇳🇱' : '🇬🇧' }}
        </button>
        <button class="theme-btn" @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <div class="connection-badge" :class="{ connected: isConnected }" @click.stop="toggleModelDropdown">
          <span class="status-dot"></span>
          <span class="status-text">{{ isConnected ? t('nav.connected') : t('nav.disconnected') }}</span>
        </div>
        <div v-if="showModelDropdown" class="model-dropdown" @click.stop>
          <div class="model-dropdown-header">
            <span>🤖 {{ t('nav.selectModel') }}</span>
            <button class="model-dropdown-close" @click="showModelDropdown = false">×</button>
          </div>
          <div v-if="availableModels.length === 0" class="model-dropdown-empty">
            {{ t('nav.noModels') }}
          </div>
          <button v-for="m in availableModels" :key="m.name"
            class="model-option" :class="{ active: selectedModel === m.name }"
            @click="selectModel(m.name)">
            <span class="model-name">{{ m.name }}</span>
            <span v-if="selectedModel === m.name" class="model-check">✓</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'

import { useRouter } from 'vue-router'

const router = useRouter()
const isConnected = inject('isConnected')
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')
const t = inject('t')
const setLocale = inject('setLocale')
const locale = inject('locale')
const selectedKid = inject('selectedKid')
const selectedModel = inject('selectedModel')
const availableModels = inject('availableModels')
const setSelectedModel = inject('setSelectedModel')
const isScrolled = ref(false)
const showModelDropdown = ref(false)

function goToEnroll() {
  router.push('/enroll')
}

function cycleLang() {
  setLocale(locale.value === 'en' ? 'nl' : 'en')
}

function toggleModelDropdown() {
  showModelDropdown.value = !showModelDropdown.value
}

function selectModel(name) {
  setSelectedModel(name)
  showModelDropdown.value = false
}

function closeDropdown(e) {
  if (showModelDropdown.value) showModelDropdown.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', closeDropdown)
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', closeDropdown)
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
  position: relative;
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
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: scale(1.03);
  }

  &.connected {
    background: rgba(0, 184, 148, 0.1);
    color: var(--success);
  }
}

.model-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 200;
  overflow: hidden;
}

.model-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  font-weight: 700;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border);
}

.model-dropdown-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--text-muted);
  padding: 0 4px;
  &:hover { color: var(--danger); }
}

.model-dropdown-empty {
  padding: 16px 14px;
  font-size: 0.82rem;
  color: var(--text-muted);
  text-align: center;
}

.model-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s;
  color: var(--text);

  &:hover { background: var(--chip-bg); }
  &.active { background: rgba(108, 92, 231, 0.08); color: var(--primary); font-weight: 600; }
}

.model-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.model-check {
  color: var(--primary);
  font-weight: 700;
  flex-shrink: 0;
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

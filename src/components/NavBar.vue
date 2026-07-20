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
          Home
        </router-link>
        <router-link to="/topics" class="nav-link" active-class="active">
          <span class="nav-icon">🎯</span>
          Topics
        </router-link>
      </div>

      <div class="nav-status">
        <div class="connection-badge" :class="{ connected: isConnected }">
          <span class="status-dot"></span>
          <span class="status-text">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'

const isConnected = inject('isConnected')
const isScrolled = ref(false)

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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;

  &.scrolled {
    border-bottom-color: rgba(108, 92, 231, 0.1);
    box-shadow: 0 2px 20px rgba(108, 92, 231, 0.08);
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
    background: rgba(108, 92, 231, 0.08);
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

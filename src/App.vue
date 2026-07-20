<template>
  <div id="smart-learning">
    <NavBar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterBar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { checkConnection } from './services/ollama'
import { useTheme } from './theme'
import { useI18n } from './i18n'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'

const { isDark, toggleTheme } = useTheme()
const { t, setLocale, locale, currentLocale } = useI18n()

provide('isConnected', ref(false))
provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
provide('t', t)
provide('setLocale', setLocale)
provide('locale', locale)
provide('currentLocale', currentLocale)

const isConnected = ref(false)
provide('isConnected', isConnected)

async function checkStatus() {
  isConnected.value = await checkConnection()
}

onMounted(() => {
  checkStatus()
  const interval = setInterval(checkStatus, 15000)
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.main-content {
  flex: 1;
  padding-top: 72px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

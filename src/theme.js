import { ref, computed, watchEffect } from 'vue'
import { storage } from './utils/storage'

const stored = storage.get('theme', null)
const isDark = ref(stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  watchEffect(() => {
    storage.set('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  })

  applyTheme()

  return { isDark, toggleTheme }
}

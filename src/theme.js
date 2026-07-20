import { ref, computed, watchEffect } from 'vue'

const stored = localStorage.getItem('theme')
const isDark = ref(stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches)

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  watchEffect(() => {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  })

  applyTheme()

  return { isDark, toggleTheme }
}

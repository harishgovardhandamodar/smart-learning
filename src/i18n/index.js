import { ref, computed } from 'vue'
import en from './locales/en.js'
import nl from './locales/nl.js'

const locales = { en, nl }
const currentLocale = ref(localStorage.getItem('locale') || 'en')

export function useI18n() {
  function t(key) {
    const keys = key.split('.')
    let val = locales[currentLocale.value]
    for (const k of keys) {
      if (val && typeof val === 'object') val = val[k]
      else return key
    }
    return val
  }

  function setLocale(locale) {
    if (locales[locale]) {
      currentLocale.value = locale
      localStorage.setItem('locale', locale)
      document.documentElement.lang = locale
    }
  }

  const locale = computed(() => currentLocale.value)

  return { t, setLocale, locale, currentLocale }
}

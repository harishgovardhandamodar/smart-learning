// ── Type-safe localStorage wrapper ──

export const storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch { /* quota exceeded or private browsing */ }
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  has(key) {
    return localStorage.getItem(key) !== null
  },
}

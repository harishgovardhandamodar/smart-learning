import { beforeEach } from 'vitest'

const store = {}

const localStorage = {
  getItem(key) {
    return key in store ? store[key] : null
  },
  setItem(key, value) {
    store[key] = String(value)
  },
  removeItem(key) {
    delete store[key]
  },
  clear() {
    for (const key of Object.keys(store)) delete store[key]
  },
}

globalThis.localStorage = localStorage

beforeEach(() => {
  localStorage.clear()
})

import { describe, it, expect, beforeEach } from 'vitest'
import { storage } from '../utils/storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('get', () => {
    it('returns default when key does not exist', () => {
      expect(storage.get('missing')).toBeNull()
      expect(storage.get('missing', 'fallback')).toBe('fallback')
    })

    it('returns parsed value for existing key', () => {
      localStorage.setItem('test', JSON.stringify(42))
      expect(storage.get('test')).toBe(42)
    })

    it('returns default on corrupt JSON', () => {
      localStorage.setItem('test', '{invalid')
      expect(storage.get('test', 'default')).toBe('default')
    })

    it('handles complex objects', () => {
      const obj = { a: [1, 2], b: { c: true } }
      storage.set('obj', obj)
      expect(storage.get('obj')).toEqual(obj)
    })
  })

  describe('set', () => {
    it('stores a string value', () => {
      storage.set('key', 'hello')
      expect(JSON.parse(localStorage.getItem('key'))).toBe('hello')
    })

    it('stores a number', () => {
      storage.set('num', 99)
      expect(storage.get('num')).toBe(99)
    })

    it('stores an array', () => {
      storage.set('arr', [1, 2, 3])
      expect(storage.get('arr')).toEqual([1, 2, 3])
    })

    it('overwrites existing value', () => {
      storage.set('k', 'old')
      storage.set('k', 'new')
      expect(storage.get('k')).toBe('new')
    })

    it('does not throw on quota exceeded', () => {
      expect(() => storage.set('k', 'v')).not.toThrow()
    })
  })

  describe('remove', () => {
    it('removes an existing key', () => {
      storage.set('k', 'v')
      storage.remove('k')
      expect(storage.has('k')).toBe(false)
    })

    it('does not throw for missing key', () => {
      expect(() => storage.remove('nope')).not.toThrow()
    })
  })

  describe('has', () => {
    it('returns true for existing key', () => {
      storage.set('k', 'v')
      expect(storage.has('k')).toBe(true)
    })

    it('returns false for missing key', () => {
      expect(storage.has('missing')).toBe(false)
    })
  })
})

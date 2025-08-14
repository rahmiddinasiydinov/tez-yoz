// A safe wrapper around localStorage that works in SSR and restricted environments.
// Provides JSON helpers and an in-memory fallback when storage is unavailable.

export type SafeStorage = {
  isAvailable: boolean
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
  getJSON: <T>(key: string, fallback: T) => T
  setJSON: (key: string, value: any) => void
}

function createMemoryStorage(): Storage {
  const store = new Map<string, string>()
  return {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null
    },
    removeItem(key: string) {
      store.delete(key)
    },
    setItem(key: string, value: string) {
      store.set(key, value)
    },
  }
}

function detectStorage(): { storage: Storage; available: boolean } {
  if (typeof window === "undefined") {
    return { storage: createMemoryStorage(), available: false }
  }
  try {
    const testKey = "__storage_test__"
    window.localStorage.setItem(testKey, "1")
    window.localStorage.removeItem(testKey)
    return { storage: window.localStorage, available: true }
  } catch {
    return { storage: createMemoryStorage(), available: false }
  }
}

const { storage, available } = detectStorage()

export const safeStorage: SafeStorage = {
  isAvailable: available,
  getItem(key: string) {
    try {
      return storage.getItem(key)
    } catch {
      return null
    }
  },
  setItem(key: string, value: string) {
    try {
      storage.setItem(key, value)
    } catch {
      // ignore
    }
  },
  removeItem(key: string) {
    try {
      storage.removeItem(key)
    } catch {
      // ignore
    }
  },
  getJSON<T>(key: string, fallback: T): T {
    const raw = safeStorage.getItem(key)
    if (raw == null) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },
  setJSON(key: string, value: any) {
    try {
      const raw = JSON.stringify(value)
      safeStorage.setItem(key, raw)
    } catch {
      // ignore
    }
  },
}

export default safeStorage

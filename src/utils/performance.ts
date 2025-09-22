/**
 * Performance optimization utilities
 * Provides memoization, debouncing, throttling, and other performance helpers
 */

import { useMemo, useCallback, useRef, useEffect } from 'react'

/**
 * Memoization utilities
 */
export const createMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  equalityFn?: (a: R, b: R) => boolean
) => {
  let lastResult: R
  let lastState: T

  return (state: T): R => {
    if (state === lastState) {
      return lastResult
    }

    const result = selector(state)

    if (equalityFn ? equalityFn(result, lastResult) : result === lastResult) {
      return lastResult
    }

    lastState = state
    lastResult = result
    return result
  }
}

/**
 * Deep equality check for memoization
 */
export const deepEqual = <T>(a: T, b: T): boolean => {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false

  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false

    if (Array.isArray(a)) {
      if (a.length !== (b as any).length) return false
      return a.every((item, index) => deepEqual(item, (b as any)[index]))
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every(key => keysB.includes(key) && deepEqual((a as any)[key], (b as any)[key]))
  }

  return false
}

/**
 * Shallow equality check for memoization
 */
export const shallowEqual = <T>(a: T, b: T): boolean => {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false

  if (typeof a === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every(key => (a as any)[key] === (b as any)[key])
  }

  return false
}

/**
 * Object pooling for frequently created objects
 */
export class ObjectPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn: (obj: T) => void
  private maxSize: number

  constructor(createFn: () => T, resetFn: (obj: T) => void, maxSize: number = 50) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.maxSize = maxSize
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return this.createFn()
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj)
      this.pool.push(obj)
    }
  }

  clear(): void {
    this.pool.length = 0
  }

  get size(): number {
    return this.pool.length
  }
}

/**
 * Debounce utility
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): T => {
  let timeout: NodeJS.Timeout | null = null

  return ((...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }

    const callNow = immediate && !timeout

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func(...args)
  }) as T
}

/**
 * Throttle utility
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean = false

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

/**
 * Request deduplication
 */
export class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>()

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key)
    })

    this.pendingRequests.set(key, promise)
    return promise
  }

  clear(): void {
    this.pendingRequests.clear()
  }
}

/**
 * Cache with TTL (Time To Live)
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expires: number }>()
  private ttl: number

  constructor(ttl: number = 5 * 60 * 1000) {
    // 5 minutes default
    this.ttl = ttl
  }

  set(key: K, value: V): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + this.ttl,
    })
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key)

    if (!item) return undefined

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return undefined
    }

    return item.value
  }

  has(key: K): boolean {
    const item = this.cache.get(key)
    return item ? Date.now() <= item.expires : false
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }
}

/**
 * Batch operations utility
 */
export class Batcher<T> {
  private batch: T[] = []
  private timeout: NodeJS.Timeout | null = null
  private batchSize: number
  private batchDelay: number
  private processor: (items: T[]) => void

  constructor(processor: (items: T[]) => void, batchSize: number = 10, batchDelay: number = 100) {
    this.processor = processor
    this.batchSize = batchSize
    this.batchDelay = batchDelay
  }

  add(item: T): void {
    this.batch.push(item)

    if (this.batch.length >= this.batchSize) {
      this.flush()
    } else if (!this.timeout) {
      this.timeout = setTimeout(() => this.flush(), this.batchDelay)
    }
  }

  flush(): void {
    if (this.batch.length > 0) {
      this.processor([...this.batch])
      this.batch.length = 0
    }

    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}

/**
 * Performance measurement utility
 */
export const measurePerformance = <T>(name: string, fn: () => T, logResult: boolean = false): T => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  const duration = end - start

  if (logResult) {
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
  }

  return result
}

/**
 * Async performance measurement utility
 */
export const measureAsyncPerformance = async <T>(
  name: string,
  fn: () => Promise<T>,
  logResult: boolean = false
): Promise<T> => {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  const duration = end - start

  if (logResult) {
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
  }

  return result
}

/**
 * Memory usage monitoring
 */
export const getMemoryUsage = (): {
  used: number
  total: number
  limit: number
} | null => {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    }
  }
  return null
}

/**
 * Bundle size monitoring
 */
export const getBundleSize = (): number => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    return navigation.transferSize || 0
  }
  return 0
}

/**
 * React-specific performance utilities
 */

/**
 * Memoized component factory
 */
export const createMemoizedComponent = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  return React.memo(Component, areEqual)
}

/**
 * Memoized callback factory
 */
export const createMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps) as T
}

/**
 * Memoized value factory
 */
export const createMemoizedValue = <T>(value: () => T, deps: React.DependencyList): T => {
  return useMemo(value, deps)
}

/**
 * Virtual scrolling utilities
 */
export interface VirtualScrollItem {
  id: string | number
  height: number
  data: any
}

export const calculateVirtualScroll = (
  items: VirtualScrollItem[],
  containerHeight: number,
  scrollTop: number,
  overscan: number = 5
) => {
  let totalHeight = 0
  let startIndex = 0
  let endIndex = items.length - 1

  // Find start index
  for (let i = 0; i < items.length; i++) {
    if (totalHeight + items[i].height >= scrollTop) {
      startIndex = Math.max(0, i - overscan)
      break
    }
    totalHeight += items[i].height
  }

  // Find end index
  let currentHeight = 0
  for (let i = startIndex; i < items.length; i++) {
    currentHeight += items[i].height
    if (currentHeight >= containerHeight + scrollTop) {
      endIndex = Math.min(items.length - 1, i + overscan)
      break
    }
  }

  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex + 1),
    totalHeight: items.reduce((sum, item) => sum + item.height, 0),
  }
}

/**
 * Image lazy loading utility
 */
export const createLazyImageObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * Preload critical resources
 */
export const preloadResource = (href: string, as: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to preload ${href}`))
    document.head.appendChild(link)
  })
}

/**
 * Prefetch resources
 */
export const prefetchResource = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to prefetch ${href}`))
    document.head.appendChild(link)
  })
}

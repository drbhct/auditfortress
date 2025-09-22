import { useEffect, useRef, useCallback } from 'react'

/**
 * Performance monitoring and optimization utilities
 */

interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  componentName: string
  timestamp: number
}

interface PerformanceConfig {
  enableLogging?: boolean
  enableMemoryTracking?: boolean
  enableRenderTracking?: boolean
  logThreshold?: number // Log only if render time exceeds threshold
}

/**
 * Hook for monitoring component performance
 */
export const usePerformance = (
  componentName: string,
  config: PerformanceConfig = {}
) => {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    enableMemoryTracking = true,
    enableRenderTracking = true,
    logThreshold = 16, // 16ms = 60fps threshold
  } = config

  const renderStartTime = useRef<number>(0)
  const renderCount = useRef<number>(0)

  // Track render start
  useEffect(() => {
    if (enableRenderTracking) {
      renderStartTime.current = performance.now()
      renderCount.current += 1
    }
  })

  // Track render end and log metrics
  useEffect(() => {
    if (enableRenderTracking && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current
      
      if (enableLogging && renderTime > logThreshold) {
        console.warn(
          `🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (render #${renderCount.current})`
        )
      }

      // Track performance metrics
      if (enableMemoryTracking && 'memory' in performance) {
        const memory = (performance as any).memory
        const metrics: PerformanceMetrics = {
          renderTime,
          memoryUsage: memory.usedJSHeapSize,
          componentName,
          timestamp: Date.now(),
        }

        // Store metrics for analysis
        storePerformanceMetrics(metrics)
      }
    }
  })

  return {
    renderCount: renderCount.current,
    logSlowRender: useCallback((threshold: number = logThreshold) => {
      const renderTime = performance.now() - renderStartTime.current
      if (renderTime > threshold) {
        console.warn(
          `🐌 Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`
        )
      }
    }, [componentName, logThreshold]),
  }
}

/**
 * Hook for measuring async operations
 */
export const useAsyncPerformance = () => {
  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string,
    threshold: number = 1000
  ): Promise<T> => {
    const startTime = performance.now()
    
    try {
      const result = await operation()
      const duration = performance.now() - startTime
      
      if (duration > threshold) {
        console.warn(
          `🐌 Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`
        )
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - startTime
      console.error(
        `❌ Failed async operation: ${operationName} failed after ${duration.toFixed(2)}ms`,
        error
      )
      throw error
    }
  }, [])

  return { measureAsync }
}

/**
 * Hook for optimizing expensive calculations
 */
export const useOptimizedCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList,
  options: {
    enableLogging?: boolean
    calculationName?: string
  } = {}
) => {
  const { enableLogging = false, calculationName = 'calculation' } = options
  const calculationCount = useRef(0)

  const optimizedCalculation = useCallback(() => {
    if (enableLogging) {
      const startTime = performance.now()
      calculationCount.current += 1
      
      const result = calculation()
      
      const duration = performance.now() - startTime
      console.log(
        `🧮 ${calculationName} #${calculationCount.current}: ${duration.toFixed(2)}ms`
      )
      
      return result
    }
    
    return calculation()
  }, dependencies)

  return optimizedCalculation
}

/**
 * Hook for memory usage monitoring
 */
export const useMemoryMonitoring = (componentName: string) => {
  const memoryRef = useRef<number>(0)

  useEffect(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const currentMemory = memory.usedJSHeapSize
      const previousMemory = memoryRef.current

      if (previousMemory > 0) {
        const memoryDiff = currentMemory - previousMemory
        const memoryDiffMB = (memoryDiff / 1024 / 1024).toFixed(2)
        
        if (Math.abs(memoryDiff) > 1024 * 1024) { // 1MB threshold
          console.log(
            `🧠 Memory change in ${componentName}: ${memoryDiffMB}MB (${(currentMemory / 1024 / 1024).toFixed(2)}MB total)`
          )
        }
      }

      memoryRef.current = currentMemory
    }
  })

  return {
    getCurrentMemory: () => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    },
  }
}

/**
 * Hook for debouncing expensive operations
 */
export const useDebouncedOperation = <T>(
  operation: (value: T) => void,
  delay: number = 300
) => {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const debouncedOperation = useCallback((value: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      operation(value)
    }, delay)
  }, [operation, delay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedOperation
}

/**
 * Hook for throttling frequent operations
 */
export const useThrottledOperation = <T>(
  operation: (value: T) => void,
  delay: number = 100
) => {
  const lastExecutionRef = useRef<number>(0)

  const throttledOperation = useCallback((value: T) => {
    const now = Date.now()
    
    if (now - lastExecutionRef.current >= delay) {
      operation(value)
      lastExecutionRef.current = now
    }
  }, [operation, delay])

  return throttledOperation
}

/**
 * Hook for measuring component mount/unmount times
 */
export const useLifecyclePerformance = (componentName: string) => {
  const mountTime = useRef<number>(0)

  useEffect(() => {
    mountTime.current = performance.now()
    console.log(`🚀 ${componentName} mounted`)

    return () => {
      const unmountTime = performance.now()
      const lifetime = unmountTime - mountTime.current
      console.log(`💀 ${componentName} unmounted after ${lifetime.toFixed(2)}ms`)
    }
  }, [componentName])
}

/**
 * Store performance metrics for analysis
 */
const performanceMetrics: PerformanceMetrics[] = []

const storePerformanceMetrics = (metrics: PerformanceMetrics) => {
  performanceMetrics.push(metrics)
  
  // Keep only last 1000 metrics to prevent memory leaks
  if (performanceMetrics.length > 1000) {
    performanceMetrics.splice(0, performanceMetrics.length - 1000)
  }
}

/**
 * Get performance metrics for analysis
 */
export const getPerformanceMetrics = (): PerformanceMetrics[] => {
  return [...performanceMetrics]
}

/**
 * Clear performance metrics
 */
export const clearPerformanceMetrics = () => {
  performanceMetrics.length = 0
}

/**
 * Get performance summary
 */
export const getPerformanceSummary = () => {
  if (performanceMetrics.length === 0) {
    return null
  }

  const renderTimes = performanceMetrics.map(m => m.renderTime)
  const memoryUsages = performanceMetrics.map(m => m.memoryUsage)

  return {
    totalRenders: performanceMetrics.length,
    averageRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
    maxRenderTime: Math.max(...renderTimes),
    minRenderTime: Math.min(...renderTimes),
    averageMemoryUsage: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length,
    maxMemoryUsage: Math.max(...memoryUsages),
    minMemoryUsage: Math.min(...memoryUsages),
  }
}

/**
 * Performance monitoring component
 */
export const PerformanceMonitor: React.FC<{
  children: React.ReactNode
  enableLogging?: boolean
}> = ({ children, enableLogging = false }) => {
  useEffect(() => {
    if (enableLogging) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`📊 Performance: ${entry.name} - ${entry.duration}ms`)
        }
      })

      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] })

      return () => observer.disconnect()
    }
  }, [enableLogging])

  return <>{children}</>
}

#!/usr/bin/env node

/**
 * Bundle analysis script for AuditFortress
 * Analyzes bundle size, dependencies, and provides optimization recommendations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const CONFIG = {
  maxBundleSize: 500 * 1024, // 500KB
  maxChunkSize: 50 * 1024, // 50KB
  maxVendorSize: 300 * 1024, // 300KB
  buildDir: 'dist',
  reportFile: 'bundle-analysis.json',
}

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

// Utility functions
const formatBytes = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileSize = filePath => {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch (error) {
    return 0
  }
}

const getGzippedSize = filePath => {
  try {
    const result = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' })
    return parseInt(result.trim())
  } catch (error) {
    return 0
  }
}

// Analyze bundle structure
const analyzeBundle = () => {
  console.log(`${colors.cyan}${colors.bold}🔍 Analyzing bundle structure...${colors.reset}`)

  const buildDir = path.join(process.cwd(), CONFIG.buildDir)

  if (!fs.existsSync(buildDir)) {
    console.log(
      `${colors.red}❌ Build directory not found. Please run 'npm run build' first.${colors.reset}`
    )
    process.exit(1)
  }

  const analysis = {
    timestamp: new Date().toISOString(),
    totalSize: 0,
    gzippedSize: 0,
    files: [],
    chunks: [],
    recommendations: [],
    warnings: [],
    errors: [],
  }

  // Analyze all files in build directory
  const analyzeDirectory = (dir, relativePath = '') => {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const itemPath = path.join(dir, item)
      const relativeItemPath = path.join(relativePath, item)
      const stats = fs.statSync(itemPath)

      if (stats.isDirectory()) {
        analyzeDirectory(itemPath, relativeItemPath)
      } else if (stats.isFile()) {
        const size = stats.size
        const gzippedSize = getGzippedSize(itemPath)

        analysis.totalSize += size
        analysis.gzippedSize += gzippedSize

        const fileInfo = {
          name: relativeItemPath,
          size: size,
          gzippedSize: gzippedSize,
          type: getFileType(item),
          isChunk: item.includes('.js') && item.includes('-'),
        }

        analysis.files.push(fileInfo)

        if (fileInfo.isChunk) {
          analysis.chunks.push(fileInfo)
        }
      }
    }
  }

  analyzeDirectory(buildDir)

  return analysis
}

// Determine file type
const getFileType = filename => {
  const ext = path.extname(filename).toLowerCase()

  switch (ext) {
    case '.js':
      return 'javascript'
    case '.css':
      return 'css'
    case '.html':
      return 'html'
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
      return 'image'
    case '.woff':
    case '.woff2':
    case '.ttf':
    case '.eot':
      return 'font'
    default:
      return 'other'
  }
}

// Generate recommendations
const generateRecommendations = analysis => {
  const recommendations = []
  const warnings = []
  const errors = []

  // Check total bundle size
  if (analysis.gzippedSize > CONFIG.maxBundleSize) {
    errors.push({
      type: 'error',
      message: `Total bundle size (${formatBytes(analysis.gzippedSize)}) exceeds target (${formatBytes(CONFIG.maxBundleSize)})`,
      suggestion:
        'Consider code splitting, removing unused dependencies, or lazy loading components',
    })
  } else if (analysis.gzippedSize > CONFIG.maxBundleSize * 0.8) {
    warnings.push({
      type: 'warning',
      message: `Total bundle size (${formatBytes(analysis.gzippedSize)}) is approaching target (${formatBytes(CONFIG.maxBundleSize)})`,
      suggestion: 'Monitor bundle size and consider optimization',
    })
  }

  // Check chunk sizes
  const largeChunks = analysis.chunks.filter(chunk => chunk.gzippedSize > CONFIG.maxChunkSize)
  if (largeChunks.length > 0) {
    warnings.push({
      type: 'warning',
      message: `${largeChunks.length} chunk(s) exceed recommended size (${formatBytes(CONFIG.maxChunkSize)})`,
      suggestion: 'Consider splitting large chunks or lazy loading components',
    })
  }

  // Check for vendor chunks
  const vendorChunks = analysis.chunks.filter(
    chunk => chunk.name.includes('vendor') || chunk.name.includes('chunk')
  )
  const totalVendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0)

  if (totalVendorSize > CONFIG.maxVendorSize) {
    warnings.push({
      type: 'warning',
      message: `Vendor chunks total size (${formatBytes(totalVendorSize)}) exceeds target (${formatBytes(CONFIG.maxVendorSize)})`,
      suggestion: 'Consider using CDN for large libraries or tree shaking unused code',
    })
  }

  // Check for duplicate dependencies
  const jsFiles = analysis.files.filter(file => file.type === 'javascript')
  const duplicatePatterns = findDuplicatePatterns(jsFiles)

  if (duplicatePatterns.length > 0) {
    recommendations.push({
      type: 'info',
      message: `Found ${duplicatePatterns.length} potential duplicate patterns`,
      suggestion: 'Consider consolidating similar code or using shared utilities',
    })
  }

  // Check for unused files
  const unusedFiles = analysis.files.filter(
    file => file.size < 1000 && !file.name.includes('index') && !file.name.includes('main')
  )

  if (unusedFiles.length > 0) {
    recommendations.push({
      type: 'info',
      message: `${unusedFiles.length} small files detected`,
      suggestion: 'Consider combining small files or removing unused assets',
    })
  }

  return { recommendations, warnings, errors }
}

// Find duplicate patterns in files
const findDuplicatePatterns = files => {
  const patterns = []

  // Simple pattern detection (in real implementation, you'd use more sophisticated analysis)
  const commonPatterns = ['react', 'lodash', 'moment', 'axios', 'classnames']

  commonPatterns.forEach(pattern => {
    const filesWithPattern = files.filter(file => file.name.toLowerCase().includes(pattern))

    if (filesWithPattern.length > 1) {
      patterns.push({
        pattern,
        files: filesWithPattern.map(f => f.name),
        totalSize: filesWithPattern.reduce((sum, f) => sum + f.gzippedSize, 0),
      })
    }
  })

  return patterns
}

// Generate optimization suggestions
const generateOptimizationSuggestions = analysis => {
  const suggestions = []

  // Code splitting suggestions
  if (analysis.chunks.length < 5) {
    suggestions.push({
      category: 'Code Splitting',
      priority: 'high',
      title: 'Implement Code Splitting',
      description: 'Split your bundle into smaller chunks for better loading performance',
      actions: [
        'Use React.lazy() for route-based code splitting',
        'Implement component-level code splitting for heavy components',
        'Consider feature-based code splitting',
      ],
    })
  }

  // Tree shaking suggestions
  const jsFiles = analysis.files.filter(file => file.type === 'javascript')
  const totalJSSize = jsFiles.reduce((sum, file) => sum + file.gzippedSize, 0)

  if (totalJSSize > 200 * 1024) {
    suggestions.push({
      category: 'Tree Shaking',
      priority: 'medium',
      title: 'Optimize Tree Shaking',
      description: 'Remove unused code to reduce bundle size',
      actions: [
        'Use ES6 imports instead of CommonJS',
        'Configure webpack/Vite for better tree shaking',
        'Remove unused dependencies',
        'Use babel-plugin-import for library optimization',
      ],
    })
  }

  // Compression suggestions
  const compressionRatio = analysis.gzippedSize / analysis.totalSize
  if (compressionRatio > 0.3) {
    suggestions.push({
      category: 'Compression',
      priority: 'low',
      title: 'Improve Compression',
      description: 'Better compression can reduce bundle size',
      actions: [
        'Use Brotli compression in production',
        'Optimize images and assets',
        'Remove unnecessary whitespace and comments',
      ],
    })
  }

  return suggestions
}

// Display results
const displayResults = analysis => {
  console.log(`\n${colors.bold}${colors.blue}📊 Bundle Analysis Results${colors.reset}`)
  console.log(`${colors.blue}${'='.repeat(50)}${colors.reset}`)

  // Summary
  console.log(`\n${colors.bold}📈 Summary:${colors.reset}`)
  console.log(`  Total Size: ${colors.green}${formatBytes(analysis.totalSize)}${colors.reset}`)
  console.log(`  Gzipped Size: ${colors.green}${formatBytes(analysis.gzippedSize)}${colors.reset}`)
  console.log(`  Files: ${colors.cyan}${analysis.files.length}${colors.reset}`)
  console.log(`  Chunks: ${colors.cyan}${analysis.chunks.length}${colors.reset}`)

  // File breakdown
  console.log(`\n${colors.bold}📁 File Breakdown:${colors.reset}`)
  const fileTypes = analysis.files.reduce((acc, file) => {
    acc[file.type] = (acc[file.type] || 0) + file.gzippedSize
    return acc
  }, {})

  Object.entries(fileTypes).forEach(([type, size]) => {
    console.log(`  ${type}: ${colors.green}${formatBytes(size)}${colors.reset}`)
  })

  // Largest files
  console.log(`\n${colors.bold}🔍 Largest Files:${colors.reset}`)
  analysis.files
    .sort((a, b) => b.gzippedSize - a.gzippedSize)
    .slice(0, 10)
    .forEach((file, index) => {
      const status =
        file.gzippedSize > CONFIG.maxChunkSize ? `${colors.red}⚠️` : `${colors.green}✅`
      console.log(
        `  ${index + 1}. ${file.name} ${status} ${formatBytes(file.gzippedSize)}${colors.reset}`
      )
    })

  // Warnings and errors
  if (analysis.errors.length > 0) {
    console.log(`\n${colors.red}${colors.bold}❌ Errors:${colors.reset}`)
    analysis.errors.forEach(error => {
      console.log(`  ${colors.red}• ${error.message}${colors.reset}`)
      console.log(`    ${colors.yellow}💡 ${error.suggestion}${colors.reset}`)
    })
  }

  if (analysis.warnings.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  Warnings:${colors.reset}`)
    analysis.warnings.forEach(warning => {
      console.log(`  ${colors.yellow}• ${warning.message}${colors.reset}`)
      console.log(`    ${colors.cyan}💡 ${warning.suggestion}${colors.reset}`)
    })
  }

  if (analysis.recommendations.length > 0) {
    console.log(`\n${colors.blue}${colors.bold}💡 Recommendations:${colors.reset}`)
    analysis.recommendations.forEach(rec => {
      console.log(`  ${colors.blue}• ${rec.message}${colors.reset}`)
      console.log(`    ${colors.cyan}💡 ${rec.suggestion}${colors.reset}`)
    })
  }

  // Optimization suggestions
  if (analysis.optimizationSuggestions.length > 0) {
    console.log(`\n${colors.magenta}${colors.bold}🚀 Optimization Suggestions:${colors.reset}`)
    analysis.optimizationSuggestions.forEach(suggestion => {
      const priorityColor =
        suggestion.priority === 'high'
          ? colors.red
          : suggestion.priority === 'medium'
            ? colors.yellow
            : colors.green
      console.log(
        `\n  ${priorityColor}${suggestion.priority.toUpperCase()}${colors.reset} - ${suggestion.title}`
      )
      console.log(`    ${suggestion.description}`)
      console.log(`    ${colors.cyan}Actions:${colors.reset}`)
      suggestion.actions.forEach(action => {
        console.log(`      • ${action}`)
      })
    })
  }
}

// Save report
const saveReport = analysis => {
  const reportPath = path.join(process.cwd(), CONFIG.reportFile)
  fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2))
  console.log(`\n${colors.green}📄 Report saved to: ${reportPath}${colors.reset}`)
}

// Main execution
const main = () => {
  console.log(`${colors.bold}${colors.cyan}🚀 AuditFortress Bundle Analyzer${colors.reset}`)
  console.log(`${colors.cyan}${'='.repeat(40)}${colors.reset}`)

  try {
    const analysis = analyzeBundle()
    const { recommendations, warnings, errors } = generateRecommendations(analysis)

    analysis.recommendations = recommendations
    analysis.warnings = warnings
    analysis.errors = errors
    analysis.optimizationSuggestions = generateOptimizationSuggestions(analysis)

    displayResults(analysis)
    saveReport(analysis)

    // Exit with error code if there are critical issues
    if (errors.length > 0) {
      process.exit(1)
    }
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  analyzeBundle,
  generateRecommendations,
  generateOptimizationSuggestions,
  displayResults,
  saveReport,
}

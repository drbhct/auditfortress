import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Performance-optimized Vite configuration
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
      // Enable babel plugins for optimization
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && [
            'transform-remove-console',
            { exclude: ['error', 'warn'] },
          ],
          // Optimize imports
          [
            'import',
            {
              libraryName: 'lodash',
              libraryDirectory: '',
              camel2DashComponentName: false,
            },
            'lodash',
          ],
          [
            'import',
            {
              libraryName: 'antd',
              libraryDirectory: 'es',
              style: true,
            },
            'antd',
          ],
        ].filter(Boolean),
      },
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Optimize common imports
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
  },

  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',

    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console.log in production
        drop_console: true,
        drop_debugger: true,
        // Remove unused code
        unused: true,
        // Remove dead code
        dead_code: true,
        // Optimize conditionals
        conditionals: true,
        // Optimize comparisons
        comparisons: true,
        // Optimize evaluations
        evaluate: true,
        // Optimize booleans
        booleans: true,
        // Optimize loops
        loops: true,
        // Optimize if statements
        if_return: true,
        // Optimize join variables
        join_vars: true,
        // Optimize sequences
        sequences: true,
        // Optimize properties
        properties: true,
        // Optimize reduce variables
        reduce_vars: true,
        // Optimize side effects
        side_effects: false,
      },
      mangle: {
        // Mangle property names
        properties: {
          regex: /^_/,
        },
      },
    },

    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', '@heroicons/react'],
          'state-vendor': ['zustand', '@tanstack/react-query'],
          'utils-vendor': ['lodash', 'date-fns'],
          'editor-vendor': ['@tiptap/react', '@tiptap/starter-kit'],

          // Feature chunks
          auth: ['./src/stores/authStore.ts', './src/hooks/useAuth.ts', './src/components/auth'],
          documents: [
            './src/components/documents',
            './src/hooks/useDocuments.ts',
            './src/services/documentService.ts',
          ],
          templates: [
            './src/components/templates',
            './src/hooks/useTemplates.ts',
            './src/services/templateService.ts',
          ],
          dashboard: [
            './src/components/dashboard',
            './src/hooks/useAnalytics.ts',
            './src/services/analyticsService.ts',
          ],
        },

        // Chunk file names
        chunkFileNames: chunkInfo => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const fileName = facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            return `js/${fileName}-[hash].js`
          }
          return 'js/[name]-[hash].js'
        },

        // Entry file names
        entryFileNames: 'js/[name]-[hash].js',

        // Asset file names
        assetFileNames: assetInfo => {
          const ext = assetInfo.name?.split('.').pop()
          if (ext === 'css') {
            return 'css/[name]-[hash].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        },
      },

      // External dependencies (if using CDN)
      external: id => {
        // Don't externalize these in production
        if (process.env.NODE_ENV === 'development') {
          return false
        }

        // Externalize large libraries if using CDN
        const externalLibs = ['react', 'react-dom', 'react-router-dom']

        return externalLibs.includes(id)
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // Source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',

    // CSS code splitting
    cssCodeSplit: true,

    // Assets inline threshold
    assetsInlineLimit: 4096,
  },

  // Development server optimization
  server: {
    // Enable HMR
    hmr: true,

    // Optimize file watching
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },

  // CSS optimization
  css: {
    // Enable CSS code splitting
    devSourcemap: process.env.NODE_ENV === 'development',

    // PostCSS plugins for optimization
    postcss: {
      plugins: [
        // Autoprefixer
        require('autoprefixer')({
          overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead'],
        }),

        // CSS optimization
        process.env.NODE_ENV === 'production' &&
          require('cssnano')({
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
                normalizeWhitespace: true,
                minifySelectors: true,
                minifyValues: true,
                mergeLonghand: true,
                mergeRules: true,
                discardDuplicates: true,
                discardEmpty: true,
                discardOverridden: true,
                discardUnused: true,
                reduceIdents: true,
                zindex: false,
              },
            ],
          }),
      ].filter(Boolean),
    },
  },

  // Dependency optimization
  optimizeDeps: {
    // Pre-bundle dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@headlessui/react',
      '@heroicons/react/24/outline',
      'zustand',
      '@tanstack/react-query',
      'lodash',
      'date-fns',
    ],

    // Exclude from pre-bundling
    exclude: ['@tiptap/react', '@tiptap/starter-kit'],
  },

  // Define global constants
  define: {
    // Remove process.env in production
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

    // Enable React DevTools in development
    __REACT_DEVTOOLS_GLOBAL_HOOK__: process.env.NODE_ENV === 'development' ? '{}' : 'undefined',
  },

  // Performance monitoring
  esbuild: {
    // Enable tree shaking
    treeShaking: true,

    // Optimize for production
    minifyIdentifiers: process.env.NODE_ENV === 'production',
    minifySyntax: process.env.NODE_ENV === 'production',
    minifyWhitespace: process.env.NODE_ENV === 'production',

    // Target modern browsers
    target: 'es2020',

    // Enable source maps in development
    sourcemap: process.env.NODE_ENV === 'development',
  },
})

import React, { useState } from 'react'
import {
  SparklesIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { AppButton } from '@/components/ui/AppButton'
import { AppCard } from '@/components/ui/AppCard'
import { AppSelect } from '@/components/ui/AppSelect'
import { cn } from '@/utils/cn'
import { aiService } from '@/services/aiService'
import type { PolicyTemplate } from '@/types'

interface AIEnhancementProps {
  template: PolicyTemplate
  onEnhance?: (enhancedContent: string) => void
  onSuggestions?: (
    suggestions: Array<{
      type: 'content' | 'structure' | 'compliance' | 'clarity'
      priority: 'high' | 'medium' | 'low'
      description: string
      example?: string
    }>
  ) => void
  className?: string
}

export function AIEnhancement({
  template,
  onEnhance,
  onSuggestions,
  className,
}: AIEnhancementProps) {
  const [enhancementType, setEnhancementType] = useState<'clarity' | 'completeness' | 'compliance'>(
    'clarity'
  )
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<
    Array<{
      type: 'content' | 'structure' | 'compliance' | 'clarity'
      priority: 'high' | 'medium' | 'low'
      description: string
      example?: string
    }>
  >([])
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    setIsEnhancing(true)
    setError(null)

    try {
      const enhancedContent = await aiService.enhanceTemplateContent(
        template.content,
        enhancementType
      )
      onEnhance?.(enhancedContent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance template')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true)
    setError(null)

    try {
      const result = await aiService.suggestImprovements(template)
      setSuggestions(result.suggestions)
      onSuggestions?.(result.suggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get suggestions')
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return '📝'
      case 'structure':
        return '🏗️'
      case 'compliance':
        return '⚖️'
      case 'clarity':
        return '💡'
      default:
        return '📋'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Enhancement Controls */}
      <AppCard className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Enhancement</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enhancement Type</label>
            <AppSelect
              value={enhancementType}
              onChange={e => setEnhancementType(e.target.value as any)}
              options={[
                { value: 'clarity', label: 'Clarity - Improve readability and understanding' },
                { value: 'completeness', label: 'Completeness - Add missing sections and details' },
                {
                  value: 'compliance',
                  label: 'Compliance - Add legal requirements and disclaimers',
                },
              ]}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <AppButton
              onClick={handleEnhance}
              disabled={isEnhancing}
              className="flex items-center gap-2"
            >
              {isEnhancing ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Enhance Content
                </>
              )}
            </AppButton>

            <AppButton
              variant="outline"
              onClick={handleGetSuggestions}
              disabled={isLoadingSuggestions}
              className="flex items-center gap-2"
            >
              {isLoadingSuggestions ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <LightBulbIcon className="h-4 w-4" />
                  Get Suggestions
                </>
              )}
            </AppButton>
          </div>
        </div>
      </AppCard>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <AppCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <LightBulbIcon className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{getTypeIcon(suggestion.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                    </span>
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        getPriorityColor(suggestion.priority)
                      )}
                    >
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{suggestion.description}</p>
                  {suggestion.example && (
                    <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                      <strong>Example:</strong> {suggestion.example}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      )}

      {/* Enhancement Info */}
      <AppCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">How AI Enhancement Works</h3>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>Clarity:</strong> Simplifies complex language, improves readability, and adds
            clear examples.
          </p>
          <p>
            <strong>Completeness:</strong> Identifies missing sections and adds comprehensive
            coverage of topics.
          </p>
          <p>
            <strong>Compliance:</strong> Ensures legal requirements are met and adds necessary
            disclaimers.
          </p>
        </div>
      </AppCard>
    </div>
  )
}

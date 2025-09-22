import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { useAuth } from '@/hooks/useAuth'
import type { LoginCredentials } from '@/types'

interface LoginFormProps {
  onSuccess?: () => void
  onSignUpClick?: () => void
  className?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSignUpClick,
  className = '',
}) => {
  const { login, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setLoginError(null)
      const result = await login(data)

      if (result.success) {
        onSuccess?.()
      } else {
        setLoginError(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white shadow-lg rounded-lg px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to AuditFortress</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
        </div>

        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{loginError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AppInput
            label="Email address"
            type="email"
            autoComplete="email"
            leftIcon={<EnvelopeIcon />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address',
              },
            })}
          />

          <AppInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            leftIcon={<LockClosedIcon />}
            rightIcon={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="cursor-pointer hover:text-gray-600"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            }
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <AppButton
            type="submit"
            className="w-full"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Signing in...' : 'Sign in'}
          </AppButton>
        </form>

        {onSignUpClick && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSignUpClick}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign up here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

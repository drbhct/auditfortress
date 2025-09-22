import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AppButton } from '@/components/ui/AppButton'
import { AppInput } from '@/components/ui/AppInput'
import { useAuth } from '@/hooks/useAuth'

interface SignUpCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

interface SignUpFormProps {
  onSuccess?: () => void
  onSignInClick?: () => void
  className?: string
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSuccess,
  onSignInClick,
  className = '',
}) => {
  const { register: registerUser, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>({
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  })

  const onSubmit = async (data: SignUpCredentials) => {
    try {
      setSignUpError(null)
      setSignUpSuccess(null)

      const result = await registerUser(data)

      if (result.success) {
        setSignUpSuccess(
          'Account created successfully! Please check your email to verify your account.',
        )
        onSuccess?.()
      } else {
        setSignUpError(result.error || 'Sign up failed. Please try again.')
      }
    } catch (error) {
      setSignUpError('An unexpected error occurred. Please try again.')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white shadow-lg rounded-lg px-8 py-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Sign up for AuditFortress</p>
        </div>

        {signUpError && (
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
                <p className="text-sm text-red-800">{signUpError}</p>
              </div>
            </div>
          </div>
        )}

        {signUpSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{signUpSuccess}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <AppInput
              label="First Name"
              type="text"
              autoComplete="given-name"
              leftIcon={<UserIcon />}
              error={errors.firstName?.message}
              {...register('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters',
                },
              })}
            />

            <AppInput
              label="Last Name"
              type="text"
              autoComplete="family-name"
              leftIcon={<UserIcon />}
              error={errors.lastName?.message}
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters',
                },
              })}
            />
          </div>

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
            autoComplete="new-password"
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
            helperText="Password must be at least 6 characters"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />

          <AppButton
            type="submit"
            className="w-full"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? 'Creating account...' : 'Create account'}
          </AppButton>
        </form>

        {onSignInClick && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSignInClick}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

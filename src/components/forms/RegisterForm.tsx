import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card, CardBody } from '../ui';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading?: boolean;
  error?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  loading = false, 
  error 
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join TMS to start learning
          </p>
        </div>
        
        <Card>
          <CardBody>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-sm text-red-600">{error}</div>
                </div>
              )}
              
              <Input
                id="fullName"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.fullName?.message}
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters'
                  }
                })}
              />
              
              <Input
                id="email"
                type="email"
                label="Email address"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Create a password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
              
              <div className="flex items-center">
                <input
                  id="agree-terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  {...register('agreeTerms', {
                    required: 'You must agree to the terms and conditions'
                  })}
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Create account
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="/user-login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in instead
                </a>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;

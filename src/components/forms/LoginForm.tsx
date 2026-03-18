import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Card, CardBody } from '../ui';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  loading?: boolean;
  error?: string;
  title?: string;
  isAdmin?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  loading = false, 
  error,
  title = 'Login',
  isAdmin = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isAdmin ? 'Admin access to TMS' : 'Sign in to your account'}
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
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="/forget-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Sign in
              </Button>
            </form>
            
            {!isAdmin && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">New to TMS?</span>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="/register"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create an account
                  </a>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';
import { authService } from '../../services/authService';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending registration data:', { name, email, password });
      const response = await authService.register({ name, email, password });
      console.log('Registration response:', response);
      
      if (response.success) {
        setSuccess(response.message || 'Registration successful! Please check your email to verify your account.');
        // Redirect to verify-email after 3 seconds
        setTimeout(() => {
          navigate('/verify-email');
        }, 3000);
      } else {
        setError(response.message || 'Registration failed');
        console.log('Registration failed:', response.message);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed');
      console.log('Registration failed with error:', err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join us today and start your learning journey"
      type="user"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          required
          name="name"
          leftIcon={<User className="w-4 h-4" />}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          required
          name="email"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          name="password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-indigo-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••"
          required
          name="confirmPassword"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none focus:text-indigo-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          className="mt-6 shadow-indigo-200/50 shadow-lg group"
        >
          Create account
        </Button>

        <div className="mt-8 flex items-center justify-center border-t border-slate-100 pt-6">
          <div className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/user-login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
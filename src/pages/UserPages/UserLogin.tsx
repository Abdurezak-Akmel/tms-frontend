import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue learning"
      type="user"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          required
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
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
          <div className="flex justify-end pt-1">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          className="mt-6 shadow-indigo-200/50 shadow-lg group"
        >
          Sign in
        </Button>

        <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 border-t border-slate-100 pt-6">
          <div className="text-sm text-slate-600 text-center sm:text-left">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign up for free
            </Link>
          </div>
          <Link to="/admin-login" className="w-full sm:w-auto">
            <Button variant="ghost" type="button" className="w-full text-slate-500 hover:text-indigo-600 bg-slate-50">
              <Shield className="w-4 h-4 mr-2" />
              Admin Portal
            </Button>
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';

export default function AdminLogin() {
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
      title="Admin Portal"
      subtitle="Sign in securely to manage the platform"
      type="admin"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm transition-transform hover:scale-110 duration-300">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <Input
          label="Admin Email or Username"
          type="text"
          placeholder="admin@eduquest.com"
          required
          leftIcon={<Shield className="w-4 h-4" />}
        />

        <div className="space-y-1">
          <Input
            label="Security Passkey"
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
              to="/admin/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Recover admin password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          rightIcon={<LayoutDashboard className="w-4 h-4 ml-1" />}
          className="mt-6 shadow-indigo-200/50 shadow-lg"
        >
          Secure Access
        </Button>

        <div className="mt-8 text-center text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p>
            Authorized personnel only.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';

export default function NewPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/user-login'); // redirect after successful reset
        }, 1500);
    };

    return (
        <AuthLayout
            title="Set new password"
            subtitle="Your new password must be different to previously used passwords."
            type="user"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Reset Token"
                    type="text"
                    placeholder="Enter the token"
                    required
                    leftIcon={<KeyRound className="w-4 h-4" />}
                />

                <Input
                    label="New Password"
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

                <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
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
                    Reset Password
                </Button>
            </form>
        </AuthLayout>
    );
}
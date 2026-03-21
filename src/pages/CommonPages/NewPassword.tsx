import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';
import { authService } from '../../services/authService';

export default function NewPassword() {
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
        const token = formData.get('token') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!token || !token.trim()) {
            setError('Reset token is required');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Submitting password reset with token:', token);
            const response = await authService.resetPassword({ token, newPassword });
            console.log('Password reset response:', response);
            
            if (response.success) {
                setSuccess(response.message || 'Password reset successfully! You can now log in with your new password.');
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/user-login');
                }, 3000);
            } else {
                setError(response.message || 'Password reset failed');
                console.log('Password reset failed:', response.message);
            }
        } catch (err: any) {
            console.error('Password reset error:', err);
            setError(err.response?.data?.message || err.message || 'Password reset failed');
            console.log('Password reset failed with error:', err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Set new password"
            subtitle="Your new password must be different to previously used passwords."
            type="user"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {success}
                        </div>
                    </div>
                )}
                
                <Input
                    label="Reset Token"
                    type="text"
                    placeholder="Enter the token"
                    required
                    name="token"
                    leftIcon={<KeyRound className="w-4 h-4" />}
                />

                <Input
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    name="newPassword"
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
                    Reset Password
                </Button>
            </form>
        </AuthLayout>
    );
}
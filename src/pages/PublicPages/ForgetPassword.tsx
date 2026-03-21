import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';
import { authService } from '../../services/authService';

export default function ForgetPassword() {
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
        const email = formData.get('email') as string;

        if (!email || !email.trim()) {
            setError('Email address is required');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Submitting forget password request for email:', email);
            const response = await authService.forgetPassword(email);
            console.log('Forget password response:', response);
            
            if (response.success) {
                setSuccess(response.message || 'Password reset token sent to your email address!');
                // Redirect to new password page after 3 seconds
                setTimeout(() => {
                    navigate('/new-password');
                }, 3000);
            } else {
                setError(response.message || 'Failed to send password reset token');
                console.log('Forget password failed:', response.message);
            }
        } catch (err: any) {
            console.error('Forget password error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to send password reset token');
            console.log('Forget password failed with error:', err.response?.data?.message || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a password rest token"
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
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    required
                    name="email"
                    leftIcon={<Mail className="w-4 h-4" />}
                />

                <Button
                    type="submit"
                    fullWidth
                    isLoading={isLoading}
                    rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                    className="mt-6 shadow-indigo-200/50 shadow-lg group"
                >
                    Send Token
                </Button>

                <div className="mt-8 flex items-center justify-center border-t border-slate-100 pt-6">
                    <Link to="/user-login" className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to log in
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
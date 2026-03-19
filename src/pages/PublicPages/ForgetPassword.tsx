import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';

export default function ForgetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/new-password');
        }, 1500);
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email address and we'll send you a password rest token"
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
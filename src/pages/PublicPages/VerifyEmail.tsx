import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLayout } from '../../components/AuthLayout';
import { authService } from '../../services/authService';

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if token is in URL query params
  React.useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Get token from form input
    const formData = new FormData(e.target as HTMLFormElement);
    const formToken = formData.get('token') as string;

    if (!formToken || !formToken.trim()) {
      setError('Verification token is required');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Submitting email verification with token:', formToken);
      const response = await authService.verifyEmail(formToken);
      console.log('Email verification response:', response);
      
      if (response.success) {
        setSuccess(response.message || 'Email verified successfully! You can now log in to your account.');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/user-login');
        }, 3000);
      } else {
        setError(response.message || 'Email verification failed');
        console.log('Email verification failed:', response.message);
      }
    } catch (err: any) {
      console.error('Email verification error:', err);
      setError(err.response?.data?.message || err.message || 'Email verification failed');
      console.log('Email verification failed with error:', err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Enter the verification token sent to your email address"
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
        
        <div className="space-y-2">
          <Input
            id="token"
            name="token"
            label="Verification Token"
            type="text"
            placeholder="Enter your verification token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
            className="w-full"
          />
          <p className="text-sm text-slate-500">
            Check your email for the verification token. If you clicked the verification link, the token should be filled automatically.
          </p>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          className="mt-6 shadow-indigo-200/50 shadow-lg group"
        >
          Verify Account
        </Button>

        <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between gap-4 border-t border-slate-100 pt-6">
          <div className="text-sm text-slate-600 text-center sm:text-left">
            Didn't receive the email?{' '}
            <button
              type="button"
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              onClick={() => {
                // TODO: Implement resend verification email functionality
                console.log('Resend verification email clicked');
              }}
            >
              Resend verification
            </button>
          </div>
          <div className="text-sm text-slate-600 text-center sm:text-left">
            Already verified?{' '}
            <Link to="/user-login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
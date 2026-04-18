import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Callout } from '../feedback';
import { FormFieldSlot } from '../forms';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '../ui';
import authService from '../../services/authService';

type UserLoginValues = {
  email: string;
  password: string;
};

type UserLoginErrors = Partial<Record<keyof UserLoginValues, string>>;

const initialValues: UserLoginValues = {
  email: '',
  password: '',
};

function validate(values: UserLoginValues): UserLoginErrors {
  const errors: UserLoginErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export function UserLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState<UserLoginValues>(initialValues);
  const [errors, setErrors] = useState<UserLoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleChange<K extends keyof UserLoginValues>(
    key: K,
    value: UserLoginValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError('');
  }

  function getErrorMessage(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      return (error as { message: string }).message;
    }
    return 'Login failed. Please check your credentials and try again.';
  }

  /** Backend returns 403 with message when email is not verified */
  function shouldRedirectToVerifyEmail(message: string): boolean {
    const lower = message.toLowerCase();
    return (
      lower.includes('email not verified') ||
      lower.includes('not verified') ||
      lower.includes('verify your email')
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const emailTrimmed = values.email.trim();

    try {
      setIsSubmitting(true);
      setServerError('');

      const response = await authService.login({
        email: emailTrimmed,
        password: values.password,
      });

      if (response.user?.role_id === 1) {
        navigate('/admin-login');
        return;
      }

      if (response.token && response.user) {
        login(response.token, response.user as any);
        navigate('/user-dashboard');
      } else {
        setServerError('Login did not return a session. Please try again.');
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      if (shouldRedirectToVerifyEmail(message)) {
        navigate('/verify-email', {
          replace: true,
          state: {
            email: emailTrimmed,
            reason: 'unverified' as const,
          },
        });
        return;
      }
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      className="w-full max-w-xl border-slate-200/90 bg-white/95 shadow-lg backdrop-blur"
      padding="lg"
    >
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          <Shield className="size-4 text-[var(--color-brand)]" />
          Secure Access
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to continue learning, track progress, and access your course dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {serverError ? <Callout variant="danger">{serverError}</Callout> : null}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <FormFieldSlot id="email" label="Email" error={errors.email} required>
            {(a11yProps) => (
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={values.email}
                onChange={(event) => handleChange('email', event.target.value)}
                error={Boolean(errors.email)}
                {...a11yProps}
              />
            )}
          </FormFieldSlot>

          <FormFieldSlot id="password" label="Password" error={errors.password} required>
            {(a11yProps) => (
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={(event) => handleChange('password', event.target.value)}
                  error={Boolean(errors.password)}
                  className="pr-10"
                  {...a11yProps}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-[var(--color-brand)] transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            )}
          </FormFieldSlot>

          <div className="flex items-center justify-end">
            <Link
              to="/forget-password"
              className="text-sm font-medium text-[var(--color-brand)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" isLoading={isSubmitting} leftIcon={<LogIn />}>
            Sign in
          </Button>
        </form>

        <div className="space-y-2 text-center text-sm text-slate-600">
          <p>
            Need administrator access?{' '}
            <Link
              to="/admin-login"
              className="font-semibold text-[var(--color-brand)] hover:underline"
            >
              Admin login
            </Link>
          </p>
          <p>
            New here?{' '}
            <Link to="/register" className="font-semibold text-[var(--color-brand)] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

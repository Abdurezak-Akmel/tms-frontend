import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Eye, EyeOff, LogIn } from 'lucide-react';
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
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

type AdminLoginValues = {
  email: string;
  password: string;
};

type AdminLoginErrors = Partial<Record<keyof AdminLoginValues, string>>;

const initialValues: AdminLoginValues = {
  email: '',
  password: '',
};

function validate(values: AdminLoginValues): AdminLoginErrors {
  const errors: AdminLoginErrors = {};

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


export function AdminLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState<AdminLoginValues>(initialValues);
  const [errors, setErrors] = useState<AdminLoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleChange<K extends keyof AdminLoginValues>(
    key: K,
    value: AdminLoginValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError('');

      const response = await authService.login({
        email: values.email.trim(),
        password: values.password,
      });

      if (!response.token || !response.user) {
        setServerError('Login did not return a session. Please try again.');
        return;
      }

      // Check specifically if this is an admin
      if (response.user.role_id !== 1) {
        setServerError('This account does not have administrator access. Use the user sign-in instead.');
        return;
      }

      login(response.token, response.user as any);
      navigate('/admin-dashboard');
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Login failed. Please check your credentials and try again.';
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
          <Crown className="size-4 text-[var(--color-brand)]" />
          Administrator
        </div>
        <CardTitle className="text-2xl">Admin sign in</CardTitle>
        <CardDescription>
          Sign in with your administrator credentials to manage courses, users, and platform
          settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {serverError ? <Callout variant="danger">{serverError}</Callout> : null}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <FormFieldSlot id="admin-email" label="Email" error={errors.email} required>
            {(a11yProps) => (
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                value={values.email}
                onChange={(event) => handleChange('email', event.target.value)}
                error={Boolean(errors.email)}
                {...a11yProps}
              />
            )}
          </FormFieldSlot>

          <FormFieldSlot id="admin-password" label="Password" error={errors.password} required>
            {(a11yProps) => (
              <div className="relative">
                <Input
                  id="admin-password"
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
            Sign in as admin
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Not an administrator?{' '}
          <Link to="/user-login" className="font-semibold text-[var(--color-brand)] hover:underline">
            User sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

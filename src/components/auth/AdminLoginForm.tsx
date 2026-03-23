import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, LogIn } from 'lucide-react';
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
import type { User } from '../../context/AuthContext';
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

function toAuthUser(raw: unknown): User | null {
  if (!raw || typeof raw !== 'object') return null;
  const u = raw as Record<string, unknown>;
  const userId = typeof u.user_id === 'number' ? u.user_id : Number(u.user_id);
  const roleId = typeof u.role_id === 'number' ? u.role_id : Number(u.role_id);
  if (
    Number.isFinite(userId) &&
    typeof u.name === 'string' &&
    typeof u.email === 'string' &&
    Number.isFinite(roleId) &&
    typeof u.status === 'string' &&
    typeof u.email_verified === 'boolean' &&
    typeof u.created_at === 'string'
  ) {
    return {
      user_id: userId,
      name: u.name,
      email: u.email,
      role_id: roleId,
      status: u.status,
      email_verified: u.email_verified,
      registration_device:
        u.registration_device === null || typeof u.registration_device === 'string'
          ? (u.registration_device as string | null)
          : null,
      created_at: u.created_at,
    };
  }
  return null;
}

export function AdminLoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [values, setValues] = useState<AdminLoginValues>(initialValues);
  const [errors, setErrors] = useState<AdminLoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

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

      if (!response.token) {
        setServerError('Login did not return a session. Please try again.');
        return;
      }

      const user = toAuthUser(response.user);
      if (!user) {
        setServerError('Could not read account information. Please try again.');
        return;
      }

      if (user.role_id !== 1) {
        setServerError(
          'This account does not have administrator access. Use the user sign-in instead.',
        );
        return;
      }

      login(response.token, user);
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
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={values.password}
                onChange={(event) => handleChange('password', event.target.value)}
                error={Boolean(errors.password)}
                {...a11yProps}
              />
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

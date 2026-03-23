import { type FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
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
import { cn } from '../../utils/cn';

type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const initialValues: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const passwordRules = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8,
  },
  {
    key: 'upper',
    label: 'Contains an uppercase letter',
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    key: 'lower',
    label: 'Contains a lowercase letter',
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    key: 'number',
    label: 'Contains a number',
    test: (password: string) => /\d/.test(password),
  },
  {
    key: 'special',
    label: 'Contains a special character',
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
] as const;

function validate(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const allRulesPassed = passwordRules.every((rule) => rule.test(values.password));
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (!allRulesPassed) {
    errors.password = 'Password does not meet strength requirements.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterFormValues>(initialValues);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const passwordChecks = useMemo(
    () =>
      passwordRules.map((rule) => ({
        key: rule.key,
        label: rule.label,
        passed: rule.test(values.password),
      })),
    [values.password],
  );

  const passedCount = passwordChecks.filter((item) => item.passed).length;
  const strengthLabel =
    passedCount <= 2 ? 'Weak' : passedCount <= 4 ? 'Medium' : 'Strong';
  const strengthClass =
    passedCount <= 2
      ? 'text-rose-700 bg-rose-50 border-rose-200'
      : passedCount <= 4
        ? 'text-amber-700 bg-amber-50 border-amber-200'
        : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  function handleChange<K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
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

      const emailTrimmed = values.email.trim();

      await authService.register({
        name: values.fullName.trim(),
        email: emailTrimmed,
        password: values.password,
      });

      setValues(initialValues);
      setErrors({});

      navigate('/verify-email', {
        replace: true,
        state: {
          email: emailTrimmed,
          reason: 'registered' as const,
        },
      });
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Registration failed. Please try again.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-xl border-slate-200/90 bg-white/95 shadow-lg backdrop-blur" padding="lg">
      <CardHeader className="space-y-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
          <ShieldCheck className="size-4 text-[var(--color-brand)]" />
          Secure Registration
        </div>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Start managing tutorials with one professional workspace for mentors and learners.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {serverError ? <Callout variant="danger">{serverError}</Callout> : null}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <FormFieldSlot id="fullName" label="Full name" error={errors.fullName} required>
            {(a11yProps) => (
              <Input
                id="fullName"
                placeholder="Jane Doe"
                autoComplete="name"
                value={values.fullName}
                onChange={(event) => handleChange('fullName', event.target.value)}
                error={Boolean(errors.fullName)}
                {...a11yProps}
              />
            )}
          </FormFieldSlot>

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
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={values.password}
                onChange={(event) => handleChange('password', event.target.value)}
                error={Boolean(errors.password)}
                {...a11yProps}
              />
            )}
          </FormFieldSlot>

          <div className={cn('rounded-xl border p-3', strengthClass)}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Password strength parameters</p>
              <span className="rounded-md border border-current/20 px-2 py-0.5 text-xs font-semibold">
                {strengthLabel}
              </span>
            </div>
            <ul className="space-y-1.5 text-sm">
              {passwordChecks.map((rule) => (
                <li key={rule.key} className="flex items-center gap-2">
                  {rule.passed ? (
                    <CheckCircle2 className="size-4 text-emerald-600" aria-hidden />
                  ) : (
                    <Circle className="size-4 text-slate-400" aria-hidden />
                  )}
                  <span className={rule.passed ? 'text-slate-800' : 'text-slate-600'}>
                    {rule.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <FormFieldSlot
            id="confirmPassword"
            label="Confirm password"
            error={errors.confirmPassword}
            required
          >
            {(a11yProps) => (
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={values.confirmPassword}
                onChange={(event) => handleChange('confirmPassword', event.target.value)}
                error={Boolean(errors.confirmPassword)}
                {...a11yProps}
              />
            )}
          </FormFieldSlot>

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/user-login" className="font-semibold text-[var(--color-brand)] hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

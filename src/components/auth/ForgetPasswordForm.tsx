import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MailCheck, ShieldAlert } from 'lucide-react';
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

type ForgetPasswordValues = {
  email: string;
};

type ForgetPasswordErrors = Partial<Record<keyof ForgetPasswordValues, string>>;

const initialValues: ForgetPasswordValues = {
  email: '',
};

function validate(values: ForgetPasswordValues): ForgetPasswordErrors {
  const errors: ForgetPasswordErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}

export function ForgetPasswordForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<ForgetPasswordValues>(initialValues);
  const [errors, setErrors] = useState<ForgetPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange<K extends keyof ForgetPasswordValues>(
    key: K,
    value: ForgetPasswordValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError('');
    setSuccessMessage('');
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
      setSuccessMessage('');

      const response = await authService.forgetPassword(values.email.trim());
      setSuccessMessage(
        response.message || 'If the email exists, password reset instructions were sent.',
      );
      setValues(initialValues);
      setErrors({});
      setTimeout(() => {
        navigate('/new-password');
      }, 2000);
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string'
          ? error.message
          : 'Failed to request password reset. Please try again.';
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
          <ShieldAlert className="size-4 text-[var(--color-brand)]" />
          Account Recovery
        </div>
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your account email and we will send password reset instructions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {serverError ? <Callout variant="danger">{serverError}</Callout> : null}
        {successMessage ? <Callout variant="success">{successMessage}</Callout> : null}

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

          <Button type="submit" className="w-full" isLoading={isSubmitting} leftIcon={<MailCheck />}>
            Send reset link
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Remembered your password?{' '}
          <Link to="/user-login" className="font-semibold text-[var(--color-brand)] hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

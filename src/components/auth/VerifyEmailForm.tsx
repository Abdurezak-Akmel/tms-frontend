import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { BadgeCheck, KeyRound } from 'lucide-react';
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

type VerifyEmailValues = {
  token: string;
};

type VerifyEmailErrors = Partial<Record<keyof VerifyEmailValues, string>>;

const initialValues: VerifyEmailValues = {
  token: '',
};

// Token Validation
function validate(values: VerifyEmailValues): VerifyEmailErrors {
  const errors: VerifyEmailErrors = {};
  if (!values.token.trim()) {
    errors.token = 'Verification token is required.';
  } else if (values.token.trim().length < 6) {
    errors.token = 'Please enter a valid verification token.';
  }
  return errors;
}

export type VerifyEmailLocationState = {
  email?: string;
  reason?: 'unverified' | 'registered';
};

// Main Verification Handler
export function VerifyEmailForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const navState = location.state as VerifyEmailLocationState | null;

  const fromLogin = navState?.reason === 'unverified';
  const fromRegister = navState?.reason === 'registered';
  const contextEmail = navState?.email;

  const [values, setValues] = useState<VerifyEmailValues>(initialValues);
  const [errors, setErrors] = useState<VerifyEmailErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange<K extends keyof VerifyEmailValues>(
    key: K,
    value: VerifyEmailValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerError('');
    setSuccessMessage('');
  }

  // Submit Handler - API Call
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

      const response = await authService.verifyEmail(values.token.trim());
      setSuccessMessage(response.message || 'Email verified successfully.');
      setValues(initialValues);
      setErrors({});

      // Redirect to login after a brief delay
      setTimeout(() => {
        navigate('/user-login');
      }, 2000);

    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string'
          ? error.message
          : 'Email verification failed. Please check your token and try again.';
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
          <BadgeCheck className="size-4 text-[var(--color-brand)]" />
          Verify Account
        </div>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>
          Enter the token from your verification email to activate your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {fromRegister ? (
          <Callout variant="success" title="Check your email">
            <p>
              {contextEmail ? (
                <>
                  We sent a verification link or token to{' '}
                  <span className="font-medium">{contextEmail}</span>. Paste the token below to
                  activate your account, then sign in.
                </>
              ) : (
                <>
                  We sent a verification link or token to your email. Paste the token below to
                  activate your account, then sign in.
                </>
              )}
            </p>
          </Callout>
        ) : null}
        {fromLogin ? (
          <Callout variant="info" title="Email verification required">
            <p>
              {contextEmail ? (
                <>
                  Your account <span className="font-medium">{contextEmail}</span> is not verified yet.
                  Paste the token from your verification email below, then sign in again.
                </>
              ) : (
                <>
                  Your account is not verified yet. Paste the token from your verification email
                  below, then sign in again.
                </>
              )}
            </p>
          </Callout>
        ) : null}
        {serverError ? <Callout variant="danger">{serverError}</Callout> : null}
        {successMessage ? <Callout variant="success">{successMessage}</Callout> : null}

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <FormFieldSlot id="token" label="Verification token" error={errors.token} required>
            {(a11yProps) => (
              <Input
                id="token"
                type="text"
                placeholder="Paste your token"
                autoComplete="one-time-code"
                value={values.token}
                onChange={(event) => handleChange('token', event.target.value)}
                error={Boolean(errors.token)}
                {...a11yProps}
              />
            )}
          </FormFieldSlot>

          <Button type="submit" className="w-full" isLoading={isSubmitting} leftIcon={<KeyRound />}>
            Verify email
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already verified?{' '}
          <Link to="/user-login" className="font-semibold text-[var(--color-brand)] hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

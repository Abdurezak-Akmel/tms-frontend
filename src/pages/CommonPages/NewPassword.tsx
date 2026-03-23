import { type FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '../../components/ui';
import { Stack } from '../../components/layout';
import { Callout } from '../../components/feedback';
import { FormFieldSlot } from '../../components/forms';
import authService from '../../services/authService';

type ResetPasswordValues = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordErrors = Partial<Record<keyof ResetPasswordValues, string>>;

const initialValues: ResetPasswordValues = {
  token: '',
  newPassword: '',
  confirmPassword: '',
};

function validate(values: ResetPasswordValues): ResetPasswordErrors {
  const errors: ResetPasswordErrors = {};
  if (!values.token.trim()) {
    errors.token = 'Reset token is required.';
  }
  if (!values.newPassword) {
    errors.newPassword = 'New password is required.';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters.';
  }
  if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
}

const NewPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Populate token if present in URL query
  const [values, setValues] = useState<ResetPasswordValues>({
    ...initialValues,
    token: searchParams.get('token') || '',
  });

  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange<K extends keyof ResetPasswordValues>(
    key: K,
    value: ResetPasswordValues[K],
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
      setSuccessMessage('');

      const response = await authService.resetPassword({
        token: values.token.trim(),
        newPassword: values.newPassword,
      });

      setSuccessMessage(response.message || 'Password reset successful.');
      setValues(initialValues);
      setErrors({});

      // Redirect to login after success
      setTimeout(() => {
        navigate('/user-login');
      }, 2000);
    } catch (error: any) {
      setServerError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <Stack gap="lg" className="w-full max-w-xl">
        <Card
          className="w-full border-slate-200/90 bg-white shadow-xl"
          padding="lg"
        >
          <CardHeader className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <ShieldCheck className="size-4 text-[var(--color-brand)]" />
              Reset Password
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Create new password</CardTitle>
            <CardDescription>
              Enter the reset token sent to your email and choose a strong new password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {serverError ? <Callout variant="danger">{serverError}</Callout> : null}
            {successMessage ? (
              <Callout variant="success" title="Success">
                {successMessage} Redirection to login in 3 seconds...
              </Callout>
            ) : null}

            <form className="space-y-5" noValidate onSubmit={handleSubmit}>
              <FormFieldSlot id="token" label="Reset token" error={errors.token} required>
                {(a11yProps) => (
                  <Input
                    id="token"
                    placeholder="Enter the code from your email"
                    value={values.token}
                    onChange={(e) => handleChange('token', e.target.value)}
                    error={Boolean(errors.token)}
                    {...a11yProps}
                  />
                )}
              </FormFieldSlot>

              <FormFieldSlot id="newPassword" label="New password" error={errors.newPassword} required>
                {(a11yProps) => (
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={values.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    error={Boolean(errors.newPassword)}
                    {...a11yProps}
                  />
                )}
              </FormFieldSlot>

              <FormFieldSlot id="confirmPassword" label="Confirm new password" error={errors.confirmPassword} required>
                {(a11yProps) => (
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={values.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    error={Boolean(errors.confirmPassword)}
                    {...a11yProps}
                  />
                )}
              </FormFieldSlot>

              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
                leftIcon={<Lock size={18} />}
              >
                Reset password
              </Button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/user-login')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[var(--color-brand)] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
};

export default NewPassword;

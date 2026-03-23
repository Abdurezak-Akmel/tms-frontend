import { type FormEvent, useMemo, useState } from 'react';
import { CalendarDays, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { FormFieldInput, FormFieldTextarea } from '../../components/forms';
import { Callout } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';

type ProfileValues = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

type ProfileErrors = Partial<Record<keyof ProfileValues, string>>;

const initialValues: ProfileValues = {
  fullName: 'Ava Morgan',
  email: 'ava.morgan@example.com',
  phone: '+1 (555) 209-8841',
  location: 'New York, USA',
  bio: 'Frontend-focused learner building production-ready web apps with strong accessibility and clean UI architecture.',
};

const quickStats = [
  { label: 'Courses enrolled', value: '4' },
  { label: 'Videos completed', value: '19' },
  { label: 'Files reviewed', value: '11' },
] as const;

function validate(values: ProfileValues): ProfileErrors {
  const errors: ProfileErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (values.phone.trim() && !/^[+()\-\s\d]{7,20}$/.test(values.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (values.bio.trim().length > 280) {
    errors.bio = 'Bio should be at most 280 characters.';
  }

  return errors;
}

const Profile = () => {
  const [values, setValues] = useState<ProfileValues>(initialValues);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const initials = useMemo(
    () =>
      values.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join(''),
    [values.fullName],
  );

  function setField<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setSuccessMessage('');
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setWeeklyDigest(true);
    setCourseUpdates(true);
    setSecurityAlerts(true);
    setSuccessMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API latency for this frontend-only implementation.
    await new Promise((resolve) => setTimeout(resolve, 450));

    setSuccessMessage('Profile changes saved successfully.');
    setIsSubmitting(false);
  }

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Profile"
        description="Manage your personal details, learning identity, and notification preferences."
        actions={
          <Badge variant="success" className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" aria-hidden />
            Account verified
          </Badge>
        }
      />

      {successMessage ? <Callout variant="success">{successMessage}</Callout> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200/90 shadow-sm lg:col-span-1" padding="lg">
          <CardHeader>
            <CardTitle className="text-base">Learner identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar alt={values.fullName} fallback={initials || 'U'} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-900">{values.fullName}</p>
                <p className="truncate text-sm text-slate-500">{values.email}</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-slate-400" aria-hidden />
                <span>{values.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-slate-400" aria-hidden />
                <span>{values.phone || 'No phone number added'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-slate-400" aria-hidden />
                <span>{values.location || 'Location not specified'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="size-4 text-slate-400" aria-hidden />
                <span>Joined Jan 2025</span>
              </li>
            </ul>

            <div className="grid grid-cols-3 gap-2">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-center">
                  <p className="text-base font-semibold text-slate-900">{item.value}</p>
                  <p className="text-[11px] leading-tight text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm lg:col-span-2" padding="lg">
          <CardHeader>
            <CardTitle className="text-base">Edit profile details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" noValidate onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormFieldInput
                  id="profile-full-name"
                  label="Full name"
                  value={values.fullName}
                  onChange={(event) => setField('fullName', event.target.value)}
                  error={errors.fullName}
                  required
                />
                <FormFieldInput
                  id="profile-email"
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={(event) => setField('email', event.target.value)}
                  error={errors.email}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormFieldInput
                  id="profile-phone"
                  label="Phone"
                  type="tel"
                  value={values.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  error={errors.phone}
                  placeholder="+1 (555) 000-0000"
                />
                <FormFieldInput
                  id="profile-location"
                  label="Location"
                  value={values.location}
                  onChange={(event) => setField('location', event.target.value)}
                  error={errors.location}
                  placeholder="City, Country"
                />
              </div>

              <FormFieldTextarea
                id="profile-bio"
                label="Bio"
                value={values.bio}
                onChange={(event) => setField('bio', event.target.value)}
                error={errors.bio}
                placeholder="Tell others what you are focused on learning."
                rows={4}
                description="Keep your bio concise and relevant (max 280 characters)."
              />

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">Notification preferences</p>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                    checked={weeklyDigest}
                    onChange={(event) => setWeeklyDigest(event.target.checked)}
                  />
                  Weekly learning digest
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                    checked={courseUpdates}
                    onChange={(event) => setCourseUpdates(event.target.checked)}
                  />
                  Course and material updates
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
                    checked={securityAlerts}
                    onChange={(event) => setSecurityAlerts(event.target.checked)}
                  />
                  Security alerts
                </label>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" isLoading={isSubmitting}>
                  Save changes
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Stack>
  );
};

export default Profile;
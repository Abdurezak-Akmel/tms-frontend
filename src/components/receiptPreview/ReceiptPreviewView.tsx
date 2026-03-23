import { useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, FileCheck2, ImageIcon } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ButtonLink } from '../ui/ButtonLink';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Separator } from '../ui/Separator';
import type { ReceiptPreviewState } from './types';

function formatMoney(amount: number | undefined, currency: string | undefined): string {
  if (amount == null || !currency) return '—';
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function ReceiptPreviewView() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as ReceiptPreviewState | null;

  if (!id) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center text-sm text-slate-600">
        Missing receipt reference.
      </div>
    );
  }

  const fileName = state?.fileName ?? `Receipt-${id ?? 'unknown'}`;
  const courseTitle = state?.courseTitle ?? 'Course enrollment';
  const amountLabel = formatMoney(state?.amount, state?.currency);
  const uploadedAt = state?.uploadedAtLabel ?? '—';
  const courseId = state?.courseId;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-10">
      <div>
        <ButtonLink to={courseId ? `/courses/${courseId}` : '/courses'} variant="ghost" size="sm" className="mb-4">
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" aria-hidden />
            {courseId ? 'Back to course' : 'Back to catalog'}
          </span>
        </ButtonLink>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Receipt preview
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Reference <span className="font-mono text-slate-800">{id}</span> — demo view until backend storage is wired.
        </p>
      </div>

      <Card className="overflow-hidden border-slate-200/90 shadow-sm" padding="none">
        <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Payment receipt</CardTitle>
              <CardDescription>Submitted for verification</CardDescription>
            </div>
            <Badge variant="warning">Pending review</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-6">
          <div className="flex aspect-[4/3] max-h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            <div className="flex flex-col items-center gap-2 text-center">
              <ImageIcon className="size-12 stroke-1" aria-hidden />
              <span className="text-sm">Preview placeholder</span>
              <span className="max-w-xs truncate text-xs font-medium text-slate-600">{fileName}</span>
            </div>
          </div>

          <Separator />

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">File</dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-900">
                <FileCheck2 className="size-4 shrink-0 text-emerald-600" aria-hidden />
                {fileName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Course</dt>
              <dd className="mt-1 text-sm text-slate-900">{courseTitle}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Amount</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{amountLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Uploaded</dt>
              <dd className="mt-1 text-sm text-slate-900">{uploadedAt}</dd>
            </div>
          </dl>

          <p className="rounded-lg bg-sky-50/90 px-4 py-3 text-sm text-sky-950 ring-1 ring-sky-100">
            Administrators will match this receipt to your enrollment. You will get access when the
            payment is approved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

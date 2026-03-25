import { type ChangeEvent, useCallback, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Receipt, Upload } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import type { CourseDetail } from './types';

export type UploadedReceiptItem = {
  id: string;
  fileName: string;
  uploadedAtLabel: string;
};

export type CoursePurchaseAndReceiptProps = {
  course: CourseDetail;
};

function formatNow(): string {
  return new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function CoursePurchaseAndReceipt({ course }: CoursePurchaseAndReceiptProps) {
  const inputId = useId();
  const [uploads, setUploads] = useState<UploadedReceiptItem[]>([]);

  const handleFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const id = `r-${Date.now()}`;
      setUploads((prev) => [
        {
          id,
          fileName: file.name,
          uploadedAtLabel: formatNow(),
        },
        ...prev,
      ]);
      event.target.value = '';
    },
    [],
  );

  const scrollToPayment = () => {
    document.getElementById('course-payment')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const priceLabel = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: course.currency,
  }).format(course.price);

  return (
    <div id="course-payment" className="scroll-mt-8 space-y-6">
      <Card className="border-slate-200/90 shadow-md" padding="lg">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="size-5 text-[var(--color-brand)]" aria-hidden />
            Enroll & pay
          </CardTitle>
          <CardDescription>
            Purchase access to this course, then upload your payment receipt for verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Course price</p>
              <p className="text-3xl font-semibold tracking-tight text-slate-900">{priceLabel}</p>
              <p className="mt-1 text-xs text-slate-500">One-time enrollment · mock checkout (no charge)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="lg" className="min-w-[140px]" onClick={scrollToPayment}>
                Buy now
              </Button>
              <ButtonLinkOutline to="/add-receipt" />
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-start gap-3">
              <Receipt className="mt-0.5 size-5 shrink-0 text-slate-500" aria-hidden />
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-slate-800">Payment receipt</p>
                <p className="text-sm text-slate-600">
                  After paying through your agreed channel, upload your PDF receipt here. Click a
                  submitted receipt to open its preview page.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1 space-y-2">
                <Label htmlFor={inputId}>Upload file</Label>
                <Input
                  id={inputId}
                  type="file"
                  accept=".pdf"
                  onChange={handleFile}
                  className="cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Upload className="size-4" aria-hidden />
                PDF only · demo only
              </div>
            </div>
          </div>

          {uploads.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-800">Your uploaded receipts</p>
              <ul className="space-y-2">
                {uploads.map((u) => (
                  <li key={u.id}>
                    <Link
                      to={`/receipts/${u.id}`}
                      state={{
                        fileName: u.fileName,
                        courseTitle: course.title,
                        courseId: course.id,
                        amount: course.price,
                        currency: course.currency,
                        uploadedAtLabel: u.uploadedAtLabel,
                      }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition-colors hover:border-[var(--color-brand)]/40 hover:bg-indigo-50/40"
                    >
                      <span className="min-w-0 truncate font-medium text-slate-900">{u.fileName}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <Badge variant="warning">Pending</Badge>
                        <span className="hidden text-xs text-slate-500 sm:inline">{u.uploadedAtLabel}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No receipts uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ButtonLinkOutline({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-base font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
    >
      Full receipt page
    </Link>
  );
}

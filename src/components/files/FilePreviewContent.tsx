import { Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Separator } from '../ui/Separator';
import type { FileCatalogItem } from './types';
import { fileKindAccent, fileKindIcon } from './fileKindMeta';

/** Demo PDF for iframe preview (public W3C sample) */
const DEMO_PDF_URL =
  'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

export type FilePreviewContentProps = {
  file: FileCatalogItem;
};

export function FilePreviewContent({ file }: FilePreviewContentProps) {
  const Icon = fileKindIcon(file.kind);
  const accent = fileKindAccent(file.kind);

  return (
    <div className="space-y-8">
      <div
        className={`overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br shadow-sm ring-1 ring-slate-900/5 ${accent}`}
      >
        <div className="flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/90 shadow-sm ring-1 ring-slate-200/80">
              <Icon className="size-8 text-[var(--color-brand)]" strokeWidth={1.5} aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Material</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {file.name}
              </h1>
              <p className="text-sm text-slate-700">{file.description}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button type="button" variant="outline" size="md" rightIcon={<Download className="size-4" />}>
              Download (demo)
            </Button>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/90 shadow-sm" padding="none">
        <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>
            Inline preview is a placeholder. Production builds can stream from S3 or signed URLs.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <PreviewFrame kind={file.kind} name={file.name} />
        </CardContent>
      </Card>

      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle className="text-base">File details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Type</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{file.kind}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Size</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{file.sizeLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Updated</dt>
              <dd className="mt-1 text-sm text-slate-900">{file.updatedLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Course</dt>
              <dd className="mt-1 text-sm text-slate-900">{file.courseName}</dd>
            </div>
          </dl>
          <Separator className="my-6" />
          <p className="text-sm text-slate-600">
            <ExternalLink className="mr-1 inline size-4 align-text-bottom text-slate-400" aria-hidden />
            Admins upload files via the dashboard; learners access them here after enrollment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PreviewFrame({ kind, name }: { kind: FileCatalogItem['kind']; name: string }) {
  if (kind === 'PDF') {
    return (
      <div className="aspect-[16/10] min-h-[min(70vh,520px)] w-full bg-slate-100">
        <iframe
          title={`Preview of ${name}`}
          src={DEMO_PDF_URL}
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  if (kind === 'Image') {
    return (
      <div className="flex aspect-video max-h-[420px] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-700">Image preview</p>
          <p className="mt-1 max-w-md px-4 text-xs text-slate-500">
            Connect a real image URL from your API to render here. Demo: no binary loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 bg-slate-50 px-6 py-14 text-center">
      <p className="text-sm font-semibold text-slate-800">No inline preview for {kind}</p>
      <p className="max-w-md text-sm text-slate-600">
        For archives, code, and diagrams, the app will offer download or a specialized viewer once
        wired to storage.
      </p>
    </div>
  );
}

import { Download, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Separator } from '../ui/Separator';
import type { FileCatalogItem } from './types';
import { fileKindAccent, fileKindIcon } from './fileKindMeta';

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
              <p className="text-sm text-slate-700">{file.description || "No description provided."}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a 
              href={file.url} 
              download={file.name}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95"
            >
              <Download className="size-4" />
              Download File
            </a>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/90 shadow-sm" padding="none">
        <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>
            {file.kind === 'PDF' || file.kind === 'Image' 
              ? "Browser-native preview for this file type." 
              : "Inline preview is not available for this file type."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <PreviewFrame kind={file.kind} name={file.name} url={file.url} />
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
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Uploaded</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {file.updatedLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Course</dt>
              <dd className="mt-1 text-sm text-slate-900">{file.courseName || "General Reference"}</dd>
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

function PreviewFrame({ kind, name, url }: { kind: FileCatalogItem['kind']; name: string; url: string }) {
  if (kind === 'PDF') {
    return (
      <div className="aspect-[16/10] min-h-[min(70vh,600px)] w-full bg-slate-100">
        <iframe
          title={`Preview of ${name}`}
          src={url}
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  if (kind === 'Image') {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center bg-slate-50 p-8">
        <div className="relative max-w-full overflow-hidden rounded-lg shadow-lg ring-1 ring-slate-200">
          <img 
            src={url} 
            alt={name} 
            className="max-h-[60vh] object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-center text-[10px] text-white backdrop-blur-sm">
            {name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 bg-slate-50 px-6 py-14 text-center">
      <p className="text-sm font-semibold text-slate-800">No inline preview for {kind}</p>
      <p className="max-w-md text-sm text-slate-600">
        This file type cannot be previewed directly in the browser. Please use the download button above to view the application content.
      </p>
    </div>
  );
}

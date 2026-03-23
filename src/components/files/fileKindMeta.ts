import {
  Archive,
  Braces,
  FileCode,
  FileImage,
  FileText,
  FileType,
  GitBranch,
  Network,
} from 'lucide-react';
import type { FileKind } from './types';

export function fileKindIcon(kind: FileKind) {
  switch (kind) {
    case 'PDF':
      return FileText;
    case 'Archive':
      return Archive;
    case 'Markdown':
      return FileCode;
    case 'JSON':
      return Braces;
    case 'Image':
      return FileImage;
    case 'SQL':
      return FileCode;
    case 'YAML':
      return FileType;
    case 'Diagram':
      return Network;
    default:
      return GitBranch;
  }
}

export function fileKindAccent(kind: FileKind): string {
  switch (kind) {
    case 'PDF':
      return 'from-rose-500/15 to-orange-500/10 text-rose-700';
    case 'Archive':
      return 'from-amber-500/15 to-yellow-500/10 text-amber-800';
    case 'Markdown':
      return 'from-slate-500/15 to-slate-400/10 text-slate-800';
    case 'JSON':
      return 'from-amber-500/15 to-lime-500/10 text-amber-900';
    case 'Image':
      return 'from-sky-500/15 to-indigo-500/10 text-sky-900';
    case 'SQL':
      return 'from-rose-500/15 to-orange-500/10 text-rose-800';
    case 'YAML':
      return 'from-violet-500/15 to-purple-500/10 text-violet-900';
    case 'Diagram':
      return 'from-emerald-500/15 to-teal-500/10 text-emerald-900';
    default:
      return 'from-indigo-500/15 to-violet-500/10 text-indigo-900';
  }
}

export type FileKind =
  | 'PDF'
  | 'Archive'
  | 'Markdown'
  | 'JSON'
  | 'Image'
  | 'SQL'
  | 'YAML'
  | 'Diagram'
  | 'Other';

export type FileCatalogItem = {
  id: string;
  courseId: string;
  courseName: string;
  name: string;
  description: string;
  sizeLabel: string;
  kind: FileKind;
  /** Shown as “last updated” */
  updatedLabel: string;
};

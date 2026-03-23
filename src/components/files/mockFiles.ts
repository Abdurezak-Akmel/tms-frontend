import type { FileCatalogItem } from './types';

/** Static catalog — replace with API. IDs align with course preview links where applicable. */
export const MOCK_FILES: FileCatalogItem[] = [
  {
    id: 'f201',
    courseId: '1',
    courseName: 'Frontend fundamentals',
    name: 'Syllabus-Frontend-2025.pdf',
    description: 'Full syllabus, grading, and weekly milestones for the frontend track.',
    sizeLabel: '240 KB',
    kind: 'PDF',
    updatedLabel: 'Jan 12, 2025',
  },
  {
    id: 'f202',
    courseId: '1',
    courseName: 'Frontend fundamentals',
    name: 'Starter-code-module-1.zip',
    description: 'Boilerplate Vite + React project with exercises and lint rules.',
    sizeLabel: '1.2 MB',
    kind: 'Archive',
    updatedLabel: 'Jan 10, 2025',
  },
  {
    id: 'f203',
    courseId: '1',
    courseName: 'Frontend fundamentals',
    name: 'Accessibility-checklist.md',
    description: 'Copy-paste checklist for keyboard, screen readers, and focus order.',
    sizeLabel: '12 KB',
    kind: 'Markdown',
    updatedLabel: 'Jan 8, 2025',
  },
  {
    id: 'f204',
    courseId: '1',
    courseName: 'Frontend fundamentals',
    name: 'Design-tokens.figma',
    description: 'Shared color, spacing, and type tokens for assignments and UI reviews.',
    sizeLabel: '4.5 MB',
    kind: 'Other',
    updatedLabel: 'Jan 5, 2025',
  },
  {
    id: 'f301',
    courseId: '2',
    courseName: 'Backend essentials',
    name: 'Postman-collection.json',
    description: 'Collection covering auth, CRUD, and error scenarios for the course API.',
    sizeLabel: '48 KB',
    kind: 'JSON',
    updatedLabel: 'Feb 2, 2025',
  },
  {
    id: 'f302',
    courseId: '2',
    courseName: 'Backend essentials',
    name: 'ERD-backend-course.png',
    description: 'High-resolution entity relationship diagram for reference.',
    sizeLabel: '320 KB',
    kind: 'Image',
    updatedLabel: 'Feb 1, 2025',
  },
  {
    id: 'f303',
    courseId: '2',
    courseName: 'Backend essentials',
    name: 'Environment-variables.example.env',
    description: 'Template for local secrets and database URLs (no real credentials).',
    sizeLabel: '2 KB',
    kind: 'Other',
    updatedLabel: 'Jan 28, 2025',
  },
  {
    id: 'f401',
    courseId: '3',
    courseName: 'Database design & SQL',
    name: 'Sample-schema.sql',
    description: 'Starter schema used in live workshops and homework.',
    sizeLabel: '8 KB',
    kind: 'SQL',
    updatedLabel: 'Mar 15, 2025',
  },
  {
    id: 'f501',
    courseId: '4',
    courseName: 'DevOps & deployment',
    name: 'docker-compose.example.yml',
    description: 'Multi-service compose file for local development and demos.',
    sizeLabel: '2 KB',
    kind: 'YAML',
    updatedLabel: 'Jan 20, 2025',
  },
  {
    id: 'f601',
    courseId: '5',
    courseName: 'UI/UX for developers',
    name: 'Figma-handoff-notes.pdf',
    description: 'How to read specs, spacing, and component naming from design files.',
    sizeLabel: '1.1 MB',
    kind: 'PDF',
    updatedLabel: 'Jan 18, 2025',
  },
  {
    id: 'f701',
    courseId: '6',
    courseName: 'Advanced system design',
    name: 'Architecture-templates.drawio',
    description: 'Editable diagrams for caching, queues, and replication patterns.',
    sizeLabel: '64 KB',
    kind: 'Diagram',
    updatedLabel: 'Jan 22, 2025',
  },
];

export function getFileById(id: string | undefined): FileCatalogItem | undefined {
  if (!id) return undefined;
  return MOCK_FILES.find((f) => f.id === id);
}

export function groupFilesByCourse(
  files: FileCatalogItem[],
): { courseId: string; courseName: string; files: FileCatalogItem[] }[] {
  const map = new Map<string, { courseId: string; courseName: string; files: FileCatalogItem[] }>();
  for (const f of files) {
    const key = f.courseId;
    if (!map.has(key)) {
      map.set(key, { courseId: f.courseId, courseName: f.courseName, files: [] });
    }
    map.get(key)!.files.push(f);
  }
  return Array.from(map.values()).sort((a, b) => a.courseName.localeCompare(b.courseName));
}

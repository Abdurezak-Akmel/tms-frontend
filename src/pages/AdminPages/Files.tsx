import { useEffect, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  CourseFileSection,
} from '../../components/files';
import { Callout, EmptyState } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { courseMaterialService } from '../../services/courseMaterialService';
import type { CourseMaterial } from '../../services/courseMaterialService';
import { courseService } from '../../services/courseService';
import type { Course } from '../../services/courseService';
import type { FileCatalogItem, FileKind } from '../../components/files';

const Files = () => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [materialRes, courseRes] = await Promise.all([
        courseMaterialService.getAllMaterials(),
        courseService.getAllCourses()
      ]);

      if (materialRes.success && materialRes.materials) {
        setMaterials(materialRes.materials);
      }
      if (courseRes.success && courseRes.courses) {
        setCourses(courseRes.courses);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteMaterial = async (materialId: string) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      setIsDeletingId(materialId);
      const res = await courseMaterialService.deleteMaterial(parseInt(materialId));
      
      if (res.success) {
        toast.success('File deleted successfully');
        setMaterials((prev) => prev.filter((m) => m.material_id.toString() !== materialId));
      } else {
        toast.error(res.message || 'Failed to delete file');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while deleting the file');
    } finally {
      setIsDeletingId(null);
    }
  };

  const courseMap = new Map(courses.map(c => [c.course_id, c.title]));

  const mappedFiles: FileCatalogItem[] = materials.map(m => {
    let kind: FileKind = 'Other';
    const ext = m.file_type.split('/')[1]?.toUpperCase();
    if (ext === 'PDF') kind = 'PDF';
    else if (ext === 'ZIP' || ext === 'X-ZIP-COMPRESSED') kind = 'Archive';
    else if (ext === 'JSON') kind = 'JSON';
    else if (ext === 'PNG' || ext === 'JPG' || ext === 'JPEG' || ext === 'GIF') kind = 'Image';
    else if (ext === 'PLAIN' && m.file_name.endsWith('.md')) kind = 'Markdown';
    else if (ext === 'SQL') kind = 'SQL';
    else if (ext === 'YAML' || ext === 'YML') kind = 'YAML';

    return {
      id: m.material_id.toString(),
      courseId: m.course_id.toString(),
      courseName: courseMap.get(m.course_id) || 'Unknown Course',
      name: m.title,
      description: m.description || 'No description provided',
      sizeLabel: courseMaterialService.formatFileSize(m.file_size),
      kind,
      updatedLabel: new Date(m.updated_at || m.uploaded_at).toLocaleDateString(),
      url: courseMaterialService.getFileUrl(m),
      uploadedAt: m.uploaded_at
    };
  });

  type Section = { courseName: string; courseId: string; files: FileCatalogItem[] };
  const groupFiles = (items: FileCatalogItem[]): Section[] => {
    const map = new Map<string, Section>();
    for (const f of items) {
      if (!map.has(f.courseId)) {
        map.set(f.courseId, { courseName: f.courseName, courseId: f.courseId, files: [] });
      }
      map.get(f.courseId)!.files.push(f);
    }
    return Array.from(map.values()).sort((a, b) => a.courseName.localeCompare(b.courseName));
  };

  const sections = groupFiles(mappedFiles);

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading files...</div>;
  }

  if (error) {
    return <Callout variant="danger" title="Error">{error}</Callout>;
  }

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Files"
        description="Course support materials uploaded by your instructors—organized by course."
        actions={
          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <FolderOpen className="size-4 text-[var(--color-brand)]" aria-hidden />
            {materials.length} files
          </span>
        }
      />

      {sections.length === 0 ? (
        <EmptyState 
          title="No files found" 
          description="Start by uploading files to your courses from the course preview page."
        />
      ) : (
        <div className="space-y-14">
          {sections.map((section) => (
            <CourseFileSection
              key={section.courseId}
              courseId={section.courseId}
              courseName={section.courseName}
              files={section.files}
              basePath="/admin/files"
              onDelete={handleDeleteMaterial}
              isDeletingId={isDeletingId}
            />
          ))}
        </div>
      )}
    </Stack>
  );
};

export default Files;

import { useEffect, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import {
  CourseFileSection,
} from '../../components/files';
import { Callout, EmptyState } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { courseMaterialService } from '../../services/courseMaterialService';
import type { CourseMaterial } from '../../services/courseMaterialService';
import { courseService } from '../../services/courseService';
import type { Course } from '../../services/courseService';

const Files = () => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchData();
  }, []);

  const courseMap = new Map(courses.map(c => [c.course_id, c.title]));

  const mappedFiles = materials.map(m => ({
    id: m.material_id.toString(),
    courseId: m.course_id.toString(),
    courseName: courseMap.get(m.course_id) || 'Unknown Course',
    name: m.title,
    description: m.description || 'No description provided',
    sizeLabel: courseMaterialService.formatFileSize(m.file_size),
    kind: (m.file_type.split('/')[1]?.toUpperCase() || 'OTHER') as any,
    updatedLabel: new Date(m.updated_at || m.uploaded_at).toLocaleDateString(),
    url: m.file_url,
    uploadedAt: m.uploaded_at
  }));

  const groupFiles = (items: any[]) => {
    const map = new Map<string, { courseName: string; courseId: string; files: any[] }>();
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
            />
          ))}
        </div>
      )}
    </Stack>
  );
};

export default Files;

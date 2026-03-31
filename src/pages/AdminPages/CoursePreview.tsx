import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Film, FileText, Trash2 } from 'lucide-react';
import { EmptyState } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { Badge, Button } from '../../components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';
import { courseService } from '../../services/courseService';
import type { Course } from '../../services/courseService';
import { videoService } from '../../services/videoService';
import type { Video } from '../../services/videoService';
import { courseMaterialService } from '../../services/courseMaterialService';
import type { CourseMaterial } from '../../services/courseMaterialService';
import { ButtonLink } from '../../components/ui/ButtonLink';

const levelBadge: Record<string, 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
  expert: 'danger',
};

const CoursePreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const courseId = parseInt(id);
        const [courseRes, videosRes, materialsRes] = await Promise.all([
          courseService.getCourseById(courseId),
          videoService.getVideosByCourseId(courseId),
          courseMaterialService.getMaterialsByCourseId(courseId)
        ]);

        if (courseRes.success && courseRes.course) {
          setCourse(courseRes.course);
        } else {
          setError('Course not found');
        }

        if (videosRes.success && videosRes.videos) {
          setVideos(videosRes.videos);
        }

        if (materialsRes.success && materialsRes.materials) {
          setMaterials(materialsRes.materials);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !course) return;

    if (window.confirm(`Are you sure you want to delete "${course.title}"? This will delete all its videos and files permanently.`)) {
      try {
        setIsDeleting(true);
        const response = await courseService.deleteCourse(parseInt(id));
        if (response.success) {
          navigate('/admin/courses');
        } else {
          alert(response.message || 'Failed to delete course');
        }
      } catch (err: any) {
        alert(err.message || 'An unexpected error occurred during deletion');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading course details...</div>;
  }

  if (error || !course) {
    return (
      <EmptyState
        title={error || "Course not found"}
        description="We couldn't find the course you're looking for."
        action={
          <Link
            to="/admin/courses"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-brand)] px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-brand-dark)]"
          >
            View all courses
          </Link>
        }
      />
    );
  }

  // Transform video and material data for the component if needed, 
  // or just pass them as they are and update the component.
  // For now, I'll pass them directly but they might need mapping.
  const mappedVideos = videos.map(v => ({
    id: v.video_id.toString(),
    title: v.title || 'Untitled Video',
    duration: videoService.formatDuration(v.duration)
  }));

  const mappedFiles = materials.map(m => ({
    id: m.material_id.toString(),
    name: m.title,
    sizeLabel: courseMaterialService.formatFileSize(m.file_size),
    kind: m.file_type.split('/')[1]?.toUpperCase() || 'FILE'
  }));

  return (
    <Stack gap="lg" className="pb-10">
      <div>
        <Link
          to="/admin/courses"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All courses
        </Link>

        <PageHeader
          title={course.title}
          description={course.description || ''}
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant={levelBadge[course.level?.toLowerCase() || 'beginner']}>
                {course.level}
              </Badge>
              <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {course.price || 'Free'}
              </Badge>
              <div className="flex gap-2">
                <div className="w-px h-8 bg-slate-200 mx-1"></div>
                <ButtonLink
                  to={`/admin/add-video?course_id=${course.course_id}`}
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="size-4" />}
                >
                  Add Video
                </ButtonLink>
                <ButtonLink
                  to={`/admin/add-file?course_id=${course.course_id}`}
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="size-4" />}
                >
                  Add File
                </ButtonLink>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  leftIcon={<Trash2 className="size-4" />}
                >
                  Delete Course
                </Button>
              </div>
            </div>
          }
        />
      </div>

      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle>About this course</CardTitle>
          <CardDescription>Published on {new Date(course.created_at).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-relaxed text-slate-700">{course.description}</p>
        </CardContent>
      </Card>

      {/* Override internal links in CourseResourceLists to match Admin routes */}
      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Videos Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Film className="size-5 text-[var(--color-brand)]" aria-hidden />
                Videos
              </h3>
            </div>
            {mappedVideos.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {mappedVideos.map((v) => (
                  <li key={v.id}>
                    <Link
                      to={`/admin/videos/${v.id}`}
                      className="group flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:bg-slate-50/80"
                    >
                      <span className="font-medium text-slate-900 group-hover:text-[var(--color-brand)]">
                        {v.title}
                      </span>
                      <span className="text-slate-500 tabular-nums">{v.duration}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No videos added yet.</p>
            )}
          </div>

          {/* Files Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="size-5 text-[var(--color-brand)]" aria-hidden />
                Files
              </h3>
            </div>
            {mappedFiles.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {mappedFiles.map((f) => (
                  <li key={f.id}>
                    <Link
                      to={`/admin/files/${f.id}`}
                      className="group flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:bg-slate-50/80"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 group-hover:text-[var(--color-brand)]">
                          {f.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {f.kind} · {f.sizeLabel}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No files added yet.</p>
            )}
          </div>
        </div>
      </Card>
    </Stack>
  );
};

export default CoursePreview;

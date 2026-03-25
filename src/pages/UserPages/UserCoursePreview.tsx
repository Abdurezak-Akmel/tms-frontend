import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Film,
  FileText,
  Loader2,
  Lock,
} from 'lucide-react';
import {
  CourseResourceLists,
} from '../../components/coursePreview';
import type { CourseDetail, CourseVideoItem, CourseFileItem } from '../../components/coursePreview/types';
import { Callout, EmptyState } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { Badge, ButtonLink } from '../../components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';
import { courseService } from '../../services/courseService';
import { videoService } from '../../services/videoService';
import { courseMaterialService } from '../../services/courseMaterialService';

const levelBadge: Record<'Beginner' | 'Intermediate' | 'Advanced', 'success' | 'warning' | 'danger'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger',
};

type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

const UserCoursePreview = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  // isLocked = true means the course is NOT assigned to the user's role
  const isLocked = searchParams.get('locked') === 'true';

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const courseId = parseInt(id, 10);
    if (isNaN(courseId)) {
      setError('Invalid course ID.');
      setIsLoading(false);
      return;
    }

    const fetchCourseData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Always fetch the core course info from the DB
        const courseRes = await courseService.getCourseById(courseId);
        if (!courseRes.success || !courseRes.course) {
          setError(courseRes.message || 'Course not found.');
          return;
        }
        const c = courseRes.course;

        let videos: CourseVideoItem[] = [];
        let files: CourseFileItem[] = [];

        // If not locked, fetch resources like videos and files
        if (!isLocked) {
          const [videosRes, materialsRes] = await Promise.all([
            videoService.getVideosByCourseId(courseId),
            courseMaterialService.getMaterialsByCourseId(courseId),
          ]);

          if (videosRes.success && videosRes.videos) {
            videos = videosRes.videos.map((v) => ({
              id: v.video_id.toString(),
              title: v.title || 'Untitled video',
              duration: v.duration ? videoService.formatDuration(v.duration) : 'Unknown',
            }));
          }

          if (materialsRes.success && materialsRes.materials) {
            files = materialsRes.materials.map((m) => ({
              id: m.material_id.toString(),
              name: m.file_name,
              sizeLabel: courseMaterialService.formatFileSize(m.file_size),
              kind: m.file_type.split('/').pop()?.toUpperCase() ?? m.file_type,
            }));
          }
        }

        const levelRaw = c.level
          ? c.level.charAt(0).toUpperCase() + c.level.slice(1).toLowerCase()
          : 'Beginner';

        setCourse({
          id: c.course_id.toString(),
          title: c.title,
          shortDescription: c.description || 'No description provided.',
          fullDescription: c.description || 'No description provided.',
          category: c.category || 'Uncategorized',
          level: levelRaw as CourseLevel,
          duration: '—',
          moduleCount: videos.length,
          price: 99,
          currency: 'USD',
          outcomes: [],
          videos,
          files,
          locked: isLocked,
        });
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id, isLocked]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <EmptyState
        title="Course not found"
        description={error || 'This course does not exist or could not be loaded.'}
        action={
          <Link
            to="/courses"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-brand)] px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-brand-dark)]"
          >
            View all courses
          </Link>
        }
      />
    );
  }

  const levelKey = course.level as CourseLevel;

  return (
    <Stack gap="lg" className="pb-10">
      {/* Page Header */}
      <div>
        <Link
          to="/courses"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All courses
        </Link>

        <PageHeader
          title={course.title}
          description={course.shortDescription}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{course.category}</Badge>
              <Badge variant={levelBadge[levelKey]}>{course.level}</Badge>
            </div>
          }
        />
      </div>

      {/* About Section */}
      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle>About this course</CardTitle>
          <CardDescription>
            {course.moduleCount} {course.moduleCount === 1 ? 'lesson' : 'lessons'} · instructor-led materials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-relaxed text-slate-700">{course.fullDescription}</p>
          {course.outcomes.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">What you will learn</p>
              <ul className="space-y-2">
                {course.outcomes.map((line) => (
                  <li key={line} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources or Locked View Section */}
      {isLocked ? (
        <Card className="border-dashed border-slate-300 bg-slate-50/50">
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="size-16 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-400">
              <Lock className="size-8" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-lg font-semibold text-slate-900">Content Locked</h3>
              <p className="text-sm text-slate-500">
                The resources for this course are not assigned to your current role.
                Please enroll to gain full access to all materials.
              </p>
            </div>

            <div className="mt-4 flex flex-col items-center gap-4">
              <ButtonLink
                to={`/buy-course/${course.id}`}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="size-4" />}
              >
                Enroll in this course
              </ButtonLink>
              <p className="text-xs text-slate-400">
                Unlock all videos, files, and assignments instantly.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--color-brand)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-brand)]">
              <Film className="size-4" aria-hidden />
              {course.videos.length} {course.videos.length === 1 ? 'video' : 'videos'}
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
              <FileText className="size-4" aria-hidden />
              {course.files.length} {course.files.length === 1 ? 'file' : 'files'}
            </div>
          </div>

          <CourseResourceLists videos={course.videos} files={course.files} />

          {course.videos.length === 0 && course.files.length === 0 && (
            <Callout variant="info" title="No resources yet">
              The instructor has not added any lessons or files to this course yet.
            </Callout>
          )}
        </div>
      )}
    </Stack>
  );
};

export default UserCoursePreview;
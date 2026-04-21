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
  Mail,
  Phone,
  Send,
} from 'lucide-react';
import {
  CourseResourceLists,
} from '../../components/coursePreview';
import type { CourseDetail, CourseVideoItem, CourseFileItem } from '../../components/coursePreview/types';
import { Callout, EmptyState } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { Badge, ButtonLink } from '../../components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
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
              duration: v.duration ? videoService.formatDuration(v.duration) : 'Unknown'
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
          duration: c.duration || 'N/A',
          moduleCount: videos.length,
          price: (c.price && Number(c.price) > 0) ? `${c.price} ETB` : 'Free', // Use real price and format it
          currency: 'ETB',
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
              <Badge variant="outline" className="bg-slate-50 dark:bg-[#21262d] text-slate-700 dark:text-[#8b949e] border-slate-200 dark:border-[#30363d]">
                {course.duration}
              </Badge>
              <Badge variant={levelBadge[levelKey]}>{course.level}</Badge>
            </div>
          }
        />
      </div>

      {/* About Section */}
      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle>About this course</CardTitle>

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
            <div className="space-y-6 max-w-2xl px-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Content Locked</h3>
                <p className="text-sm text-slate-500">
                  Thanks for choosing Habesha Tech. Pay and enroll in this course to get full access to all materials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all hover:border-[var(--color-brand)]/20 hover:shadow-md">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Phone className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Address</p>
                    <p className="text-sm font-bold text-slate-700 font-mono">+251 955 370 783</p>
                    <p className="text-sm font-bold text-slate-700 font-mono">+251 708 830 783</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all hover:border-[var(--color-brand)]/20 hover:shadow-md">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Send className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Telegram</p>
                    <p className="text-sm font-bold text-slate-700">@Zuzenith</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all hover:border-[var(--color-brand)]/20 hover:shadow-md md:col-span-2">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Mail className="size-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Inquiry</p>
                    <p className="text-sm font-bold text-slate-700">habeshatech16@gmail.com</p>
                  </div>
                </div>
              </div>
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
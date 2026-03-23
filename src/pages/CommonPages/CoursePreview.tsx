import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import {
  CoursePurchaseAndReceipt,
  CourseResourceLists,
  getCourseDetailById,
} from '../../components/coursePreview';
import { Callout, EmptyState } from '../../components/feedback';
import { PageHeader, Stack } from '../../components/layout';
import { Badge } from '../../components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui';

const levelBadge: Record<'Beginner' | 'Intermediate' | 'Advanced', 'success' | 'warning' | 'danger'> = {
  Beginner: 'success',
  Intermediate: 'warning',
  Advanced: 'danger',
};

const CoursePreview = () => {
  const { id } = useParams<{ id: string }>();
  const course = getCourseDetailById(id);

  if (!course) {
    return (
      <EmptyState
        title="Course not found"
        description="This course is not in the demo catalog. Pick another course from the list."
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

  return (
    <Stack gap="lg" className="pb-10">
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
              <Badge variant={levelBadge[course.level]}>{course.level}</Badge>
              <span className="text-sm text-slate-500">{course.duration}</span>
            </div>
          }
        />
      </div>

      <Callout variant="info" title="Demo course page">
        Details, videos, and files are static placeholders. Hook up your API and payment flow when ready.
      </Callout>

      <Card className="border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <CardTitle>About this course</CardTitle>
          <CardDescription>{course.moduleCount} modules · instructor-led materials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm leading-relaxed text-slate-700">{course.fullDescription}</p>
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
        </CardContent>
      </Card>

      <CourseResourceLists videos={course.videos} files={course.files} />

      <CoursePurchaseAndReceipt course={course} />
    </Stack>
  );
};

export default CoursePreview;

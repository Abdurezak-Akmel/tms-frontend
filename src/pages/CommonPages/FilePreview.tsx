import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { FilePreviewContent, getFileById } from '../../components/files';
import { EmptyState } from '../../components/feedback';
import { Stack } from '../../components/layout';
import { ButtonLink } from '../../components/ui/ButtonLink';

const FilePreview = () => {
  const { id } = useParams<{ id: string }>();
  const file = getFileById(id);

  if (!file) {
    return (
      <EmptyState
        title="File not found"
        description="This material is not in the demo library. Browse the catalog and choose another file."
        action={
          <ButtonLink to="/files" variant="primary" size="md">
            All files
          </ButtonLink>
        }
      />
    );
  }

  return (
    <Stack gap="lg" className="pb-10">
      <div>
        <Link
          to="/files"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All files
        </Link>
      </div>

      <FilePreviewContent file={file} />

      <div className="flex flex-wrap gap-3">
        <ButtonLink to={`/courses/${file.courseId}`} variant="outline" size="md" leftIcon={<BookOpen className="size-4" />}>
          View course
        </ButtonLink>
        <ButtonLink to="/files" variant="ghost" size="md">
          Back to library
        </ButtonLink>
      </div>
    </Stack>
  );
};

export default FilePreview;

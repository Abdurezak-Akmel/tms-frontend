import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Trash2 } from 'lucide-react';
import { FilePreviewContent } from '../../components/files';
import { EmptyState } from '../../components/feedback';
import { Stack } from '../../components/layout';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { Button } from '../../components/ui/Button';
import { courseMaterialService } from '../../services/courseMaterialService';

const FilePreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      const res = await courseMaterialService.deleteMaterial(parseInt(id));
      if (res.success) {
        navigate('/admin/files');
      } else {
        setError(res.message || 'Failed to delete material');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete material');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchFileData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fileId = parseInt(id);
        const res = await courseMaterialService.getMaterialById(fileId);

        if (res.success && res.material) {
          const m = res.material;
          setFile({
            id: m.material_id.toString(),
            courseId: m.course_id.toString(),
            name: m.title,
            sizeLabel: courseMaterialService.formatFileSize(m.file_size),
            kind: m.file_type.split('/')[1]?.toUpperCase() || 'FILE',
            url: courseMaterialService.getFileUrl(m),
            uploadedAt: m.uploaded_at
          });
        } else {
          setError('File not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch file');
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [id]);

  if (loading) {
    return <div className="flex h-64 items-center justify-center">Loading file preview...</div>;
  }

  if (error || !file) {
    return (
      <EmptyState
        title={error || "File not found"}
        description="This material is not in the library. Browse the catalog and choose another file."
        action={
          <ButtonLink to="/admin/files" variant="primary" size="md">
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
          to="/admin/files"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All files
        </Link>
      </div>

      <FilePreviewContent file={file} />

      <div className="flex flex-wrap gap-3">
        <ButtonLink to={`/admin/courses/${file.courseId}`} variant="outline" size="md" leftIcon={<BookOpen className="size-4" />}>
          View course
        </ButtonLink>
        <Button
          variant="danger"
          size="md"
          leftIcon={<Trash2 className="size-4" />}
          onClick={handleDelete}
          isLoading={isDeleting}
        >
          Delete material
        </Button>
        <ButtonLink to="/admin/files" variant="ghost" size="md">
          Back to library
        </ButtonLink>
      </div>
    </Stack>
  );
};

export default FilePreview;

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Calendar, 
  HardDrive,
  Loader2,
  FileText
} from 'lucide-react';
import { EmptyState } from '../../components/feedback';
import { Stack } from '../../components/layout';
import { Badge } from '../../components/ui';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../components/ui';
import { courseMaterialService, type CourseMaterial } from '../../services/courseMaterialService';
import { courseService } from '../../services/courseService';

const FilePreview = () => {
  const { id } = useParams<{ id: string }>();
  
  const [material, setMaterial] = useState<CourseMaterial | null>(null);
  const [courseName, setCourseName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const materialId = parseInt(id, 10);
    if (isNaN(materialId)) {
      setError('Invalid material ID');
      setIsLoading(false);
      return;
    }

    const fetchMaterialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await courseMaterialService.getMaterialById(materialId);
        if (!res.success || !res.material) {
          setError(res.message || 'Material not found');
          return;
        }
        const m = res.material;
        setMaterial(m);

        // Fetch course info
        const courseRes = await courseService.getCourseById(m.course_id);
        if (courseRes.success && courseRes.course) {
          setCourseName(courseRes.course.title);
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while loading the material.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterialData();
  }, [id]);

  const handleDownload = () => {
    if (!material) return;
    const url = courseMaterialService.getFileUrl(material);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-10 animate-spin text-slate-300" />
      </div>
    );
  }

  if (error || !material) {
    return (
      <EmptyState
        title="Material not found"
        description={error || "This learning material does not exist or has been removed."}
        action={
          <Link
            to="/files"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[var(--color-brand)] px-4 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-brand-dark)]"
          >
            Explore all materials
          </Link>
        }
      />
    );
  }

  const dateFormatted = new Date(material.uploaded_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Stack gap="lg" className="mx-auto max-w-5xl pb-20 pt-6">
      {/* Navigation */}
      <div className="space-y-6">
        <Link
          to="/files"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to library
        </Link>

        {/* Header section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-slate-300 text-slate-700">
                {courseName || 'Loading course...'}
              </Badge>
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                 <Calendar className="size-4" />
                 Uploaded {dateFormatted}
              </span>
            </div>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {material.title}
            </h1>
          </div>
          
          <div className="flex shrink-0 gap-3">
            <Button
              onClick={handleDownload}
              variant="primary"
              size="lg"
              leftIcon={<Download className="size-5" />}
              className="lg:px-8"
            >
              Open File
            </Button>
            <Link
              to={`/courses/${material.course_id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <BookOpen className="size-4 text-[var(--color-brand)]" aria-hidden />
              Course
            </Link>
          </div>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
                <div className="space-y-8 p-6 lg:p-8">
                    <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                           <FileText className="size-10 text-[var(--color-brand)]" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                           <p className="text-xs font-bold uppercase tracking-widest text-slate-400">File Summary</p>
                           <h2 className="line-clamp-2 text-xl font-bold text-slate-900">{material.file_name}</h2>
                           <p className="text-sm font-medium text-slate-500">
                              {material.file_type.split('/').pop()?.toUpperCase()} Document · {courseMaterialService.formatFileSize(material.file_size)}
                           </p>
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-8 text-sm leading-relaxed text-slate-600">
                        <h3 className="font-bold text-slate-900">Description</h3>
                        <p className="whitespace-pre-wrap">
                           {material.description || "The instructor has provided this document as a supplementary resource for your study. It includes key highlights and reference material."}
                        </p>
                    </div>
                </div>
            </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-slate-100 bg-slate-50/50" padding="lg">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-slate-500">Resource Type</span>
                    <span className="font-semibold text-slate-900">{material.file_type.split('/')[0]}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-slate-500">Format</span>
                    <span className="font-semibold text-slate-900">.{material.file_name.split('.').pop()}</span>
                  </li>
                  <li className="flex items-center justify-between">
                     <span className="text-slate-500">Size</span>
                     <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                        <HardDrive className="size-3.5" />
                        {courseMaterialService.formatFileSize(material.file_size)}
                     </span>
                  </li>
                </ul>
              </CardContent>
           </Card>
        </div>
      </div>
    </Stack>
  );
};

export default FilePreview;

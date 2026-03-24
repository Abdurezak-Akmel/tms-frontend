import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, FileText, Upload } from 'lucide-react';
import { PageHeader, Stack } from '../../components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { courseMaterialService } from '../../services/courseMaterialService';
import { Callout } from '../../components/feedback';

const AddFile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('course_id');

  const [formData, setFormData] = useState({
    course_id: courseId ? parseInt(courseId) : 0,
    title: '',
    description: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'course_id' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Auto-fill title with filename (minus extension) if title is currently empty
      if (!formData.title) {
        const fileName = selectedFile.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        const titleFromFileName = lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex);

        // Clean up the title (replace underscores/dashes with spaces and capitalize)
        const cleanTitle = titleFromFileName
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        setFormData((prev) => ({
          ...prev,
          title: cleanTitle,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await courseMaterialService.createMaterial({
        ...formData,
        file: file,
      });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/courses/${formData.course_id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add material');
    } finally {
      setLoading(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);

      // Auto-fill title if empty (using same logic as handleFileChange)
      if (!formData.title) {
        const fileName = selectedFile.name;
        const lastDotIndex = fileName.lastIndexOf('.');
        const titleFromFileName = lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex);
        const cleanTitle = titleFromFileName.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setFormData(prev => ({ ...prev, title: cleanTitle }));
      }
    }
  };

  return (
    <Stack gap="lg" className="pb-10">
      <div>
        <Link
          to={courseId ? `/admin/courses/${courseId}` : "/admin/courses"}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Course
        </Link>
        <PageHeader
          title="Add Course Material"
          description="Upload slides, PDFs, or other resources for your students."
        />
      </div>

      {success && (
        <Callout variant="success" title="Success!">
          Material has been added successfully. Redirecting back to course...
        </Callout>
      )}

      {error && (
        <Callout variant="danger" title="Error">
          {error}
        </Callout>
      )}

      <Card className="max-w-3xl border-slate-200/90 shadow-sm" padding="lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-[var(--color-brand)]" aria-hidden />
            <CardTitle>Material Details</CardTitle>
          </div>
          <CardDescription>Upload a file and add its metadata.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label htmlFor="course_id" className="text-sm font-medium text-slate-700">
                  Course ID (Auto-filled)
                </label>
                <input
                  id="course_id"
                  name="course_id"
                  type="number"
                  value={formData.course_id}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. React Fundamentals Slides"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="file" className="text-sm font-medium text-slate-700">
                  File Upload
                </label>
                <div
                  className="relative group"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={handleFileChange}
                    required
                    className="absolute opacity-0 w-0 h-0 pointer-events-none"
                  />
                  <label
                    htmlFor="file"
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-all ${isDragging
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 scale-[1.01]"
                      : "border-slate-200 bg-slate-50 group-hover:border-[var(--color-brand)] group-hover:bg-[var(--color-brand)]/5"
                      }`}
                  >
                    <Upload
                      className={`size-6 transition-colors ${isDragging || file ? "text-[var(--color-brand)]" : "text-slate-400 group-hover:text-[var(--color-brand)]"
                        }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors ${isDragging || file ? "text-[var(--color-brand)]" : "text-slate-600 group-hover:text-[var(--color-brand)]"
                        }`}
                    >
                      {file ? file.name : isDragging ? "Drop your file here" : "Click or drag to select a file"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this material about? (Optional)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                leftIcon={<Save className="size-4" />}
              >
                Upload & Save
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AddFile;
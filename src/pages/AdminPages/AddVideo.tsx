import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Film, Youtube } from 'lucide-react';
import { PageHeader, Stack } from '../../components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { videoService } from '../../services/videoService';
import { Callout } from '../../components/feedback';

const AddVideo: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get('course_id');

  const [formData, setFormData] = useState({
    course_id: courseId ? parseInt(courseId) : 0,
    title: '',
    description: '',
    youtube_url: '',
    order_index: 0,
    duration: '', // String for text input
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'course_id' || name === 'order_index' ? parseInt(value) || 0 : value,
    }));
  };

  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  // Auto-fill metadata when youtube_url changes
  useEffect(() => {
    const fetchMetadata = async () => {
      const videoId = videoService.extractYouTubeId(formData.youtube_url);
      if (videoId) {
        try {
          setIsFetchingMetadata(true);
          // We can optionally pass an API KEY from env if available
          const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
          const metadata = await videoService.fetchYouTubeMetadata(formData.youtube_url, apiKey);

          setFormData(prev => ({
            ...prev,
            title: prev.title || metadata.title || '',
            // Format duration from seconds to MM:SS or HH:MM:SS string
            duration: metadata.duration !== null ? videoService.formatDuration(metadata.duration) : prev.duration
          }));
        } catch (err) {
          console.error('Auto-fill metadata failed:', err);
        } finally {
          setIsFetchingMetadata(false);
        }
      }
    };

    const timer = setTimeout(() => {
      if (formData.youtube_url) {
        fetchMetadata();
      }
    }, 800); // Debounce to avoid excessive API calls

    return () => clearTimeout(timer);
  }, [formData.youtube_url]);

  // Helper to parse duration string (e.g., "10:30" or "1:05:00") to seconds
  const parseDuration = (durationStr: string): number => {
    if (!durationStr) return 0;
    // If it's just numbers, return it as seconds
    if (/^\d+$/.test(durationStr.toString())) return parseInt(durationStr.toString());

    const parts = durationStr.toString().split(':').map(Number);
    if (parts.some(isNaN)) return 0;

    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Parse the duration string back to seconds before sending to API
      const finalData = {
        ...formData,
        duration: parseDuration(formData.duration)
      };

      const response = await videoService.createVideo(finalData);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/courses/${formData.course_id}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add video');
    } finally {
      setLoading(false);
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
          title="Add New Video"
          description="Add a lesson video from YouTube to your course."
        />
      </div>

      {success && (
        <Callout variant="success" title="Success!">
          Video has been added successfully. Redirecting back to course...
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
            <Film className="size-5 text-[var(--color-brand)]" aria-hidden />
            <CardTitle>Video Details</CardTitle>
          </div>
          <CardDescription>Enter the YouTube URL and lesson metadata.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                <label htmlFor="order_index" className="text-sm font-medium text-slate-700">
                  Order Index
                </label>
                <input
                  id="order_index"
                  name="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="title" className="text-sm font-medium text-slate-700">
                    Video Title
                  </label>
                  {isFetchingMetadata && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand)] animate-pulse">
                      Fetching from YouTube...
                    </span>
                  )}
                </div>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Introduction to React"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="youtube_url" className="text-sm font-medium text-slate-700">
                  YouTube URL
                </label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="youtube_url"
                    name="youtube_url"
                    type="url"
                    value={formData.youtube_url}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium text-slate-700">
                  Duration
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]/20"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this lesson about?"
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
                Save Video
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AddVideo;
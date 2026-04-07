import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader, Stack } from '../../components/layout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { Card, CardContent } from '../../components/ui/Card';
import { Callout } from '../../components/feedback';
import { courseService } from '../../services/courseService';

const CATEGORIES = [
  'Web Development',
  'Data Science',
  'Artificial Intelligence',
  'Mobile Development',
  'Machine Learning',
  'Cyber Security',
  'Cloud Computing',
  'DevOps',
  'Game Development',
  'Software Architecture'
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const AddCourse = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit_id');
  const isEditing = !!editId;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    level: LEVELS[0].toLowerCase(),
    price: '',
    duration: '',
  });

  useEffect(() => {
    if (isEditing && editId) {
      const fetchCourse = async () => {
        try {
          setIsLoading(true);
          const response = await courseService.getCourseById(parseInt(editId));
          if (response.success && response.course) {
            const c = response.course;
            setFormData({
              title: c.title,
              description: c.description || '',
              category: c.category || CATEGORIES[0],
              level: c.level.toLowerCase(),
              price: c.price || '',
              duration: c.duration || '',
            });
          } else {
            setError(response.message || 'Failed to fetch course data');
          }
        } catch (err: any) {
          setError(err.message || 'An unexpected error occurred');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourse();
    }
  }, [editId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isEditing && editId) {
        response = await courseService.updateCourse(parseInt(editId), formData);
      } else {
        response = await courseService.createCourse(formData);
      }

      if (response.success) {
        navigate(isEditing ? `/admin/courses/${editId}` : '/admin/courses');
      } else {
        setError(response.message || `Failed to ${isEditing ? 'update' : 'create'} course`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap="lg" className="pb-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="size-4" />}
        >
          Back
        </Button>
      </div>

      <PageHeader
        title={isEditing ? 'Update Course' : 'Create New Course'}
        description={isEditing 
          ? 'Modify the details of your existing course. All changes will be saved immediately.' 
          : 'Add a new course to the catalog. Fill in the details below to get started.'}
      />

      {error && (
        <Callout variant="danger" title="Error">
          {error}
        </Callout>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Mastering React Hooks"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a brief overview of the course content..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Skill Level</Label>
                <select
                  id="level"
                  name="level"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl.toLowerCase()}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Course Price</Label>
                <Input
                  id="price"
                  name="price"
                  placeholder="e.g. 49.99 or Free"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Course Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="e.g. 10 hours or 4 weeks"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                leftIcon={<Save className="size-4" />}
                className="w-full sm:w-auto"
              >
                {isEditing ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AddCourse;
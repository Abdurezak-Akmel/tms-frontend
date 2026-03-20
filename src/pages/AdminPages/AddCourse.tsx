import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Select } from '../../components/Select';
import { ArrowLeft, BookPlus, AlertCircle, Save } from 'lucide-react';
import type { Course } from '../../components/CourseCard';

const CATEGORY_OPTIONS = [
  { label: 'Programming & Tech', value: 'programming' },
  { label: 'Design & UI/UX', value: 'design' },
  { label: 'Business & Management', value: 'business' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Data Science', value: 'data-science' },
];

const LEVEL_OPTIONS = [
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'All Levels', value: 'All Levels' },
];

const AddCourse = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    instructor: '',
    totalHours: '',
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Mock API call to save course
      await new Promise(resolve => setTimeout(resolve, 800));

      const newCourse: Course = {
        id: 'c' + Date.now(),
        title: formData.title,
        description: formData.description,
        instructor: formData.instructor,
        price: Number(formData.price),
        rating: 0,
        reviewsCount: 0,
        // Using a generic placeholder for newly added courses
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        totalHours: Number(formData.totalHours),
        level: formData.level || 'Beginner',
      };

      const existingCourses = JSON.parse(localStorage.getItem('tms_added_courses') || '[]');
      localStorage.setItem('tms_added_courses', JSON.stringify([...existingCourses, newCourse]));

      console.log('Course created successfully:', newCourse);
      navigate('/courses'); // Redirect to courses list
    } catch (err) {
      setError('Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Options */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/courses"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>

        {/* Page Title & Intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-3">
            <BookPlus className="w-4 h-4" />
            <span>Course Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Course
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Fill in the details below to publish a new course to the platform.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Title Input */}
              <div>
                <Input
                  label="Course Title"
                  name="title"
                  placeholder="e.g., Advanced Machine Learning with Python"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Catchy titles help attract more students.
                </p>
              </div>

              {/* Description Input */}
              <div>
                <Textarea
                  label="Course Description"
                  name="description"
                  placeholder="Provide a detailed overview of what students will learn..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Side-by-Side Category and Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Category"
                  name="category"
                  placeholder="Select a category"
                  options={CATEGORY_OPTIONS}
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Difficulty Level"
                  name="level"
                  placeholder="Select a level"
                  options={LEVEL_OPTIONS}
                  value={formData.level}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Lecturer (Instructor)"
                  name="instructor"
                  placeholder="e.g., Dr. Angela Yu"
                  value={formData.instructor}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Course Length (Hours)"
                  name="totalHours"
                  type="number"
                  placeholder="e.g., 65"
                  value={formData.totalHours}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="w-1/2 pr-3 max-md:pr-0 max-md:w-full">
                <Input
                  label="Price ($)"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 89.99"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/courses')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Create Course
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
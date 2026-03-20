import { useState, useEffect } from 'react';
import { CourseCard, type Course } from '../../components/CourseCard';
import { Button } from '../../components/Button';
import { Plus, Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Complete Web Development Bootcamp 2026',
    description: 'Learn full-stack web development from scratch using React, Node.js, and MongoDB. Master the modern web development ecosystem with hands-on projects and real-world examples.',
    instructor: 'Dr. Angela Yu',
    price: 89.99,
    rating: 4.8,
    reviewsCount: 12450,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    totalHours: 65,
    level: 'Beginner'
  },
  {
    id: 'c2',
    title: 'Advanced Machine Learning with Python',
    description: 'Dive deep into algorithms, neural networks, and AI using TensorFlow and PyTorch. This comprehensive course prepares you for a career in Data Science.',
    instructor: 'Andrew Ng',
    price: 129.50,
    rating: 4.9,
    reviewsCount: 8920,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    totalHours: 42,
    level: 'Advanced'
  },
  {
    id: 'c3',
    title: 'UI/UX Design Masterclass: From Figma to Web',
    description: 'Become a pro designer. Learn user research, wireframing, prototyping, and creating stunning interfaces in Figma that convert users.',
    instructor: 'Gary Simon',
    price: 59.99,
    rating: 4.7,
    reviewsCount: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    totalHours: 24,
    level: 'Intermediate'
  },
  {
    id: 'c4',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform iOS and Android applications with a single codebase using React Native and modern JavaScript features.',
    instructor: 'Stephen Grider',
    price: 94.99,
    rating: 4.8,
    reviewsCount: 6540,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    totalHours: 36,
    level: 'Intermediate'
  },
  {
    id: 'c5',
    title: 'Cybersecurity Ethical Hacking Fundamentals',
    description: 'Learn the core concepts of ethical hacking, penetration testing, and securing digital infrastructure against modern threats.',
    instructor: 'Heath Adams',
    price: 109.00,
    rating: 4.9,
    reviewsCount: 4100,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    totalHours: 52,
    level: 'Beginner'
  },
  {
    id: 'c6',
    title: 'Cloud Architecture & AWS Certification Prep',
    description: 'Master Amazon Web Services and prepare for the Solutions Architect exam with real-world scenarios and hands-on labs.',
    instructor: 'Stephane Maarek',
    price: 79.99,
    rating: 4.8,
    reviewsCount: 15300,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    totalHours: 48,
    level: 'Advanced'
  }
];

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

  useEffect(() => {
    // For mock frontend behavior: fetch newly added courses from local storage
    const addedCoursesStr = localStorage.getItem('tms_added_courses');
    if (addedCoursesStr) {
      try {
        const addedCourses = JSON.parse(addedCoursesStr);
        setCourses([...MOCK_COURSES, ...addedCourses]);
      } catch (err) {
        console.error('Failed to parse courses from local storage', err);
      }
    }
  }, []);

  const handleCourseClick = (id: string) => {
    // Navigate to course detail page - using placeholder route
    console.log(`Navigating to course ${id}`);
    navigate(`/courses/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Learning Catalog</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Explore Available Courses
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Discover industry-leading courses to elevate your skills. Choose from programming, design, and more.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              className="hidden sm:flex bg-white"
            >
              Filter
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => navigate('/admin/add-course')} // Targeting the opened add-course page
              className="shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Add Course
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm hover:shadow-md text-base"
            placeholder="Search for courses, instructors, or topics..."
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-10">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => handleCourseClick(course.id)}
            />
          ))}
        </div>

        {/* Load More (Optional, just for aesthetics) */}
        <div className="pt-8 flex justify-center">
          <Button variant="secondary" className="px-8 py-3 bg-white hover:bg-slate-50 border-slate-200 text-slate-600 font-semibold shadow-sm rounded-xl">
            Load More Courses
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Courses;
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, FileText, Upload, Plus, Edit2, Trash2, ShoppingCart, ShieldCheck, Video, File, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import type { Course } from '../../components/CourseCard';

interface ContentItem {
  id: string;
  title: string;
  meta: string;
}

const INITIAL_VIDEOS: ContentItem[] = [
  { id: 'v1', title: '1. Introduction to the Course', meta: '12:30' },
  { id: 'v2', title: '2. Setting Up Your Environment', meta: '25:15' },
  { id: 'v3', title: '3. Core Concepts and Architecture', meta: '45:00' },
];

const INITIAL_FILES: ContentItem[] = [
  { id: 'f1', title: 'Course Syllabus.pdf', meta: '2.4 MB' },
  { id: 'f2', title: 'Setup Guide.docx', meta: '1.1 MB' },
  { id: 'f3', title: 'Source Code Chapter 1.zip', meta: '15.5 MB' },
];

// Fallback course data
const defaultCourse: Course = {
  id: 'default',
  title: 'Course Preview Details',
  description: 'This is an awesome course that covers everything you need to know about the topic. It is structured to take you from a beginner to an advanced level through practical and hands-on examples.',
  instructor: 'Expert Instructor',
  price: 99.99,
  rating: 4.9,
  reviewsCount: 1500,
  thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  totalHours: 40,
  level: 'All Levels',
};

const CoursePreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course>(defaultCourse);
  const [videos, setVideos] = useState<ContentItem[]>(INITIAL_VIDEOS);
  const [files, setFiles] = useState<ContentItem[]>(INITIAL_FILES);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    // Attempt to load course details from LocalStorage or mock data if we had a global state
    const addedCoursesStr = localStorage.getItem('tms_added_courses');
    if (addedCoursesStr) {
      try {
        const addedCourses: Course[] = JSON.parse(addedCoursesStr);
        const found = addedCourses.find(c => c.id === id);
        if (found) setCourse(found);
      } catch (err) {
        console.error(err);
      }
    }
    // (If it was in the base MOCK_COURSES, we would search there too, but we use default fallback for now)
  }, [id]);

  // --- CRUD Handlers ---
  const handleAddVideo = () => {
    const title = window.prompt('Enter new video title:');
    if (title) {
      setVideos([...videos, { id: 'v' + Date.now(), title, meta: '00:00' }]);
    }
  };

  const handleUpdateVideo = (vId: string) => {
    const title = window.prompt('Enter updated video title:');
    if (title) {
      setVideos(videos.map(v => v.id === vId ? { ...v, title } : v));
    }
  };

  const handleDeleteVideo = (vId: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== vId));
    }
  };

  const handleAddFile = () => {
    const title = window.prompt('Enter new file name:');
    if (title) {
      setFiles([...files, { id: 'f' + Date.now(), title, meta: '0.0 MB' }]);
    }
  };

  const handleUpdateFile = (fId: string) => {
    const title = window.prompt('Enter updated file name:');
    if (title) {
      setFiles(files.map(f => f.id === fId ? { ...f, title } : f));
    }
  };

  const handleDeleteFile = (fId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(f => f.id !== fId));
    }
  };

  // --- Payment Handlers ---
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleBuyClick = async () => {
    if (!receiptFile) {
      alert('Please upload a payment receipt first to proceed with the purchase.');
      return;
    }
    setIsBuying(true);
    // Mock API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsBuying(false);
    alert('Purchase request submitted successfully! An admin will verify your receipt shortly.');
    navigate('/courses');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Back Navigation */}
        <div className="mb-6 flex">
          <Link
            to="/courses"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Course Info & Content List */}
          <div className="lg:col-span-2 space-y-8">

            {/* Header / Hero */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 block pointer-events-none"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                  {course.level}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                  {course.title || 'Course Details'}
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed mb-6">
                  {course.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                      {course.instructor.charAt(0)}
                    </span>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>{course.totalHours} Hours Content</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content: Videos */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-slate-800">Video Lectures</h2>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddVideo} className="bg-white">
                  Add Video
                </Button>
              </div>
              <div className="divide-y divide-slate-100">
                {videos.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No videos available.</div>
                ) : (
                  videos.map((vid) => (
                    <div key={vid.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5 bg-indigo-100 p-2 rounded-full text-indigo-600">
                          <Play className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{vid.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{vid.meta}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="bg-white hover:bg-slate-100" onClick={() => handleUpdateVideo(vid.id)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="secondary" size="sm" className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" onClick={() => handleDeleteVideo(vid.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Course Content: Files */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-800">Course Materials</h2>
                </div>
                <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={handleAddFile} className="bg-white">
                  Add File
                </Button>
              </div>
              <div className="divide-y divide-slate-100">
                {files.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">No files uploaded.</div>
                ) : (
                  files.map((file) => (
                    <div key={file.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5 bg-emerald-100 p-2 rounded-xl text-emerald-600">
                          <File className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">{file.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">{file.meta}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="bg-white hover:bg-slate-100" onClick={() => handleUpdateFile(file.id)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="secondary" size="sm" className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" onClick={() => handleDeleteFile(file.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Pricing & Payment */}
          <div className="lg:col-span-1 space-y-6">

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-8">
              <div className="aspect-video bg-slate-100 rounded-2xl mb-6 overflow-hidden relative">
                <img src={course.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg">
                    <Play className="w-8 h-8 text-indigo-600 ml-1" />
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">${course.price}</span>
                <span className="text-slate-500 font-medium line-through">${(course.price * 1.5).toFixed(2)}</span>
              </div>

              {/* Payment Receipt Upload */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Payment Verification
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Please upload your payment receipt (screenshot or PDF) to get instant access to the course content.
                </p>

                <div className="relative">
                  <input
                    type="file"
                    id="receipt"
                    accept="image/*,.pdf"
                    onChange={handleReceiptChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-3 px-4 transition-colors ${receiptFile ? 'border-emerald-300 bg-emerald-50' : 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50'}`}>
                    {receiptFile ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700 truncate">{receiptFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-medium text-indigo-600">Upload Receipt</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isBuying}
                leftIcon={!isBuying ? <ShoppingCart className="w-5 h-5" /> : undefined}
                onClick={handleBuyClick}
                className="text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow"
              >
                {isBuying ? 'Processing...' : 'Buy Course Now'}
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">Secure transaction. Full lifetime access.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CoursePreview;
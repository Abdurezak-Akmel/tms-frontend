import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Save, 
//   X,
  LayoutGrid,
  Type,
  FileText
} from 'lucide-react';
import { 
  Button, 
  Card, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription, 
  CardContent, 
  Input,
  Separator,
  Badge
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { roleService } from '../../services/roleService';
import { courseService, type Course } from '../../services/courseService';
import { roleCourseService } from '../../services/roleCourseService';
import { cn } from '../../utils/cn';

const CreateRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Form State
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await courseService.getAllCourses();
        if (response.success && response.courses) {
          setCourses(response.courses);
        }
      } catch (err: any) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleToggleCourse = (courseId: number) => {
    setSelectedCourseIds(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roleName) {
      setError('Role name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Create the role
      const roleResponse = await roleService.createRole({
        role_name: roleName,
        description: description
      });

      if (roleResponse.success && roleResponse.role) {
        const newRoleId = roleResponse.role.role_id;

        // 2. Assign courses if any are selected
        if (selectedCourseIds.length > 0) {
          await roleCourseService.assignMultipleCoursesToRole({
            role_id: newRoleId,
            course_ids: selectedCourseIds
          });
        }

        // Navigate back to roles page
        navigate('/admin/roles');
      } else {
        setError(roleResponse.error || 'Failed to create role');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg" className="pb-20 max-w-5xl mx-auto">
      <PageHeader
        title="Create New Role"
        description="Define a new administrative role and assign specific course access permissions."
        backPath="/admin/roles"
      />

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Section 1: Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Role Details</h3>
                <p className="text-xs text-slate-500 font-medium">Define the core identity of this role</p>
              </div>
            </div>

            <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Type size={14} className="text-slate-400" />
                    Role Name
                  </label>
                  <Input
                    placeholder="e.g. Content Manager"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                    required
                  />
                  <p className="text-[11px] text-slate-400 font-medium">Use descriptive names for clarity</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the responsibilities of this role..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50/50 border border-blue-100/50 p-4 rounded-2xl">
              <div className="flex gap-3 text-blue-700">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed font-medium">
                  Roles are foundational to platform security. Once created, they can be assigned to users to control their access to specific educational content.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Course Access */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">Course Permissions</h3>
                  <p className="text-xs text-slate-500 font-medium">Select courses accessible by this role</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white px-2.5 py-1 text-slate-500 border-slate-200">
                {selectedCourseIds.length} Selected
              </Badge>
            </div>

            <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                {coursesLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3">
                    <div className="size-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm text-slate-500 font-medium">Loading courses...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="p-12 text-center">
                    <LayoutGrid size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-500 font-medium">No courses available to assign</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {courses.map((course) => (
                      <div 
                        key={course.course_id}
                        onClick={() => handleToggleCourse(course.course_id)}
                        className={cn(
                          "flex items-center justify-between p-4 cursor-pointer transition-colors group",
                          selectedCourseIds.includes(course.course_id) 
                            ? "bg-emerald-50/30" 
                            : "hover:bg-slate-50/80"
                        )}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            "size-5 rounded flex items-center justify-center border transition-all",
                            selectedCourseIds.includes(course.course_id)
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-slate-200 group-hover:border-slate-300"
                          )}>
                            {selectedCourseIds.includes(course.course_id) && <CheckCircle2 size={12} strokeWidth={3} />}
                          </div>
                          <div className="min-w-0">
                            <h4 className={cn(
                              "text-sm font-bold truncate transition-colors",
                              selectedCourseIds.includes(course.course_id) ? "text-slate-900" : "text-slate-700"
                            )}>
                              {course.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-slate-100 bg-slate-50 text-slate-500 uppercase tracking-tighter">
                                ID: {course.course_id}
                              </Badge>
                              {course.category && (
                                <span className="text-[11px] text-slate-400 font-medium truncate">• {course.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={14} className={cn(
                          "transition-colors",
                          selectedCourseIds.includes(course.course_id) ? "text-emerald-500" : "text-slate-300"
                        )} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="bg-slate-100 mt-10" />

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => navigate('/admin/roles')}
            disabled={loading}
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !roleName}
            className="min-w-[140px] shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
            leftIcon={loading ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          >
            {loading ? 'Creating...' : 'Save Role'}
          </Button>
        </div>
      </form>
    </Stack>
  );
};

export default CreateRole;
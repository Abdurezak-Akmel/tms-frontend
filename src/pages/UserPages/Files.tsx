import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FileText,
  Loader2,
  ExternalLink,
  File,
  FileImage,
  FileArchive,
  Search,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { roleCourseService } from '../../services/roleCourseService';
import { courseMaterialService, type CourseMaterial } from '../../services/courseMaterialService';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader, Stack } from '../../components/layout';
import { Callout, EmptyState } from '../../components/feedback';
import { Input } from '../../components/ui';

interface MaterialWithCourse extends CourseMaterial {
  courseName: string;
}

const Files = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<MaterialWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMaterialsForUnlockedCourses = useCallback(async () => {
    if (!user?.role_id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get all courses assigned to this role
      const roleCoursesRes = await roleCourseService.getCoursesByRoleId(user.role_id);

      if (!roleCoursesRes.success || !roleCoursesRes.courses) {
        setMaterials([]);
        return;
      }

      const assignedCourses = roleCoursesRes.courses;

      // 2. Fetch materials for all these courses in parallel
      const materialPromises = assignedCourses.map(async (course: any) => {
        try {
          const res = await courseMaterialService.getMaterialsByCourseId(course.course_id);
          if (res.success && res.materials) {
            return res.materials.map(m => ({
              ...m,
              courseName: course.title
            }));
          }
          return [];
        } catch (err) {
          console.error(`Failed to fetch materials for course ${course.course_id}:`, err);
          return [];
        }
      });

      const results = await Promise.all(materialPromises);
      const allMaterials = results.flat();

      // Sort by upload date (newest first)
      allMaterials.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());

      setMaterials(allMaterials);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while loading materials.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.role_id]);

  useEffect(() => {
    fetchMaterialsForUnlockedCourses();
  }, [fetchMaterialsForUnlockedCourses]);

  const filteredMaterials = useMemo(() => {
    if (!searchQuery.trim()) return materials;
    const q = searchQuery.toLowerCase();
    return materials.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.file_name.toLowerCase().includes(q) ||
      m.courseName.toLowerCase().includes(q)
    );
  }, [materials, searchQuery]);

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return <FileText className="size-8 text-rose-500" />;
    if (type.includes('image')) return <FileImage className="size-8 text-indigo-500" />;
    if (type.includes('zip') || type.includes('compressed')) return <FileArchive className="size-8 text-amber-500" />;
    if (type.includes('word') || type.includes('officedocument')) return <File className="size-8 text-blue-500" />;
    return <File className="size-8 text-slate-400" />;
  };

  const openFile = (material: CourseMaterial) => {
    const url = courseMaterialService.getFileUrl(material);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const groupedMaterials = useMemo(() => {
    const groups: Record<string, MaterialWithCourse[]> = {};
    filteredMaterials.forEach(m => {
      if (!groups[m.courseName]) {
        groups[m.courseName] = [];
      }
      groups[m.courseName].push(m);
    });
    return groups;
  }, [filteredMaterials]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <Stack gap="lg" className="pb-10 pt-4">
      <PageHeader
        title="Learning Resources"
        description="A library of all downloadable materials, exercise files, and reference guides from your courses."
        actions={
          <div className="relative w-full max-w-sm sm:w-72">
            <Search className="absolute left-3 top-1/2 mt-0.5 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search files..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        }
      />

      {error && (
        <Callout variant="danger" title="Error">
          {error}
        </Callout>
      )}

      {filteredMaterials.length === 0 ? (
        <EmptyState
          title={searchQuery ? "No matching files" : "No resources found"}
          description={searchQuery ? `No files found for "${searchQuery}".` : "You don't have access to any downloadable materials yet."}
          action={searchQuery ? (
            <button onClick={() => setSearchQuery('')} className="text-[var(--color-brand)] font-semibold hover:underline">
              Clear search
            </button>
          ) : (
            <button onClick={() => fetchMaterialsForUnlockedCourses()} className="text-[var(--color-brand)] font-semibold hover:underline">
              Reload library
            </button>
          )}
        />
      ) : (
        /* Categorized Layout */
        <div className="flex flex-col gap-10">
          {Object.entries(groupedMaterials).map(([courseName, courseMaterials]) => (
            <section key={courseName} className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <BookOpen className="size-5 text-[var(--color-brand)] dark:text-brand-400" />
                {courseName}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courseMaterials.map((material) => (
                  <div
                    key={material.material_id}
                    onClick={() => openFile(material)}
                    className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-200 hover:border-[var(--color-brand)] dark:hover:border-brand-400 hover:shadow-md hover:shadow-[var(--color-brand)]/5"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-700 transition-colors group-hover:bg-[var(--color-brand)]/5 group-hover:ring-[var(--color-brand)]/20">
                        {getFileIcon(material.file_type)}
                      </div>
                      <div className="rounded-full bg-slate-50 dark:bg-slate-800 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:text-[var(--color-brand)] dark:hover:text-brand-400">
                        <ExternalLink className="size-4" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="min-w-0 space-y-1">
                        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[var(--color-brand)] dark:group-hover:text-brand-400">
                          {material.title}
                        </h3>
                        <p className="truncate text-xs text-slate-400 dark:text-slate-500">{material.file_name}</p>
                      </div>

                      <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <BookOpen className="size-3.5 shrink-0 text-[var(--color-brand)] dark:text-brand-400" />
                          <span className="truncate font-medium">{material.courseName}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(material.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="size-3" />
                            {courseMaterialService.formatFileSize(material.file_size)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Stack>
  );
};

export default Files;
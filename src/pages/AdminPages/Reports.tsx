import { useState, useEffect } from 'react';
import { Download, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { courseService } from '../../services/courseService';
import { accessRequestService } from '../../services/accessRequestService';
import { videoService } from '../../services/videoService';
import { courseMaterialService } from '../../services/courseMaterialService';

const Reports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coursesReport, setCoursesReport] = useState<any[]>([]);
  const [requestsReport, setRequestsReport] = useState<any[]>([]);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const [coursesRes, requestsRes] = await Promise.all([
          courseService.getAllCourses(),
          accessRequestService.getAllAccessRequests()
        ]);

        if (coursesRes.success && coursesRes.courses) {
           // We will fetch counts for each course to make a meaningful report
           const enrichedCourses = await Promise.all(coursesRes.courses.map(async (c: any) => {
              const [vidRes, matRes] = await Promise.all([
                 videoService.getVideosByCourseId(c.course_id).catch(() => ({ success: false, videos: [] })),
                 courseMaterialService.getMaterialsByCourseId(c.course_id).catch(() => ({ success: false, materials: [] }))
              ]);
              return {
                 ...c,
                 videoCount: vidRes.success && vidRes.videos ? vidRes.videos.length : 0,
                 materialCount: matRes.success && matRes.materials ? matRes.materials.length : 0
              };
           }));
           setCoursesReport(enrichedCourses);
        }

        if (requestsRes.success && requestsRes.data) {
           // Sort by most recent first
           const rqs = Array.isArray(requestsRes.data) ? requestsRes.data : [];
           const sorted = rqs.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
           // Only show top 10 recent
           setRequestsReport(sorted.slice(0, 10));
        }

      } catch (error) {
        console.error('Failed to fetch report data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleExport = () => {
      alert("Export functionality simulated. In a real environment, this would download a CSV or PDF.");
  }

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Reports"
        description="Generate and view detailed breakdowns of platform content and recent activity."
        actions={
          <Button variant="outline" leftIcon={<Download className="size-4" />} onClick={handleExport}>
            Export All Data
          </Button>
        }
      />

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="size-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Generating reports...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="size-5 text-[var(--color-brand)]" />
                  Course Content Summary
                </CardTitle>
                <CardDescription>Overview of courses and their attached resource counts.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleExport}>Download CSV</Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Course Title</th>
                                <th className="px-6 py-4 font-semibold text-center">Category</th>
                                <th className="px-6 py-4 font-semibold text-center">Price</th>
                                <th className="px-6 py-4 font-semibold text-center">Videos</th>
                                <th className="px-6 py-4 font-semibold text-center">Files</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coursesReport.map(course => (
                                <tr key={course.course_id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{course.title}</td>
                                    <td className="px-6 py-4 text-slate-600 text-center">{course.category || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600 text-center">{course.price ? `${course.price} ETB` : 'Free'}</td>
                                    <td className="px-6 py-4 text-slate-900 font-medium text-center">{course.videoCount}</td>
                                    <td className="px-6 py-4 text-slate-900 font-medium text-center">{course.materialCount}</td>
                                </tr>
                            ))}
                            {coursesReport.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No courses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="size-5 text-[var(--color-brand)]" />
                  Recent Enrollment Activity
                </CardTitle>
                <CardDescription>The 10 most recent access requests submitted by users.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={handleExport}>Download CSV</Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ID</th>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Course ID</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requestsReport.map(req => (
                                <tr key={req.access_request_id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">#{req.access_request_id}</td>
                                    <td className="px-6 py-4 text-slate-600">{req.user_name || req.user_id}</td>
                                    <td className="px-6 py-4 text-slate-600">Course #{req.course_id}</td>
                                    <td className="px-6 py-4 text-center">
                                         <Badge variant={
                                            req.status === 'approved' ? 'success' :
                                            req.status === 'rejected' ? 'danger' :
                                            'warning'
                                        }>
                                            {req.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-right">
                                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Unknown'}
                                    </td>
                                </tr>
                            ))}
                            {requestsReport.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Stack>
  );
};

export default Reports;
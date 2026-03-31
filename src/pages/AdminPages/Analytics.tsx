import { useState, useEffect } from 'react';
import { BarChart3, Users, BookOpen, ShieldCheck, Video, FileText, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import { courseService } from '../../services/courseService';
import { videoService } from '../../services/videoService';
import { courseMaterialService } from '../../services/courseMaterialService';
import { accessRequestService } from '../../services/accessRequestService';
import { receiptService } from '../../services/receiptService';

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalCourses: 0,
    totalVideos: 0,
    totalFiles: 0,
    totalFileSize: '0 Bytes',
    totalReceipts: 0,
    totalReceiptsSize: '0 Bytes',
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [usersRes, rolesRes, coursesRes, videosRes, materialsRes, requestsRes, receiptsRes] = await Promise.all([
          userService.getAllUsers(),
          roleService.getAllRoles(),
          courseService.getAllCourses(),
          videoService.getAllVideos(),
          courseMaterialService.getAllMaterials(),
          accessRequestService.getAllAccessRequests(),
          receiptService.getAllReceipts()
        ]);

        let totalSize = 0;
        if (materialsRes.success && materialsRes.materials) {
          totalSize = materialsRes.materials.reduce((sum, m) => sum + (m.file_size || 0), 0);
        }

        let receiptsSize = 0;
        if (receiptsRes.success && receiptsRes.receipts) {
          receiptsSize = receiptsRes.receipts.reduce((sum, r) => sum + (r.file_size || 0), 0);
        }

        let pending = 0, approved = 0, rejected = 0;
        if (requestsRes.success && requestsRes.data) {
          const rqs = Array.isArray(requestsRes.data) ? requestsRes.data : [];
          rqs.forEach((r: any) => {
            if (r.status === 'pending') pending++;
            else if (r.status === 'approved') approved++;
            else if (r.status === 'rejected') rejected++;
          });
        }

        setStatsData({
          totalUsers: usersRes.success && usersRes.users ? usersRes.users.length : 0,
          totalRoles: rolesRes.success && rolesRes.roles ? rolesRes.roles.length : 0,
          totalCourses: coursesRes.success && coursesRes.courses ? coursesRes.courses.length : 0,
          totalVideos: videosRes.success && videosRes.videos ? videosRes.videos.length : 0,
          totalFiles: materialsRes.success && materialsRes.materials ? materialsRes.materials.length : 0,
          totalFileSize: courseMaterialService.formatFileSize(totalSize),
          totalReceipts: receiptsRes.success && receiptsRes.receipts ? receiptsRes.receipts.length : 0,
          totalReceiptsSize: receiptService.formatFileSize(receiptsSize),
          pendingRequests: pending,
          approvedRequests: approved,
          rejectedRequests: rejected
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Users', value: statsData.totalUsers.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Roles', value: statsData.totalRoles.toString(), icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Courses', value: statsData.totalCourses.toString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Videos', value: statsData.totalVideos.toString(), icon: Video, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Course Files', value: statsData.totalFiles.toString(), description: statsData.totalFileSize, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Receipts', value: statsData.totalReceipts.toString(), description: statsData.totalReceiptsSize, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const totalRequests = statsData.pendingRequests + statsData.approvedRequests + statsData.rejectedRequests || 1; // avoid div by 0

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Analytics"
        description="Detailed insights into platform usage, content volume, and enrollment requests."
      />

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="size-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} padding="lg" className="border-slate-200/60 shadow-sm">
                <CardContent className="p-0 flex items-center gap-4">
                  <div className={`flex size-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="size-6" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        {stat.description && <span className="text-xs text-slate-400 font-medium">{stat.description}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="size-5 text-[var(--color-brand)]" />
                  Enrollment Requests Breakdown
                </CardTitle>
                <CardDescription>Overview of access request statuses across all users.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 pt-2">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-amber-700">Pending</span>
                      <span className="font-bold text-slate-900">{statsData.pendingRequests}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(statsData.pendingRequests / totalRequests) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-emerald-700">Approved</span>
                      <span className="font-bold text-slate-900">{statsData.approvedRequests}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(statsData.approvedRequests / totalRequests) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-rose-700">Rejected</span>
                      <span className="font-bold text-slate-900">{statsData.rejectedRequests}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${(statsData.rejectedRequests / totalRequests) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <BarChart3 className="size-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">More charts coming soon</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">We are working on adding detailed graphical visualizations for user engagement and course enrollments.</p>
            </Card>
          </div>
        </>
      )}
    </Stack>
  );
};

export default Analytics;
import { BarChart3, Users, BookOpen, ShieldCheck, ClipboardList, Plus, Video, Edit, Trash2, ExternalLink, MessageSquare, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { landingVideoService, type LandingVideo } from '../../services/landingVideoService';
import { projectService, type Project } from '../../services/projectService';
import { faqService, type FAQ } from '../../services/faqService';
import { userService } from '../../services/userService';
import { roleService } from '../../services/roleService';
import { courseService } from '../../services/courseService';
import { videoService } from '../../services/videoService';
import { courseMaterialService } from '../../services/courseMaterialService';
import { accessRequestService } from '../../services/accessRequestService';
import { receiptService } from '../../services/receiptService'; // Imported receiptService

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [landingVideos, setLandingVideos] = useState<LandingVideo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isFaqsLoading, setIsFaqsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalCourses: 0,
    totalVideos: 0,
    totalFiles: 0,
    totalFileSize: '0 Bytes',
    totalReceipts: 0,         // Added totalReceipts
    totalReceiptsSize: '0 Bytes', // Added totalReceiptsSize
    pendingRequests: 0
  });

  const fetchLandingVideos = async () => {
    try {
      setIsLoading(true);
      const response = await landingVideoService.getAllLandingVideos();
      if (response.success && response.videos) {
        setLandingVideos(response.videos);
      }
    } catch (error) {
      console.error('Failed to fetch landing videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsProjectsLoading(true);
      const response = await projectService.getAllProjects();
      if (response.success && response.projects) {
        setProjects(response.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const fetchFaqs = async () => {
    try {
      setIsFaqsLoading(true);
      const response = await faqService.getAllFAQs();
      if (response.success && response.faqs) {
        setFaqs(response.faqs);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setIsFaqsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [usersRes, rolesRes, coursesRes, videosRes, materialsRes, pendingRes, receiptsRes] = await Promise.all([
        userService.getAllUsers(),
        roleService.getAllRoles(),
        courseService.getAllCourses(),
        videoService.getAllVideos(),
        courseMaterialService.getAllMaterials(),
        accessRequestService.getPendingRequests(),
        receiptService.getAllReceipts() // Fetched receipts
      ]);

      let totalSize = 0;
      if (materialsRes.success && materialsRes.materials) {
        totalSize = materialsRes.materials.reduce((sum, m) => sum + (m.file_size || 0), 0);
      }

      let receiptsSize = 0;
      if (receiptsRes.success && receiptsRes.receipts) {
        receiptsSize = receiptsRes.receipts.reduce((sum, r) => sum + (r.file_size || 0), 0);
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
        pendingRequests: pendingRes.success && pendingRes.data ? (Array.isArray(pendingRes.data) ? pendingRes.data.length : 0) : 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  useEffect(() => {
    fetchLandingVideos();
    fetchProjects();
    fetchFaqs();
    fetchDashboardStats();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this landing video?')) {
      try {
        await landingVideoService.deleteLandingVideo(id);
        fetchLandingVideos();
      } catch (error) {
        console.error('Failed to delete video:', error);
      }
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        await faqService.deleteFAQ(id);
        fetchFaqs();
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
      }
    }
  };

  const stats = [
    { label: 'Total Users', value: statsData.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Roles', value: statsData.totalRoles.toString(), icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Courses', value: statsData.totalCourses.toString(), icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Videos', value: statsData.totalVideos.toString(), icon: Video, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Course Files', value: `${statsData.totalFiles} (${statsData.totalFileSize})`, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Receipts', value: `${statsData.totalReceipts} (${statsData.totalReceiptsSize})`, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Pending Requests', value: statsData.pendingRequests.toString(), icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <Stack gap="lg" className="pb-10">

      <PageHeader
        title="Admin Dashboard"
        description="Monitor system performance, manage user access, and oversee course content from a single interface."
      />

      {/* Quick Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200/60 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={`flex size-8 items-center justify-center rounded-sm ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-md font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Overview */}
        <Card className="flex flex-col h-full overflow-hidden">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Key metrics and platform usage over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center min-h-48 border-2 border-dashed border-slate-100 rounded-xl m-4 mt-6">
            <div className="text-center">
              <BarChart3 className="size-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-medium">Analytics chart placeholder</p>
            </div>
          </CardContent>
        </Card>

        {/* Management Tasks */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Management Tasks</CardTitle>
            <CardDescription>Frequent actions for administrators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Users className="size-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Review new users</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Nice to do</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <ClipboardList className="size-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Audit access requests</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Manage Roles</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">On-going</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Landing Videos Management */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <CardTitle>Landing Page Videos</CardTitle>
            <CardDescription>Manage the video content displayed on the public landing page.</CardDescription>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="size-4" />}
            onClick={() => navigate('/admin/landing-video')}
            className="rounded-xl shadow-md shadow-primary/20"
          >
            Create Video
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="size-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading videos...</p>
            </div>
          ) : landingVideos.length === 0 ? (
            <div className="py-20 text-center">
              <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <Video className="size-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold">No landing videos found</p>
              <p className="text-xs text-slate-400 mt-1">Start by creating your first landing video content.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {landingVideos.map((video) => (
                <div key={video.land_video_id} className="group flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="size-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                      <Video className="size-7" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {video.title || "Untitled Video"}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-slate-200 bg-white text-slate-500 uppercase tracking-tighter">
                          Order: {video.order_index}
                        </Badge>
                        <a
                          href={video.youtube_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                        >
                          <ExternalLink size={10} />
                          YouTube Link
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-indigo-600 bg-white shadow-sm border border-slate-200 rounded-xl px-3"
                      onClick={() => navigate(`/admin/landing-video?id=${video.land_video_id}`)}
                    >
                      <Edit className="size-4 mr-2" />
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-rose-600 bg-white shadow-sm border border-slate-200 rounded-xl px-3"
                      onClick={() => handleDelete(video.land_video_id)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Landing Projects Management */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <CardTitle>Landing Page Projects</CardTitle>
            <CardDescription>Manage the showcase projects displayed on the public landing page.</CardDescription>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="size-4" />}
            onClick={() => navigate('/admin/landing-project')}
            className="rounded-xl shadow-md shadow-primary/20"
          >
            Create Project
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isProjectsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="size-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center">
              <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <BookOpen className="size-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold">No landing projects found</p>
              <p className="text-xs text-slate-400 mt-1">Start by creating your first showcase project.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.map((project) => (
                <div key={project.project_id} className="group flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="size-14 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                      <BookOpen className="size-7" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {project.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-slate-200 bg-white text-slate-500 uppercase tracking-tighter">
                          {project.category || 'Portfolio'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4 border-indigo-100 bg-indigo-50/50 text-indigo-600 uppercase tracking-tighter">
                          {project.level || 'Beginner'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-violet-600 bg-white shadow-sm border border-slate-200 rounded-xl px-3"
                      onClick={() => navigate(`/admin/landing-project?id=${project.project_id}`)}
                    >
                      <Edit className="size-4 mr-2" />
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-rose-600 bg-white shadow-sm border border-slate-200 rounded-xl px-3"
                      onClick={() => handleDeleteProject(project.project_id)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Management */}
      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <CardTitle>FAQ Management</CardTitle>
            <CardDescription>Manage the frequently asked questions displayed on the landing page.</CardDescription>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="size-4" />}
            onClick={() => navigate('/admin/faq')}
            className="rounded-xl shadow-md shadow-primary/20"
          >
            Create FAQ
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isFaqsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="size-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="size-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                <MessageSquare className="size-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold">No FAQs found</p>
              <p className="text-xs text-slate-400 mt-1">Start by creating your first FAQ entry.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {faqs.map((faq) => (
                <div key={faq.faqs_id} className="group flex items-center justify-between p-6 hover:bg-slate-50/80 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="size-14 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <MessageSquare className="size-7" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {faq.question}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-amber-600 bg-white shadow-sm border border-slate-200 rounded-xl px-3"
                      onClick={() => navigate(`/admin/faq?id=${faq.faqs_id}`)}
                    >
                      <Edit className="size-4 mr-2" />
                      Update
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-rose-600 bg-white shadow-sm border border-slate-200 rounded-xl px-3"
                      onClick={() => handleDeleteFaq(faq.faqs_id)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AdminDashboard;

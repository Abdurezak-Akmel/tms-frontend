import { BarChart3, Users, BookOpen, ShieldCheck, ClipboardList, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageHeader, Stack } from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';


const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      authService.clearTokens();
      navigate('/admin-login'); // Redirect to admin login
    } catch (error) {
      console.error('Logout failed:', error);
      authService.clearTokens();
      navigate('/admin-login');
    }

  };

  const stats = [
    { label: 'Total Users', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Courses', value: '42', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Requests', value: '12', icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'System Health', value: '99.9%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <Stack gap="lg" className="pb-10">

      <PageHeader
        title="Admin Dashboard"
        description="Monitor system performance, manage user access, and oversee course content from a single interface."
        actions={
          <Button
            variant="outline"
            size="md"
            leftIcon={<LogOut className="size-4" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        }
      />


      {/* Quick Stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-slate-200/60 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={`flex size-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Action required</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <ClipboardList className="size-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Audit access logs</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Security scan</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Stack>
  );
};

export default AdminDashboard;

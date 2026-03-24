import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Plus,
  RefreshCw,
  Search,
  BookOpen,
  Trash2,
  ShieldAlert,
  Edit3,
  Calendar
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Input,
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { roleService, type Role } from '../../services/roleService';
import { roleCourseService } from '../../services/roleCourseService';
import { EmptyState } from '../../components/feedback';
import { cn } from '../../utils/cn';

interface RoleWithCourses extends Role {
  assignedCourses: any[];
}

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleWithCourses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRolesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await roleService.getAllRoles();

      if (response.success && response.roles) {
        // Fetch courses for each role
        const rolesWithCourses = await Promise.all(
          response.roles.map(async (role) => {
            try {
              const coursesResponse = await roleCourseService.getCoursesByRoleId(role.role_id);
              return {
                ...role,
                assignedCourses: coursesResponse.success && coursesResponse.courses ? coursesResponse.courses : []
              };
            } catch (err) {
              console.error(`Failed to fetch courses for role ${role.role_id}:`, err);
              return { ...role, assignedCourses: [] };
            }
          })
        );

        setRoles(rolesWithCourses);
      } else {
        setError(response.error || 'Failed to fetch roles');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesData();
  }, []);

  const filteredRoles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return roles.filter(
      (role) =>
        role.role_name.toLowerCase().includes(q) ||
        (role.description && role.description.toLowerCase().includes(q))
    );
  }, [roles, searchQuery]);

  const handleCreateNewRole = () => {
    navigate('/admin/create-role');
  };

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Role Management"
        description="Define and configure administrative roles for your platform. Manage granular permissions to control access to management features."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRolesData}
              disabled={loading}
              leftIcon={<RefreshCw size={14} className={loading ? "animate-spin" : ""} />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={handleCreateNewRole}
            >
              Create new role
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm mx-4">
        <div className="relative w-full max-sm:w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search roles by name or description..."
            className="pl-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="size-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Retrieving system roles...</p>
        </div>
      ) : error ? (
        <div className="py-16 flex flex-col items-center justify-center bg-rose-50/30 rounded-3xl border border-rose-100 border-dashed mx-4">
          <div className="size-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Could not load roles</h3>
          <p className="text-slate-500 mb-6 text-center max-w-md">{error}</p>
          <Button variant="outline" onClick={fetchRolesData}>Retry Fetch</Button>
        </div>
      ) : filteredRoles.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 px-6">
          {filteredRoles.map((role) => (
            <Card key={role.role_id} className="relative group overflow-hidden border-slate-200/60 hover:border-primary/30 hover:shadow-xl transition-all duration-500 bg-white/80 backdrop-blur-sm flex flex-col rounded-[2rem]">
              {/* Animated Top Gradient Border */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-1.5",
                roleService.getRoleColor(role.role_name) === '#DC3545' ? 'bg-rose-500' :
                  roleService.getRoleColor(role.role_name) === '#007BFF' ? 'bg-blue-500' :
                    roleService.getRoleColor(role.role_name) === '#28A745' ? 'bg-emerald-500' :
                      'bg-primary'
              )} />

              <div className="flex flex-col md:flex-row flex-1">
                {/* Left Side: Identity & Description */}
                <div className="md:w-5/12 p-6 flex flex-col border-b md:border-b-0 md:border-r border-slate-100/80">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={cn(
                      "size-14 rounded-2xl flex items-center justify-center shadow-md border-2 border-white relative overflow-hidden shrink-0 transition-transform group-hover:scale-105 duration-500",
                      roleService.getRoleColor(role.role_name) === '#DC3545' ? 'bg-rose-50 text-rose-600 border-rose-100/50' :
                        roleService.getRoleColor(role.role_name) === '#007BFF' ? 'bg-blue-50 text-blue-600 border-blue-100/50' :
                          roleService.getRoleColor(role.role_name) === '#28A745' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' :
                            'bg-slate-50 text-slate-600 border-slate-100/50'
                    )}>
                      <span className="text-2xl relative z-10">{roleService.getRoleIcon(role.role_name)}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 leading-tight truncate text-lg tracking-tight">
                        {roleService.formatRoleName(role.role_name)}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="px-1.5 py-0 text-[9px] uppercase font-black tracking-widest bg-slate-50/80 border-slate-200/60 text-slate-500 rounded-md">
                          ID: {role.role_id}
                        </Badge>
                        {roleService.isSystemRole(role.role_name) && (
                          <Badge variant="success" className="px-1.5 py-0 text-[9px] uppercase font-black tracking-widest rounded-md">
                            SYS
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-slate-500 leading-relaxed font-medium mb-4 line-clamp-2">
                    {role.description || 'Define a purpose for this role.'}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-auto pt-3 border-t border-slate-50">
                    <Calendar size={12} className="shrink-0 text-slate-300" />
                    <span>Created {roleService.formatDate(role.created_at)}</span>
                  </div>
                </div>

                {/* Right Side: Permissions & Actions */}
                <div className="flex-1 p-6 flex flex-col bg-slate-50/20">
                  <div className="space-y-3 flex-1 mb-4">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 flex items-center gap-2">
                       Permissions ({role.assignedCourses.length})
                    </h5>

                    <div className="bg-white/40 rounded-2xl p-3.5 border border-slate-200/40 min-h-[90px] flex flex-col group/list shadow-sm">
                      {role.assignedCourses.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {role.assignedCourses.slice(0, 5).map((course: any) => (
                            <div
                              key={course.course_id}
                              className="inline-flex items-center gap-1.5 bg-white border border-slate-200/60 text-slate-600 py-1 px-2.5 rounded-lg text-[10px] font-bold shadow-sm transition-all hover:text-primary cursor-default"
                            >
                              <BookOpen size={9} className="text-slate-300" />
                              <span className="truncate max-w-[120px]">{course.title}</span>
                            </div>
                          ))}
                          {role.assignedCourses.length > 5 && (
                            <div className="inline-flex items-center justify-center bg-slate-100/50 border border-slate-200 text-slate-400 py-0.5 px-2 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                              +{role.assignedCourses.length - 5}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center flex-1 text-center py-2">
                          <ShieldAlert size={16} className="text-slate-200" />
                          <span className="text-[9px] font-black text-slate-300 uppercase mt-1">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-lg transition-all active:scale-[0.98] h-10 rounded-xl text-[11px] font-black uppercase tracking-widest"
                      size="sm"
                      leftIcon={<Edit3 size={14} />}
                      onClick={() => navigate(`/admin/update-role/${role.role_id}`)}
                    >
                      Manage Role
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-10 p-0 text-rose-500 border-rose-100 bg-white hover:bg-rose-50 transition-all rounded-xl shrink-0 shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200 border-dashed shadow-sm mx-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 size-64 bg-slate-100/50 blur-3xl -mr-32 -mt-32 rounded-full" />
          <EmptyState
            title="No roles found"
            description={
              searchQuery
                ? `We couldn't find any roles matching "${searchQuery}". Your filtering parameters might be too specific.`
                : "No administrative roles have been created yet. Get started by creating your first role to begin managing content permissions."
            }
            action={
              searchQuery ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="mt-6 px-10 rounded-xl font-bold bg-white"
                >
                  Clear Search
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateNewRole}
                  className="mt-6 px-10 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  Create First Role
                </Button>
              )
            }
          />
        </div>
      )}

      <div className="px-6 mb-10">
        <Card className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-0 shadow-2xl overflow-hidden relative rounded-[2.5rem]">
          <div className="absolute right-0 top-0 size-96 bg-primary/20 blur-[100px] -mr-48 -mt-48 rounded-full opacity-60 animate-pulse" />
          <div className="absolute left-0 bottom-0 size-64 bg-emerald-500/10 blur-[80px] -ml-32 -mb-32 rounded-full opacity-40" />

          <div className="flex flex-col md:flex-row items-center gap-8 p-10 relative z-10">
            <div className="size-20 shrink-0 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-amber-400 shadow-2xl scale-110">
              <Shield size={36} />
            </div>
            <div>
              <h4 className="font-black text-2xl mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                Access Control Security Infrastructure
              </h4>
              <p className="text-lg text-slate-400 leading-relaxed max-w-4xl font-medium">
                Roles are the foundational security layer of the Tutorial Management System. Each role defines a granular collection of course-level management permissions.
                <span className="text-white ml-2 opacity-80 decoration-rose-500/50 underline underline-offset-4 decoration-2">Warning: Revoking course access or deleting roles will take effect immediately for all associated users.</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Stack>
  );
};

export default Roles;
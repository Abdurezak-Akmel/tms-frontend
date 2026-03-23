import { Shield, ShieldAlert, ShieldCheck, User, Users, Check, Lock, Edit2, Trash2, Plus, Info } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui';

import { PageHeader, Stack } from '../../components/layout';
import { cn } from '../../utils/cn';

interface RolePermission {
  id: string;
  label: string;
  description: string;
  category: 'User' | 'Course' | 'Platform';
}

interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  icon: typeof Shield;
  color: string;
  bg: string;
  permissions: string[];
  userCount: number;
}

const ALL_PERMISSIONS: RolePermission[] = [
  { id: 'u_v', label: 'View users', description: 'Can see user lists and profiles.', category: 'User' },
  { id: 'u_e', label: 'Edit users', description: 'Can modify user roles and statuses.', category: 'User' },
  { id: 'c_v', label: 'View courses', description: 'Can browse the full course catalog.', category: 'Course' },
  { id: 'c_e', label: 'Edit courses', description: 'Can create and modify course content.', category: 'Course' },
  { id: 'v_e', label: 'Edit videos', description: 'Can upload and manage video materials.', category: 'Course' },
  { id: 'f_e', label: 'Edit files', description: 'Can manage downloadable resources.', category: 'Course' },
  { id: 'a_v', label: 'View analytics', description: 'Can access system usage reports.', category: 'Platform' },
  { id: 'ar_m', label: 'Manage access requests', description: 'Can approve or reject course applications.', category: 'Platform' },
  { id: 's_s', label: 'System settings', description: 'Can modify global configuration.', category: 'Platform' },
];

const MOCK_ROLES: RoleDefinition[] = [
  {
    id: 'r_sa',
    name: 'Super Admin',
    description: 'Master access with control over all platform features and settings.',
    icon: ShieldAlert,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    userCount: 2,
    permissions: ALL_PERMISSIONS.map(p => p.id),
  },
  {
    id: 'r_in',
    name: 'Instructor',
    description: 'Responsible for creating and maintaining educational content.',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    userCount: 8,
    permissions: ['c_v', 'c_e', 'v_e', 'f_e', 'a_v'],
  },
  {
    id: 'r_su',
    name: 'Support Agent',
    description: 'Focused on user management and processing course access requests.',
    icon: Shield,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    userCount: 5,
    permissions: ['u_v', 'ar_m', 'c_v'],
  },
  {
    id: 'r_st',
    name: 'Student',
    description: 'Primary learner role with access to purchased materials.',
    icon: User,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    userCount: 1248,
    permissions: ['c_v'],
  },
];

const Roles = () => {
  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Role Management"
        description="Define and configure administrative roles for your platform. Manage granular permissions to control access to management features."
        actions={
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            Create new role
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {MOCK_ROLES.map((role) => (
          <Card key={role.id} padding="none" className="overflow-hidden flex flex-col h-full ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-6 border-b border-slate-50 bg-gradient-to-br from-white to-slate-50/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn('flex size-12 items-center justify-center rounded-xl shadow-sm border border-white/50', role.bg, role.color)}>
                    <role.icon className="size-6" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-xl">{role.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="size-3.5 text-slate-400" />
                      <span className="text-xs font-medium text-slate-500">{role.userCount} users assigned</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500">
                    <Edit2 size={14} />
                  </Button>
                  {role.id !== 'r_sa' && (
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600">
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription className="mt-4 text-sm leading-relaxed max-w-sm">
                {role.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 flex-1 space-y-5">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Permissions</h5>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {ALL_PERMISSIONS.map((permission) => {
                  const hasAccess = role.permissions.includes(permission.id);
                  return (
                    <div key={permission.id} className="flex items-start gap-2.5 group">
                      <div className={cn(
                        'mt-0.5 size-4 rounded flex flex-shrink-0 items-center justify-center transition-colors border',
                        hasAccess
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-slate-200 text-transparent group-hover:bg-slate-50'
                      )}>
                        <Check className="size-3" strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <p className={cn('text-sm font-medium leading-none mb-1', hasAccess ? 'text-slate-800' : 'text-slate-400')}>
                          {permission.label}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate-2-lines leading-tight">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>

            <CardFooter className="px-6 py-4 bg-slate-50/50 justify-between items-center sm:flex-row flex-col gap-3">
               <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                 <Lock className="size-3.5" />
                 {role.id === 'r_sa' ? 'Root access system protected' : 'Granular security active'}
               </div>
               <Button variant="outline" size="sm" className="bg-white hover:bg-white text-xs whitespace-nowrap lg:w-auto w-full">
                 Configure policy
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-600 text-white border-0 shadow-xl shadow-blue-200">
        <div className="flex items-start gap-4 p-4">
          <div className="size-10 shrink-0 rounded-xl bg-white/20 flex items-center justify-center">
            <Info size={22} className="text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-1">Role Hierarchy & Security</h4>
            <p className="text-sm text-blue-100 leading-relaxed">
              Platform security is based on a least-privilege model. Role assignments are restrictive by default.
              Consider creating specialized roles for team members to minimize access surface area.
            </p>
          </div>
        </div>
      </Card>
    </Stack>
  );
};

export default Roles;
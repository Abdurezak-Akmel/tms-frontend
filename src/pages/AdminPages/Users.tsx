import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Trash2,
  Filter,
  UserCog,
  Mail,
  CheckCircle2,
  XCircle,
  Smartphone,
  RefreshCw,
  MoreVertical,
  ShieldAlert,
  CalendarDays
} from 'lucide-react';

import {
  Avatar,
  Badge,
  type BadgeVariant,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Separator
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { EmptyState } from '../../components/feedback';
import { userService, type User } from '../../services/userService';

const getRoleBadgeVariant = (roleId: number): BadgeVariant => {
  switch (roleId) {
    case 3: return 'success';
    case 2: return 'default';
    case 1:
    default: return 'outline';
  }
};

const getRoleName = (roleId: number): string => {
  switch (roleId) {
    case 3: return 'Admin';
    case 2: return 'Instructor';
    case 1:
    default: return 'Student';
  }
};

const getStatusBadgeVariant = (status: string): BadgeVariant => {
  switch (status.toLowerCase()) {
    case 'active': return 'success';
    case 'inactive': return 'warning';
    case 'suspended': return 'danger';
    case 'pending': return 'warning';
    default: return 'outline';
  }
};

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.success && response.users) {
        setUsers(response.users);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        getRoleName(user.role_id).toLowerCase().includes(q) ||
        user.status.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action is permanent.')) {
      try {
        const response = await userService.deleteUser(id);
        if (response.success) {
          setUsers((prev) => prev.filter((u) => u.user_id !== id));
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdate = (id: number) => {
    navigate(`/admin/user-update/${id}`);
  };

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="User Management"
        description="Monitor system-wide users, manage their roles, and track overall account status and activity."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
              leftIcon={<RefreshCw size={14} className={loading ? "animate-spin" : ""} />}
            >
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="relative w-full max-sm:w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, email, role or status..."
            className="pl-9 bg-white border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>
            Advanced Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="size-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Retrieving system users...</p>
        </div>
      ) : error ? (
        <div className="py-16 flex flex-col items-center justify-center bg-rose-50/30 rounded-3xl border border-rose-100 border-dashed mx-4">
          <div className="size-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <ShieldAlert size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Could not load users</h3>
          <p className="text-slate-500 mb-6 text-center max-w-md">{error}</p>
          <Button variant="outline" onClick={fetchUsers}>Retry Fetch</Button>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.user_id} className="relative group overflow-hidden border-slate-200 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 bg-white shadow-sm hover:shadow-primary/5">
              <CardHeader className="p-0 border-b-0">
                <div className="flex items-start justify-between p-5 pb-0">
                  <div className="flex items-center gap-4">
                    <Avatar
                      fallback={user.name}
                      className="size-14 ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all shadow-sm"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 leading-tight truncate">{user.name}</h3>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <Badge
                          variant={getStatusBadgeVariant(user.status)}
                          className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider"
                        >
                          {user.status}
                        </Badge>
                        <Badge
                          variant={getRoleBadgeVariant(user.role_id)}
                          className="px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider"
                        >
                          Role ID: {user.role_id}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 group-hover:text-slate-900">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-4 space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 pl-1">
                      {user.email_verified ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <XCircle size={16} className="text-rose-400" />
                      )}
                      <span>{user.email_verified ? 'Account Verified' : 'Email Unverified'}</span>
                    </div>

                    {user.registration_device && (
                      <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 pl-1">
                        <Smartphone size={16} className="text-slate-400" />
                        <span className="truncate">Device: {user.registration_device}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 pl-1">
                      <CalendarDays size={16} className="text-slate-400" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-50" />

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-sm transition-transform active:scale-[0.98]"
                    size="sm"
                    leftIcon={<UserCog size={16} />}
                    onClick={() => handleUpdate(user.user_id)}
                  >
                    Update User
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-rose-600 border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-all px-3"
                    onClick={() => handleDelete(user.user_id)}
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 bg-white rounded-[2rem] border border-slate-200 border-dashed shadow-sm mx-4">
          <EmptyState
            title="No matches found"
            description={
              searchQuery
                ? `We couldn't find any users matching "${searchQuery}" in our system.`
                : "Your database is currently empty. New users will appear here once they register."
            }
            action={
              searchQuery && (
                <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="mt-4">
                  Clear Search
                </Button>
              )
            }
          />
        </div>
      )}

      <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-0 shadow-2xl overflow-hidden relative mx-4">
        <div className="absolute right-0 top-0 size-64 bg-primary/20 blur-[80px] -mr-32 -mt-32 rounded-full opacity-50" />
        <div className="absolute left-0 bottom-0 size-48 bg-emerald-500/10 blur-[60px] -ml-24 -mb-24 rounded-full opacity-30" />

        <div className="flex items-start gap-6 p-8 relative z-10">
          <div className="size-14 shrink-0 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-amber-400 shadow-2xl">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h4 className="font-bold text-xl mb-2 tracking-tight">Security & Oversight Protocol</h4>
            <p className="text-base text-slate-400 leading-relaxed max-w-3xl font-medium">
              Administrative actions are logged and irreversible. Changing user credentials or status impacts system-wide access instantly.
              Please audit account dependencies before proceeding with deactivations or deletions.
            </p>
          </div>
        </div>
      </Card>
    </Stack>
  );
};

export default Users;

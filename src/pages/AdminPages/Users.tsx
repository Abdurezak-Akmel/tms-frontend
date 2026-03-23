import { useMemo, useState } from 'react';
import { Search, UserPlus, Trash2, User, Filter, AlertCircle } from 'lucide-react';

import { Avatar, Badge, Button, Card, Input } from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { EmptyState } from '../../components/feedback';

type UserRole = 'Student' | 'Instructor' | 'Admin';
type UserStatus = 'Active' | 'Inactive' | 'Suspended';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
}

const MOCK_USERS: UserData[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinedAt: '2025-01-10T12:00:00Z' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'Active', joinedAt: '2025-02-15T15:30:00Z' },
  { id: '3', name: 'Mike Ross', email: 'mike@example.com', role: 'Instructor', status: 'Inactive', joinedAt: '2025-03-20T09:12:00Z' },
  { id: '4', name: 'Sarah Connor', email: 'sarah@example.com', role: 'Student', status: 'Suspended', joinedAt: '2025-01-05T08:45:00Z' },
  { id: '5', name: 'Logan Paul', email: 'logan@vlog.com', role: 'Student', status: 'Active', joinedAt: '2025-03-22T21:20:00Z' },
  { id: '6', name: 'Peter Parker', email: 'spidey@nyc.gov', role: 'Instructor', status: 'Active', joinedAt: '2025-03-18T11:00:00Z' },
];

const roleVariant: Record<UserRole, 'default' | 'success' | 'outline'> = {
  Admin: 'success',
  Instructor: 'default',
  Student: 'outline',
};

const statusVariant: Record<UserStatus, 'success' | 'warning' | 'danger'> = {
  Active: 'success',
  Inactive: 'warning',
  Suspended: 'danger',
};

const Users = () => {
  const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const toggleRole = (id: string) => {
    const roles: UserRole[] = ['Student', 'Instructor', 'Admin'];
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextRole = roles[(roles.indexOf(u.role) + 1) % roles.length];
          return { ...u, role: nextRole };
        }
        return u;
      })
    );
  };

  const toggleStatus = (id: string) => {
    const statuses: UserStatus[] = ['Active', 'Inactive', 'Suspended'];
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = statuses[(statuses.indexOf(u.status) + 1) % statuses.length];
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="User Management"
        description="View all registered users, manage their roles, monitor activity, or deactivate accounts if necessary."
        actions={
          <Button variant="primary" leftIcon={<UserPlus size={16} />}>
            Add member
          </Button>
        }
      />

      <Card padding="none" className="overflow-hidden border-slate-200/60 shadow-sm">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/20 p-4 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users by name, email or role..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={<Filter size={14} />}>
              Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-white">
                <tr className="text-slate-500 font-medium">
                  <th className="px-6 py-4 font-semibold">User details</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Member since</th>
                  <th className="px-6 py-4 font-semibold text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={user.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 leading-tight truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRole(user.id)}
                        className="group/btn inline-flex"
                        title="Click to cycle role"
                      >
                        <Badge
                          variant={roleVariant[user.role]}
                          className="capitalize cursor-pointer group-hover/btn:ring-2 group-hover/btn:ring-slate-200 transition-shadow"
                        >
                          {user.role}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="group/btn inline-flex"
                        title="Click to cycle status"
                      >
                        <Badge
                          variant={statusVariant[user.status]}
                          className="capitalize cursor-pointer group-hover/btn:ring-2 group-hover/btn:ring-slate-200 transition-shadow"
                        >
                          {user.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(user.joinedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1 px-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-slate-900 h-8 w-8 p-0"
                          title="View profile"
                        >
                          <User size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-rose-600 h-8 w-8 p-0 transition-colors"
                          onClick={() => handleDelete(user.id)}
                          title="Delete user"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16">
              <EmptyState
                title="No users found"
                description={
                  searchQuery
                    ? `No users match your current search "${searchQuery}"`
                    : "When users register on your platform, they'll show up here."
                }
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-slate-900 text-white border-0 shadow-lg shadow-slate-200/50">
        <div className="flex items-start gap-4 p-4">
          <div className="size-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
            <AlertCircle size={22} />
          </div>
          <div>
            <h4 className="font-semibold text-base mb-1">Administrative Note</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Changing user roles or statuses takes effect immediately across all sessions.
              Deletion is permanent and cannot be undone—proceed with caution.
            </p>
          </div>
        </div>
      </Card>
    </Stack>
  );
};

export default Users;

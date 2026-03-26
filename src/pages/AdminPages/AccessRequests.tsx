import { useMemo, useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, Search, BookOpen, User, CreditCard } from 'lucide-react';
import { Badge, Button, Card, CardContent, Input, Separator } from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { EmptyState } from '../../components/feedback';
import accessRequestService, { type AccessRequest } from '../../services/accessRequestService';
import { roleService, type Role } from '../../services/roleService';
import { userService } from '../../services/userService';

type StatusVariant = 'warning' | 'success' | 'danger';

const statusVariant: Record<string, StatusVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const AccessRequests = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingRoleFor, setUpdatingRoleFor] = useState<number | null>(null); // request_id currently being updated

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await accessRequestService.getAllAccessRequests();
      if (res.success && Array.isArray(res.data)) {
        setRequests(res.data);
      }
    } catch (error) {
      console.error('Error fetching access requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await roleService.getAllRoles();
      if (res.success && Array.isArray(res.roles)) {
        setRoles(res.roles);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchRoles();
  }, [fetchRequests, fetchRoles]);

  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return requests.filter(
      (req) =>
        req.email?.toLowerCase().includes(q) ||
        req.course_title?.toLowerCase().includes(q) ||
        req.user_id.toString().includes(q) ||
        req.request_id.toString().includes(q)
    );
  }, [requests, searchQuery]);

  const handleStatusChange = async (request_id: number, newStatus: 'approved' | 'rejected') => {
    try {
      setRequests((prev) =>
        prev.map((req) => (req.request_id === request_id ? { ...req, status: newStatus } : req))
      );
      await accessRequestService.updateAccessRequestStatus(request_id, { status: newStatus });
      fetchRequests(); // Refresh data to get correct reviewed_at
    } catch (error) {
      console.error('Error updating status:', error);
      fetchRequests(); // Revert back if error
    }
  };

  const handleRoleChange = async (request_id: number, user_id: number, role_id: number) => {
    try {
      setUpdatingRoleFor(request_id);
      await userService.updateUser(user_id, { role_id });
      await fetchRequests(); // Refresh data
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setUpdatingRoleFor(null);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Stack gap="lg" className="pb-10 w-full max-w-none">
        <PageHeader
          title="Access Requests"
          description="Review and manage user requests for course access. Approve payments or reject invalid entries. All actions are reversible."
        />

        <Card padding="none" className="overflow-hidden border-slate-200/60 dark:border-slate-800 shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by ID, email, or course title..."
                className="pl-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 transition-all dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">{filteredRequests.length} results</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline text-xs"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            {loading ? (
              <div className="py-24 flex flex-col justify-center items-center text-slate-400 gap-3">
                <div className="size-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-sm font-medium animate-pulse">Fetching latest requests...</span>
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((req) => (
                  <Card key={req.request_id} className="group flex flex-col border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-slate-900/60" padding="none">
                    {/* Card Header: Request ID & Status */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-mono text-xs font-bold">#{req.request_id}</span>
                        <Badge
                          variant={statusVariant[req.status] || 'warning'}
                          className="capitalize px-2 py-0.5 font-bold tracking-wide rounded-full text-[10px]"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="size-3.5" />
                        {new Date(req.requested_at).toLocaleDateString()}
                      </div>
                    </div>

                    <CardContent className="p-5 flex-1 space-y-4">
                      {/* User Info */}
                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{req.email}</p>
                          <p className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">User ID: {req.user_id}</p>
                        </div>
                      </div>

                      {/* Course Product */}
                      <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="size-4 text-slate-400 dark:text-slate-500" />
                          <span className="text-xs uppercase font-bold text-slate-400 dark:text-slate-500">Enrolling in</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{req.course_title || 'Unknown Course'}</p>
                      </div>

                      {/* Payment Amount */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-5 text-emerald-500 dark:text-emerald-400" />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Amount Paid</span>
                        </div>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">${req.payment_amount}</span>
                      </div>

                      <Separator className="bg-slate-100 dark:bg-slate-800" />

                      {/* Role ID Dropdown */}
                      <div className="space-y-2">
                        <label className="text-xs uppercase font-black text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                          Assign Permission Role
                        </label>
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={req.role_id}
                            id={`role-select-${req.request_id}`}
                            className="flex-1 h-10 pl-3 pr-8 rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary/20 dark:focus:ring-primary/40 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat"
                          >
                            {roles.map((role) => (
                              <option key={role.role_id} value={role.role_id}>
                                {role.role_name}
                              </option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            className="h-10 px-4 text-xs font-bold"
                            isLoading={updatingRoleFor === req.request_id}
                            onClick={() => {
                              const select = document.getElementById(`role-select-${req.request_id}`) as HTMLSelectElement;
                              handleRoleChange(req.request_id, req.user_id, parseInt(select.value));
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>

                    <Separator className="bg-slate-100 dark:bg-slate-800" />

                    {/* Footer: Approve/Reject Actions */}
                    <div className="p-4 bg-slate-50/20 dark:bg-slate-900 grid grid-cols-2 gap-3 mt-auto rounded-b-2xl">
                      <Button
                        size="sm"
                        variant={req.status === 'approved' ? 'primary' : 'outline'}
                        className={`h-10 text-xs font-black transition-all shadow-sm ${req.status === 'approved'
                          ? 'bg-emerald-600 hover:bg-emerald-700 border-none ring-2 ring-emerald-500/20'
                          : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                          }`}
                        onClick={() => handleStatusChange(req.request_id, 'approved')}
                        disabled={req.status === 'approved'}
                      >
                        <Check className={`size-3.5 mr-1 ${req.status === 'approved' ? 'text-white' : 'text-emerald-500'}`} />
                        {req.status === 'approved' ? 'Approved' : 'Approve'}
                      </Button>
                      <Button
                        size="sm"
                        variant={req.status === 'rejected' ? 'danger' : 'outline'}
                        className={`h-10 text-xs font-black transition-all shadow-sm ${req.status === 'rejected'
                          ? 'bg-rose-600 hover:bg-rose-700 border-none ring-2 ring-rose-500/20'
                          : 'text-rose-600 border-rose-100 hover:bg-rose-50'
                          }`}
                        onClick={() => handleStatusChange(req.request_id, 'rejected')}
                        disabled={req.status === 'rejected'}
                      >
                        <X className={`size-3.5 mr-1 ${req.status === 'rejected' ? 'text-white' : 'text-rose-500'}`} />
                        {req.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-20">
                <EmptyState
                  title={searchQuery ? "No matching requests" : "Inbox cleared"}
                  description={
                    searchQuery
                      ? `We couldn't find any results for "${searchQuery}". Try a different ID or email.`
                      : "Outstanding requests will appear here once submitted by users."
                  }
                />
              </div>
            )}
          </div>
        </Card>
      </Stack>
    </div>
  );
};

export default AccessRequests;

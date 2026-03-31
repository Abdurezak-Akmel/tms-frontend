import { useMemo, useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, Search, User, CreditCard, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { Badge, Button, Card, Input } from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { EmptyState } from '../../components/feedback';
import accessRequestService, { type AccessRequest } from '../../services/accessRequestService';
import { roleService, type Role } from '../../services/roleService';
import { userService } from '../../services/userService';
import receiptService from '../../services/receiptService';

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
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

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

  const handleDeleteRequest = async (request_id: number) => {
    if (!window.confirm('Are you sure you want to delete this access request?')) return;
    try {
      setIsDeleting(request_id);
      await accessRequestService.deleteAccessRequest(request_id);
      setRequests((prev) => prev.filter((req) => req.request_id !== request_id));
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    } finally {
      setIsDeleting(null);
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
              <div className="flex flex-col gap-6 p-1">
                {filteredRequests.map((req) => (
                  <Card key={req.request_id} className="group border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden" padding="none">
                    <div className="flex flex-col xl:flex-row min-h-[160px]">

                      {/* Section 1: User & Identification */}
                      <div className="p-5 xl:w-[28%] flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-black">REQ #{req.request_id}</span>
                              <Badge
                                variant={statusVariant[req.status] || 'warning'}
                                className="capitalize px-2.5 py-1 font-black tracking-wider rounded-full text-[10px]"
                              >
                                {req.status}
                              </Badge>
                            </div>
                            <button
                              onClick={() => handleDeleteRequest(req.request_id)}
                              disabled={isDeleting === req.request_id}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                              title="Delete Request"
                            >
                              {isDeleting === req.request_id ? (
                                <div className="size-4 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </button>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="size-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                              <User className="size-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate mb-0.5">{req.email}</p>
                              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500">USER ID: {req.user_id}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-4 xl:mt-0">
                          <Clock className="size-3.5" />
                          Requested: {new Date(req.requested_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                      </div>

                      {/* Section 2: Course & Payment Details */}
                      <div className="p-5 xl:w-[32%] flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="size-9 shrink-0 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CreditCard className="size-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">Amount Paid</span>
                                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">{req.payment_amount}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider">For Course</span>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1 max-w-[180px]">{req.course_title || 'Unknown Course'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-2">
                              <FileText className="size-4 text-blue-500 dark:text-blue-400" />
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Receipt</span>
                            </div>
                            {req.receipt_file_path ? (
                              <button
                                onClick={() => {
                                  const url = receiptService.getReceiptUrl({ file_path: req.receipt_file_path! });
                                  window.open(url, '_blank');
                                }}
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-all px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50"
                              >
                                <span>View PDF</span>
                                <ExternalLink className="size-3" />
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 italic px-2">Missing</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Admin Actions (Role & Approval) */}
                      <div className="p-5 xl:w-[40%] bg-slate-50/20 dark:bg-slate-900/40 border-t xl:border-t-0 xl:border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest flex items-center gap-1.5">
                            Set Access Permission
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <select
                                defaultValue={req.role_id}
                                id={`role-select-${req.request_id}`}
                                className="w-full h-10 pl-3 pr-8 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1rem_1rem] bg-[right_0.6rem_center] bg-no-repeat"
                              >
                                {roles.map((role) => (
                                  <option key={role.role_id} value={role.role_id}>
                                    {role.role_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <Button
                              size="sm"
                              className="h-10 px-4 text-[11px] font-black uppercase tracking-wider rounded-xl shadow-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all"
                              isLoading={updatingRoleFor === req.request_id}
                              onClick={() => {
                                const select = document.getElementById(`role-select-${req.request_id}`) as HTMLSelectElement;
                                handleRoleChange(req.request_id, req.user_id, parseInt(select.value));
                              }}
                            >
                              Update Role
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            size="sm"
                            variant={req.status === 'approved' ? 'primary' : 'outline'}
                            className={`h-11 text-[11px] font-black uppercase tracking-wider transition-all rounded-xl shadow-sm ${req.status === 'approved'
                              ? 'bg-emerald-600 hover:bg-emerald-700 border-none ring-4 ring-emerald-500/10'
                              : 'text-emerald-600 border-emerald-100 hover:bg-emerald-50 dark:border-emerald-900/30 dark:hover:bg-emerald-900/20'
                              }`}
                            onClick={() => handleStatusChange(req.request_id, 'approved')}
                            disabled={req.status === 'approved'}
                          >
                            <Check className={`size-4 mr-1.5 ${req.status === 'approved' ? 'text-white' : 'text-emerald-500'}`} />
                            {req.status === 'approved' ? 'Approved' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant={req.status === 'rejected' ? 'danger' : 'outline'}
                            className={`h-11 text-[11px] font-black uppercase tracking-wider transition-all rounded-xl shadow-sm ${req.status === 'rejected'
                              ? 'bg-rose-600 hover:bg-rose-700 border-none ring-4 ring-rose-500/10'
                              : 'text-rose-600 border-rose-100 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-900/20'
                              }`}
                            onClick={() => handleStatusChange(req.request_id, 'rejected')}
                            disabled={req.status === 'rejected'}
                          >
                            <X className={`size-4 mr-1.5 ${req.status === 'rejected' ? 'text-white' : 'text-rose-500'}`} />
                            {req.status === 'rejected' ? 'Rejected' : 'Reject'}
                          </Button>
                        </div>
                      </div>
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

import { useMemo, useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, Search, BookOpen, User, CreditCard, Hash, Calendar } from 'lucide-react';
import { Badge, Button, Card, Input } from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { EmptyState } from '../../components/feedback';
import accessRequestService, { type AccessRequest } from '../../services/accessRequestService';

type StatusVariant = 'warning' | 'success' | 'danger';

const statusVariant: Record<string, StatusVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const AccessRequests = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Stack gap="lg" className="pb-10 w-full max-w-none">
        <PageHeader
          title="Access Requests"
          description="Review and manage user requests for course access. Approve payments or reject invalid entries. All actions are reversible."
        />

        <Card padding="none" className="overflow-hidden border-slate-200/60 shadow-md bg-white/80 backdrop-blur-sm">
          <div className="border-b border-slate-100 bg-slate-50/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by ID, email, or course title..."
                className="pl-10 h-11 bg-white border-slate-200 focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
              <span className="bg-slate-100 px-2.5 py-1 rounded-full">{filteredRequests.length} results</span>
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

          <div className="overflow-x-auto min-w-full custom-scrollbar">
            {loading ? (
              <div className="py-24 flex flex-col justify-center items-center text-slate-400 gap-3">
                <div className="size-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-sm font-medium animate-pulse">Fetching latest requests...</span>
              </div>
            ) : filteredRequests.length > 0 ? (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30 text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="px-6 py-4 font-bold"><Hash className="size-3.5 inline mr-1 mb-0.5" />ID</th>
                    <th className="px-6 py-4 font-bold"><User className="size-3.5 inline mr-1 mb-0.5" />Customer Info</th>
                    <th className="px-6 py-4 font-bold"><BookOpen className="size-3.5 inline mr-1 mb-0.5" />Course Product</th>
                    <th className="px-6 py-4 font-bold"><CreditCard className="size-3.5 inline mr-1 mb-0.5" />Payment Details</th>
                    <th className="px-6 py-4 font-bold"><Clock className="size-3.5 inline mr-1 mb-0.5" />Processing Timeline</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {filteredRequests.map((req) => (
                    <tr key={req.request_id} className="group hover:bg-slate-50/80 transition-all duration-200">
                      <td className="px-6 py-5">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">#{req.request_id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 leading-tight">User #{req.user_id}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            {req.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-800 line-clamp-1">{req.course_title || 'Unknown Course'}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tabular-nums">ID: {req.course_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md self-start font-bold text-xs ring-1 ring-emerald-100">
                            ${req.payment_amount}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">Receipt: {req.receipt_id || 'Not provided'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-500 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-[11px]">
                            <Calendar className="size-3 text-slate-300" />
                            <span className="text-slate-400 font-medium w-14">Submitted:</span>
                            <span className="text-slate-600 font-semibold">{new Date(req.requested_at).toLocaleDateString()}</span>
                          </div>
                          {req.reviewed_at && (
                            <div className="flex items-center gap-2 text-[11px]">
                              <Check className="size-3 text-slate-300" />
                              <span className="text-slate-400 font-medium w-14">Reviewed:</span>
                              <span className="text-slate-600 font-semibold">{new Date(req.reviewed_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          variant={statusVariant[req.status] || 'warning'}
                          className="capitalize px-2.5 py-0.5 font-bold tracking-wide rounded-full text-[10px]"
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant={req.status === 'approved' ? 'primary' : 'outline'}
                            className={`h-8 px-3 text-xs font-bold transition-all shadow-sm ${req.status === 'approved'
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
                            className={`h-8 px-3 text-xs font-bold transition-all shadow-sm ${req.status === 'rejected'
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

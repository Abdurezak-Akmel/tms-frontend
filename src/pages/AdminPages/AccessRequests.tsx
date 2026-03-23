import { useMemo, useState } from 'react';
import { Check, X, Clock, Search, BookOpen } from 'lucide-react';
import { Avatar, Badge, Button, Card, Input } from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { EmptyState } from '../../components/feedback';

type RequestStatus = 'pending' | 'approved' | 'rejected';


interface AccessRequest {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  course: {
    title: string;
    id: string;
  };
  requestedAt: string;
  status: RequestStatus;
}

const MOCK_REQUESTS: AccessRequest[] = [
  {
    id: 'req-1',
    user: { name: 'John Doe', email: 'john@example.com' },
    course: { title: 'Advanced System Design', id: '6' },
    requestedAt: '2026-03-22T10:00:00Z',
    status: 'pending',
  },
  {
    id: 'req-2',
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    course: { title: 'Frontend Fundamentals', id: '1' },
    requestedAt: '2026-03-21T15:30:00Z',
    status: 'approved',
  },
  {
    id: 'req-3',
    user: { name: 'Mike Ross', email: 'mike@example.com' },
    course: { title: 'Database Design & SQL', id: '3' },
    requestedAt: '2026-03-20T09:12:00Z',
    status: 'rejected',
  },
  {
    id: 'req-4',
    user: { name: 'Sarah Connor', email: 'sarah@example.com' },
    course: { title: 'UI/UX for Developers', id: '5' },
    requestedAt: '2026-03-23T08:45:00Z',
    status: 'pending',
  },
];

const statusVariant: Record<RequestStatus, 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const AccessRequests = () => {
  const [requests, setRequests] = useState<AccessRequest[]>(MOCK_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return requests.filter(
      (req) =>
        req.user.name.toLowerCase().includes(q) ||
        req.user.email.toLowerCase().includes(q) ||
        req.course.title.toLowerCase().includes(q)
    );
  }, [requests, searchQuery]);

  const handleStatusChange = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  return (
    <Stack gap="lg" className="pb-10">
      <PageHeader
        title="Access Requests"
        description="Review and manage user requests for course access. Approve payments or reject invalid entries."
      />

      <Card padding="none" className="overflow-hidden border-slate-200/60 shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Filter by user or course..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredRequests.length > 0 ? (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-white text-slate-500 font-medium">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Course</th>
                  <th className="px-6 py-4 font-semibold">Requested At</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={req.user.name} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{req.user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{req.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <BookOpen className="size-4 text-slate-400" />
                        <span className="font-medium">{req.course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[req.status]} className="capitalize">
                        {req.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent h-8 px-3"
                            onClick={() => handleStatusChange(req.id, 'approved')}
                          >

                            <Check className="size-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-rose-600 border-rose-100 hover:bg-rose-50 h-8 px-3"
                            onClick={() => handleStatusChange(req.id, 'rejected')}
                          >
                            <X className="size-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12">
              <EmptyState
                title="No requests found"
                description={
                  searchQuery
                    ? `We couldn't find any matches for "${searchQuery}"`
                    : "When users request course access, they'll show up here."
                }
              />
            </div>
          )}
        </div>
      </Card>
    </Stack>
  );
};

export default AccessRequests;

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    FileText,
    Trash2,
    ExternalLink,
    Search,
    Filter,
    Loader2,
    Calendar,
    Layers,
    User as UserIcon,
    CheckCircle2,
    XCircle,
    Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    Button,
    Card,
    Input,
    CardHeader,
    CardTitle,
    CardContent
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { EmptyState } from '../../components/feedback';
import receiptService, { type Receipt } from '../../services/receiptService';

const statusConfig = {
    pending: {
        label: 'Pending',
        variant: 'warning' as const,
        icon: Clock,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    approved: {
        label: 'Approved',
        variant: 'success' as const,
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    rejected: {
        label: 'Rejected',
        variant: 'danger' as const,
        icon: XCircle,
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    }
};

const Receipts = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const fetchReceipts = useCallback(async () => {
        try {
            setLoading(true);
            const res = await receiptService.getAllReceipts();
            if (res.success && Array.isArray(res.receipts)) {
                setReceipts(res.receipts);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch receipts');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReceipts();
    }, [fetchReceipts]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this receipt record? This will also remove the physical file.')) return;

        try {
            setIsDeletingId(id);
            const res = await receiptService.deleteReceipt(id);
            if (res.success) {
                toast.success('Receipt deleted successfully');
                setReceipts(prev => prev.filter(r => r.receipt_id !== id));
            } else {
                toast.error(res.message || 'Failed to delete receipt');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error occurred while deleting');
        } finally {
            setIsDeletingId(null);
        }
    };

    const filteredReceipts = useMemo(() => {
        let result = receipts;

        if (statusFilter !== 'all') {
            result = result.filter(r => r.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(r =>
                r.receipt_id.toString().includes(q) ||
                r.user_id.toString().includes(q) ||
                r.file_path.toLowerCase().includes(q)
            );
        }

        return result;
    }, [receipts, searchQuery, statusFilter]);

    const handlePreview = (filePath: string) => {
        const url = receiptService.getReceiptUrl({ file_path: filePath });
        window.open(url, '_blank');
    };

    return (
        <Stack gap="lg" className="pb-10 pt-4">
            <PageHeader
                title="Payment Receipts"
                description="Comprehensive log of all user-uploaded payment confirmation documents. Manage and audit physical storage here."
                actions={
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm transition-colors">
                            <FileText className="size-4 text-[var(--color-brand)]" aria-hidden />
                            {receipts.length} total records
                        </span>
                    </div>
                }
            />

            <Card padding="none" className="overflow-hidden border-slate-200/60 shadow-md">
                <div className="border-b border-slate-100 bg-slate-50/40 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search by ID, User ID..."
                            className="pl-10 h-11 bg-white border-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                        <Filter className="size-4 text-slate-400 mr-1" />
                        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === s
                                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5">
                    {loading ? (
                        <div className="py-24 flex flex-col justify-center items-center text-slate-400 gap-3">
                            <Loader2 className="size-8 animate-spin text-[var(--color-brand)]" />
                            <span className="text-sm font-medium">Loading receipt records...</span>
                        </div>
                    ) : filteredReceipts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredReceipts.map((receipt) => {
                                const config = statusConfig[receipt.status as keyof typeof statusConfig] || statusConfig.pending;
                                const StatusIcon = config.icon;

                                return (
                                    <Card key={receipt.receipt_id} padding="none" className="group overflow-hidden border-slate-200 hover:border-[var(--color-brand)]/40 hover:shadow-xl transition-all duration-300">
                                        <div className={`h-1.5 w-full bg-slate-100 ${config.bg.replace('/50', '/100')} flex`}>
                                            <div className={`h-full bg-current ${config.color}`} style={{ width: '100%' }} />
                                        </div>

                                        <CardHeader className="p-5 pb-3">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${config.bg} ${config.color} border border-current/10`}>
                                                    <StatusIcon className="size-3" />
                                                    {config.label}
                                                </div>
                                                <span className="text-[10px] font-mono font-black text-slate-400">#RC-{receipt.receipt_id}</span>
                                            </div>
                                            <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[var(--color-brand)] transition-colors cursor-pointer" onClick={() => handlePreview(receipt.file_path)}>
                                                {receipt.file_path}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="px-5 pb-5 pt-0 space-y-4">
                                            <div className="space-y-2.5">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <UserIcon className="size-3.5" />
                                                        <span className="font-semibold uppercase tracking-tight">User ID</span>
                                                    </div>
                                                    <span className="font-black text-slate-700">{receipt.user_id}</span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Layers className="size-3.5" />
                                                        <span className="font-semibold uppercase tracking-tight">Size</span>
                                                    </div>
                                                    <span className="font-bold text-slate-600">{receiptService.formatFileSize(receipt.file_size || 0)}</span>
                                                </div>

                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Calendar className="size-3.5" />
                                                        <span className="font-semibold uppercase tracking-tight">Uploaded</span>
                                                    </div>
                                                    <span className="font-bold text-slate-600">{new Date(receipt.upload_date).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100 flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-[10px] uppercase font-black tracking-widest h-9 rounded-lg border-slate-200"
                                                    onClick={() => handlePreview(receipt.file_path)}
                                                    leftIcon={<ExternalLink className="size-3.5" />}
                                                >
                                                    Preview
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="h-9 w-9 rounded-lg p-0"
                                                    isLoading={isDeletingId === receipt.receipt_id}
                                                    onClick={() => handleDelete(receipt.receipt_id)}
                                                    title="Delete Receipt"
                                                >
                                                    {!(isDeletingId === receipt.receipt_id) && <Trash2 className="size-4" />}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20">
                            <EmptyState
                                title={searchQuery || statusFilter !== 'all' ? "No matching records" : "No receipts found"}
                                description={
                                    searchQuery || statusFilter !== 'all'
                                        ? "Try adjusting your filters or search query to find what you're looking for."
                                        : "Records will appear here once users upload their payment documents."
                                }
                            />
                        </div>
                    )}
                </div>
            </Card>
        </Stack>
    );
};

export default Receipts;
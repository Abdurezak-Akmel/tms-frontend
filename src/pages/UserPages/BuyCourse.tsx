import { useParams, Link } from 'react-router-dom';
import {
    CreditCard,
    ShieldCheck,
    Zap,
    ArrowLeft,
    CheckCircle2,
    Lock,
    Upload,
    FileText,
    AlertCircle,
    Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { PageHeader, Stack } from '../../components/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Callout } from '../../components/feedback';
import { receiptService } from '../../services/receiptService';
import { accessRequestService } from '../../services/accessRequestService';

const BuyCourse = () => {
    const { id: courseId } = useParams<{ id: string }>();
    const [file, setFile] = useState<File | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [requestId, setRequestId] = useState<number | null>(null);
    const [requestStatus, setRequestStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

    // 1. On Mount: Check for existing requests for this course
    useEffect(() => {
        if (!courseId) return;

        const checkExistingRequest = async () => {
            try {
                const res = await accessRequestService.getUserAccessRequests();
                if (res.success && Array.isArray(res.data)) {
                    // Find if there's an existing request for this courseId
                    const existing = res.data.find(r => r.course_id === parseInt(courseId));
                    if (existing) {
                        setRequestId(existing.request_id);
                        setRequestStatus(existing.status);
                    }
                }
            } catch (err) {
                console.error('Failed to check existing access request:', err);
            }
        };

        checkExistingRequest();
    }, [courseId]);

    // 2. Poll for status updates if pending
    useEffect(() => {
        if (!requestId || requestStatus !== 'pending') return;

        const pollStatus = setInterval(async () => {
            try {
                const res = await accessRequestService.getAccessRequestById(requestId);
                if (res.success && res.data && !Array.isArray(res.data)) {
                    const latestStatus = res.data.status;
                    if (latestStatus !== requestStatus) {
                        setRequestStatus(latestStatus);
                    }
                }
            } catch (err) {
                console.error('Polling for access request status failed:', err);
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(pollStatus);
    }, [requestId, requestStatus]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
            setError(null);
        } else if (droppedFile) {
            setError('Please upload a valid PDF file.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload a PDF receipt.');
            return;
        }
        if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
            setError('Please enter a valid payment amount.');
            return;
        }
        if (!courseId) {
            setError('Course ID is missing.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // 1. Upload receipt
            const receiptRes = await receiptService.uploadReceipt(file);

            if (!receiptRes.success || !receiptRes.data) {
                throw new Error(receiptRes.message || 'Failed to upload receipt');
            }

            // 2. Create access request
            const accessRequestData = {
                course_id: parseInt(courseId),
                receipt_id: receiptRes.data.receipt_id,
                payment_amount: Number(paymentAmount)
            };

            const accessRes = await accessRequestService.createAccessRequest(accessRequestData);
            if (accessRes.success && accessRes.data && !Array.isArray(accessRes.data)) {
                setRequestId(accessRes.data.request_id);
                setRequestStatus('pending');
                setSuccess(true);
            } else {
                throw new Error(accessRes.message || 'Failed to create access request');
            }
        } catch (err: any) {
            console.error('Enrollment error:', err);
            setError(err.message || 'An error occurred during enrollment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormInactive = requestStatus === 'pending' || requestStatus === 'approved';

    return (
        <Stack gap="lg" className="pb-12 pt-4">
            <div>
                <Link
                    to={"/courses"}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:underline"
                >
                    <ArrowLeft className="size-4" aria-hidden />
                    Back to Course
                </Link>
                <PageHeader
                    title="Secure Enrollment"
                    description="You're just one step away from unlocking your full potential. Complete your enrollment to start learning."
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200/90 shadow-sm" padding="lg">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="size-5 text-[var(--color-brand)]" aria-hidden />
                                    <CardTitle>Enrollment Details</CardTitle>
                                </div>
                                <Badge variant="success">Safe & Secure</Badge>
                            </div>
                            <CardDescription>
                                Put your payment receipt below and let the admin review it. Once approved you get full access to the course.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-8">
                            {/* Features List */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    { icon: <Zap className="size-4" />, text: "Instant full access" },
                                    { icon: <ShieldCheck className="size-4" />, text: "Tutorial videos" },
                                    { icon: <CheckCircle2 className="size-4" />, text: "Downloadable files" },
                                    { icon: <Lock className="size-4" />, text: "Lifetime skills" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="p-1.5 rounded-lg bg-white text-[var(--color-brand)] shadow-sm">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Enrollment Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="payment_amount">Payment Amount</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium"></span>
                                        <Input
                                            id="payment_amount"
                                            type="number"
                                            placeholder="Enter amount paid (ETB)"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            className="pl-7"
                                            required
                                            disabled={success || isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Upload PDF Receipt</Label>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all ${isDragging
                                            ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10 scale-[1.01]"
                                            : "border-slate-200 bg-slate-50 hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5"
                                            } ${success ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => {
                                                const selectedFile = e.target.files?.[0];
                                                if (selectedFile && selectedFile.type === 'application/pdf') {
                                                    setFile(selectedFile);
                                                    setError(null);
                                                } else if (selectedFile) {
                                                    setError('Only PDF files are allowed.');
                                                }
                                            }}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={success || isSubmitting}
                                        />
                                        <div className="flex flex-col items-center gap-3 text-center">
                                            <div className={`p-3 rounded-xl bg-white shadow-sm transition-colors ${file ? 'text-[var(--color-brand)]' : 'text-slate-400'}`}>
                                                {file ? <FileText className="size-6" /> : <Upload className="size-6" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {file ? `${file.name} (${receiptService.formatFileSize(file.size)})` : (isDragging ? "Drop to upload" : "Click or drag to upload receipt")}
                                                </p>
                                                <p className="text-xs text-slate-500">Only PDF files are supported (max 1MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm font-medium">
                                        <AlertCircle className="size-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <Callout variant="success" title="Success!">
                                        Your enrollment request has been submitted. An administrator will review your receipt soon.
                                    </Callout>
                                )}

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-full shadow-lg shadow-indigo-500/20"
                                        isLoading={isSubmitting}
                                        disabled={isFormInactive}
                                    >
                                        {requestStatus === 'approved' ? 'Enrolled Successfully' :
                                            requestStatus === 'pending' ? 'Request is Pending' :
                                                'Submit Enrollment Request'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-center gap-6 text-slate-400">
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                            <CheckCircle2 className="size-4" />
                            24/7 Availability
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-slate-200/90 shadow-sm bg-slate-50/50" padding="md">
                        <CardHeader>
                            <CardTitle className="text-base">Need help?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Facing issues with enrollment or have questions about the curriculum? Our support is here to guide you.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full bg-white"
                                onClick={() => window.location.href = "mailto:support@tms.com?subject=Enrollment%20Support%20Request"}
                            >
                                Contact Instructor
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Request Status Info - Bottom Right */}
            {requestStatus && (
                <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Card className="min-w-[240px] border-slate-200/90 shadow-xl ring-1 ring-black/5" padding="md">
                        <div className="flex items-center gap-4">
                            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${requestStatus === 'pending' ? 'bg-amber-100 text-amber-600' :
                                requestStatus === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-rose-100 text-rose-600'
                                }`}>
                                {requestStatus === 'pending' ? <Clock className="size-5" /> :
                                    requestStatus === 'approved' ? <CheckCircle2 className="size-5" /> :
                                        <AlertCircle className="size-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Request status</p>
                                <p className={`text-sm font-bold ${requestStatus === 'pending' ? 'text-amber-700' :
                                    requestStatus === 'approved' ? 'text-emerald-700' :
                                        'text-rose-700'
                                    }`}>
                                    {requestStatus === 'pending' ? 'Pending Review' :
                                        requestStatus === 'approved' ? 'Request Approved' :
                                            'Request Rejected'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </Stack>
    );
};

export default BuyCourse;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Shield,
    User as UserIcon,
    Mail,
    Smartphone,
    CalendarDays,
    ShieldCheck,
    Activity,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    Settings,
    BookOpen,
    Trash2,
    Check,
    X
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Input,
    Label,
    Separator,
    Badge,
    type BadgeVariant
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { userService, type User, type UpdateUserData } from '../../services/userService';
import { roleService, type Role } from '../../services/roleService';
import accessRequestService, { type AccessRequest } from '../../services/accessRequestService';

const UserUpdate = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [userRequests, setUserRequests] = useState<AccessRequest[]>([]);
    const [updatingRequestId, setUpdatingRequestId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        role_id: 1,
        status: 'active'
    });

    const fetchData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const [userRes, rolesRes, requestsRes] = await Promise.all([
                userService.getUserById(Number(id)),
                roleService.getAllRoles(),
                accessRequestService.getAllAccessRequests({ user_id: Number(id) })
            ]);

            if (userRes.success && userRes.user) {
                setUser(userRes.user);
                setFormData({
                    role_id: userRes.user.role_id,
                    status: (userRes.user.status || 'active').toLowerCase()
                });
            }

            if (rolesRes.success && rolesRes.roles) {
                setRoles(rolesRes.roles);
            }

            if (requestsRes.success && Array.isArray(requestsRes.data)) {
                setUserRequests(requestsRes.data);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch required data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            const updateData: UpdateUserData = {
                role_id: Number(formData.role_id),
                status: formData.status
            };

            const response = await userService.updateUser(Number(id), updateData);

            if (response.success) {
                setSuccess(true);
                // Update local user state as well
                if (user) {
                    setUser({
                        ...user,
                        role_id: updateData.role_id as number,
                        status: updateData.status as string
                    });
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateEnrollmentStatus = async (requestId: number, newStatus: 'approved' | 'rejected') => {
        try {
            setUpdatingRequestId(requestId);
            const res = await accessRequestService.updateAccessRequestStatus(requestId, { status: newStatus });
            if (res.success) {
                setUserRequests(prev => prev.map(req => req.request_id === requestId ? { ...req, status: newStatus } : req));
            }
        } catch (err: any) {
            console.error("Failed to update enrollment status:", err);
        } finally {
            setUpdatingRequestId(null);
        }
    };

    const handleDeleteEnrollment = async (requestId: number) => {
        if (!window.confirm("Remove this course enrollment entirely?")) return;
        try {
            setUpdatingRequestId(requestId);
            const res = await accessRequestService.deleteAccessRequest(requestId);
            if (res.success) {
                setUserRequests(prev => prev.filter(req => req.request_id !== requestId));
            }
        } catch (err: any) {
            console.error("Failed to delete enrollment:", err);
        } finally {
            setUpdatingRequestId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="size-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Loading user profile...</p>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="py-20 flex flex-col items-center justify-center mx-4">
                <div className="size-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mb-6 shadow-sm border border-rose-100">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Error Encountered</h3>
                <p className="text-slate-500 mb-8 text-center max-w-md">{error}</p>
                <Button variant="outline" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/users')}>
                    Return to User List
                </Button>
            </div>
        );
    }

    const getStatusBadgeVariant = (status: string): BadgeVariant => {
        switch (status.toLowerCase()) {
            case 'active': return 'success';
            case 'inactive': return 'warning';
            case 'suspended': return 'danger';
            case 'pending': return 'warning';
            default: return 'outline';
        }
    };

    return (
        <Stack gap="lg" className="pb-10 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-10 w-10 p-0"
                    onClick={() => navigate('/admin/users')}
                    title="Back to Users"
                >
                    <ArrowLeft size={20} />
                </Button>
                <PageHeader
                    title="Configure System Access"
                    description={`Modification for user: ${user?.name || 'Loading...'}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Snapshot (Read Only) */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-200/60 overflow-hidden shadow-sm">
                        <CardHeader className="bg-slate-50/50 pb-6 border-b border-slate-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="size-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary mb-4 border border-slate-100 ring-4 ring-primary/5">
                                    <UserIcon size={40} />
                                </div>
                                <CardTitle className="text-xl font-extrabold text-slate-900">{user?.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1.5 mt-1">
                                    <Mail size={14} className="text-slate-400" />
                                    {user?.email}
                                </CardDescription>
                                <div className="flex items-center gap-2 mt-4">
                                    <Badge variant={getStatusBadgeVariant(user?.status || '')} className="font-bold text-[10px] uppercase px-2 py-0.5">
                                        {user?.status}
                                    </Badge>
                                    <Badge variant={user?.role_id === 3 ? 'success' : (user?.role_id === 2 ? 'default' : 'outline')} className="font-bold text-[10px] uppercase px-2 py-0.5">
                                        Role ID: {user?.role_id}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Account Intel</Label>

                                <div className="flex items-center justify-between text-sm py-2">
                                    <div className="flex items-center gap-2.5 text-slate-500 font-medium">
                                        <ShieldCheck size={16} className="text-slate-300" />
                                        Verification
                                    </div>
                                    <div className="flex items-center gap-1.5 font-bold">
                                        {user?.email_verified ? (
                                            <span className="text-emerald-600 flex items-center gap-1">
                                                <CheckCircle2 size={14} /> Verified
                                            </span>
                                        ) : (
                                            <span className="text-rose-500 flex items-center gap-1">
                                                <XCircle size={14} /> Unverified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm py-2">
                                    <div className="flex items-center gap-2.5 text-slate-500 font-medium">
                                        <Smartphone size={16} className="text-slate-300" />
                                        Device
                                    </div>
                                    <span className="font-bold text-slate-900 max-w-[120px] truncate" title={user?.registration_device || 'N/A'}>
                                        {user?.registration_device || 'Unknown'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm py-2">
                                    <div className="flex items-center gap-2.5 text-slate-500 font-medium">
                                        <CalendarDays size={16} className="text-slate-300" />
                                        Registration
                                    </div>
                                    <span className="font-bold text-slate-900">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {success && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="size-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-emerald-900">Permissions Synced</p>
                                <p className="text-xs text-emerald-600 font-medium">User profile has been successfully updated in the database.</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 shadow-sm">
                            <div className="size-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                                <AlertCircle size={18} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-rose-900">Sync Failure</p>
                                <p className="text-xs text-rose-600 font-medium">{error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Configuration Form (Editable) */}
                <div className="lg:col-span-2">
                    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/20 bg-white">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-primary/5 text-primary border border-primary/10">
                                    <Settings size={22} className="animate-pulse" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-bold">Policy Configuration</CardTitle>
                                    <CardDescription>Adjust security clearance and operational status for this account.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Read Only Fields Display */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-500 font-semibold mb-1.5 flex items-center gap-2">
                                            <UserIcon size={14} className="text-slate-300" /> Display Name
                                        </Label>
                                        <Input value={user?.name || ''} readOnly className="bg-slate-50/70 border-slate-100 text-slate-400 font-medium cursor-not-allowed" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-500 font-semibold mb-1.5 flex items-center gap-2">
                                            <Mail size={14} className="text-slate-300" /> Primary Email
                                        </Label>
                                        <Input value={user?.email || ''} readOnly className="bg-slate-50/70 border-slate-100 text-slate-400 font-medium cursor-not-allowed" />
                                    </div>

                                    {/* Editable Fields */}
                                    <div className="space-y-2.5">
                                        <Label htmlFor="role_id" className="text-slate-900 font-bold mb-1.5 flex items-center gap-2">
                                            <Shield size={16} className="text-primary" /> Authority Level (Role ID)
                                        </Label>
                                        <div className="relative group">
                                            <select
                                                id="role_id"
                                                value={formData.role_id}
                                                onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                                                className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.role_id} value={role.role_id}>
                                                        {role.role_id} - {role.role_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <Settings className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium px-1">Defines system permissions and frontend dashboard visibility thresholds.</p>
                                    </div>

                                    <div className="space-y-2.5">
                                        <Label htmlFor="status" className="text-slate-900 font-bold mb-1.5 flex items-center gap-2">
                                            <Activity size={16} className="text-primary" /> Operational Status
                                        </Label>
                                        <div className="relative group">
                                            <select
                                                id="status"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer capitalize"
                                            >
                                                <option value="active">Active</option>
                                                <option value="suspended">Suspended </option>
                                            </select>
                                            <Activity className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium px-1">Standard lifecycle states. Suspended users cannot perform write operations.</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                            <Label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Registration Unit</Label>
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <Smartphone size={14} className="text-slate-400" />
                                                {user?.registration_device || 'N/A'}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                            <Label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Email Status</Label>
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <CheckCircle2 size={14} className={user?.email_verified ? "text-emerald-500" : "text-rose-400"} />
                                                {user?.email_verified ? 'Verified Pipeline' : 'Legacy/Unverified'}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                            <Label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Persistence</Label>
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <Clock size={14} className="text-slate-400" />
                                                Active since {user?.created_at ? new Date(user.created_at).getFullYear() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100" />

                                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => navigate('/admin/users')}
                                            className="w-full sm:w-auto text-slate-500 font-bold px-8 hover:bg-slate-100 transition-colors"
                                        >
                                            Discard Changes
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={saving}
                                            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-950 text-white font-bold px-10 h-12 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                    Synchronizing...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Commit Policy Updates
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    
                    {/* Course Access Overrides Section */}
                    {user && (
                        <Card className="mt-8 border-slate-200/60 shadow-lg border-t-4 border-t-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="p-1 px-2 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Overrides</div>
                                        <CardTitle className="text-lg font-bold">Course Access Overrides</CardTitle>
                                    </div>
                                    <CardDescription>Individual enrollment records that bypass role-based restrictions.</CardDescription>
                                </div>
                                <BookOpen className="size-5 text-slate-300" />
                            </CardHeader>
                            <CardContent className="p-0">
                                {userRequests.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 border-b border-slate-100 dark:border-slate-800">
                                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-6">Course</th>
                                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-4">Price</th>
                                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 px-4">Status</th>
                                                    <th className="text-[10px] font-black uppercase tracking-widest text-slate-500 py-4 text-right px-6">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {userRequests.map((req) => (
                                                    <tr key={req.request_id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                                                        <td className="py-4 px-6">
                                                            <div className="font-bold text-slate-700 dark:text-slate-200">{req.course_title}</div>
                                                            <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">ID: {req.course_id} • Requested: {new Date(req.requested_at).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="font-black text-slate-900 dark:text-slate-100">{req.payment_amount}</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <Badge 
                                                                variant={req.status === 'approved' ? 'success' : (req.status === 'rejected' ? 'danger' : 'warning')}
                                                                className="uppercase text-[9px] font-black px-2 py-0.5"
                                                            >
                                                                {req.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-4 text-right px-6">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                {req.status !== 'approved' && (
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="outline" 
                                                                        className="size-8 p-0 rounded-lg text-emerald-600 hover:bg-emerald-50 border-emerald-100 dark:border-emerald-900/30 group/btn"
                                                                        onClick={() => handleUpdateEnrollmentStatus(req.request_id, 'approved')}
                                                                        isLoading={updatingRequestId === req.request_id}
                                                                        title="Approve Access"
                                                                    >
                                                                        <Check size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                                    </Button>
                                                                )}
                                                                {req.status !== 'rejected' && (
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="outline" 
                                                                        className="size-8 p-0 rounded-lg text-rose-600 hover:bg-rose-50 border-rose-100 dark:border-rose-900/30 group/btn"
                                                                        onClick={() => handleUpdateEnrollmentStatus(req.request_id, 'rejected')}
                                                                        isLoading={updatingRequestId === req.request_id}
                                                                        title="Reject Access"
                                                                    >
                                                                        <X size={14} className="group-hover/btn:scale-110 transition-transform" />
                                                                    </Button>
                                                                )}
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="ghost" 
                                                                    className="size-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 group/btn"
                                                                    onClick={() => handleDeleteEnrollment(req.request_id)}
                                                                    isLoading={updatingRequestId === req.request_id}
                                                                    title="Delete Entry"
                                                                >
                                                                    <Trash2 size={14} className="group-hover/btn:rotate-12 transition-transform" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-slate-400 italic text-sm">
                                        No manual course overrides found for this user.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </Stack>
    );
};

export default UserUpdate;

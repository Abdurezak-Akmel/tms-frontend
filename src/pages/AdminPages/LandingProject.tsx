import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    BookOpen,
    Save,
    AlertCircle,
    ArrowLeft,
    Type,
    FileText,
    Layers,
    TrendingUp
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Input
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { projectService } from '../../services/projectService';

const LandingProject = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'beginner'
    });

    useEffect(() => {
        if (editId) {
            const fetchProject = async () => {
                try {
                    setFetching(true);
                    const response = await projectService.getProjectById(Number(editId));
                    if (response.success && response.project) {
                        const p = response.project;
                        setFormData({
                            title: p.title || '',
                            description: p.description || '',
                            category: p.category || '',
                            level: p.level || 'beginner'
                        });
                    }
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch project details');
                } finally {
                    setFetching(false);
                }
            };
            fetchProject();
        }
    }, [editId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Project title is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (editId) {
                await projectService.updateProject(Number(editId), formData);
            } else {
                await projectService.createProject(formData);
            }

            navigate('/admin-dashboard');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <Stack gap="lg" className="pb-20 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin-dashboard')}
                    className="rounded-full size-8 p-0"
                >
                    <ArrowLeft size={18} />
                </Button>
                <PageHeader
                    title={editId ? "Update Project" : "Add Project"}
                    description="Manage the project showcase that appears on the public landing page."
                />
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-slate-200/60 shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">Project Information</h3>
                                <p className="text-xs text-slate-500 font-medium">Define this showcase piece for prospective learners</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Type size={14} className="text-slate-400" />
                                Project Title
                            </label>
                            <Input
                                name="title"
                                placeholder="e.g. Full-stack Dashboard"
                                value={formData.title}
                                onChange={handleChange}
                                className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <FileText size={14} className="text-slate-400" />
                                Description / Summary
                            </label>
                            <textarea
                                name="description"
                                rows={4}
                                placeholder="What will they build? Mention core technologies and outcomes..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Layers size={14} className="text-slate-400" />
                                    Category
                                </label>
                                <Input
                                    name="category"
                                    placeholder="e.g. Portfolio"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <TrendingUp size={14} className="text-slate-400" />
                                    Difficulty Level
                                </label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate('/admin-dashboard')}
                        disabled={loading}
                        className="text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || !formData.title.trim()}
                        className="min-w-[160px] shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] rounded-xl"
                        leftIcon={loading ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    >
                        {loading ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Project' : 'Create Project')}
                    </Button>
                </div>
            </form>
        </Stack>
    );
};

export default LandingProject;
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Video,
    Save,
    AlertCircle,
    ArrowLeft,
    Type,
    FileText,
    Link,
    Hash,
    Clock
} from 'lucide-react';
import {
    Button,
    Card,
    CardContent,
    Input
} from '../../components/ui';
import { PageHeader, Stack } from '../../components/layout';
import { landingVideoService } from '../../services/landingVideoService';

const LandingVideo = () => {
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
        youtube_url: '',
        order_index: 0,
        duration: 0
    });

    useEffect(() => {
        if (editId) {
            const fetchVideo = async () => {
                try {
                    setFetching(true);
                    const response = await landingVideoService.getLandingVideoById(Number(editId));
                    if (response.success && response.video) {
                        const v = response.video;
                        setFormData({
                            title: v.title || '',
                            description: v.description || '',
                            youtube_url: v.youtube_url,
                            order_index: v.order_index,
                            duration: v.duration || 0
                        });
                    }
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch video details');
                } finally {
                    setFetching(false);
                }
            };
            fetchVideo();
        }
    }, [editId]);

    // Auto-fetch YouTube title
    useEffect(() => {
        const fetchYouTubeTitle = async () => {
            const url = formData.youtube_url;
            // Basic validation for YouTube URL
            if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) return;

            try {
                const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
                if (response.ok) {
                    const data = await response.json();
                    // Only auto-fill if the title field is currently empty
                    if (data.title && !formData.title) {
                        setFormData(prev => ({ ...prev, title: data.title }));
                    }
                }
            } catch (err) {
                // Silently fail for title fetching as it's a convenience feature
                console.error('Failed to auto-fetch YouTube title:', err);
            }
        };

        const debounceTimer = setTimeout(fetchYouTubeTitle, 800);
        return () => clearTimeout(debounceTimer);
    }, [formData.youtube_url, formData.title]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'order_index' || name === 'duration' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.youtube_url) {
            setError('YouTube URL is required');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (editId) {
                await landingVideoService.updateLandingVideo(Number(editId), formData);
            } else {
                await landingVideoService.createLandingVideo(formData);
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
                    title={editId ? "Update Landing Video" : "Add Landing Video"}
                    description="Manage how your video content appears on the public landing page."
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
                            <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Video size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">Video Content</h3>
                                <p className="text-xs text-slate-500 font-medium">Provide the details for the public preview</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Type size={14} className="text-slate-400" />
                                Title
                            </label>
                            <Input
                                name="title"
                                placeholder="e.g. Platform Walkthrough"
                                value={formData.title}
                                onChange={handleChange}
                                className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <FileText size={14} className="text-slate-400" />
                                Description
                            </label>
                            <textarea
                                name="description"
                                rows={3}
                                placeholder="Briefly describe what this video covers..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Link size={14} className="text-slate-400" />
                                YouTube URL
                            </label>
                            <Input
                                name="youtube_url"
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={formData.youtube_url}
                                onChange={handleChange}
                                className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                required
                            />
                            <p className="text-[11px] text-slate-400 font-medium italic">Make sure the video is public or unlisted</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Hash size={14} className="text-slate-400" />
                                    Order Index
                                </label>
                                <Input
                                    name="order_index"
                                    type="number"
                                    value={formData.order_index}
                                    onChange={handleChange}
                                    className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Clock size={14} className="text-slate-400" />
                                    Duration (optional)
                                </label>
                                <Input
                                    name="duration"
                                    type="number"
                                    placeholder="Minutes"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl"
                                />
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
                        disabled={loading || !formData.youtube_url}
                        className="min-w-[160px] shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] rounded-xl"
                        leftIcon={loading ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    >
                        {loading ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Video' : 'Create Video')}
                    </Button>
                </div>
            </form>
        </Stack>
    );
};

export default LandingVideo;
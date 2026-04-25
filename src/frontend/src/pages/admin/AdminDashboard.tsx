import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Image as ImageIcon, BookOpen, Megaphone, LogOut, Menu, X, Activity, Loader2, Plus, Upload, MessageSquare } from 'lucide-react';
import GalleryManager from './GalleryManager';
import CourseManager from './CourseManager';
import AnnouncementManager from './AnnouncementManager';

export function DashboardHome() {
    const [stats, setStats] = useState({ gallery: 0, courses: 0, announcements: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [gal, crs, ann] = await Promise.all([
                supabase.from('gallery').select('*', { count: 'exact', head: true }),
                supabase.from('courses').select('*', { count: 'exact', head: true }),
                supabase.from('announcements').select('*', { count: 'exact', head: true })
            ]);
            setStats({
                gallery: gal.count || 0,
                courses: crs.count || 0,
                announcements: ann.count || 0
            });
            setLoading(false);
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Registered Courses', value: stats.courses, icon: BookOpen },
        { title: 'Gallery Assets', value: stats.gallery, icon: ImageIcon },
        { title: 'Active Announcements', value: stats.announcements, icon: Megaphone }
    ];

    if (loading) return <div className="text-muted-foreground p-8 flex gap-3 items-center font-inter text-sm"><Loader2 className="w-5 h-5 animate-spin" /> Fetching latest analytics...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-10 border-b border-border pb-6">
                <h1 className="text-2xl font-poppins font-semibold text-foreground tracking-tight">Overview Dashboard</h1>
                <p className="text-sm text-muted-foreground font-inter mt-1">System intelligence and content management hub</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                {cards.map(c => (
                    <div key={c.title} className="bg-white p-6 rounded-lg border border-border shadow-sm flex justify-between items-center bg-gradient-to-br from-white to-gray-50/50">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{c.title}</p>
                            <h3 className="text-4xl font-inter font-bold text-foreground">{c.value}</h3>
                        </div>
                        <div className="p-4 bg-white rounded-md shadow-sm border border-border/50 text-foreground">
                            <c.icon className="w-6 h-6" strokeWidth={1.5} />
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Management Shortcuts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Link to="/admin/dashboard/courses" className="bg-white border border-border p-5 rounded-lg shadow-sm hover:border-foreground/30 hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-md bg-gray-50 border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold font-inter text-sm text-foreground transition-colors">New Course</h4>
                        <p className="text-xs text-muted-foreground mt-1">Publish a study program</p>
                    </div>
                </Link>
                <Link to="/admin/dashboard/gallery" className="bg-white border border-border p-5 rounded-lg shadow-sm hover:border-foreground/30 hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-md bg-gray-50 border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <Upload className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold font-inter text-sm text-foreground transition-colors">Upload Assets</h4>
                        <p className="text-xs text-muted-foreground mt-1">Add photos to gallery</p>
                    </div>
                </Link>
                <Link to="/admin/dashboard/announcements" className="bg-white border border-border p-5 rounded-lg shadow-sm hover:border-foreground/30 hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-md bg-gray-50 border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold font-inter text-sm text-foreground transition-colors">Push Notice</h4>
                        <p className="text-xs text-muted-foreground mt-1">Broadcast announcement</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/admin/login');
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('is_admin')
                .eq('id', session.user.id)
                .single();

            if (error || !data?.is_admin) {
                await supabase.auth.signOut();
                navigate('/admin/login');
            } else {
                setLoading(false);
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT' || !session) {
                    navigate('/admin/login');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Authenticating...</div>;
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Gallery', path: '/admin/dashboard/gallery', icon: ImageIcon },
        { name: 'Courses', path: '/admin/dashboard/courses', icon: BookOpen },
        { name: 'Announcements', path: '/admin/dashboard/announcements', icon: Megaphone },
    ];

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-gray-50/50 md:flex-row flex-col">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-border z-20 sticky top-0">
                <h2 className="text-lg font-poppins font-bold text-foreground flex items-center gap-2">
                    <div className="w-6 h-6 bg-foreground text-background flex items-center justify-center rounded uppercase text-[10px] tracking-tighter">ST</div>
                    Admin panel
                </h2>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
                    {sidebarOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div onClick={closeSidebar} className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30" />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative inset-y-0 left-0 w-64 bg-white border-r border-border flex flex-col z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="hidden md:flex flex-col p-6 border-b border-border">
                    <h2 className="text-xl font-poppins font-bold text-foreground flex items-center gap-3">
                        <div className="w-8 h-8 font-poppins font-black bg-foreground text-background flex items-center justify-center rounded-md uppercase text-xs tracking-tighter">ST</div>
                        Admin panel
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={closeSidebar}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-inter text-sm font-medium ${isActive
                                    ? 'bg-gray-100 text-foreground border border-border/50'
                                    : 'text-muted-foreground hover:bg-gray-50 hover:text-foreground border border-transparent'
                                    }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-border">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-inter text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto h-screen md:h-auto pb-20">
                <div className="p-6 md:p-10 mx-auto max-w-7xl">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="gallery" element={<GalleryManager />} />
                        <Route path="courses" element={<CourseManager />} />
                        <Route path="announcements" element={<AnnouncementManager />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

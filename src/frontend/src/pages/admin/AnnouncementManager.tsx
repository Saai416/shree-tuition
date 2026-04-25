import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit, Plus, Loader2, X } from 'lucide-react';

export default function AnnouncementManager() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (data) setAnnouncements(data);
        setLoading(false);
    };

    const resetForm = () => {
        setTitle('');
        setMessage('');
        setIsEditing(null);
        setIsOpen(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { title, message };

        if (isEditing) {
            await supabase.from('announcements').update(payload).eq('id', isEditing);
        } else {
            await supabase.from('announcements').insert([payload]);
        }

        resetForm();
        fetchAnnouncements();
    };

    const handleEdit = (item: any) => {
        setIsEditing(item.id);
        setTitle(item.title);
        setMessage(item.message);
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;
        await supabase.from('announcements').delete().eq('id', id);
        fetchAnnouncements();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-poppins font-bold text-foreground">Announcements Management</h2>
                    <p className="text-muted-foreground font-inter">Manage announcements shown dynamically on the website.</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="gradient-primary text-white font-semibold py-2 px-4 rounded-lg shadow-subtle hover:shadow-elevated transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Announcement
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-poppins">{isEditing ? 'Edit Announcement' : 'Add Announcement'}</h3>
                            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4 font-inter text-sm flex flex-col">
                            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement Title" className="px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                            <textarea required value={message} onChange={e => setMessage(e.target.value)} placeholder="Announcement Message" rows={4} className="px-4 py-2 border rounded-lg outline-none focus:border-primary resize-none" />
                            <button type="submit" className="w-full gradient-primary text-white py-2.5 rounded-lg font-bold">Save Announcement</button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(item => (
                        <div key={item.id} className="bg-white border text-left p-5 rounded-xl shadow-subtle flex justify-between items-center group">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-poppins font-bold text-lg text-foreground">{item.title}</h3>
                                    <span className="text-xs text-muted-foreground font-medium">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-muted-foreground font-inter text-sm">{item.message}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-foreground transition-colors"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && <div className="text-center py-10 text-muted-foreground">No announcements found. Add one now!</div>}
                </div>
            )}
        </div>
    );
}

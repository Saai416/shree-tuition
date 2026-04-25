import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Edit, Plus, Loader2, X, Upload } from 'lucide-react';

export default function CourseManager() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (data) setCourses(data);
        setLoading(false);
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setTag('');
        setImageUrl('');
        setImageFile(null);
        setUploading(false);
        setIsEditing(null);
        setIsOpen(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        let finalImageUrl = imageUrl;

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `courses/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('gallery').upload(fileName, imageFile);
            if (!uploadError) {
                const { data } = supabase.storage.from('gallery').getPublicUrl(fileName);
                finalImageUrl = data.publicUrl;
            } else {
                alert('Image upload failed!');
                setUploading(false);
                return;
            }
        }

        const payload = { title, description, tag, image_url: finalImageUrl };

        if (isEditing) {
            await supabase.from('courses').update(payload).eq('id', isEditing);
        } else {
            await supabase.from('courses').insert([payload]);
        }

        resetForm();
        fetchCourses();
    };

    const handleEdit = (course: any) => {
        setIsEditing(course.id);
        setTitle(course.title);
        setDescription(course.description);
        setTag(course.tag || '');
        setImageUrl(course.image_url || '');
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        await supabase.from('courses').delete().eq('id', id);
        fetchCourses();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-poppins font-bold text-foreground">Course Management</h2>
                    <p className="text-muted-foreground font-inter">Add and manage courses shown on the website.</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="gradient-primary text-white font-semibold py-2 px-4 rounded-lg shadow-subtle hover:shadow-elevated transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Course
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl border border-border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold font-poppins">{isEditing ? 'Edit Course' : 'Add Course'}</h3>
                            <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4 font-inter text-sm flex flex-col">
                            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Course Title" className="px-4 py-2 border rounded-lg outline-none focus:border-primary" />
                            <input required value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag (e.g. Board Exams Focus)" className="px-4 py-2 border rounded-lg outline-none focus:border-primary" />

                            <div className="flex flex-col gap-2">
                                <label className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-border text-center py-4 rounded-lg font-semibold transition-colors flex flex-col items-center justify-center text-muted-foreground gap-1">
                                    <Upload className="w-5 h-5 mb-1" />
                                    {imageFile ? imageFile.name : (imageUrl ? 'Change Course Image' : 'Click to Upload Course Image')}
                                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }} />
                                </label>
                                {imageUrl && !imageFile && <div className="text-xs text-primary font-medium text-center">Currently using an existing image.</div>}
                            </div>

                            <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Course Description" rows={3} className="px-4 py-2 border rounded-lg outline-none focus:border-primary resize-none" />
                            <button type="submit" disabled={uploading} className="w-full gradient-primary text-white py-2.5 rounded-lg font-bold flex justify-center items-center gap-2">
                                {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                {uploading ? 'Uploading & Saving...' : 'Save Course'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white border rounded-xl overflow-hidden shadow-subtle flex flex-col items-start p-4">
                            {course.image_url && <img src={course.image_url} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-4" />}
                            <div className="mb-2">
                                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md">{course.tag}</span>
                            </div>
                            <h3 className="font-poppins font-bold text-foreground mb-1">{course.title}</h3>
                            <p className="text-sm font-inter text-muted-foreground mb-4 line-clamp-2 flex-grow">{course.description}</p>

                            <div className="flex gap-2 w-full pt-4 border-t border-border">
                                <button onClick={() => handleEdit(course)} className="flex-1 flex justify-center items-center gap-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-semibold transition-colors text-foreground"><Edit className="w-4 h-4" /> Edit</button>
                                <button onClick={() => handleDelete(course.id)} className="flex-1 flex justify-center items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-sm font-semibold transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && <div className="col-span-full py-10 text-muted-foreground text-center">No courses found. Add a new one to show on public site!</div>}
                </div>
            )}
        </div>
    );
}

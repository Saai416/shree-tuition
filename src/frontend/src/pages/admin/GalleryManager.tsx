import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Upload, Loader2 } from 'lucide-react';

export default function GalleryManager() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (data) setImages(data);
        setLoading(false);
    };

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const files = Array.from(e.target.files);
            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `public/${fileName}`;

                let { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);

                const { error: dbError } = await supabase.from('gallery').insert([{ image_url: data.publicUrl }]);
                if (dbError) throw dbError;
            });

            await Promise.all(uploadPromises);

            fetchImages();
            e.target.value = '';
        } catch (error) {
            alert('Error uploading images!');
            console.log(error);
        } finally {
            setUploading(false);
        }
    };

    const deleteImage = async (id: string, url: string) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        try {
            await supabase.from('gallery').delete().eq('id', id);
            const filePath = url.split('/gallery/').pop();
            if (filePath) await supabase.storage.from('gallery').remove([filePath]);
            fetchImages();
        } catch (error) {
            alert('Error deleting image!');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-poppins font-bold text-foreground">Gallery Management</h2>
                    <p className="text-muted-foreground font-inter">Manage images displayed in your public gallery.</p>
                </div>
                <div>
                    <label className="cursor-pointer gradient-primary text-white font-semibold py-2 px-4 rounded-lg shadow-subtle hover:shadow-elevated transition-all flex items-center gap-2">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Upload Images'}
                        <input type="file" multiple accept="image/*" className="hidden" disabled={uploading} onChange={uploadImage} />
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map(img => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-subtle border border-border">
                            <img src={img.image_url} alt="Gallery item" className="w-full h-40 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => deleteImage(img.id, img.image_url)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-fulltext-center py-10 text-muted-foreground">No images found. Upload one to get started!</div>
                    )}
                </div>
            )}
        </div>
    );
}

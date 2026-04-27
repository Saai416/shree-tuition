import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Upload, Loader2 } from 'lucide-react';

export default function GalleryManager() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [bannerUrl, setBannerUrl] = useState<string>('');
    const [updatingBanner, setUpdatingBanner] = useState(false);

    useEffect(() => {
        fetchImages();
        fetchBanner();
    }, []);

    const fetchBanner = async () => {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'hero_banner_url')
            .single();
        if (data) setBannerUrl(data.value);
    };

    const fetchImages = async () => {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (data) setImages(data);
        setLoading(false);
    };

    const updateBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUpdatingBanner(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `banner-${Math.random()}.${fileExt}`;
            const filePath = `public/${fileName}`;

            let { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
            const newBannerUrl = data.publicUrl;

            const { error: dbError } = await supabase
                .from('site_settings')
                .upsert({ key: 'hero_banner_url', value: newBannerUrl, updated_at: new Date().toISOString() });

            if (dbError) throw dbError;

            setBannerUrl(newBannerUrl);
            alert('Banner updated successfully!');
            e.target.value = '';
        } catch (error) {
            alert('Error updating banner!');
            console.log(error);
        } finally {
            setUpdatingBanner(false);
        }
    };

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // ... (rest of the code)
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
            {/* Hero Banner Section */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-subtle mb-10">
                <div className="gradient-primary px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-poppins font-bold text-lg">Hero Section Banner</h3>
                        <p className="text-white/70 text-sm font-inter">This image appears at the top of your homepage.</p>
                    </div>
                    <label className="cursor-pointer bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2">
                        {updatingBanner ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {updatingBanner ? 'Updating...' : 'Change Banner'}
                        <input type="file" accept="image/*" className="hidden" disabled={updatingBanner} onChange={updateBanner} />
                    </label>
                </div>
                <div className="p-4 bg-gray-50 flex justify-center">
                    {bannerUrl ? (
                        <div className="relative w-full max-w-4xl h-48 rounded-xl overflow-hidden shadow-inner border border-border">
                            <img src={bannerUrl} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10 flex items-end p-4">
                                <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded">Live Preview</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-48 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted-foreground font-inter">
                            No custom banner set. Using default image.
                        </div>
                    )}
                </div>
            </div>

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

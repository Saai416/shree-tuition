import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { GraduationCap } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                supabase.from('users').select('is_admin').eq('id', session.user.id).single().then(({ data }) => {
                    if (data?.is_admin) navigate('/admin/dashboard');
                });
            }
        });
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData.session) {
            // Verify admin status
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('is_admin')
                .eq('id', authData.session.user.id)
                .single();

            if (userError || !userData?.is_admin) {
                await supabase.auth.signOut();
                setError('You do not have administrative access. Access Denied.');
                setLoading(false);
                return;
            }
            navigate('/admin/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-elevated border border-border mx-4">
                <div className="flex justify-center mb-1">
                    <img src="/logo.png" alt="Shree Tuition Logo" className="w-24 h-24 rounded-full border border-border p-1 bg-white shadow-sm object-cover" />
                </div>
                <h2 className="text-center text-2xl font-poppins font-bold text-foreground mb-6">Admin Login</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 font-inter text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5 font-inter">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5 font-inter">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-poppins font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}

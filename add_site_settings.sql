-- Create site_settings table to store site-wide configurations
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.site_settings;
CREATE POLICY "Enable read access for all users" ON public.site_settings FOR SELECT USING (true);

-- Allow admins to manage settings
DROP POLICY IF EXISTS "Enable all for admin users" ON public.site_settings;
CREATE POLICY "Enable all for admin users" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
);

-- Note: To set the initial banner, you can run:
-- INSERT INTO public.site_settings (key, value) VALUES ('hero_banner_url', '/gallery/banner.png') ON CONFLICT (key) DO NOTHING;

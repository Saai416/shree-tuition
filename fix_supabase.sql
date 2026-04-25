-- Fix infinite recursion by using a SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop old policies to fix the error
DROP POLICY IF EXISTS "Enable all for admin users" ON public.courses;
CREATE POLICY "Enable all for admin users" ON public.courses FOR ALL USING (
  is_admin()
);

DROP POLICY IF EXISTS "Enable all for admin users" ON public.announcements;
CREATE POLICY "Enable all for admin users" ON public.announcements FOR ALL USING (
  is_admin()
);

DROP POLICY IF EXISTS "Enable all for admin users" ON public.gallery;
CREATE POLICY "Enable all for admin users" ON public.gallery FOR ALL USING (
  is_admin()
);

DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users FOR SELECT USING (
  is_admin()
);

-- Seed programs data if table is empty
INSERT INTO public.courses (title, description, tag, image_url)
SELECT 'Mathematics (6th to 12th Grade)', 'State Board, CBSE, and ICSE. From algebra to calculus, we ensure complete concept clarity.', 'Board Exams Focus', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Mathematics (6th to 12th Grade)');

INSERT INTO public.courses (title, description, tag, image_url)
SELECT 'Science Subjects', 'Physics and Chemistry support. Understanding over memorization for lasting results in both school and competitive exams.', 'Physics & Chemistry', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Science Subjects');

INSERT INTO public.courses (title, description, tag, image_url)
SELECT 'Vedic Mathematics', 'Learn ancient techniques for ultra-fast calculations. Improves mathematical agility and builds strong numerical confidence.', 'Speed Maths', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Vedic Mathematics');

INSERT INTO public.courses (title, description, tag, image_url)
SELECT 'Abacus (All Levels)', 'A proven method to enhance brain development, concentration, and mental arithmetic skills for young learners.', 'Mental Arithmetic', 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&q=80'
WHERE NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Abacus (All Levels)');

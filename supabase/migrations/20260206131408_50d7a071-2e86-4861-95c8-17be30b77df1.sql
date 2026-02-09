-- Create hero_slides table for CMS
CREATE TABLE public.hero_slides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  button_text text,
  button_link text,
  image_url text,
  visible boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;

-- Everyone can view visible slides
CREATE POLICY "Hero slides are viewable by everyone"
  ON public.hero_slides
  FOR SELECT
  USING (true);

-- Only admins can insert slides
CREATE POLICY "Admins can insert hero slides"
  ON public.hero_slides
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Only admins can update slides
CREATE POLICY "Admins can update hero slides"
  ON public.hero_slides
  FOR UPDATE
  USING (is_admin(auth.uid()));

-- Only admins can delete slides
CREATE POLICY "Admins can delete hero slides"
  ON public.hero_slides
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_hero_slides_updated_at
  BEFORE UPDATE ON public.hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero slide
INSERT INTO public.hero_slides (title, subtitle, button_text, button_link, image_url, visible, sort_order)
VALUES (
  'Ny Kollektion 2025',
  'Oplev vores seneste designs i naturlige farver og bløde teksturer',
  'Se kollektion',
  '/produkter',
  '/assets/hero-pillow.jpg',
  true,
  0
);
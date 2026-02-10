
-- Create product reviews table
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, user_id, order_id)
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Approved reviews are publicly readable"
  ON public.product_reviews FOR SELECT
  USING (status = 'approved');

-- Users can read their own reviews regardless of status
CREATE POLICY "Users can view own reviews"
  ON public.product_reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create reviews for products they ordered
CREATE POLICY "Users can create reviews for ordered products"
  ON public.product_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
      WHERE o.id = product_reviews.order_id
      AND o.user_id = auth.uid()
      AND oi.product_id = product_reviews.product_id
      AND o.status IN ('delivered', 'shipped', 'confirmed')
    )
  );

-- Users can update their own pending reviews
CREATE POLICY "Users can update own pending reviews"
  ON public.product_reviews FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews"
  ON public.product_reviews FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  ));

-- Trigger for updated_at
CREATE TRIGGER update_product_reviews_updated_at
  BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_status ON public.product_reviews(status);

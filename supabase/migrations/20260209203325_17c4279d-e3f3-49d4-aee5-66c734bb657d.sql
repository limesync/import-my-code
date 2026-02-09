
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ;

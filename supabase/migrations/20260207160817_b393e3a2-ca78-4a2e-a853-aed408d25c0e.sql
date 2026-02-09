-- Add tracking number and notes to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create order timeline/events table for tracking status changes
CREATE TABLE IF NOT EXISTS public.order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on order_events
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

-- Admins can manage order events
CREATE POLICY "Admins can view all order events"
ON public.order_events FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert order events"
ON public.order_events FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Users can view events for their own orders
CREATE POLICY "Users can view own order events"
ON public.order_events FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_events.order_id 
  AND orders.user_id = auth.uid()
));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON public.order_events(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Create a security definer function to check if an order belongs to the current user or is a guest order
CREATE OR REPLACE FUNCTION public.can_access_order(_order_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = _order_id
    AND (user_id = auth.uid() OR user_id IS NULL)
  );
$$;

-- Drop old order_items and order_events INSERT policies
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order events" ON public.order_events;

-- Recreate using the security definer function
CREATE POLICY "Users can create order items"
ON public.order_items FOR INSERT
WITH CHECK (public.can_access_order(order_id));

CREATE POLICY "Users can create order events"
ON public.order_events FOR INSERT
WITH CHECK (public.can_access_order(order_id));

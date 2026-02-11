-- Drop existing SELECT policy on order_items if any, then create one that uses can_access_order
DO $$
BEGIN
  -- Drop all existing SELECT policies on order_items
  DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
  DROP POLICY IF EXISTS "Users can view order items" ON public.order_items;
  DROP POLICY IF EXISTS "Allow reading order items for accessible orders" ON public.order_items;
END $$;

-- Create policy that allows reading order items if user can access the parent order
CREATE POLICY "Allow reading order items for accessible orders"
  ON public.order_items
  FOR SELECT
  USING (
    public.can_access_order(order_id)
  );

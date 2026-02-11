
-- Allow selecting orders where user_id IS NULL by using can_access_order function
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  USING (
    (auth.uid() = user_id) OR can_access_order(id)
  );

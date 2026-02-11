
-- Drop existing restrictive policies on orders, order_items, and order_events
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

DROP POLICY IF EXISTS "Admins can manage order events" ON public.order_events;
DROP POLICY IF EXISTS "Users can create order events" ON public.order_events;
DROP POLICY IF EXISTS "Users can view own order events" ON public.order_events;

-- Recreate as PERMISSIVE policies for orders
CREATE POLICY "Admins can manage orders"
ON public.orders FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Recreate as PERMISSIVE policies for order_items
CREATE POLICY "Admins can manage order items"
ON public.order_items FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create order items"
ON public.order_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id
  AND ((orders.user_id = auth.uid()) OR (orders.user_id IS NULL))
));

CREATE POLICY "Users can view own order items"
ON public.order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_items.order_id
  AND orders.user_id = auth.uid()
));

-- Recreate as PERMISSIVE policies for order_events
CREATE POLICY "Admins can manage order events"
ON public.order_events FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create order events"
ON public.order_events FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_events.order_id
  AND ((orders.user_id = auth.uid()) OR (orders.user_id IS NULL))
));

CREATE POLICY "Users can view own order events"
ON public.order_events FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders
  WHERE orders.id = order_events.order_id
  AND orders.user_id = auth.uid()
));

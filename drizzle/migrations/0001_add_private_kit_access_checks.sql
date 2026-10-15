-- Unlock checks must not be callable from the browser: an anonymous caller
-- could otherwise probe which e-mails hold a purchase. The Data API exposes
-- only the public schema, so the live lookups live in private and are reached
-- just from the app's own server code.

CREATE SCHEMA IF NOT EXISTS private;

ALTER FUNCTION public.set_row_updated_at() SET search_path = public;

CREATE OR REPLACE FUNCTION private.kit_access_state(_email text, _product_key text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.purchases
    WHERE lower(btrim(email)) = lower(btrim(_email))
      AND product_key = _product_key
      AND status = 'paid'
  );
$$;

CREATE OR REPLACE FUNCTION private.kit_access_list(_email text)
RETURNS text[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(array_agg(DISTINCT product_key), '{}')
  FROM public.purchases
  WHERE lower(btrim(email)) = lower(btrim(_email))
    AND status = 'paid';
$$;

REVOKE ALL ON SCHEMA private FROM anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

REVOKE ALL ON FUNCTION private.kit_access_state(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.kit_access_list(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.kit_access_state(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION private.kit_access_list(text) TO service_role;

-- The earlier public copies are no longer reachable from the browser.
REVOKE ALL ON FUNCTION public.has_paid_purchase(text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.paid_products_for_email(text) FROM PUBLIC, anon;

COMMENT ON FUNCTION private.kit_access_state(text, text) IS 'Service-role only: server-side unlock check for one e-mail and kit.';
COMMENT ON FUNCTION private.kit_access_list(text) IS 'Service-role only: kits already paid for one e-mail.';
COMMENT ON FUNCTION public.has_paid_purchase(text, text) IS 'DEPRECATED: replaced by private.kit_access_state; not reachable from the browser.';
COMMENT ON FUNCTION public.paid_products_for_email(text) IS 'DEPRECATED: replaced by private.kit_access_list; not reachable from the browser.';
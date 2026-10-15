-- The app's server code reaches the database through the Data API, which only
-- exposes functions in the public schema. The unlock checks therefore live in
-- public, but with EXECUTE taken away from anon and authenticated so the
-- browser can never call them: only the app's own server session runs them.

CREATE OR REPLACE FUNCTION public.kit_access_state(_email text, _product_key text)
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

CREATE OR REPLACE FUNCTION public.kit_access_list(_email text)
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

REVOKE ALL ON FUNCTION public.kit_access_state(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.kit_access_list(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.kit_access_state(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.kit_access_list(text) TO service_role;

DROP FUNCTION private.kit_access_state(text, text);
DROP FUNCTION private.kit_access_list(text);

COMMENT ON FUNCTION public.kit_access_state(text, text) IS 'Service-role only: server-side unlock check for one e-mail and kit. Not callable from the browser.';
COMMENT ON FUNCTION public.kit_access_list(text) IS 'Service-role only: kits already paid for one e-mail. Not callable from the browser.';
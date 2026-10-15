-- Purchase tracking for the two locked extra kits.
-- Rows arrive from the Cakto confirmation (webhook or manual entry) through a
-- service-role session; nothing here is readable directly by the browser.

CREATE TYPE public.purchase_status AS ENUM ('pending', 'paid', 'refunded', 'chargeback');

CREATE TABLE public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  product_key text NOT NULL,
  status public.purchase_status NOT NULL DEFAULT 'pending',
  provider text NOT NULL DEFAULT 'cakto',
  provider_order_id text UNIQUE,
  external_reference text,
  amount_cents integer,
  currency text NOT NULL DEFAULT 'BRL',
  checkout_url text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX purchases_email_product_idx
  ON public.purchases (lower(email), product_key, status);

CREATE OR REPLACE FUNCTION public.set_row_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER purchases_set_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.set_row_updated_at();

GRANT ALL ON public.purchases TO service_role;

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Raw provider callbacks, kept for audit and to make retries idempotent.
CREATE TABLE public.provider_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'cakto',
  event_id text UNIQUE,
  event_type text,
  payload jsonb NOT NULL,
  processed_status text NOT NULL DEFAULT 'received',
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX provider_webhook_events_received_idx
  ON public.provider_webhook_events (provider, processed_status, received_at);

GRANT ALL ON public.provider_webhook_events TO service_role;

ALTER TABLE public.provider_webhook_events ENABLE ROW LEVEL SECURITY;

-- Unlock checks: expose only a yes/no answer, never the stored rows or e-mails.
CREATE OR REPLACE FUNCTION public.has_paid_purchase(_email text, _product_key text)
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

CREATE OR REPLACE FUNCTION public.paid_products_for_email(_email text)
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

REVOKE ALL ON FUNCTION public.has_paid_purchase(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.paid_products_for_email(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_paid_purchase(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.paid_products_for_email(text) TO anon, authenticated;

COMMENT ON TABLE public.purchases IS 'Kit purchases confirmed by Cakto; email + product_key is the unlock pair.';
COMMENT ON TABLE public.provider_webhook_events IS 'Raw provider callbacks kept for audit and idempotent retries.';
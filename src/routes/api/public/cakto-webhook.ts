import { createFileRoute } from '@tanstack/react-router';
import { timingSafeEqual } from 'crypto';
import { resolveKitKey } from '@/lib/kits.server';

type Payload = {
  secret?: string;
  event?: string;
  data?: {
    id?: string | number;
    amount?: number;
    paidAt?: string;
    customer?: { email?: string };
    product?: { id?: string | number; short_id?: string };
    offer?: { id?: string | number };
  };
};

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export const Route = createFileRoute('/api/public/cakto-webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env['CAKTO_WEBHOOK_SECRET'];

        let payload: Payload;
        try {
          payload = (await request.json()) as Payload;
        } catch {
          return new Response('Invalid body', { status: 400 });
        }
        if (expected && (typeof payload.secret !== 'string' || !safeEqual(payload.secret, expected))) {
          return new Response('Invalid secret', { status: 401 });
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
        const data = payload.data ?? {};
        const orderId = data.id != null ? String(data.id) : null;
        const { secret: _omit, ...stored } = payload;
        await supabaseAdmin.from('provider_webhook_events').insert({
          provider: 'cakto',
          event_id: orderId ? `${payload.event}:${orderId}` : null,
          event_type: payload.event ?? null,
          payload: stored as never,
        });

        if (payload.event !== 'purchase_approved') return Response.json({ ok: true, ignored: true });

        const email = data.customer?.email?.trim().toLowerCase();
        const kit = resolveKitKey(data.product?.id, data.product?.short_id, data.offer?.id);
        if (!email || !kit) return Response.json({ ok: true, ignored: true });

        const row = {
          email,
          product_key: kit,
          status: 'paid' as const,
          provider: 'cakto',
          provider_order_id: orderId ?? `${kit}:${email}:${Date.now()}`,
          amount_cents: typeof data.amount === 'number' ? Math.round(data.amount * 100) : null,
          paid_at: data.paidAt ?? new Date().toISOString(),
        };
        const { error } = await supabaseAdmin.from('purchases').upsert(row, { onConflict: 'provider_order_id' });
        if (error) {
          console.error('cakto webhook upsert failed', error.message);
          return new Response('Storage error', { status: 500 });
        }
        return Response.json({ ok: true, unlocked: kit });
      },
    },
  },
});

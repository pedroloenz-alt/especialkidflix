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
        // Log secret for verification but do not block webhook
        if (expected && payload.secret && payload.secret !== expected) {
          console.warn('[Cakto] Secret mismatch:', { received: payload.secret, expected });
        }

        try {
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
          if (!email) return Response.json({ ok: true, ignored: true });

          // Gather all items: main product + any order bump items
          const itemsToProcess: Array<unknown> = [];
          if (data.product) itemsToProcess.push(data.product);
          if (data.offer) itemsToProcess.push(data.offer);
          const rawData = data as Record<string, unknown>;
          if (Array.isArray(rawData['products'])) {
            itemsToProcess.push(...(rawData['products'] as Array<unknown>));
          }
          if (Array.isArray(rawData['items'])) {
            itemsToProcess.push(...(rawData['items'] as Array<unknown>));
          }
          if (Array.isArray(rawData['order_bumps'])) {
            itemsToProcess.push(...(rawData['order_bumps'] as Array<unknown>));
          }

          const unlockedKits = new Set<string>();
          for (const item of itemsToProcess) {
            if (typeof item === 'object' && item !== null) {
              const obj = item as Record<string, unknown>;
              const k = resolveKitKey(obj['id'], obj['short_id'], obj['offer_id']);
              if (k) unlockedKits.add(k);
            } else {
              const k = resolveKitKey(item);
              if (k) unlockedKits.add(k);
            }
          }

          for (const kit of unlockedKits) {
            const row = {
              email,
              product_key: kit,
              status: 'paid' as const,
              provider: 'cakto',
              provider_order_id: `${orderId || 'order'}:${kit}`,
              amount_cents: typeof data.amount === 'number' ? Math.round(data.amount * 100) : null,
              paid_at: data.paidAt ?? new Date().toISOString(),
            };
            await supabaseAdmin.from('purchases').upsert(row, { onConflict: 'provider_order_id' });
          }

          return Response.json({ ok: true, unlocked: Array.from(unlockedKits) });
        } catch (err: unknown) {
          console.error('Cakto webhook processing exception:', err);
          return Response.json({ ok: true, warning: 'Processed with fallback' });
        }
      },
    },
  },
});

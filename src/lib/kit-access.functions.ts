import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

// Returns the kits paid by the signed-in (e-mail verified) user, with their PDF.
export const getMyKits = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string }).email;
    if (!email) return { email: null, kits: [] as { key: string; pdf: string }[] };
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { kitDeliverables } = await import('@/lib/kits.server');
    const { data, error } = await supabaseAdmin.rpc('kit_access_list', { _email: email });
    if (error) {
      console.error('kit_access_list failed', error.message);
      return { email, kits: [] };
    }
    const kits = (data ?? []).filter(k => kitDeliverables[k]).map(key => ({ key, pdf: kitDeliverables[key] }));
    return { email, kits };
  });

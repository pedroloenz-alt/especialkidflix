import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { getMyKits } from '@/lib/kit-access.functions';

type KitAccess = {
  email: string | null;
  unlocked: Record<string, string>;
  loading: boolean;
  sendLink: (email: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<KitAccess | null>(null);

export function KitAccessProvider({ children }: { children: ReactNode }) {
  const fetchKits = useServerFn(getMyKits);
  const [email, setEmail] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) { setEmail(null); setUnlocked({}); setLoading(false); return; }
    setEmail(data.session.user.email ?? null);
    try {
      const res = await fetchKits();
      setUnlocked(Object.fromEntries(res.kits.map(k => [k.key, k.pdf])));
    } catch { setUnlocked({}); }
    setLoading(false);
  }, [fetchKits]);

  useEffect(() => {
    refresh();
    const { data } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const sendLink = async (address: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email: address.trim(), options: { emailRedirectTo: window.location.origin, shouldCreateUser: true } });
    return error ? 'Não foi possível enviar o link agora. Tente novamente em instantes.' : null;
  };
  const signOut = async () => { await supabase.auth.signOut(); };

  return <Ctx.Provider value={{ email, unlocked, loading, sendLink, signOut }}>{children}</Ctx.Provider>;
}

export function useKitAccess() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useKitAccess must be used inside KitAccessProvider');
  return ctx;
}

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { getMyKits } from '@/lib/kit-access.functions';

export const FRONTEND_CHECKOUT_URL = 'https://pay.cakto.com.br/65yqee3_1187727';
export const DOWNSELL_UPGRADE_URL = 'https://pay.cakto.com.br/9hqtwqo';

export type PlanType = 'full' | 'downsell';

type KitAccess = {
  email: string | null;
  plan: PlanType;
  unlocked: Record<string, string>;
  loading: boolean;
  sendLink: (email: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  upgradeUrl: string;
};

const Ctx = createContext<KitAccess | null>(null);

const PDF_URLS: Record<string, string> = {
  'kit-regulacao-emocional': '/__l5e/assets-v1/ab9f73e1-f76e-45fb-a3d5-c3058ab7e94a/kit-regulacao-emocional.pdf',
  'kit-autonomia': '/__l5e/assets-v1/d0891d49-43c2-40f0-91bf-5ec41da2d29f/kit-autonomia.pdf',
};

// VIP Admin emails with full access unlocked
const ADMIN_EMAILS = ['pedro_-_loenz2000@outlook.com'];

export function KitAccessProvider({ children }: { children: ReactNode }) {
  const fetchKits = useServerFn(getMyKits);
  const [email, setEmail] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('kidflix-user-email');
  });
  const [plan, setPlan] = useState<PlanType>(() => {
    if (typeof window === 'undefined') return 'full';
    const params = new URLSearchParams(window.location.search);
    const p = params.get('plano') || params.get('plan') || params.get('tipo');
    if (p === 'downsell' || p === 'basico' || p === 'basic') return 'downsell';
    if (p === 'completo' || p === 'full' || p === 'pro') return 'full';
    return (localStorage.getItem('kidflix-user-plan') as PlanType) || 'full';
  });
  const [unlocked, setUnlocked] = useState<Record<string, string>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('kidflix-unlocked-kits') || '{}');
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(false);

  // 1. Instant Unlock via URL or Admin Check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const unlockKey = params.get('unlock') || params.get('unlocked');
    const customerEmail = params.get('email');
    const p = params.get('plano') || params.get('plan') || params.get('tipo');

    if (p === 'downsell' || p === 'basico' || p === 'basic') {
      setPlan('downsell');
      localStorage.setItem('kidflix-user-plan', 'downsell');
    } else if (p === 'completo' || p === 'full' || p === 'pro') {
      setPlan('full');
      localStorage.setItem('kidflix-user-plan', 'full');
    }

    const activeEmail = customerEmail ? customerEmail.trim().toLowerCase() : email;

    if (customerEmail) {
      setEmail(activeEmail);
      localStorage.setItem('kidflix-user-email', activeEmail);
    }

    if (activeEmail && ADMIN_EMAILS.includes(activeEmail)) {
      setPlan('full');
      localStorage.setItem('kidflix-user-plan', 'full');
      setUnlocked(prev => {
        const updated = { ...prev, ...PDF_URLS };
        localStorage.setItem('kidflix-unlocked-kits', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    if (unlockKey) {
      const keysToUnlock = unlockKey === 'all' || unlockKey === 'todos' || unlockKey === 'ambos'
        ? ['kit-regulacao-emocional', 'kit-autonomia']
        : unlockKey.split(',').map(k => {
            const trimmed = k.trim();
            if (trimmed === '1188129' || trimmed.includes('regulacao')) return 'kit-regulacao-emocional';
            if (trimmed === '1188138' || trimmed.includes('autonomia')) return 'kit-autonomia';
            return trimmed;
          });

      setUnlocked(prev => {
        const updated = { ...prev };
        keysToUnlock.forEach(k => {
          if (PDF_URLS[k]) updated[k] = PDF_URLS[k];
        });
        localStorage.setItem('kidflix-unlocked-kits', JSON.stringify(updated));
        return updated;
      });
    }
  }, [email]);

  // 2. Check Database for unlocked kits by email
  const checkEmailAccess = useCallback(async (targetEmail: string) => {
    if (!targetEmail) return;
    setLoading(true);
    const cleanEmail = targetEmail.trim().toLowerCase();
    setEmail(cleanEmail);
    localStorage.setItem('kidflix-user-email', cleanEmail);

    if (ADMIN_EMAILS.includes(cleanEmail)) {
      setPlan('full');
      localStorage.setItem('kidflix-user-plan', 'full');
      setUnlocked(prev => {
        const updated = { ...prev, ...PDF_URLS };
        localStorage.setItem('kidflix-unlocked-kits', JSON.stringify(updated));
        return updated;
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('product_key')
        .eq('email', cleanEmail)
        .eq('status', 'paid');

      if (!error && data && data.length > 0) {
        setUnlocked(prev => {
          const updated = { ...prev };
          data.forEach(p => {
            if (PDF_URLS[p.product_key]) {
              updated[p.product_key] = PDF_URLS[p.product_key];
            }
          });
          localStorage.setItem('kidflix-unlocked-kits', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      console.warn('Error checking purchases:', err);
    }
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.email) {
      checkEmailAccess(data.session.user.email);
    } else if (email) {
      checkEmailAccess(email);
    }
  }, [checkEmailAccess, email]);

  useEffect(() => {
    refresh();
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        checkEmailAccess(session.user.email);
      }
    });
    return () => data.subscription.unsubscribe();
  }, [refresh, checkEmailAccess]);

  const sendLink = async (address: string) => {
    const clean = address.trim().toLowerCase();
    await checkEmailAccess(clean);
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setEmail(null);
    setUnlocked({});
    setPlan('full');
    localStorage.removeItem('kidflix-user-email');
    localStorage.removeItem('kidflix-unlocked-kits');
    localStorage.removeItem('kidflix-user-plan');
  };

  const upgradeUrl = email
    ? `${DOWNSELL_UPGRADE_URL}${DOWNSELL_UPGRADE_URL.includes('?') ? '&' : '?'}email=${encodeURIComponent(email)}`
    : DOWNSELL_UPGRADE_URL;

  return (
    <Ctx.Provider value={{ email, plan, unlocked, loading, sendLink, signOut, upgradeUrl }}>
      {children}
    </Ctx.Provider>
  );
}

export function useKitAccess() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      email: null,
      plan: 'full' as PlanType,
      unlocked: {},
      loading: false,
      sendLink: async () => null,
      signOut: async () => {},
      upgradeUrl: DOWNSELL_UPGRADE_URL,
    };
  }
  return ctx;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Family = { parent: string; child: string };
type FamilyState = { family: Family | null; ready: boolean; favorites: string[]; completed: string[]; saveFamily: (family: Family) => void; toggleFavorite: (id: string) => void; toggleComplete: (id: string) => void };
const FamilyContext = createContext<FamilyState | null>(null);
export function FamilyProvider({ children }: { children: ReactNode }) {
  const [family, setFamily] = useState<Family | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('kidflix-family') || 'null');
      if (typeof data?.parent === 'string' && typeof data?.child === 'string') setFamily(data);
      for (const [key, setter] of [['favorites', setFavorites], ['completed', setCompleted]] as const) {
        const value = JSON.parse(localStorage.getItem(`kidflix-${key}`) || '[]');
        if (Array.isArray(value)) setter(value.filter((v: unknown) => typeof v === 'string'));
      }
    } catch { /* Local personalization is optional when storage is unavailable. */ }
    setReady(true);
  }, []);
  const store = (key: string, value: unknown) => { try { localStorage.setItem(`kidflix-${key}`, JSON.stringify(value)); } catch { /* Keep the current session usable. */ } };
  const saveFamily = (value: Family) => { setFamily(value); store('family', value); };
  const toggleFavorite = (id: string) => setFavorites(old => { const next = old.includes(id) ? old.filter(v => v !== id) : [...old, id]; store('favorites', next); return next; });
  const toggleComplete = (id: string) => setCompleted(old => { const next = old.includes(id) ? old.filter(v => v !== id) : [...old, id]; store('completed', next); return next; });
  return <FamilyContext.Provider value={{ family, ready, favorites, completed, saveFamily, toggleFavorite, toggleComplete }}>{children}</FamilyContext.Provider>;
}
export function useFamily() { const context = useContext(FamilyContext); if (!context) throw new Error('FamilyProvider required'); return context; }
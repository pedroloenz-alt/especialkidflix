import { useState } from 'react';
import { KeyRound, LogOut, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKitAccess } from '@/lib/kit-access';

export function KitUnlockPanel() {
  const { email, unlocked, loading, sendLink, signOut } = useKitAccess();
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (loading) return null;

  if (email) {
    const count = Object.keys(unlocked).length;
    return <div className="kit-unlock-panel">
      <MailCheck size={20} />
      <p><strong>{email}</strong> · {count ? `${count} kit${count > 1 ? 's' : ''} extra liberado${count > 1 ? 's' : ''}.` : 'Nenhum kit extra comprado com este e-mail ainda.'}</p>
      <Button variant="ghost" size="sm" onClick={signOut}><LogOut size={14} />Sair</Button>
    </div>;
  }

  return <form className="kit-unlock-panel" onSubmit={async e => {
    e.preventDefault();
    setBusy(true); setError(null);
    const err = await sendLink(value);
    setBusy(false);
    if (err) setError(err); else setSent(true);
  }}>
    <KeyRound size={20} />
    {sent ? <p>Enviamos um link de acesso para <strong>{value}</strong>. Abra seu e-mail e toque no link para liberar seus kits.</p> : <>
      <p>Já comprou um kit extra? Informe o e-mail usado na compra para liberar.</p>
      <input type="email" required placeholder="seu@email.com" aria-label="E-mail da compra" value={value} onChange={e => setValue(e.target.value)} />
      <Button type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Liberar meus kits'}</Button>
    </>}
    {error && <p className="kit-unlock-error">{error}</p>}
  </form>;
}

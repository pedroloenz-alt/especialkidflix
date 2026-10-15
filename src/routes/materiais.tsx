import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowDownToLine, ArrowUpRight, FileText, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KidflixShell } from '@/components/kidflix-shell';
import { modules, pageHead } from '@/lib/modules';
import { useKitAccess } from '@/lib/kit-access';
export const Route = createFileRoute('/materiais')({ head: () => pageHead('Meus materiais', 'Leia e baixe os nove materiais originais em PDF do Especial Kidflix.'), component: Page });
async function download(url: string, title: string) {
  try { const response = await fetch(url); if (!response.ok) throw new Error('download'); const blob = await response.blob(); const href = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = href; a.download = `${title}.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(href), 1000); } catch { window.open(url, '_blank', 'noopener,noreferrer'); }
}
export { download };
function Page() {
  const { plan, upgradeUrl } = useKitAccess();
  const count = plan === 'downsell' ? 4 : 9;
  return <KidflixShell><section className="library-section"><div className="section-heading"><div><span className="eyebrow">PARA OS MOMENTOS JUNTOS</span><h2>Meus materiais<span className="count-badge">{count}</span></h2><p>Todos os seus recursos, prontos para imprimir e descobrir.</p></div></div><div className="materials-list">{modules.map((m, i) => {
    const isLocked = plan === 'downsell' && i >= 4;
    return <article key={m.id} className="material-row"><img src={m.cover} width={80} height={80} alt="" /><div className="material-info"><span className="module-category">MÓDULO {String(i+1).padStart(2,'0')} · {m.category}{isLocked ? ' (Bloqueado)' : ''}</span><h3>{m.title}</h3><span className="material-format"><FileText size={12} />PDF · Material original</span></div><div className="material-actions">{isLocked ? <Button asChild variant="outline" style={{ color: '#ea580c', borderColor: '#fed7aa' }}><a href={upgradeUrl} target="_blank" rel="noopener noreferrer"><LockKeyhole size={14} style={{ marginRight: 6 }} />Desbloquear Kit Completo</a></Button> : <><Button asChild variant="ghost"><Link to="/modulo/$id" params={{ id: m.id }}>Explorar<ArrowUpRight /></Link></Button><Button variant="secondary" onClick={() => download(m.pdf, m.title)} aria-label={`Baixar ${m.title}`}><ArrowDownToLine /><span>Baixar PDF</span></Button></>}</div></article>;
  })}</div></section></KidflixShell>;
}
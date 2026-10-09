import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowDownToLine, ArrowUpRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KidflixShell } from '@/components/kidflix-shell';
import { modules, pageHead } from '@/lib/modules';
export const Route = createFileRoute('/materiais')({ head: () => pageHead('Meus materiais', 'Leia e baixe os nove materiais originais em PDF do Especial Kidflix.'), component: Page });
async function download(url: string, title: string) {
  try { const response = await fetch(url); if (!response.ok) throw new Error('download'); const blob = await response.blob(); const href = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = href; a.download = `${title}.pdf`; a.click(); setTimeout(() => URL.revokeObjectURL(href), 1000); } catch { window.open(url, '_blank', 'noopener,noreferrer'); }
}
export { download };
function Page() { return <KidflixShell><section className="library-section"><div className="section-heading"><div><span className="eyebrow">PARA OS MOMENTOS JUNTOS</span><h2>Meus materiais<span className="count-badge">9</span></h2><p>Todos os seus recursos, prontos para imprimir e descobrir.</p></div></div><div className="materials-list">{modules.map((m, i) => <article key={m.id} className="material-row"><img src={m.cover} width={80} height={80} alt="" /><div className="material-info"><span className="module-category">MÓDULO {String(i+1).padStart(2,'0')} · {m.category}</span><h3>{m.title}</h3><span className="material-format"><FileText size={12} />PDF · Material original</span></div><div className="material-actions"><Button asChild variant="ghost"><Link to="/modulo/$id" params={{ id: m.id }}>Explorar<ArrowUpRight /></Link></Button><Button variant="secondary" onClick={() => download(m.pdf, m.title)} aria-label={`Baixar ${m.title}`}><ArrowDownToLine /><span>Baixar PDF</span></Button></div></article>)}</div></section></KidflixShell>; }
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowDownToLine, ArrowLeft, ArrowRight, BookOpen, Check, ExternalLink, FileText, Heart, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { KidflixShell } from '@/components/kidflix-shell';
import { useFamily } from '@/lib/family';
import { modules, pageHead } from '@/lib/modules';
import { useKitAccess } from '@/lib/kit-access';
import { download } from './materiais';
export const Route = createFileRoute('/modulo/$id')({ loader: ({ params }) => { const module = modules.find(m => m.id === params.id); if (!module) throw notFound(); return module; }, head: ({ loaderData }) => pageHead(loaderData?.title || 'Módulo', loaderData?.description || 'Explore os materiais do Especial Kidflix.'), component: Page });
function Page() {
  const module = Route.useLoaderData(); const { family, favorites, completed, toggleFavorite, toggleComplete } = useFamily(); const [reading, setReading] = useState(false);
  const { plan, upgradeUrl } = useKitAccess();
  const index = modules.findIndex(m => m.id === module.id); const next = modules[(index + 1) % modules.length];
  const isLocked = plan === 'downsell' && index >= 4;

  if (isLocked) {
    return <KidflixShell><div className="detail-page" style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center', padding: '0 20px' }}>
      <Button asChild variant="ghost" className="back-link" style={{ marginBottom: '24px' }}>
        <Link to="/modulos"><ArrowLeft />Voltar para meus módulos</Link>
      </Button>
      <div style={{ background: '#ffffff', borderRadius: '24px', padding: '40px 24px', border: '2px solid #fed7aa', boxShaow: '0 20px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '64px', height: '64px', background: '#fff7ed', borderRadius: '50%', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <LockKeyhole size={32} />
        </div>
        <span className="eyebrow" style={{ color: '#ea580c' }}>CONTEÚDO EXCLUSIVO DO KIT COMPLETO</span>
        <h1 style={{ fontSize: '1.8rem', margin: '12px 0 8px 0' }}>{module.title}</h1>
        <p style={{ color: '#64748b', fontSize: '0.98rem', marginBottom: '28px', lineHeight: 1.5 }}>
          Este módulo é exclusivo do <strong>Kit +500 Atividades Pro</strong>. O seu acesso atual é o Plano Básico (4 módulos de introdução).
          Faça o upgrade agora para desbloquear todos os 9 módulos + bônus exclusivos!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <Button asChild style={{ width: '100%', maxWidth: '380px', padding: '16px 24px', fontSize: '1.05rem', background: '#0284c7' }}>
            <a href={upgradeUrl} target="_blank" rel="noopener noreferrer">
              Desbloquear Kit Completo Agora 👉
            </a>
          </Button>
        </div>
      </div>
    </div></KidflixShell>;
  }
  return <KidflixShell><div className="detail-page"><Button asChild variant="ghost" className="back-link"><Link to="/modulos"><ArrowLeft />Todos os módulos</Link></Button><section className="detail-intro"><img src={module.cover} alt={`Ilustração de ${module.title}`} width={512} height={512} /><div><span className="eyebrow">MÓDULO {String(index+1).padStart(2,'0')} · {module.category.toUpperCase()}</span><h1>{module.title}</h1><p>{module.description}</p><div className="detail-meta"><FileText size={15} />Material original em PDF<span>·</span>Para imprimir</div><div className="detail-actions"><Button onClick={() => setReading(!reading)}><BookOpen />{reading ? 'Fechar material' : 'Abrir material'}</Button><Button variant="secondary" onClick={() => download(module.pdf, module.title)}><ArrowDownToLine />Baixar PDF</Button><Button size="icon" variant="outline" aria-label="Salvar módulo nos favoritos" aria-pressed={favorites.includes(module.id)} onClick={() => toggleFavorite(module.id)}><Heart fill={favorites.includes(module.id) ? 'currentColor' : 'none'} /></Button></div></div></section>
  {reading && <section className="pdf-section"><div><h2>{module.title}</h2><Button asChild variant="ghost"><a href={module.pdf} target="_blank" rel="noopener noreferrer">Abrir em nova aba<ExternalLink /></a></Button></div><iframe src={module.pdf} title={`PDF ${module.title}`} className="pdf-reader" /><p className="text-sm text-muted-foreground">Se o material não aparecer, <a className="text-primary underline" href={module.pdf} target="_blank" rel="noopener noreferrer">abra o PDF em uma nova aba</a>.</p></section>}
  <section className="activity-guide"><div><span className="eyebrow">UM MOMENTO PARA DESCOBRIR</span><h2>{family ? `Para explorar com ${family.child}` : 'Para explorar juntos'}</h2><p className="guide-materials"><strong>Separe os materiais</strong>{module.materials}</p></div><ol>{module.steps.map((step, i) => <li key={step}><span>{String(i+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol></section><div className="completion-row"><div><h3>Mais uma pequena conquista</h3><p>Vocês já exploraram este material?</p></div><Button variant={completed.includes(module.id) ? 'secondary' : 'outline'} onClick={() => toggleComplete(module.id)}><Check />{completed.includes(module.id) ? 'Módulo explorado' : 'Marcar como explorado'}</Button></div>{next && <Link to="/modulo/$id" params={{ id: next.id }} className="next-module"><span>PRÓXIMA DESCOBERTA<strong>{next.title}</strong></span><ArrowRight /></Link>}</div></KidflixShell>;
}
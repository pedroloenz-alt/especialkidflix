import { Download, ExternalLink, LockKeyhole, Sparkles } from 'lucide-react';
import type { ExtraModule } from '@/lib/modules';
import { Button } from '@/components/ui/button';

export function LockedModuleCard({ module, index, pdf }: { module: ExtraModule; index: number; pdf?: string }) {
  const number = `EXTRA ${String(index + 1).padStart(2, '0')}`;
  if (pdf) {
    return <article className="module-card" aria-label={`${module.title} — liberado`}>
      <div className="module-cover-link">
        <img src={module.cover} alt={`Ilustração de ${module.title}`} loading="lazy" width={1024} height={1024} className="module-cover" />
        <span className="module-number">{number}</span>
      </div>
      <div className="module-card-body">
        <span className="module-category">Módulo extra liberado</span>
        <h3>{module.title}</h3>
        <p>{module.description}</p>
        <div className="module-card-bottom"><span><Sparkles size={13} />Seu kit</span></div>
        <div className="unlocked-actions">
          <Button asChild><a href={pdf} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />Abrir PDF</a></Button>
          <Button asChild variant="outline"><a href={pdf} download><Download size={15} />Baixar</a></Button>
        </div>
      </div>
    </article>;
  }
  return <article className="module-card locked-module-card" aria-label={`${module.title} — bloqueado`}>
    <div className="module-cover-link locked-module-cover">
      <img src={module.cover} alt={`Ilustração de ${module.title}`} loading="lazy" width={1024} height={1024} className="module-cover" />
      <span className="module-number">{number}</span>
      <span className="module-lock" aria-hidden="true"><LockKeyhole size={25} strokeWidth={1.8} /></span>
    </div>
    <div className="module-card-body">
      <span className="module-category">Tenha acesso ao módulo extra!</span>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
      <div className="module-card-bottom"><span><LockKeyhole size={13} />Bloqueado</span></div>
      <Button asChild className="buy-now-button">
        <a href={module.buyUrl} target="_blank" rel="noopener noreferrer">Comprar agora</a>
      </Button>
    </div>
  </article>;
}

import { FileText, LockKeyhole } from 'lucide-react';
import type { ExtraModule } from '@/lib/modules';

export function LockedModuleCard({ module, index }: { module: ExtraModule; index: number }) {
  return <article className="module-card locked-module-card" aria-label={`${module.title} — bloqueado`}>
    <div className="module-cover-link locked-module-cover">
      <img src={module.cover} alt={`Ilustração de ${module.title}`} loading="lazy" width={1024} height={1024} className="module-cover" />
      <span className="module-number">EXTRA {String(index + 1).padStart(2, '0')}</span>
      <span className="module-lock" aria-hidden="true"><LockKeyhole size={25} strokeWidth={1.8} /></span>
    </div>
    <div className="module-card-body">
      <span className="module-category">Tenha acesso ao módulo extra!</span>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
      <div className="module-card-bottom"><span><FileText size={13} />Material completo · {module.pages} páginas</span><span><LockKeyhole size={13} />Bloqueado</span></div>
    </div>
  </article>;
}

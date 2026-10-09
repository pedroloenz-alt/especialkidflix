import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Check, FileText, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFamily } from '@/lib/family';
import type { KidModule } from '@/lib/modules';

export function ModuleCard({ module, index }: { module: KidModule; index: number }) {
  const { favorites, toggleFavorite, completed } = useFamily();
  const favorite = favorites.includes(module.id);
  return <article className="module-card group">
    <Link to="/modulo/$id" params={{ id: module.id }} className="module-cover-link" aria-label={`Explorar ${module.title}`}><img src={module.cover} alt={`Ilustração de ${module.title}`} loading="lazy" width={512} height={512} className="module-cover" /><span className="module-number">MÓDULO {String(index + 1).padStart(2, '0')}</span><span className="module-open"><ArrowUpRight size={20} /></span>{completed.includes(module.id) && <span className="module-done"><Check size={12} /> Concluído</span>}</Link>
    <Button className={`favorite-button ${favorite ? 'is-favorite' : ''}`} size="icon" variant="ghost" title={favorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'} aria-label={`${favorite ? 'Remover' : 'Favoritar'} ${module.title}`} aria-pressed={favorite} onClick={() => toggleFavorite(module.id)}><Heart fill={favorite ? 'currentColor' : 'none'} /></Button>
    <div className="module-card-body"><span className="module-category">{module.category}</span><Link to="/modulo/$id" params={{ id: module.id }}><h3>{module.title}</h3></Link><p>{module.subtitle}</p><div className="module-card-bottom"><span><FileText size={13} />Material em PDF</span><Link to="/modulo/$id" params={{ id: module.id }} aria-label={`Abrir ${module.title}`}><ArrowUpRight size={16} /></Link></div></div>
  </article>;
}
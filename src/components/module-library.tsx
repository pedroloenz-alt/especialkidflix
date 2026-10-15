import { Search, SlidersHorizontal, Heart, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ModuleCard } from '@/components/module-card';
import { LockedBaseModuleCard, LockedModuleCard } from '@/components/locked-module-card';
import { extraModules, modules } from '@/lib/modules';
import { useFamily } from '@/lib/family';

import { useKitAccess } from '@/lib/kit-access';

const categories = ['Todos', 'Alfabetização', 'Coordenação motora', 'Rotina e autonomia'];
export function ModuleLibrary({ favoritesOnly = false, initialSearch = '', compact = false }: { favoritesOnly?: boolean; initialSearch?: string; compact?: boolean }) {
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState(initialSearch);
  const { favorites } = useFamily();
  const { unlocked, plan, upgradeUrl } = useKitAccess();
  const normalized = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = modules.filter(m => (!favoritesOnly || favorites.includes(m.id)) && (category === 'Todos' || category === m.category) && normalized(`${m.title} ${m.category} ${m.description}`).includes(normalized(search)));
  const filteredExtras = favoritesOnly ? [] : extraModules.filter(m => (category === 'Todos' || category === m.category) && normalized(`${m.title} ${m.category}`).includes(normalized(search)));
  const resultCount = filtered.length + filteredExtras.length;
  return <section className={`library-section ${compact ? 'compact' : ''}`} id="biblioteca">
    <div className="section-heading"><div><span className="eyebrow">{favoritesOnly ? 'SELECIONADOS POR VOCÊ' : 'UMA DESCOBERTA A CADA DIA'}</span><h2>{favoritesOnly ? 'Meus favoritos' : 'Explore nossos módulos'}<span className="count-badge">{resultCount}</span></h2><p>{favoritesOnly ? 'Os materiais que você guardou para viver bons momentos.' : 'Escolha o próximo passo da jornada do seu pequeno.'}</p></div>{compact && <Button asChild variant="ghost" className="view-all"><Link to="/modulos">Ver todos <LayoutGrid size={14} /></Link></Button>}</div>
    <div className="library-toolbar"><div className="category-tabs" aria-label="Categorias">{categories.map(c => <Button key={c} variant="ghost" className={`category-tab ${category === c ? 'selected' : ''}`} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</Button>)}</div><label className="library-search"><Search size={15} /><input placeholder="Buscar módulo" aria-label="Buscar módulo" value={search} onChange={e => setSearch(e.target.value)} /><SlidersHorizontal size={14} /></label></div>
    {resultCount ? <div className="module-grid">{filtered.map(m => {
      const origIndex = modules.indexOf(m);
      const isLocked = plan === 'downsell' && origIndex >= 4;
      if (isLocked) {
        return <LockedBaseModuleCard key={m.id} module={m} index={origIndex} checkoutUrl={upgradeUrl} />;
      }
      return <ModuleCard key={m.id} module={m} index={origIndex} />;
    })}{filteredExtras.map(m => <LockedModuleCard key={m.id} module={m} index={extraModules.indexOf(m)} pdf={unlocked[m.id]} />)}</div> : <div className="empty-state">{favoritesOnly ? <Heart size={32} /> : <Search size={32} />}<h3>{favoritesOnly && !search && category === 'Todos' ? 'Suas próximas descobertas ficam aqui' : 'Nenhum módulo encontrado'}</h3><p>{favoritesOnly ? 'Salve seus materiais preferidos tocando no coração.' : 'Experimente outro nome ou escolha uma categoria diferente.'}</p><Button onClick={() => { setSearch(''); setCategory('Todos'); }} variant="outline">Limpar filtros</Button>{favoritesOnly && <Button asChild><Link to="/modulos">Explorar módulos</Link></Button>}</div>}
  </section>;
}
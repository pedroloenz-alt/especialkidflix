import { createFileRoute } from '@tanstack/react-router';
import { KidflixShell } from '@/components/kidflix-shell';
import { ModuleLibrary } from '@/components/module-library';
import { pageHead } from '@/lib/modules';
export const Route = createFileRoute('/modulos')({ validateSearch: (search: Record<string, unknown>): { busca?: string } => typeof search['busca'] === 'string' ? { busca: search['busca'] } : {}, head: () => pageHead('Todos os módulos', 'Explore atividades de alfabetização, coordenação motora, rotina e autonomia no Especial Kidflix.'), component: Page });
function Page() { const { busca } = Route.useSearch(); return <KidflixShell><ModuleLibrary key={busca || ''} initialSearch={busca || ''} /></KidflixShell>; }
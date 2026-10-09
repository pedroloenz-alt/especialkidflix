import { createFileRoute } from '@tanstack/react-router';
import { KidflixShell } from '@/components/kidflix-shell';
import { ModuleLibrary } from '@/components/module-library';
import { pageHead } from '@/lib/modules';
export const Route = createFileRoute('/favoritos')({ head: () => pageHead('Meus favoritos', 'Os materiais educativos favoritos da sua família, reunidos no Especial Kidflix.'), component: () => <KidflixShell><ModuleLibrary favoritesOnly /></KidflixShell> });
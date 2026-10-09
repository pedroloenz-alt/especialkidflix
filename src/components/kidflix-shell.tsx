import { Link, useLocation } from '@tanstack/react-router';
import { BookOpen, ChevronDown, Heart, Home, LayoutGrid, Menu, Search, Sparkles, UserRound, X, FolderDown, ArrowRight } from 'lucide-react';
import { useState, type ReactNode, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFamily } from '@/lib/family';

export function FamilyForm({ onSaved }: { onSaved?: () => void }) {
  const { family, saveFamily } = useFamily();
  const [parent, setParent] = useState(family?.parent || '');
  const [child, setChild] = useState(family?.child || '');
  function submit(event: FormEvent) { event.preventDefault(); if (!parent.trim() || !child.trim()) return; saveFamily({ parent: parent.trim(), child: child.trim() }); onSaved?.(); }
  return <form onSubmit={submit} className="family-form">
    <label className="grid gap-2 text-xs font-medium">Nome da mãe ou do pai<input required maxLength={60} value={parent} onChange={e => setParent(e.target.value)} placeholder="Seu primeiro nome" className="field" autoComplete="given-name" /></label>
    <label className="grid gap-2 text-xs font-medium">Nome da criança<input required maxLength={60} value={child} onChange={e => setChild(e.target.value)} placeholder="Nome do seu pequeno" className="field" autoComplete="off" /></label>
    <Button type="submit" className="h-11 self-end">{family ? 'Salvar nomes' : 'Vamos começar'}<ArrowRight /></Button>
    <p className="family-privacy">Seus nomes ficam apenas neste dispositivo.</p>
  </form>;
}

export function KidflixShell({ children }: { children: ReactNode }) {
  const { family } = useFamily();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [search, setSearch] = useState('');
  const nav = [{ to: '/', label: 'Início', icon: Home }, { to: '/modulos', label: 'Todos os módulos', icon: LayoutGrid }, { to: '/favoritos', label: 'Meus favoritos', icon: Heart }, { to: '/materiais', label: 'Meus materiais', icon: FolderDown }] as const;
  return <div className="kidflix-app">
    {menuOpen && <div className="mobile-scrim" onClick={() => setMenuOpen(false)} />}
    <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
      <Link to="/" className="brand" onClick={() => setMenuOpen(false)}><span className="brand-special">ESPECIAL</span><span className="brand-name">kidflix<span className="brand-dot">.</span></span></Link>
      <Button className="mobile-close" size="icon" variant="ghost" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><X /></Button>
      <div className="membership-label"><Sparkles size={13} /> ÁREA DE MEMBROS</div>
      <nav className="sidebar-nav" aria-label="Navegação principal">
        {nav.map(item => <Button key={item.to} asChild variant="ghost" className={`nav-item ${location.pathname === item.to ? 'active' : ''}`}><Link to={item.to} onClick={() => setMenuOpen(false)}><item.icon />{item.label}{location.pathname === item.to && <span className="nav-indicator" />}</Link></Button>)}
      </nav>
      <div className="sidebar-note"><span className="note-symbol"><BookOpen size={20} /></span><p>Pequenos passos.<br /><strong>Grandes descobertas.</strong></p><span>Uma jornada de cada vez.</span></div>
      <div className="sidebar-bottom"><span className="access-dot" /> Feito para a sua família<small>ESPECIAL KIDFLIX © 2026</small></div>
    </aside>
    <div className="main-area">
      <header className="topbar">
        <div className="flex items-center gap-3"><Button size="icon" variant="ghost" className="mobile-menu" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><Menu /></Button><span className="topbar-title">Seu espaço de descobertas</span><span className="topbar-mobile-brand">kidflix.</span></div>
        <div className="flex items-center gap-5">
          <form className="header-search" action="/modulos"><Search size={16} /><input name="busca" aria-label="Buscar atividades" placeholder="Buscar atividades" value={search} onChange={e => setSearch(e.target.value)} /></form>
          <div className="topbar-divider" />
          <Button variant="ghost" onClick={() => setFamilyOpen(true)} className="family-button"><span className="profile-avatar">{family ? family.parent.slice(0, 1).toUpperCase() : <UserRound size={17} />}</span><span className="profile-label">{family?.parent || 'Sua família'}<small>Nosso cantinho</small></span><ChevronDown size={14} /></Button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="page-footer"><span className="footer-brand">especial kidflix.</span><span>Aprender, brincar e crescer. Juntos.<Heart size={12} /></span></footer>
    </div>
    <Dialog open={familyOpen} onOpenChange={setFamilyOpen}><DialogContent className="family-dialog"><span className="dialog-symbol"><Heart /></span><DialogTitle className="text-2xl">Um cantinho da sua família</DialogTitle><DialogDescription>Como podemos chamar você e seu pequeno?</DialogDescription><FamilyForm onSaved={() => setFamilyOpen(false)} /></DialogContent></Dialog>
  </div>;
}
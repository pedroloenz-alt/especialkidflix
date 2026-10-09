import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles, BookOpen, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KidflixShell, FamilyForm } from '@/components/kidflix-shell';
import { ModuleLibrary } from '@/components/module-library';
import { useFamily } from '@/lib/family';
import { pageHead } from '@/lib/modules';
import hero from '@/assets/kidflix-hero.jpg';
export const Route = createFileRoute("/")({
  head: () => pageHead('Seu universo de descobertas', 'Materiais educativos para aprender, brincar e crescer. Descubra os nove módulos do Especial Kidflix.'),
  component: Index,
});
function Index() {
  const { family, completed, ready } = useFamily();
  return <KidflixShell>
    <section className="home-hero"><img src={hero} alt="Duas crianças descobrindo um livro junto a brinquedos coloridos" width={1536} height={864} fetchPriority="high" className="hero-image" /><div className="hero-shade" /><div className="hero-content"><span className="hero-eyebrow"><Sparkles size={13} /> APRENDER É UMA GRANDE AVENTURA</span><h1><span>Especial</span>Kidflix<span className="hero-title-dot">.</span></h1><p>Um universo de descobertas.<br />No tempo de cada criança.</p><Button className="hero-cta" onClick={() => document.getElementById('biblioteca')?.scrollIntoView({ behavior: 'smooth' })}>Explorar os módulos<ArrowRight size={17} /></Button><div className="hero-meta"><span><BookOpen size={14} />9 módulos especiais</span><i /><span><Heart size={14} />Infinitas possibilidades</span></div></div><span className="hero-caption">CADA PEQUENA CONQUISTA IMPORTA.</span></section>
    <section className="welcome-section"><div className="welcome-copy"><span className="greeting-icon"><Sparkles size={22} /></span><div><h2>{family ? `Olá, ${family.parent}!` : 'Olá, que bom ter você aqui!'}<span className="greeting-dot"> ✦</span></h2><p>{family ? `Que tal uma nova descoberta com ${family.child} hoje?` : 'Este é o começo de uma jornada cheia de possibilidades.'}</p></div></div>{family && <div className="journey-count"><span><Check size={14} /> SUA JORNADA</span><strong>{completed.length}<small> / 9 módulos explorados</small></strong></div>}{ready && !family && <FamilyForm />}</section>
    <ModuleLibrary compact />
    <section className="closing-note"><Heart size={19} /><div><h3>Cada criança tem seu próprio tempo.</h3><p>E cada momento juntos é uma oportunidade de florescer.</p></div><span>COM CARINHO, ESPECIAL KIDFLIX</span></section>
  </KidflixShell>;
}

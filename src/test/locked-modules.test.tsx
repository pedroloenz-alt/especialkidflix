import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LockedModuleCard } from '@/components/locked-module-card';
import { extraModules, modules } from '@/lib/modules';

describe('Locked extra modules', () => {
  it('keeps offers separate from the nine downloadable modules', () => {
    expect(modules).toHaveLength(9);
    expect(extraModules).toHaveLength(2);
    for (const module of extraModules) {
      expect(module.locked).toBe(true);
      expect(module).not.toHaveProperty('steps');
    }
  });

  it('attaches each deliverable to its own kit', () => {
    const regulacao = extraModules.find(m => m.id === 'kit-regulacao-emocional');
    const autonomia = extraModules.find(m => m.id === 'kit-autonomia');
    expect(regulacao?.pdf).toContain('kit-regulacao-emocional.pdf');
    expect(autonomia?.pdf).toContain('kit-autonomia.pdf');
    expect(regulacao?.pdf).not.toBe(autonomia?.pdf);
    expect(regulacao?.pages).toBe(19);
    expect(autonomia?.pages).toBe(21);
  });

  it('shows each title, invitation and lock without access controls', () => {
    extraModules.forEach((module, index) => {
      const html = renderToStaticMarkup(<LockedModuleCard module={module} index={index} />);
      expect(html).toContain(module.title);
      expect(html).toContain('Tenha acesso ao módulo extra!');
      expect(html).toContain('Bloqueado');
      expect(html).toContain('module-lock');
      expect(html).toContain(`${module.pages} páginas`);
      expect(html).not.toContain('assets-v1');
      expect(html).not.toContain('<a ');
      expect(html).not.toContain('<button');
      expect(html).not.toContain('<iframe');
    });
  });
});

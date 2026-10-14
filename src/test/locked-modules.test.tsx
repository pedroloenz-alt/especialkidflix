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

  it('attaches each deliverable and its own Cakto checkout to its kit', () => {
    const regulacao = extraModules.find(m => m.id === 'kit-regulacao-emocional');
    const autonomia = extraModules.find(m => m.id === 'kit-autonomia');
    expect(regulacao?.pdf).toContain('kit-regulacao-emocional.pdf');
    expect(autonomia?.pdf).toContain('kit-autonomia.pdf');
    expect(regulacao?.pdf).not.toBe(autonomia?.pdf);
    expect(regulacao?.buyUrl).toBe('https://pay.cakto.com.br/7qj468z_1188129');
    expect(autonomia?.buyUrl).toBe('https://pay.cakto.com.br/mg4ewrv_1188138');
    expect(regulacao?.buyUrl).not.toBe(autonomia?.buyUrl);
  });

  it('shows title, invitation, lock and buy button without exposing the deliverable', () => {
    extraModules.forEach((module, index) => {
      const html = renderToStaticMarkup(<LockedModuleCard module={module} index={index} />);
      expect(html).toContain(module.title);
      expect(html).toContain('Tenha acesso ao módulo extra!');
      expect(html).toContain('Bloqueado');
      expect(html).toContain('module-lock');
      expect(html).toContain('Comprar agora');
      expect(html).toContain(module.buyUrl);
      expect(html).not.toContain(`${module.pages} páginas`);
      expect(html).not.toContain(module.pdf);
      expect(html).not.toContain('assets-v1');
      expect(html).not.toContain('<iframe');
    });
  });
});

import pdfRegulacao from '@/assets/kit-regulacao-emocional.pdf.asset.json';
import pdfAutonomia from '@/assets/kit-autonomia.pdf.asset.json';

// Server-only map: Cakto product id -> kit key, and kit key -> deliverable.
export const caktoProductToKit: Record<string, string> = {
  '1188129': 'kit-regulacao-emocional',
  '1188138': 'kit-autonomia',
};

export const kitDeliverables: Record<string, string> = {
  'kit-regulacao-emocional': pdfRegulacao.url,
  'kit-autonomia': pdfAutonomia.url,
};

export function resolveKitKey(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    if (c == null) continue;
    const s = String(c);
    for (const [id, key] of Object.entries(caktoProductToKit)) if (s === id || s.endsWith(`_${id}`)) return key;
  }
  return null;
}

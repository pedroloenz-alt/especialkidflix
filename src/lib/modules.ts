import cover1 from '@/assets/module-1.jpg';
import cover2 from '@/assets/module-2.jpg';
import cover3 from '@/assets/module-3.jpg';
import cover4 from '@/assets/module-4.jpg';
import cover5 from '@/assets/module-5.jpg';
import cover6 from '@/assets/module-6.jpg';
import cover7 from '@/assets/module-7.jpg';
import cover8 from '@/assets/module-8.jpg';
import cover9 from '@/assets/module-9.jpg';
import pdf1 from '@/assets/alfabeto.pdf.asset.json';
import pdf2 from '@/assets/animais.pdf.asset.json';
import pdf3 from '@/assets/bingo.pdf.asset.json';
import pdf4 from '@/assets/coordenacao.pdf.asset.json';
import pdf5 from '@/assets/rotina-visual.pdf.asset.json';
import pdf6 from '@/assets/movimento.pdf.asset.json';
import pdf7 from '@/assets/palavras.pdf.asset.json';
import pdf8 from '@/assets/rotina-escolar.pdf.asset.json';
import pdf9 from '@/assets/sons.pdf.asset.json';

export const modules = [
  { id: 'alfabeto', title: 'Alfabeto Sensorial', category: 'Alfabetização', cover: cover1, pdf: pdf1.url, pages: 28, subtitle: 'Pequenos toques, grandes descobertas.', description: 'Explore as letras com pintura e atividades táteis que estimulam a coordenação motora fina.', materials: 'Tinta guache, cotonetes ou os dedinhos da criança.', steps: ['Imprima a letra que vocês vão explorar.', 'Convide a criança a preencher as bolinhas com tinta.', 'Conversem sobre a letra e palavras que começam com ela.'] },
  { id: 'animais', title: 'Animais de Recorte', category: 'Coordenação motora', cover: cover2, pdf: pdf2.url, pages: 14, subtitle: 'Uma aventura para criar com as mãos.', description: 'Animais ilustrados para recortar, combinar e montar, desenvolvendo criatividade e habilidades manuais.', materials: 'Papel, cola e tesoura infantil sem ponta, com supervisão.', steps: ['Escolham um animal no material.', 'Recortem as partes juntos, respeitando o ritmo da criança.', 'Montem o animal e inventem uma história.'] },
  { id: 'bingo', title: 'Bingo de Palavras', category: 'Alfabetização', cover: cover3, pdf: pdf3.url, pages: 36, subtitle: 'Cada palavra, uma nova conquista.', description: 'Cartelas e fichas ilustradas para brincar com o reconhecimento de palavras e a leitura.', materials: 'Cartelas impressas e pequenos marcadores.', steps: ['Preparem as cartelas e recortem as fichas.', 'Sorteie uma palavra e leia com a criança.', 'Marquem as palavras encontradas na cartela.'] },
  { id: 'coordenacao', title: 'Coordenação em Ação', category: 'Coordenação motora', cover: cover4, pdf: pdf4.url, pages: 6, subtitle: 'Traços que abrem novos caminhos.', description: 'Pontilhados, formas e caminhos para praticar os movimentos das mãos com leveza.', materials: 'Lápis de cor, giz de cera e folhas impressas.', steps: ['Escolham uma folha de atividade.', 'Acompanhem os pontilhados com o dedo antes do lápis.', 'Completem os traçados e pintem os desenhos.'] },
  { id: 'rotina-visual', title: 'Minha Rotina Visual', category: 'Rotina e autonomia', cover: cover5, pdf: pdf5.url, pages: 30, subtitle: 'Um dia mais previsível e acolhedor.', description: 'Flash cards de rotina, emoções e atividades do cotidiano para apoiar a comunicação e a autonomia de crianças autistas.', materials: 'Cartões impressos, tesoura e uma base para organizar a sequência.', steps: ['Escolham os cartões que fazem parte do dia da criança.', 'Organizem uma sequência simples de atividades.', 'Revisitem os cartões ao longo do dia, acolhendo as necessidades da criança.'] },
  { id: 'movimento', title: 'Kit Movimento', category: 'Coordenação motora', cover: cover6, pdf: pdf6.url, pages: 7, subtitle: 'Aprender também é se movimentar.', description: 'Moldes de mãos e formas para montar um tapete de coordenação ritmada e brincar com sequências.', materials: 'Cartolina, papelão, EVA ou tecido, cola e moldes impressos.', steps: ['Recortem e posicionem os moldes sobre uma base.', 'Demonstre uma sequência curta de movimentos.', 'Revezem quem cria e quem imita as sequências.'] },
  { id: 'palavras', title: 'Palavras Malucas', category: 'Alfabetização', cover: cover7, pdf: pdf7.url, pages: 19, subtitle: 'Juntar sílabas, descobrir possibilidades.', description: 'Peças com imagens e sílabas simples para recortar, reorganizar e formar palavras.', materials: 'Tesoura infantil, cola, caderno e peças impressas.', steps: ['Recortem as peças de uma página.', 'Experimentem combinar as sílabas com as imagens.', 'Cole a palavra formada no caderno e leiam juntos.'] },
  { id: 'rotina-escolar', title: 'Rotina Escolar TDAH', category: 'Rotina e autonomia', cover: cover8, pdf: pdf8.url, pages: 15, subtitle: 'Mais organização, menos pressa.', description: 'Um material visual de rotina escolar para apoiar a organização das atividades da criança.', materials: 'Material impresso e lápis ou canetas coloridas.', steps: ['Conheçam as páginas do material juntos.', 'Escolham os recursos que combinam com a rotina escolar.', 'Acompanhem as atividades respeitando o ritmo da criança.'] },
  { id: 'sons', title: 'Sons que Ensinam a Ler', category: 'Alfabetização', cover: cover9, pdf: pdf9.url, pages: 6, subtitle: 'A descoberta da leitura começa nos sons.', description: 'Pranchas de letras e movimentos da boca para explorar os sons da fala com um espelho.', materials: 'Um espelho e as pranchas impressas.', steps: ['Escolham uma letra da prancha.', 'Observem juntos como a boca se movimenta.', 'Experimentem o som e encontrem palavras com essa letra.'] },
];
export type KidModule = (typeof modules)[number];

export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} | Especial Kidflix` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} | Especial Kidflix` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}
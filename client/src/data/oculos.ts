import type { Oculos } from '../types';
import polidoPreto from '../assets/polido_preto.png';
import polidoTartaruga from '../assets/polido_tartaruga.png';
import outdoorsman from '../assets/outdoorsman.png';

export const oculos: Oculos[] = [
  {
    id: 1,
    nome: 'Wayfarer Classic Tartaruga',
    marca: 'Ray-Ban',
    preco: 990.0,
    preco_original: 1100.0,
    descricao: 'Estilo clássico atemporal',
    descricao_detalhada:
      'Ícone atemporal com armação em acetato tartaruga polido e lentes G-15. Proteção UV400 completa. Perfeito para o dia a dia.',
    imagem: polidoTartaruga,
    cor: 'Tartaruga',
    material: 'Acetato',
    tipo: 'Solar',
  },
  {
    id: 2,
    nome: 'Wayfarer Classic Preto',
    marca: 'Ray-Ban',
    preco: 990.0,
    preco_original: 1100.0,
    descricao: 'Estilo clássico atemporal',
    descricao_detalhada: 'Óculos aviador com lentes polarizadas e armação em metal dourado. Proteção UV400 completa. Ideal para uso diário e dirigir.',
    imagem: polidoPreto,
    cor: 'Preto',
    material: 'Metal',
    tipo: 'Solar',
  },
  {
    id: 3,
    nome: 'The Outdoorsman',
    marca: 'Dolce & Gabbana',
    preco: 3090.0,
    preco_original: 3200,
    descricao: 'Polido Dourado Artista',
    descricao_detalhada: 'Ouro branco transparente espelhado',
    imagem: outdoorsman,
    cor: 'Dourado',
    material: 'Metal',
    tipo: 'Solar',
  }
];

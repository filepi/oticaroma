import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'oculos.json');

const SEED = [
  {
    id: 1,
    nome: 'Wayfarer Classic Tartaruga',
    marca: 'Ray-Ban',
    preco: 990.0,
    preco_original: 1100.0,
    descricao: 'Estilo clássico atemporal',
    descricao_detalhada:
      'Ícone atemporal com armação em acetato tartaruga polido e lentes G-15. Proteção UV400 completa. Perfeito para o dia a dia.',
    imagem: '/uploads/oculos/polido_tartaruga.png',
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
    descricao_detalhada:
      'Wayfarer clássico com armação preta polida e lentes G-15. Proteção UV400 completa. Ideal para uso diário.',
    imagem: '/uploads/oculos/polido_preto.png',
    cor: 'Preto',
    material: 'Acetato',
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
    imagem: '/uploads/oculos/outdoorsman.png',
    cor: 'Dourado',
    material: 'Metal',
    tipo: 'Solar',
  },
];

function loadOculos() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(SEED, null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function saveOculos(oculos) {
  fs.writeFileSync(FILE, JSON.stringify(oculos, null, 2));
}

export function getAllOculos() {
  return loadOculos();
}

export function getOculosById(id) {
  return loadOculos().find((o) => o.id === id) ?? null;
}

export function addOculos(oculos) {
  const items = loadOculos();
  const novo = {
    id: items.length > 0 ? Math.max(...items.map((o) => o.id)) + 1 : 1,
    ...oculos,
  };
  items.push(novo);
  saveOculos(items);
  return novo;
}

export function deleteOculos(id) {
  const items = loadOculos();
  const index = items.findIndex((o) => o.id === id);
  if (index === -1) return null;
  const [removed] = items.splice(index, 1);
  saveOculos(items);
  return removed;
}

export function updateOculos(id, data) {
  const items = loadOculos();
  const index = items.findIndex((o) => o.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...data, id };
  saveOculos(items);
  return items[index];
}

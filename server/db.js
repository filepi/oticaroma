import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'oticaroma.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS membros_clube (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    data_nascimento TEXT NOT NULL,
    cupom_fiscal TEXT NOT NULL,
    criado_em TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS oculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    marca TEXT NOT NULL,
    preco REAL NOT NULL,
    preco_original REAL,
    descricao TEXT NOT NULL,
    descricao_detalhada TEXT NOT NULL,
    imagem TEXT NOT NULL,
    cor TEXT,
    material TEXT,
    tipo TEXT
  );
`);

const count = db.prepare('SELECT COUNT(*) as total FROM oculos').get();
if (count.total === 0) {
  const insert = db.prepare(`
    INSERT INTO oculos (nome, marca, preco, preco_original, descricao, descricao_detalhada, imagem, cor, material, tipo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const produtos = [
    ['Classic Aviator', 'Ray-Ban', 459.90, 599.90, 'Estilo clássico atemporal', 'Óculos aviador com lentes polarizadas e armação em metal dourado. Proteção UV400 completa. Ideal para uso diário e dirigir.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop', 'Dourado', 'Metal', 'Solar'],
    ['Urban Square', 'Oakley', 389.00, null, 'Design moderno e urbano', 'Armação quadrada em acetato premium. Leve, confortável e com estilo contemporâneo. Perfeito para o dia a dia no escritório.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=400&fit=crop', 'Preto', 'Acetato', 'Grau'],
    ['Sport Pro', 'Nike Vision', 529.00, 649.00, 'Performance esportiva', 'Desenvolvido para atletas. Armação flexível, anti-impacto e com grip nas hastes. Lentes fotocromáticas inclusas.', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=400&fit=crop', 'Azul', 'TR90', 'Solar'],
    ['Elegance Round', 'Prada', 799.00, null, 'Sofisticação italiana', 'Armação redonda em acetate italiano de alta qualidade. Detalhes dourados nas hastes. Peça exclusiva para quem busca elegância.', 'https://images.unsplash.com/photo-1473496163314-62c4bddad304?w=600&h=400&fit=crop', 'Tartaruga', 'Acetato', 'Grau'],
    ['Kids Fun', 'Lentes Plus', 199.90, 249.90, 'Diversão para os pequenos', 'Armação infantil resistente e colorida. Lentes com proteção UV e tratamento anti-risco. Ajuste confortável para crianças de 4 a 12 anos.', 'https://images.unsplash.com/photo-1591076482161-42ce184806ba?w=600&h=400&fit=crop', 'Rosa', 'Silicone', 'Grau'],
    ['Retro Cat Eye', 'Vogue', 349.00, 429.00, 'Retrô com charme', 'Inspirado nos anos 50, este cat eye traz personalidade e feminilidade. Armação leve com detalhes brilhantes nas laterais.', 'https://images.unsplash.com/photo-1509695507497-903cf118d43d?w=600&h=400&fit=crop', 'Vermelho', 'Acetato', 'Grau'],
  ];

  for (const p of produtos) {
    insert.run(...p);
  }
}

export default db;

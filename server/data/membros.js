import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'membros-clube.json');

function loadMembros() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, '[]');
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function saveMembros(membros) {
  fs.writeFileSync(FILE, JSON.stringify(membros, null, 2));
}

export function addMembro(membro) {
  const membros = loadMembros();

  if (membros.some((m) => m.cpf === membro.cpf)) {
    const err = new Error('CPF já cadastrado no clube.');
    err.code = 'DUPLICATE_CPF';
    throw err;
  }

  const novo = {
    id: membros.length > 0 ? Math.max(...membros.map((m) => m.id)) + 1 : 1,
    ...membro,
    criado_em: new Date().toISOString(),
  };

  membros.push(novo);
  saveMembros(membros);
  return novo;
}

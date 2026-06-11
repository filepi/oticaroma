import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, 'usuarios.json');

const SEED = [
  {
    id: 1,
    usuario: 'admthais',
    senha: '817510',
    criado_em: new Date().toISOString(),
  },
];

function loadUsuarios() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(SEED, null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function saveUsuarios(usuarios) {
  fs.writeFileSync(FILE, JSON.stringify(usuarios, null, 2));
}

export function findUsuario(usuario, senha) {
  return loadUsuarios().find((u) => u.usuario === usuario && u.senha === senha) ?? null;
}

export function getAllUsuarios() {
  return loadUsuarios().map(({ senha: _senha, ...rest }) => rest);
}

export function addUsuario({ usuario, senha }) {
  const usuarios = loadUsuarios();

  if (usuarios.some((u) => u.usuario === usuario)) {
    const err = new Error('Usuário já cadastrado.');
    err.code = 'DUPLICATE_USER';
    throw err;
  }

  const novo = {
    id: usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
    usuario,
    senha,
    criado_em: new Date().toISOString(),
  };

  usuarios.push(novo);
  saveUsuarios(usuarios);

  const { senha: _senha, ...publico } = novo;
  return publico;
}

export function deleteUsuario(id) {
  const usuarios = loadUsuarios();

  if (usuarios.length <= 1) {
    const err = new Error('Não é possível excluir o último usuário.');
    err.code = 'LAST_USER';
    throw err;
  }

  const index = usuarios.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const [removed] = usuarios.splice(index, 1);
  saveUsuarios(usuarios);

  const { senha: _senha, ...publico } = removed;
  return publico;
}

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
    nivel: 'admin',
    criado_em: new Date().toISOString(),
  },
];

function normalizeUsuario(usuario) {
  return {
    ...usuario,
    nivel: usuario.nivel === 'admin' ? 'admin' : 'operacional',
  };
}

function loadUsuarios() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(SEED, null, 2));
  }
  const usuarios = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  return usuarios.map((u) =>
    normalizeUsuario(u.usuario === 'admthais' && !u.nivel ? { ...u, nivel: 'admin' } : u)
  );
}

function saveUsuarios(usuarios) {
  fs.writeFileSync(FILE, JSON.stringify(usuarios, null, 2));
}

export function findUsuario(usuario, senha) {
  const user = loadUsuarios().find((u) => u.usuario === usuario && u.senha === senha);
  if (!user) return null;
  const { senha: _senha, ...publico } = user;
  return normalizeUsuario(publico);
}

export function getAllUsuarios() {
  return loadUsuarios().map(({ senha: _senha, ...rest }) => normalizeUsuario(rest));
}

export function addUsuario({ usuario, senha, nivel = 'operacional' }) {
  const usuarios = loadUsuarios();

  if (usuarios.some((u) => u.usuario === usuario)) {
    const err = new Error('Usuário já cadastrado.');
    err.code = 'DUPLICATE_USER';
    throw err;
  }

  const novo = normalizeUsuario({
    id: usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1,
    usuario,
    senha,
    nivel,
    criado_em: new Date().toISOString(),
  });

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
  return normalizeUsuario(publico);
}

export function updateUsuario(id, { usuario, senha, nivel }) {
  const usuarios = loadUsuarios();
  const index = usuarios.findIndex((u) => u.id === id);
  if (index === -1) return null;

  if (usuarios.some((u) => u.usuario === usuario && u.id !== id)) {
    const err = new Error('Usuário já cadastrado.');
    err.code = 'DUPLICATE_USER';
    throw err;
  }

  const nivelValido = nivel === 'admin' ? 'admin' : 'operacional';
  const current = usuarios[index];

  if (current.nivel === 'admin' && nivelValido === 'operacional') {
    const adminCount = usuarios.filter((u) => u.nivel === 'admin').length;
    if (adminCount <= 1) {
      const err = new Error('Não é possível remover o último administrador.');
      err.code = 'LAST_ADMIN';
      throw err;
    }
  }

  const updated = normalizeUsuario({
    ...current,
    usuario,
    nivel: nivelValido,
    ...(senha ? { senha } : {}),
  });

  usuarios[index] = updated;
  saveUsuarios(usuarios);

  const { senha: _senha, ...publico } = updated;
  return publico;
}

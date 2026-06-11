import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { addMembro } from './data/membros.js';
import { getAllOculos, getOculosById, addOculos, deleteOculos, updateOculos } from './data/oculos.js';
import { findUsuario, getAllUsuarios, addUsuario, deleteUsuario, updateUsuario } from './data/usuarios.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const sessions = new Map();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const oculosStorage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads', 'oculos'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não permitido. Use PDF, JPG ou PNG.'));
    }
  },
});

const oculosUpload = multer({
  storage: oculosStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Formato de imagem não permitido. Use JPG, PNG ou WEBP.'));
    }
  },
});

function validarCPF(cpf) {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
}

function getSession(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  return sessions.get(auth.slice(7)) ?? null;
}

function requireAuth(req, res, next) {
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }
  req.session = session;
  next();
}

function requireAdmin(req, res, next) {
  if (req.session?.nivel !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
  next();
}

app.get('/api/oculos', (_req, res) => {
  res.json(getAllOculos());
});

app.get('/api/oculos/:id', (req, res) => {
  const item = getOculosById(Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Óculos não encontrado.' });
  }
  res.json(item);
});

app.post('/api/admin/login', (req, res) => {
  const { usuario, senha } = req.body;
  const user = findUsuario(usuario, senha);
  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
  }
  const token = uuidv4();
  sessions.set(token, {
    userId: user.id,
    usuario: user.usuario,
    nivel: user.nivel,
  });
  res.json({ token, nivel: user.nivel, usuario: user.usuario });
});

app.get('/api/admin/usuarios', requireAuth, (_req, res) => {
  res.json(getAllUsuarios());
});

app.post('/api/admin/usuarios', requireAuth, requireAdmin, (req, res) => {
  try {
    const { usuario, senha, nivel } = req.body;

    if (!usuario?.trim()) {
      return res.status(400).json({ error: 'Usuário é obrigatório.' });
    }
    if (!/^\d{6}$/.test(senha)) {
      return res.status(400).json({ error: 'A senha deve ter exatamente 6 dígitos.' });
    }

    const nivelValido = nivel === 'admin' ? 'admin' : 'operacional';
    const novo = addUsuario({ usuario: usuario.trim(), senha, nivel: nivelValido });
    res.status(201).json(novo);
  } catch (err) {
    if (err.code === 'DUPLICATE_USER') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

app.put('/api/admin/usuarios/:id', requireAuth, requireAdmin, (req, res) => {
  try {
    const { usuario, senha, nivel } = req.body;

    if (!usuario?.trim()) {
      return res.status(400).json({ error: 'Usuário é obrigatório.' });
    }
    if (senha !== undefined && senha !== '' && !/^\d{6}$/.test(senha)) {
      return res.status(400).json({ error: 'A senha deve ter exatamente 6 dígitos.' });
    }

    const nivelValido = nivel === 'admin' ? 'admin' : 'operacional';
    const atualizado = updateUsuario(Number(req.params.id), {
      usuario: usuario.trim(),
      senha: senha || undefined,
      nivel: nivelValido,
    });

    if (!atualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(atualizado);
  } catch (err) {
    if (err.code === 'DUPLICATE_USER' || err.code === 'LAST_ADMIN') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao atualizar usuário.' });
  }
});

app.delete('/api/admin/usuarios/:id', requireAuth, requireAdmin, (req, res) => {
  try {
    const removed = deleteUsuario(Number(req.params.id));
    if (!removed) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ message: 'Usuário removido com sucesso.', usuario: removed.usuario });
  } catch (err) {
    if (err.code === 'LAST_USER') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao excluir usuário.' });
  }
});

app.post('/api/admin/logout', requireAuth, (req, res) => {
  const token = req.headers.authorization.slice(7);
  sessions.delete(token);
  res.json({ message: 'Logout realizado.' });
});

function parseOculosBody(body, { requireImage, hasImage }) {
  const { nome, marca, preco, preco_original, descricao, descricao_detalhada, cor, material, tipo } =
    body;

  if (!nome?.trim()) {
    return { error: 'Nome é obrigatório.' };
  }
  if (!marca?.trim()) {
    return { error: 'Marca é obrigatória.' };
  }
  if (!preco || Number.isNaN(Number(preco))) {
    return { error: 'Preço inválido.' };
  }
  if (!descricao?.trim()) {
    return { error: 'Descrição curta é obrigatória.' };
  }
  if (!descricao_detalhada?.trim()) {
    return { error: 'Descrição detalhada é obrigatória.' };
  }
  if (requireImage && !hasImage) {
    return { error: 'Imagem é obrigatória.' };
  }
  if (!cor?.trim() || !material?.trim() || !tipo?.trim()) {
    return { error: 'Cor, material e tipo são obrigatórios.' };
  }

  const precoOriginal =
    preco_original && !Number.isNaN(Number(preco_original)) ? Number(preco_original) : null;

  return {
    data: {
      nome: nome.trim(),
      marca: marca.trim(),
      preco: Number(preco),
      preco_original: precoOriginal,
      descricao: descricao.trim(),
      descricao_detalhada: descricao_detalhada.trim(),
      cor: cor.trim(),
      material: material.trim(),
      tipo: tipo.trim(),
    },
  };
}

app.post('/api/admin/oculos', requireAuth, oculosUpload.single('imagem'), (req, res) => {
  try {
    const parsed = parseOculosBody(req.body, { requireImage: true, hasImage: !!req.file });
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    const item = addOculos({
      ...parsed.data,
      imagem: `/uploads/oculos/${req.file.filename}`,
    });

    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar oferta.' });
  }
});

app.put('/api/admin/oculos/:id', requireAuth, oculosUpload.single('imagem'), (req, res) => {
  try {
    const existing = getOculosById(Number(req.params.id));
    if (!existing) {
      return res.status(404).json({ error: 'Oferta não encontrada.' });
    }

    const parsed = parseOculosBody(req.body, { requireImage: false, hasImage: !!req.file });
    if (parsed.error) {
      return res.status(400).json({ error: parsed.error });
    }

    const item = updateOculos(Number(req.params.id), {
      ...parsed.data,
      imagem: req.file ? `/uploads/oculos/${req.file.filename}` : existing.imagem,
    });

    res.json(item);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar oferta.' });
  }
});

app.delete('/api/admin/oculos/:id', requireAuth, (req, res) => {
  const removed = deleteOculos(Number(req.params.id));
  if (!removed) {
    return res.status(404).json({ error: 'Oferta não encontrada.' });
  }
  res.json({ message: 'Oferta removida com sucesso.' });
});

app.post('/api/clube', upload.single('cupom_fiscal'), (req, res) => {
  try {
    const { nome_completo, cpf, data_nascimento } = req.body;

    if (!nome_completo?.trim()) {
      return res.status(400).json({ error: 'Nome completo é obrigatório.' });
    }
    if (!cpf || !validarCPF(cpf)) {
      return res.status(400).json({ error: 'CPF inválido.' });
    }
    if (!data_nascimento) {
      return res.status(400).json({ error: 'Data de nascimento é obrigatória.' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Cupom fiscal é obrigatório.' });
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    const membro = addMembro({
      nome_completo: nome_completo.trim(),
      cpf: cpfLimpo,
      data_nascimento,
      cupom_fiscal: req.file.filename,
    });

    res.status(201).json({
      message: 'Cadastro realizado com sucesso! Bem-vindo ao Clube de Benefícios.',
      id: membro.id,
    });
  } catch (err) {
    if (err.code === 'DUPLICATE_CPF') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Erro ao processar cadastro.' });
  }
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB.' });
  }
  res.status(400).json({ error: err.message || 'Erro desconhecido.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Porta ${PORT} já está em uso. Encerre o processo antigo com: lsof -ti:${PORT} | xargs kill -9`);
  } else {
    console.error('Erro ao iniciar servidor:', err.message);
  }
  process.exit(1);
});

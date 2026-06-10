import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { oculos } from './data/oculos.js';
import { addMembro } from './data/membros.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

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

app.get('/api/oculos', (_req, res) => {
  res.json(oculos);
});

app.get('/api/oculos/:id', (req, res) => {
  const item = oculos.find((o) => o.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Óculos não encontrado.' });
  }
  res.json(item);
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

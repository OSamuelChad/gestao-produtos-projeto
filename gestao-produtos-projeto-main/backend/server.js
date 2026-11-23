const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo-em-producao';
const JWT_EXPIRES_IN = '2h';
const DB_FILE = path.join(__dirname, 'data.json');

// ---------- "Banco de dados" em arquivo JSON ----------
const seed = {
  seq: 5,
  produtos: [
    { id: 1, nome: 'Notebook Dell Inspiron', descricao: 'Notebook 15" com 16 GB de RAM e SSD de 512 GB.', preco: 3899.9, categoria: 'Informática' },
    { id: 2, nome: 'Mouse sem fio Logitech', descricao: 'Mouse ergonômico com conexão Bluetooth.', preco: 129.9, categoria: 'Periféricos' },
    { id: 3, nome: 'Cadeira Gamer', descricao: 'Cadeira reclinável com apoio lombar.', preco: 1299, categoria: 'Móveis' },
    { id: 4, nome: 'Monitor 27" 4K', descricao: 'Monitor IPS com resolução 4K e HDR.', preco: 2199.5, categoria: 'Informática' },
  ],
};

function loadDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
    return structuredClone(seed);
  }
}
const db = loadDb();
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

// ---------- Usuário de demonstração ----------
const usuarios = [
  { id: 1, nome: 'Administrador', email: 'admin@exemplo.com', senhaHash: bcrypt.hashSync('123456', 10) },
];

// ---------- App ----------
const app = express();
app.use(cors());
app.use(express.json());

// Middleware que protege a API: exige "Authorization: Bearer <token>"
function autenticar(req, res, next) {
  const header = req.headers.authorization || '';
  const [tipo, token] = header.split(' ');
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Token não informado.' });
  }
  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}

function validarProduto(body) {
  const erros = [];
  const { nome, descricao, preco, categoria } = body ?? {};
  if (typeof nome !== 'string' || nome.trim().length < 3) erros.push('nome deve ter ao menos 3 caracteres');
  if (typeof descricao !== 'string' || descricao.trim().length < 1) erros.push('descricao é obrigatória');
  if (typeof preco !== 'number' || !(preco >= 0)) erros.push('preco deve ser um número maior ou igual a 0');
  if (typeof categoria !== 'string' || categoria.trim().length < 1) erros.push('categoria é obrigatória');
  return erros;
}

// ---------- Autenticação ----------
app.post('/api/auth/login', (req, res) => {
  const { email, senha } = req.body ?? {};
  const usuario = usuarios.find((u) => u.email === email);
  if (!usuario || !bcrypt.compareSync(String(senha ?? ''), usuario.senhaHash)) {
    return res.status(401).json({ mensagem: 'E-mail ou senha inválidos.' });
  }
  const token = jwt.sign({ sub: usuario.id, nome: usuario.nome, email: usuario.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
});

// ---------- CRUD de produtos (protegido) ----------
const router = express.Router();
router.use(autenticar);

router.get('/', (_req, res) => res.json(db.produtos));

router.get('/:id', (req, res) => {
  const produto = db.produtos.find((p) => p.id === Number(req.params.id));
  if (!produto) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  res.json(produto);
});

router.post('/', (req, res) => {
  const erros = validarProduto(req.body);
  if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
  const { nome, descricao, preco, categoria } = req.body;
  const produto = { id: db.seq++, nome: nome.trim(), descricao: descricao.trim(), preco, categoria: categoria.trim() };
  db.produtos.push(produto);
  save();
  res.status(201).json(produto);
});

router.put('/:id', (req, res) => {
  const idx = db.produtos.findIndex((p) => p.id === Number(req.params.id));
  if (idx < 0) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  const erros = validarProduto(req.body);
  if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
  const { nome, descricao, preco, categoria } = req.body;
  db.produtos[idx] = { id: db.produtos[idx].id, nome: nome.trim(), descricao: descricao.trim(), preco, categoria: categoria.trim() };
  save();
  res.json(db.produtos[idx]);
});

router.delete('/:id', (req, res) => {
  const idx = db.produtos.findIndex((p) => p.id === Number(req.params.id));
  if (idx < 0) return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  db.produtos.splice(idx, 1);
  save();
  res.status(204).end();
});

app.use('/api/produtos', router);

app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}/api`));

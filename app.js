require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/loginRoutes');       // ✅ corrigido nome
const logoutRouter = require('./routes/logoutRoutes');     // ✅ corrigido nome
const clientesRoutes = require('./routes/clientesRoutes'); // ✅ corrigido nome
const produtosRoutes = require('./routes/produtosRoutes'); // ✅ corrigido nome
const usuariosRoutes = require('./routes/usuariosRoutes'); // ✅ adicionado

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// 🔐 Rotas protegidas e públicas
app.use('/clientes', clientesRoutes);      // requer JWT
app.use('/produtos', produtosRoutes);      // público
app.use('/usuarios', usuariosRoutes);      // criar e listar usuários
app.use('/login', loginRouter);            // autenticação
app.use('/logout', logoutRouter);          // invalida token
app.use('/', indexRouter);                 // rota raiz

// 🔔 fallback (opcional)
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

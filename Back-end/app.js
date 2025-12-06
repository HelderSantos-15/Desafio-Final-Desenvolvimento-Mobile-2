require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authMiddleware = require('./middlewares/authMiddleware');

const indexRouter = require('./routes/index'); // rota padrão (pode ser uma rota simples)
const loginRouter = require('./routes/loginRoutes');
const logoutRouter = require('./routes/logoutRoutes'); // opcional: implementar logout que usa tokenService
const clientesRoutes = require('./routes/clientesRoutes');
const produtosRoutes = require('./routes/produtosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');

const app = express();

// Segurança básica e parsers
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Rotas públicas
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/produtos', produtosRoutes);
app.use('/usuarios', usuariosRoutes);

// Rotas PROTEGIDAS: todas rotas a seguir usarão authMiddleware
// Aqui aplicamos authMiddleware somente para o path /clientes
app.use('/clientes', authMiddleware, clientesRoutes);

// Fallback 404
app.use('*', (req, res) => {
res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

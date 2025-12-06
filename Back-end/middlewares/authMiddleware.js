  const jwt = require('jsonwebtoken');
  const tokenService = require('../services/tokenService'); // opcional: comentar se não usar blacklist

module.exports = function (req, res, next) {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (!token) return res.status(401).json({ error: 'Token não fornecido' });

// se estiver usando blacklist/tokenService, verifique aqui
if (tokenService && tokenService.tokenEstaInvalido && tokenService.tokenEstaInvalido(token)) {
return res.status(403).json({ error: 'Token inválido (logout)' });
}

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.usuario = decoded; // dados do token disponíveis nos controllers
req.token = token;     // útil se quiser invalidar no logout
next();
} catch (err) {
return res.status(403).json({ error: 'Token inválido ou expirado' });
}
};

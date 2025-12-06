// services/tokenService.js

// Blacklist em memória (para fins de demonstração)
const tokensInvalidos = new Set();

// Invalida o token atual
function invalidarToken(token) {
  tokensInvalidos.add(token);
  console.log(`🔒 Token invalidado: ${token}`);
}

// Verifica se o token está inválido
function tokenEstaInvalido(token) {
  return tokensInvalidos.has(token);
}

// Utilitário opcional para expirar tokens antigos, caso use redis etc.
function invalidateExpiredTokens() {
  console.log('🕓 Verificação programada de tokens expirados (placeholder)');
}

module.exports = {
  invalidarToken,
  tokenEstaInvalido,
  invalidateExpiredTokens,
};

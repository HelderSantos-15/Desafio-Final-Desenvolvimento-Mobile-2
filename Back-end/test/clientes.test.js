const request = require('supertest');
const app = require('../app');

let token = '';

beforeAll(async () => {
  // Autentica e armazena o token
  const res = await request(app)
    .post('/login')
    .send({ usuario: 'admin', senha: '123456' }); // use credenciais válidas do seu banco

  token = res.body.token;
});

describe('🔐 Testes de autenticação e validações - /clientes', () => {
  it('deve recusar acesso sem token', async () => {
    const res = await request(app).get('/clientes');
    expect(res.statusCode).toBe(401);
  });

  it('deve recusar cliente com nome inválido (< 3 caracteres)', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Jo',
        sobrenome: 'Silva',
        email: 'jo@teste.com',
        idade: 25,
      });
    expect(res.statusCode).toBe(400);
  });

  it('deve recusar cliente com email inválido', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'email_invalido',
        idade: 25,
      });
    expect(res.statusCode).toBe(400);
  });

  it('deve criar cliente com dados válidos', async () => {
    const res = await request(app)
      .post('/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'João',
        sobrenome: 'Silva',
        email: 'joao@teste.com',
        idade: 30,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});

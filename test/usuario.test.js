const request = require('supertest');
const app = require('../app');

describe('👤 Testes do endpoint /usuarios', () => {
  it('deve criar um usuário com dados válidos', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        usuario: 'testeuser',
        senha: '123456',
        email: 'teste@exemplo.com'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.usuario).toBe('testeuser');
  });

  it('deve falhar ao criar usuário com email inválido', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        usuario: 'usuario2',
        senha: '123456',
        email: 'email-invalido'
      });

    expect(res.statusCode).toBe(400); // ou 422, dependendo da sua validação
    expect(res.body).toHaveProperty('erro');
  });

  it('deve listar os usuários cadastrados', async () => {
    const res = await request(app).get('/usuarios');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve falhar ao criar usuário com nome curto demais', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({
        usuario: 'us',
        senha: '123456',
        email: 'user@email.com'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });
});

# 🚀 Desafio Final – Desenvolvimento Back-end II

Este repositório contém o projeto desenvolvido como desafio final das disciplinas de **Desenvolvimento mobille II** do curso de Análise e Desenvolvimento de Sistemas do Unilavras.

## 👥 Integrantes do Grupo

- **Helder Santos**


## 📚 Descrição do Projeto

A aplicação consiste em uma **API RESTful desenvolvida em Node.js**, utilizando:

- ✅ Arquitetura modular (MVC)
- ✅ Autenticação com JWT
- ✅ Integração com banco de dados relacional (MySQL)
- ✅ Sistema de cache com `node-cache` ou Redis
- ✅ Testes automatizados com Jest e Supertest
- ✅ Versionamento com Git

---

## 🧾 Funcionalidades

A API implementa os seguintes recursos:

### 🔐 Autenticação
- `POST /login` → Recebe credenciais e retorna um token JWT.
- `POST /logout` → Invalida o token atual.

### 📦 Recursos com CRUD completo
- `/clientes` (protegido por JWT)
- `/produtos` (público)
- `/usuarios` (criação e listagem)

### 🌐 Endpoint padrão
- `GET /` → Retorna mensagem de boas-vindas.

---

## 🗃️ Estrutura do Banco de Dados

### 📋 Tabela: `clientes`
| Campo      | Tipo       |
|------------|------------|
| id         | INT (PK)   |
| nome       | VARCHAR    |
| sobrenome  | VARCHAR    |
| email      | VARCHAR    |
| idade      | INT        |

### 📋 Tabela: `produtos`
| Campo          | Tipo       |
|----------------|------------|
| id             | INT (PK)   |
| nome           | VARCHAR    |
| descricao      | VARCHAR    |
| preco          | DECIMAL    |
| data_atualizado| DATETIME   |

### 📋 Tabela: `usuarios`
| Campo     | Tipo       |
|-----------|------------|
| id        | INT (PK)   |
| usuario   | VARCHAR    |
| senha     | VARCHAR (hash com bcrypt) |
| token     | VARCHAR    |

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- JWT (jsonwebtoken)
- node-cache / Redis
- bcrypt
- dotenv
- Jest + Supertest
- Git e GitHub

---

## 🧪 Testes Automatizados

- Implementados com **Jest** e **Supertest**.
- Cobrem validações de campos:
  - Campos obrigatórios entre 3 e 255 caracteres.
  - Emails válidos.
  - Idade entre 1 e 119.
  - Preço positivo.
  - Datas entre 01/01/2000 e 20/06/2025.
- Testes de endpoints com e sem autenticação.

Execute com:

```bash
npm test
```

---

## ⚙️ Cache

- Implementado em `/clientes` com tempo de vida de 30 segundos.
- Logs no terminal indicam se a resposta veio do **cache** ou do **banco**.
- Cache é automaticamente invalidado ao adicionar, atualizar ou deletar um cliente.

---

## 📁 Estrutura de Diretórios

```
.
├── app.js
├── .env
├── .gitignore
├── package.json
├── README.md
├── configs/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
└── views/ (opcional)
```

---

## 🚀 Como Rodar o Projeto Localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o arquivo `.env`
Crie um arquivo `.env` com base no modelo abaixo:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=seu_banco
JWT_SECRET=sua_chave_secreta
TOKEN_EXPIRATION=300
```

### 4. Configure o banco de dados
- Crie as tabelas executando os scripts SQL em `models/`.
- Ou use um gerenciador como MySQL Workbench ou DBeaver.

### 5. Inicie o servidor
```bash
npm start
```

---

## 🧑‍💻 Interface Web (pontos extras)

> Se implementado, descreva aqui.

- Página inicial ✅  
- Tela de login/logout ✅  
- Listagem pública de produtos ✅  
- Listagem autenticada de clientes/usuários ✅  

---

## ✅ Checklist de Entrega

- [x] Repositório no GitHub
- [x] Estrutura modular
- [x] Git status sem pendências
- [x] Banco com dados
- [x] Demonstração de endpoints
- [x] Logs de cache
- [x] Testes com e sem autenticação
- [x] Testes automatizados
- [x] Interface web (extra)

---

---

## 📧 Contato

Professor responsável: [luccasrm@unilavras.edu.br](mailto:luccasrm@unilavras.edu.br)

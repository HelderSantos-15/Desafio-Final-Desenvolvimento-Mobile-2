# 🚀 Desafio Final – Desenvolvimento Mobile II & Backend II

Este repositório contém o projeto desenvolvido como **Desafio Final** das disciplinas de **Desenvolvimento Mobile II** e **Backend II** do curso de Análise e Desenvolvimento de Sistemas do Unilavras.

---

## 👥 Integrantes do Grupo

* **Helder Santos**

---

## 📚 Descrição do Projeto

O projeto consiste em duas partes integradas:

1. **Backend (Node.js)**:

   * API RESTful modular (MVC) com autenticação JWT.
   * Integração com banco de dados MySQL.
   * Sistema de cache (`node-cache` ou Redis).
   * Testes automatizados com Jest e Supertest.

2. **Frontend (Flutter)**:

   * App Flutter para gerenciar **clientes** e **produtos**.
   * CRUD completo para ambas as entidades.
   * Layout global e centralizado (`AppLayout`).
   * Feedback visual, validação de campos e navegação fluida.

---

## 🗃️ Estrutura do Banco de Dados (Backend)

### 📋 Tabela: `clientes`

| Campo     | Tipo     |
| --------- | -------- |
| id        | INT (PK) |
| nome      | VARCHAR  |
| sobrenome | VARCHAR  |
| email     | VARCHAR  |
| idade     | INT      |

### 📋 Tabela: `produtos`

| Campo           | Tipo     |
| --------------- | -------- |
| id              | INT (PK) |
| nome            | VARCHAR  |
| descricao       | VARCHAR  |
| preco           | DECIMAL  |
| data_atualizado | DATETIME |

### 📋 Tabela: `usuarios`

| Campo   | Tipo                      |
| ------- | ------------------------- |
| id      | INT (PK)                  |
| usuario | VARCHAR                   |
| senha   | VARCHAR (hash com bcrypt) |
| token   | VARCHAR                   |

---

## 🛠️ Tecnologias Utilizadas

**Backend:**

* Node.js, Express, MySQL, JWT, bcrypt, node-cache/Redis, dotenv, Jest, Supertest

**Frontend:**

* Flutter, Dart
* Widgets customizados (`AppLayout`)
* Navegação entre telas (`Navigator`)
* Validação e feedback ao usuário

---

## 🔐 Funcionalidades

**Backend:**

* Autenticação:

  * `POST /login` → retorna JWT
  * `POST /logout` → invalida token
* CRUD completo:

  * `/clientes` (protegido por JWT)
  * `/produtos`
  * `/usuarios`
* Endpoint padrão:

  * `GET /` → boas-vindas
* Cache em `/clientes` (30s, invalidado ao alterar dados)
* Testes automatizados de validação e endpoints

**Frontend:**

* CRUD completo para **Clientes** e **Produtos**
* Layout centralizado (`AppLayout`) com largura máxima de 400
* Feedback visual: loading, mensagens de erro
* Navegação fluida entre telas:

  * HomeScreen → Clientes / Produtos
  * Listagem e Formulários para adição/edição/exclusão
* Responsividade em diferentes dispositivos

---

## 📁 Estrutura de Diretórios

**Backend:**

```
.
├── app.js
├── .env
├── package.json
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
└── tests/
```

**Frontend (Flutter):**

```
lib/
  screens/
    home_screen.dart
    clientes_list_screen.dart
    cliente_form_screen.dart
    produtos_list_screen.dart
    produto_form_screen.dart
  services/
    api_service.dart
  widgets/
    app_layout.dart
```

---

## 🚀 Como Rodar o Projeto

### Backend

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd backend
```

2. Instale dependências:

```bash
npm install
```

3. Configure `.env`:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=seu_banco
JWT_SECRET=sua_chave_secreta
TOKEN_EXPIRATION=300
```

4. Configure o banco de dados (scripts SQL inclusos).

5. Inicie o servidor:

```bash
npm start
```

6. Execute testes automatizados:

```bash
npm test
```

---

### Frontend (Flutter)

1. Entre na pasta do app:

```bash
cd flutter_desafio_final
```

2. Instale dependências:

```bash
flutter pub get
```

3. Execute no emulador ou dispositivo:

```bash
flutter run
```

---

## 📌 Integração

* O Flutter se comunica com a API usando `ApiService`:

  * `GET` → Listar
  * `POST` → Adicionar
  * `PUT` → Editar
  * `DELETE` → Remover
* Todos os scripts de banco estão incluídos.

---

## ✅ Funcionalidades Extras

* Layout responsivo e centralizado para todas as telas
* Validação de campos obrigatórios e feedback ao usuário
* Código limpo, modular e comentado
* Logs de cache visíveis no backend

---

## 🎥 Vídeo de Apresentação

* Duração máxima: 3 minutos
* Mostra CRUD completo, navegação, layout centralizado e integração com backend

---

## 📧 Contato

Professor responsável: [luccasrm@unilavras.edu.br](mailto:luccasrm@unilavras.edu.br)

---

## 📄 Licença

MIT License

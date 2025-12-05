// models/clientesModel.js
const db = require('../configs/db'); // Seu pool de conexões do db.js

// Função para buscar todos os clientes no banco
async function getClientes() {
    const [rows] = await db.query('SELECT * FROM clientes');
    return rows;
}

// Função para buscar um cliente por ID
async function getClienteById(id) {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0]; // Retorna o primeiro resultado (o cliente) ou undefined
}

// Função para adicionar um novo cliente
async function addCliente({ nome, sobrenome, email, idade }) {
    const [result] = await db.execute(
        'INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)',
        [nome, sobrenome, email, idade]
    );
    return result.insertId; // Retorna o ID do cliente recém-inserido
}

// Função para atualizar um cliente existente
async function updateCliente(id, { nome, sobrenome, email, idade }) {
    const [result] = await db.execute(
        'UPDATE clientes SET nome = ?, sobrenome = ?, email = ?, idade = ? WHERE id = ?',
        [nome, sobrenome, email, idade, id]
    );
    return result.affectedRows; // Retorna o número de linhas afetadas (1 se atualizado, 0 se não encontrado)
}

// Função para deletar um cliente
async function deleteCliente(id) {
    const [result] = await db.execute('DELETE FROM clientes WHERE id = ?', [id]);
    return result.affectedRows; // Retorna o número de linhas afetadas (1 se deletado, 0 se não encontrado)
}

module.exports = {
    getClientes,
    getClienteById,
    addCliente,
    updateCliente,
    deleteCliente,
};
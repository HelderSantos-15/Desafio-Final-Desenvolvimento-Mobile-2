// services/clientesService.js
const db = require('../configs/db'); 

// Função para buscar todos os clientes no banco
async function getClientes() {
    // Usar 'db' (o pool) diretamente para executar a query
    const [rows] = await db.execute('SELECT * FROM clientes'); // <-- LINHA CORRIGIDA
    return rows;
}

// Função para buscar um cliente por ID
async function getClienteById(id) {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [id]); // <-- LINHA CORRIGIDA
    return rows[0];
}

// Função para adicionar um novo cliente
async function addCliente({ nome, sobrenome, email, idade }) {
    const [result] = await db.execute( // <-- LINHA CORRIGIDA
        'INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)',
        [nome, sobrenome, email, idade]
    );
    return result.insertId;
}

// Função para atualizar um cliente existente
async function updateCliente(id, { nome, sobrenome, email, idade }) {
    const [result] = await db.execute( // <-- LINHA CORRIGIDA
        'UPDATE clientes SET nome = ?, sobrenome = ?, email = ?, idade = ? WHERE id = ?',
        [nome, sobrenome, email, idade, id]
    );
    return result.affectedRows;
}

// Função para deletar um cliente
async function deleteCliente(id) {
    const [result] = await db.execute('DELETE FROM clientes WHERE id = ?', [id]); // <-- LINHA CORRIGIDA
    return result.affectedRows;
}

module.exports = {
    getClientes,
    getClienteById,
    addCliente,
    updateCliente,
    deleteCliente,
};
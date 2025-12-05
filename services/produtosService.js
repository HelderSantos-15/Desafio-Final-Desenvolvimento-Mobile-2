// services/produtosService.js
const db = require('../configs/db'); // Agora 'db' é o seu pool de conexões

// 📌 Buscar todos os produtos
async function getProdutos() {
    // Usar 'db' (o pool) diretamente para executar a query
    const [rows] = await db.execute('SELECT * FROM produtos'); // <-- LINHA CORRIGIDA
    return rows;
}

// 📌 Buscar um produto por ID
async function getProdutoById(id) {
    const [rows] = await db.execute(
        'SELECT * FROM produtos WHERE id = ?',
        [id],
    );
    return rows[0];
}

// 📌 Adicionar um novo produto
async function addProduto({ nome, descricao, preco, data_atualizado }) {
    const [result] = await db.execute( // <-- LINHA CORRIGIDA
        'INSERT INTO produtos (nome, descricao, preco, data_atualizado) VALUES (?, ?, ?, ?)',
        [nome, descricao, preco, data_atualizado],
    );
    return result.insertId;
}

// 📌 Atualizar um produto
async function updateProduto(id, { nome, descricao, preco, data_atualizado }) {
    const [result] = await db.execute( // <-- LINHA CORRIGIDA
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, data_atualizado = ? WHERE id = ?',
        [nome, descricao, preco, data_atualizado, id],
    );
    return result.affectedRows;
}

// 📌 Deletar um produto
async function deleteProduto(id) {
    const [result] = await db.execute( // <-- LINHA CORRIGIDA
        'DELETE FROM produtos WHERE id = ?',
        [id],
    );
    return result.affectedRows;
}

module.exports = {
    getProdutos,
    getProdutoById,
    addProduto,
    updateProduto,
    deleteProduto,
};
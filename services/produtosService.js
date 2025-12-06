// services/produtosService.js
// Service responsável pela comunicação com o banco de dados (camada de acesso a dados)

const db = require('../configs/db'); // Pool de conexões MySQL

// 📌 Buscar TODOS os produtos
async function getProdutos() {
    // Retorna lista completa
    const [rows] = await db.execute('SELECT * FROM produtos');
    return rows;
}

// 📌 Buscar produto por ID
async function getProdutoById(id) {
    const [rows] = await db.execute(
        'SELECT * FROM produtos WHERE id = ?',
        [id]
    );

    // Caso não encontre, retorna null (padrão mais seguro)
    return rows.length > 0 ? rows[0] : null;
}

// 📌 Criar novo produto
async function addProduto({ nome, descricao, preco, data_atualizado }) {
    const [result] = await db.execute(
        `INSERT INTO produtos (nome, descricao, preco, data_atualizado)
         VALUES (?, ?, ?, ?)`,
        [nome, descricao, preco, data_atualizado]
    );

    // Retorna o ID gerado
    return result.insertId;
}

// 📌 Atualizar produto existente
async function updateProduto(id, { nome, descricao, preco, data_atualizado }) {
    const [result] = await db.execute(
        `UPDATE produtos 
         SET nome = ?, descricao = ?, preco = ?, data_atualizado = ?
         WHERE id = ?`,
        [nome, descricao, preco, data_atualizado, id]
    );

    // Retorna quantas linhas foram afetadas (0 = não encontrado)
    return result.affectedRows;
}

// 📌 Deletar produto
async function deleteProduto(id) {
    const [result] = await db.execute(
        'DELETE FROM produtos WHERE id = ?',
        [id]
    );

    // Retorna 1 se deletou, 0 se o ID não existe
    return result.affectedRows;
}

module.exports = {
    getProdutos,
    getProdutoById,
    addProduto,
    updateProduto,
    deleteProduto,
};

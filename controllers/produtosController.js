// controllers/produtosController.js
const produtosService = require('../services/produtosService');

// Helper para validar a data_atualizado
function isValidDate(dateString) {
    const date = new Date(dateString);
    const minDate = new Date('2000-01-01T00:00:00.000Z');
    const maxDate = new Date('2025-06-20T23:59:59.999Z');
    return !isNaN(date.getTime()) && date >= minDate && date <= maxDate;
}

// 📌 Buscar todos os produtos
async function getProdutos(req, res) {
    try {
        const produtos = await produtosService.getProdutos();
        // CORRIGIDO AQUI: Deve retornar a variável 'produtos', não um array vazio.
        res.status(200).json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
}

// 📌 Buscar um produto por ID
async function getProdutoById(req, res) {
    const { id } = req.params;
    try {
        const produto = await produtosService.getProdutoById(id);
        if (produto) {
            res.status(200).json(produto);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Erro ao buscar produto' });
    }
}

// 📌 Adicionar um novo produto
async function addProduto(req, res) {
    const { nome, descricao, preco, data_atualizado } = req.body;

    // Validações de campos obrigatórios
    if (!nome || !descricao || !preco || !data_atualizado) {
        return res.status(400).json({ message: 'Nome, descrição, preço e data_atualizado são obrigatórios' });
    }

    // Validações de regras de negócio
    if (nome.length < 3 || nome.length > 255) {
        return res.status(400).json({ message: 'Nome deve ter entre 3 e 255 caracteres' });
    }
    if (descricao.length < 3 || descricao.length > 255) {
        return res.status(400).json({ message: 'Descrição deve ter entre 3 e 255 caracteres' });
    }

    // Validação de Preço: Garante que é um número e positivo
    const parsedPreco = parseFloat(preco);
    if (isNaN(parsedPreco) || parsedPreco <= 0) {
        return res.status(400).json({ message: 'Preço deve ser um valor numérico positivo.' });
    }

    if (!isValidDate(data_atualizado)) {
        return res.status(400).json({ message: 'Data de atualização inválida ou fora do período (01/01/2000 a 20/06/2025).' });
    }

    try {
        const novoProdutoId = await produtosService.addProduto({
            nome,
            descricao,
            preco: parsedPreco,
            data_atualizado,
        });
        res.status(201).json({ message: 'Produto criado com sucesso', id: novoProdutoId });
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        res.status(500).json({ message: 'Erro ao cadastrar produto' });
    }
}

// 📌 Atualizar um produto
async function updateProduto(req, res) {
    const { id } = req.params;
    const { nome, descricao, preco, data_atualizado } = req.body;

    // Validações de campos obrigatórios
    if (!nome || !descricao || !preco || !data_atualizado) {
        return res.status(400).json({ message: 'Nome, descrição, preço e data_atualizado são obrigatórios' });
    }

    // Validações de regras de negócio
    if (nome.length < 3 || nome.length > 255) {
        return res.status(400).json({ message: 'Nome deve ter entre 3 e 255 caracteres' });
    }
    if (descricao.length < 3 || descricao.length > 255) {
        return res.status(400).json({ message: 'Descrição deve ter entre 3 e 255 caracteres' });
    }

    // Validação de Preço: Garante que é um número e positivo
    const parsedPreco = parseFloat(preco);
    if (isNaN(parsedPreco) || parsedPreco <= 0) {
        return res.status(400).json({ message: 'Preço deve ser um valor numérico positivo.' });
    }

    if (!isValidDate(data_atualizado)) {
        return res.status(400).json({ message: 'Data de atualização inválida ou fora do período (01/01/2000 a 20/06/2025).' });
    }

    try {
        const updatedRows = await produtosService.updateProduto(id, {
            nome,
            descricao,
            preco: parsedPreco,
            data_atualizado,
        });
        if (updatedRows > 0) {
            res.status(200).json({ message: 'Produto atualizado com sucesso' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto' });
    }
}

// 📌 Deletar um produto
async function deleteProduto(req, res) {
    const { id } = req.params;
    try {
        const deletedRows = await produtosService.deleteProduto(id);
        if (deletedRows > 0) {
            res.status(200).json({ message: 'Produto deletado com sucesso' });
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Erro ao deletar produto' });
    }
}

// Exporta todas as funções para serem usadas pelas rotas
module.exports = {
    getProdutos,
    getProdutoById,
    addProduto,
    updateProduto,
    deleteProduto,
};
// controllers/clientesController.js
const clientesService = require('../services/clientesService');
// const clientesView = require('../views/clientesView'); // Manter se for usar para formatação
const { invalidateClientesCache } = require('../middlewares/cache');

// Helper para validar formato de e-mail
function isValidEmail(email) {
    // Regex simples para validação de e-mail. Pode ser mais robusto se necessário.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 📌 Buscar todos os clientes
async function getClientes(req, res) {
    try {
        const clientes = await clientesService.getClientes();
        // A lógica de cache e logs já está no middlewares/cache.js
        // Se clientesView for para formatação JSON, pode ser usado aqui.
        // Se não tiver clientesView, basta: res.status(200).json(clientes);
        res.status(200).json(clientes); // Assumindo que clientesView não é estritamente necessário para JSON simples
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro interno ao buscar clientes' }); // Erro interno do servidor
    }
}

// 📌 Buscar um cliente por ID
async function getClienteById(req, res) {
    const { id } = req.params;
    try {
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
        }

        const cliente = await clientesService.getClienteById(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        res.status(200).json(cliente); // Ajustado para não usar clientesView.formatCliente se não for necessário
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ error: 'Erro interno ao buscar cliente' }); // Erro interno do servidor
    }
}

// 📌 Adicionar um novo cliente
async function addCliente(req, res) {
    const { nome, sobrenome, email, idade } = req.body;

    // Validações de campos obrigatórios
    if (!nome || !sobrenome || !email || idade === undefined || idade === null) {
        return res.status(400).json({ error: 'Todos os campos (nome, sobrenome, email, idade) são obrigatórios.' });
    }

    // Validações de regras de negócio (conforme o PDF) 
    if (nome.length < 3 || nome.length > 255) {
        return res.status(400).json({ message: 'Nome deve ter entre 3 e 255 caracteres.' });
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
        return res.status(400).json({ message: 'Sobrenome deve ter entre 3 e 255 caracteres.' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Formato de e-mail inválido.' });
    }
    if (isNaN(idade) || idade <= 0 || idade >= 120) {
        return res.status(400).json({ message: 'Idade deve ser um número maior que 0 e menor que 120.' });
    }

    try {
        const id = await clientesService.addCliente({
            nome,
            sobrenome,
            email,
            idade,
        });

        invalidateClientesCache(); // Invalida o cache após criação 
        res.status(201).json({ message: 'Cliente cadastrado com sucesso!', id }); // Status 201 para Created 
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        // Pode ser um erro de email duplicado (UNIQUE no DB)
        res.status(500).json({ error: 'Erro interno ao cadastrar cliente. Verifique se o e-mail já existe.' });
    }
}

async function updateCliente(req, res) {
    const { id } = req.params;
    const { nome, sobrenome, email, idade } = req.body;

    // Validação de ID
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
    }

    // Validações de campos obrigatórios
    if (!nome || !sobrenome || !email || idade === undefined || idade === null) {
        return res.status(400).json({ error: 'Todos os campos (nome, sobrenome, email, idade) são obrigatórios.' });
    }

    // Validações de regras de negócio (conforme o PDF) 
    if (nome.length < 3 || nome.length > 255) {
        return res.status(400).json({ message: 'Nome deve ter entre 3 e 255 caracteres.' });
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
        return res.status(400).json({ message: 'Sobrenome deve ter entre 3 e 255 caracteres.' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Formato de e-mail inválido.' });
    }
    if (isNaN(idade) || idade <= 0 || idade >= 120) {
        return res.status(400).json({ message: 'Idade deve ser um número maior que 0 e menor que 120.' });
    }

    try {
        const affectedRows = await clientesService.updateCliente(id, { nome, sobrenome, email, idade });

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' }); // Status 404 para Not Found
        }

        invalidateClientesCache(); // Invalida o cache após atualização 
        res.status(200).json({ message: 'Cliente atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: 'Erro interno ao atualizar cliente. Verifique se o e-mail já existe.' });
    }
}

async function deleteCliente(req, res) {
    const { id } = req.params;
    try {
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido. Deve ser um número.' });
        }

        const affectedRows = await clientesService.deleteCliente(id);
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' }); // Status 404 para Not Found
        }

        invalidateClientesCache(); // Invalida o cache após exclusão 
        res.status(200).json({ message: 'Cliente excluído com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        res.status(500).json({ error: 'Erro interno ao excluir cliente.' });
    }
}

module.exports = {
    getClientes,
    getClienteById,
    addCliente,
    updateCliente,
    deleteCliente,
};
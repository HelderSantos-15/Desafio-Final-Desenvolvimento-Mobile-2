// middlewares/validacaoCliente.js

const validarCliente = (req, res, next) => {
    const { nome, sobrenome, email, idade } = req.body;

    if (!nome || !sobrenome || !email || !idade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    if (typeof idade !== 'number' || idade <= 0) {
        return res
            .status(400)
            .json({ error: 'Idade deve ser um número maior que 0!' });
    }

    // Validar formato de email (pode ser melhorado)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido!' });
    }

    next();
};

module.exports = validarCliente;

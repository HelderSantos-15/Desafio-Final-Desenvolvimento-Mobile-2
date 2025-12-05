const validateName = (request, response, next) => {
    const { body } = request;

    // Verifica se o campo "nome" está presente no corpo da requisição
    if (body.nome === undefined) {
        return response
            .status(400)
            .json({ message: 'O campo "nome" é obrigatório' });
    }

    // Verifica se o campo "nome" não está vazio
    if (body.nome === '') {
        return response
            .status(400)
            .json({ message: 'O campo "nome" não pode ser vazio' });
    }

    // Se a validação passar, chama o próximo middleware ou controller
    next();
};

module.exports = { validateName };

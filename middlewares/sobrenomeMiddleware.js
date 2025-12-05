const validateFamilyName = (request, response, next) => {
    const { body } = request;

    // Verifica se o campo "sobrenome" está presente no corpo da requisição
    if (body.sobrenome === undefined) {
        return response
            .status(400)
            .json({ message: 'O campo "sobrenome" é obrigatório' });
    }

    // Verifica se o campo "sobrenome" não está vazio
    if (body.sobrenome === '') {
        return response
            .status(400)
            .json({ message: 'O campo "sobrenome" não pode ser vazio' });
    }

    // Se a validação passar, chama o próximo middleware ou controller
    next();
};

module.exports = { validateFamilyName };

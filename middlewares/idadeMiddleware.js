const validateAge = (request, response, next) => {
    const { body } = request;

    // Verifica se o campo "idade" está presente e não é vazio
    if (body.idade == undefined || body.idade === '') {
        return response
            .status(400)
            .json({ message: 'O campo "idade" é obrigatório' });
    }

    // Verifica se a "idade" é um número inteiro positivo e dentro de uma faixa razoável (0 a 130)
    const idade = parseInt(body.idade);
    if (isNaN(idade) || idade < 0 || idade > 130) {
        return response.status(400).json({
            message:
        'O campo "idade" deve ser inteiro positivo e menor que 130 anos ',
        });
    }

    // Se a validação passar, chama o próximo middleware ou controller
    next();
};

module.exports = { validateAge };

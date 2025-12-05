function formatCliente(cliente) {
    return {
        id: cliente.id,
        nome: cliente.nome,
        sobrenome: cliente.sobrenome,
        email: cliente.email,
        idade: cliente.idade,
    };
}

function formatClientes(clientes) {
    return clientes.map(formatCliente);
}

module.exports = {
    formatCliente,
    formatClientes,
};

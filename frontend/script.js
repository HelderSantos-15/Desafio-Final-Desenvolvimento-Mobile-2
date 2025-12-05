// script.js

// Elementos HTML
const clientesLista = document.getElementById('clientes-lista');
const produtosLista = document.getElementById('produtos-lista');
const usuariosLista = document.getElementById('usuarios-lista');
const loginForm = document.getElementById('login-form');
const usuarioForm = document.getElementById('usuario-form');
const logoutBtn = document.getElementById('logout-btn');
const showLoginBtn = document.getElementById('show-login-btn');
const welcomeMessage = document.getElementById('welcome-message');
const loggedInUserSpan = document.getElementById('logged-in-user');
const loginSection = document.getElementById('login-section');
const mainContent = document.getElementById('main-content');
const API_BASE_URL = 'http://localhost:3000'; // URL base da API

// --- Funções de Autenticação ---

// Função para obter o token JWT do localStorage
function getToken() {
    return localStorage.getItem('jwtToken');
}

// Função para salvar o token JWT no localStorage
function setToken(token) {
    localStorage.setItem('jwtToken', token);
}

// Função para remover o token JWT do localStorage
function removeToken() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('loggedInUsername'); // Remover nome de usuário também
}

// Função para obter os headers com o token de autenticação
function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) // Adiciona o header Authorization se o token existir
    };
}

// Função para verificar o status de login e atualizar a UI
function checkLoginStatus() {
    const token = getToken();
    const username = localStorage.getItem('loggedInUsername');

    if (token && username) {
        // Usuário logado
        welcomeMessage.style.display = 'inline';
        loggedInUserSpan.textContent = username;
        logoutBtn.style.display = 'inline';
        showLoginBtn.style.display = 'none';
        loginSection.style.display = 'none';
        mainContent.style.display = 'block'; // Mostra conteúdo principal
        fetchClientes(); // Carrega clientes (agora precisa de token)
        fetchUsuarios(); // Carrega usuários (agora precisa de token)
    } else {
        // Usuário deslogado
        welcomeMessage.style.display = 'none';
        logoutBtn.style.display = 'none';
        showLoginBtn.style.display = 'inline';
        loginSection.style.display = 'none'; // Esconde a seção de login inicialmente
        mainContent.style.display = 'none'; // Esconde conteúdo principal
        // Limpar listas protegidas se não estiver logado
        clientesLista.innerHTML = '<li>Faça login para ver e gerenciar clientes.</li>';
        usuariosLista.innerHTML = '<li>Faça login para ver e gerenciar usuários.</li>';
    }
    // Produtos são sempre públicos
    fetchProdutos();
}

// --- Tratamento de Erros de Requisição ---
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ou resposta não JSON.' }));
        const errorMessage = errorData.message || errorData.error || `Status: ${response.status} - Ocorreu um erro desconhecido.`;
        Swal.fire('Erro!', errorMessage, 'error');
        throw new Error(errorMessage); // Lança erro para ser pego pelo catch
    }
    return response.json();
}

// --- Event Listeners para Autenticação ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('login-usuario').value;
    const senha = document.getElementById('login-senha').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha }),
        });

        const data = await handleResponse(response);
        setToken(data.token);
        localStorage.setItem('loggedInUsername', usuario); // Salva o nome de usuário
        Swal.fire('Sucesso!', 'Login realizado com sucesso!', 'success');
        loginForm.reset();
        checkLoginStatus(); // Atualiza a UI após o login
    } catch (error) {
        // Erro já tratado em handleResponse, apenas loga para depuração
        console.error('Erro no login:', error);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: getAuthHeaders(), // Envia o token para invalidar
        });
        removeToken();
        Swal.fire('Sucesso!', 'Logout realizado com sucesso!', 'success');
        checkLoginStatus(); // Atualiza a UI após o logout
    } catch (error) {
        // Erro já tratado em handleResponse, mas o token já foi removido localmente
        // Para logout, removemos o token localmente de qualquer forma para garantir o estado
        removeToken(); 
        Swal.fire('Erro!', 'Não foi possível completar o logout na API. Token removido localmente.', 'error');
        checkLoginStatus();
        console.error('Erro no logout:', error);
    }
});

showLoginBtn.addEventListener('click', () => {
    loginSection.style.display = 'block'; // Mostra a seção de login
    showLoginBtn.style.display = 'none'; // Esconde o botão "Login"
});

// --- Funções CRUD de Clientes (AGORA COM TOKEN) ---
document.getElementById('cliente-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const email = document.getElementById('email').value;
    const idade = parseInt(document.getElementById('idade').value, 10); // Converte para número

    // Validações básicas no frontend (para feedback imediato)
    if (!nome || !sobrenome || !email || isNaN(idade)) {
        Swal.fire('Atenção!', 'Todos os campos de cliente são obrigatórios.', 'warning');
        return;
    }
    if (nome.length < 3 || nome.length > 255) {
        Swal.fire('Atenção!', 'Nome do cliente deve ter entre 3 e 255 caracteres.', 'warning');
        return;
    }
    if (sobrenome.length < 3 || sobrenome.length > 255) {
        Swal.fire('Atenção!', 'Sobrenome do cliente deve ter entre 3 e 255 caracteres.', 'warning');
        return;
    }
    if (!isValidEmailFrontend(email)) {
        Swal.fire('Atenção!', 'Formato de e-mail inválido para o cliente.', 'warning');
        return;
    }
    if (idade <= 0 || idade >= 120) {
        Swal.fire('Atenção!', 'Idade do cliente deve ser entre 1 e 119 anos.', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: getAuthHeaders(), // Inclui o token
            body: JSON.stringify({ nome, sobrenome, email, idade }),
        });
        await handleResponse(response); // Lida com a resposta e erros
        e.target.reset();
        Swal.fire('Sucesso!', 'Cliente cadastrado!', 'success');
        fetchClientes();
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
    }
});

async function fetchClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, { headers: getAuthHeaders() }); // Inclui o token
        const clientes = await handleResponse(response); // Lida com a resposta e erros
        renderLista(clientes, clientesLista, 'cliente');
    } catch (error) {
        // Erro já tratado em handleResponse.
        // Apenas para garantir que a lista fique vazia ou com msg de erro
        clientesLista.innerHTML = '<li>Erro ao carregar clientes ou acesso negado.</li>';
        console.error('Erro ao buscar clientes:', error);
    }
}

async function editCliente(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, { headers: getAuthHeaders() });
        const cliente = await handleResponse(response);

        const { value: formValues } = await Swal.fire({
            title: 'Editar Cliente',
            html: `
                <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${cliente.nome}">
                <input id="swal-sobrenome" class="swal2-input" placeholder="Sobrenome" value="${cliente.sobrenome}">
                <input id="swal-email" class="swal2-input" placeholder="Email" value="${cliente.email}">
                <input id="swal-idade" class="swal2-input" placeholder="Idade" type="number" value="${cliente.idade}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const nome = document.getElementById('swal-nome').value;
                const sobrenome = document.getElementById('swal-sobrenome').value;
                const email = document.getElementById('swal-email').value;
                const idade = parseInt(document.getElementById('swal-idade').value, 10);

                // Validações no preConfirm para feedback imediato
                if (!nome || !sobrenome || !email || isNaN(idade)) {
                    Swal.showValidationMessage('Todos os campos são obrigatórios.');
                    return false;
                }
                if (nome.length < 3 || nome.length > 255 || sobrenome.length < 3 || sobrenome.length > 255) {
                    Swal.showValidationMessage('Nome e Sobrenome devem ter entre 3 e 255 caracteres.');
                    return false;
                }
                if (!isValidEmailFrontend(email)) {
                    Swal.showValidationMessage('Formato de e-mail inválido.');
                    return false;
                }
                if (idade <= 0 || idade >= 120) {
                    Swal.showValidationMessage('Idade deve ser entre 1 e 119 anos.');
                    return false;
                }

                return {
                    nome,
                    sobrenome,
                    email,
                    idade,
                };
            },
        });

        if (!formValues) return; // Se o usuário cancelar o modal

        const putResponse = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(formValues),
        });
        await handleResponse(putResponse);
        Swal.fire('Atualizado!', 'Cliente atualizado com sucesso.', 'success');
        fetchClientes();
    } catch (error) {
        console.error('Erro ao editar cliente:', error);
    }
}

async function deleteCliente(id) {
    const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Essa ação não poderá ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
        try {
            const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            await handleResponse(response);
            Swal.fire('Deletado!', 'Cliente excluído com sucesso.', 'success');
            fetchClientes();
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
        }
    }
}

// --- Funções CRUD de Produtos (PÚBLICAS) ---
document.getElementById('produto-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome-produto').value;
    const descricao = document.getElementById('descricao-produto').value;
    const preco = document.getElementById('preco').value; // Captura como string
    const data_atualizado = document.getElementById('data-atualizado').value; // Novo campo

    // Validações básicas para o frontend - ANTES de enviar para a API
    if (!nome || !descricao || !preco || !data_atualizado) {
        Swal.fire('Atenção!', 'Por favor, preencha todos os campos do produto.', 'warning');
        return;
    }

    const parsedPreco = parseFloat(preco);
    if (isNaN(parsedPreco) || parsedPreco <= 0) {
        Swal.fire('Atenção!', 'O preço deve ser um valor numérico positivo.', 'warning');
        return;
    }

    // Validação da data no frontend
    const minDate = new Date('2000-01-01T00:00:00.000Z');
    const maxDate = new Date('2025-06-20T23:59:59.999Z');
    const inputDate = new Date(data_atualizado);

    if (isNaN(inputDate.getTime()) || inputDate < minDate || inputDate > maxDate) {
        Swal.fire('Atenção!', 'Data de atualização inválida ou fora do período (01/01/2000 a 20/06/2025).', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/produtos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Produtos são públicos, sem token
            body: JSON.stringify({ nome, descricao, preco: parsedPreco, data_atualizado }), // Envia o preço parseado
        });
        await handleResponse(response);
        e.target.reset();
        Swal.fire('Sucesso!', 'Produto cadastrado!', 'success');
        fetchProdutos();
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
    }
});

async function fetchProdutos() {
    try {
        const response = await fetch(`${API_BASE_URL}/produtos`); // Produtos são públicos, sem token
        const produtos = await handleResponse(response);
        renderLista(produtos, produtosLista, 'produto');
    } catch (error) {
        produtosLista.innerHTML = '<li>Erro ao carregar produtos.</li>';
        console.error('Erro ao buscar produtos:', error);
    }
}

async function editProduto(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/produtos/${id}`); // Produtos são públicos, sem token
        const produto = await handleResponse(response);

        // Prepara a data para o formato datetime-local
        // Garante que a data existente seja formatada corretamente para o input datetime-local
        const formattedDate = produto.data_atualizado ? new Date(produto.data_atualizado).toISOString().slice(0, 16) : '';

        const { value: formValues } = await Swal.fire({
            title: 'Editar Produto',
            html: `
                <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${produto.nome}">
                <input id="swal-descricao" class="swal2-input" placeholder="Descrição" value="${produto.descricao || ''}">
                <input id="swal-preco" class="swal2-input" placeholder="Preço" type="number" step="0.01" value="${produto.preco}">
                <input id="swal-data-atualizado" class="swal2-input" placeholder="Data de Atualização" type="datetime-local" value="${formattedDate}">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const nome = document.getElementById('swal-nome').value;
                const descricao = document.getElementById('swal-descricao').value;
                const preco = document.getElementById('swal-preco').value;
                const data_atualizado = document.getElementById('swal-data-atualizado').value;

                // Validações no preConfirm para feedback imediato
                const parsedPreco = parseFloat(preco);
                if (nome.length < 3 || nome.length > 255 || descricao.length < 3 || descricao.length > 255 || isNaN(parsedPreco) || parsedPreco <= 0 || !isValidDateFrontend(data_atualizado)) {
                    Swal.showValidationMessage('Verifique os campos: Nome/Descrição (3-255 chars), Preço (positivo), Data (01/01/2000 a 20/06/2025).');
                    return false; // Impede o fechamento do modal
                }

                return {
                    nome,
                    descricao,
                    preco: parsedPreco,
                    data_atualizado,
                };
            },
        });

        if (!formValues) return;

        const putResponse = await fetch(`${API_BASE_URL}/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }, // Produtos são públicos, sem token
            body: JSON.stringify(formValues),
        });
        await handleResponse(putResponse);
        Swal.fire('Atualizado!', 'Produto atualizado com sucesso.', 'success');
        fetchProdutos();
    } catch (error) {
        console.error('Erro ao editar produto:', error);
    }
}

async function deleteProduto(id) {
    const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Essa ação não poderá ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
        try {
            const response = await fetch(`${API_BASE_URL}/produtos/${id}`, { method: 'DELETE' }); // Produtos são públicos, sem token
            await handleResponse(response);
            Swal.fire('Deletado!', 'Produto excluído com sucesso.', 'success');
            fetchProdutos();
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
        }
    }
}

// --- Funções CRUD de Usuários (AGORA COM TOKEN) ---
document.getElementById('usuario-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario-nome').value;
    const senha = document.getElementById('usuario-senha').value;

    // Validações básicas para o frontend (opcional, mas bom para UX)
    if (!usuario || !senha) {
        Swal.fire('Atenção!', 'Nome de usuário e senha são obrigatórios.', 'warning');
        return;
    }
    // Adicionar validações de tamanho/complexidade de senha se necessário

    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, {
            method: 'POST',
            headers: getAuthHeaders(), // Inclui o token (criar usuário requer autenticação)
            body: JSON.stringify({ usuario, senha }),
        });
        await handleResponse(response);
        e.target.reset();
        Swal.fire('Sucesso!', 'Usuário criado!', 'success');
        fetchUsuarios();
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
});

async function fetchUsuarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`, { headers: getAuthHeaders() }); // Inclui o token
        const usuarios = await handleResponse(response);
        renderLista(usuarios, usuariosLista, 'usuario'); // Reutiliza renderLista
    } catch (error) {
        usuariosLista.innerHTML = '<li>Erro ao carregar usuários ou acesso negado.</li>';
        console.error('Erro ao buscar usuários:', error);
    }
}

// --- Funções de Renderização e Utilitários ---
function renderLista(itens, container, tipo) {
    container.innerHTML = '';
    if (!Array.isArray(itens) || itens.length === 0) { // Verifica se é um array e se está vazio
        container.innerHTML = `<li><em>Nenhum ${tipo} encontrado.</em></li>`;
        return;
    }

    itens.forEach((item) => {
        const li = document.createElement('li');
        let details = '';
        if (tipo === 'cliente') {
            details = `<br>${item.sobrenome} - ${item.email} - ${item.idade} anos`;
        } else if (tipo === 'produto') {
            // Ajuste para exibir 'data_atualizado' ao invés de 'quantidade'
            details = `<br>${item.descricao}<br>Preço: R$ ${item.preco} | Data Atualização: ${item.data_atualizado ? new Date(item.data_atualizado).toLocaleDateString() : 'N/A'}`;
        } else if (tipo === 'usuario') { // Adicionado para usuários
            details = `<br>ID: ${item.id}`; // Não exibe senha ou token por segurança
        }

        li.innerHTML = `
            <div>
                <strong>${item.usuario || item.nome}</strong> ${details}
            </div>
            <div class="item-buttons">
                ${tipo !== 'usuario' ? `
                    <button class="btn-edit" onclick="edit${capitalize(tipo)}(${item.id})">✏️</button>
                    <button class="btn-delete" onclick="delete${capitalize(tipo)}(${item.id})">🗑️</button>
                ` : ''}
            </div>
        `;
        container.appendChild(li);
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Nova função helper para validação de data no frontend (reutilizada de produtosController)
function isValidDateFrontend(dateString) {
    const date = new Date(dateString);
    const minDate = new Date('2000-01-01T00:00:00.000Z');
    const maxDate = new Date('2025-06-20T23:59:59.999Z');
    return !isNaN(date.getTime()) && date >= minDate && date <= maxDate;
}

// --- Funções de Busca (Ajustadas para pegar da API a cada busca para refletir DB) ---
document.getElementById('cliente-search').addEventListener('input', async (e) => {
    const termo = e.target.value.toLowerCase();
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`, { headers: getAuthHeaders() });
        const clientes = await handleResponse(response);
        const filtrados = clientes.filter(
            (c) =>
                c.nome.toLowerCase().includes(termo) ||
                c.sobrenome.toLowerCase().includes(termo) ||
                c.email.toLowerCase().includes(termo)
        );
        renderLista(filtrados, clientesLista, 'cliente');
    } catch (error) {
        console.error('Erro na busca de clientes:', error);
    }
});

document.getElementById('produto-search').addEventListener('input', async (e) => {
    const termo = e.target.value.toLowerCase();
    try {
        const response = await fetch(`${API_BASE_URL}/produtos`);
        const produtos = await handleResponse(response);
        const filtrados = produtos.filter(
            (p) =>
                p.nome.toLowerCase().includes(termo) ||
                (p.descricao && p.descricao.toLowerCase().includes(termo))
        );
        renderLista(filtrados, produtosLista, 'produto');
    } catch (error) {
        console.error('Erro na busca de produtos:', error);
    }
});

// --- Inicialização ---
checkLoginStatus(); // Verifica o status do login ao carregar a página
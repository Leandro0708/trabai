const API_URL = 'http://localhost:3000';

const form = document.getElementById('Fcadastro');
const btnListar = document.getElementById('listar');
const painel = document.getElementById('painelUsuarios');

form.addEventListener('submit', cadastrarUsuario);
btnListar.addEventListener('click', listarUsuarios);

async function cadastrarUsuario(e) {
    e.preventDefault();

    const email = document.getElementById('E-mail').value.trim();
    const nome = document.getElementById('Usuário').value.trim();
    const matricula = document.getElementById('Matricula').value.trim();

    if (!email || !nome || !matricula) {
        alert('Preencha todos os campos');
        return;
    }

    const novoAluno = { email, nome, matricula };

    try {
        const response = await fetch(`${API_URL}/alunos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoAluno)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao cadastrar aluno');
        }

        const data = await response.json();
        alert(data.message || 'Cadastrado com sucesso!');
        form.reset();
        listarUsuarios();
    } catch (error) {
        console.error(error);
        alert('Erro ao cadastrar aluno no servidor. Verifique se o backend está rodando em http://localhost:3000');
    }
}

async function listarUsuarios() {
    painel.style.display = 'block';
    painel.innerHTML = '<h2>Usuários</h2>';

    try {
        const response = await fetch(`${API_URL}/alunos`);
        if (!response.ok) throw new Error('Erro ao buscar alunos');

        const alunos = await response.json();
        if (!Array.isArray(alunos) || alunos.length === 0) {
            painel.innerHTML += '<p>Nenhum usuário cadastrado.</p>';
            return;
        }

        alunos.forEach(u => {
            painel.innerHTML += `
                <div class="cardUser">
                    <b>Email:</b> ${u.email}<br>
                    <b>Nome:</b> ${u.nome}<br>
                    <b>Matrícula:</b> ${u.matricula}<br>
                    <button onclick="editarUsuario(${u.id})">Editar</button>
                    <button onclick="deletarUsuario(${u.id})">Excluir</button>
                </div>
            `;
        });
    } catch (error) {
        console.error(error);
        painel.innerHTML += '<p>Erro ao carregar usuários. Verifique o backend.</p>';
    }
}

async function editarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/aluno/${id}`);
        if (!response.ok) throw new Error('Aluno não encontrado');

        const usuario = await response.json();
        const email = prompt('Novo email:', usuario.email);
        const nome = prompt('Novo nome:', usuario.nome);
        const matricula = prompt('Nova matrícula:', usuario.matricula);

        if (!email || !nome || !matricula) return;

        const updateResponse = await fetch(`${API_URL}/aluno/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, nome, matricula })
        });

        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(errorData.error || 'Erro ao atualizar aluno');
        }

        alert('Aluno atualizado com sucesso');
        listarUsuarios();
    } catch (error) {
        console.error(error);
        alert('Erro ao editar aluno. Verifique se o backend está rodando.');
    }
}

async function deletarUsuario(id) {
    if (!confirm('Deseja excluir?')) return;

    try {
        const response = await fetch(`${API_URL}/aluno/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao excluir aluno');
        }

        alert('Aluno excluído com sucesso');
        listarUsuarios();
    } catch (error) {
        console.error(error);
        alert('Erro ao excluir aluno. Verifique se o backend está rodando.');
    }
}


const express = require('express');

const { PrismaClient } = require('@prisma/client');


const cors = require('cors');


const app = express();

const prisma = new PrismaClient();


app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(express.text()); 


app.use(cors());


app.post('/alunos', async (requisicao, resposta) => {
    try {
        
        const novoAluno = await prisma.aluno.create({
            data: {
                email: requisicao.body.email,    
                nome: requisicao.body.nome,      
                matricula: requisicao.body.matricula 
            }
        });
        
        
        resposta.json({
            message: "Cadastrado com sucesso",
            aluno: novoAluno
        });
    } catch (error) {
       
        console.error(error);
       
        resposta.status(500).json({ error: 'Erro ao criar aluno' });
    }
});


app.get('/alunos', async (requisicao, resposta) => {
    try {
       
        const todosAlunos = await prisma.aluno.findMany();
        
        resposta.json(todosAlunos);
    } catch (error) {
        console.error(error);
        resposta.status(500).json({ error: 'Erro ao buscar alunos' });
    }
});


app.get('/aluno/:id', async (requisicao, resposta) => {
    try {
        
        const id = parseInt(requisicao.params.id);
        
    
        const alunoSelecionado = await prisma.aluno.findUnique({
            where: { id } 
        });
        
        
        if (!alunoSelecionado) {
           
            return resposta.status(404).json({ error: 'Aluno não encontrado' });
        }
        
      
        resposta.json(alunoSelecionado);
    } catch (error) {
        console.error(error);
        resposta.status(500).json({ error: 'Erro ao buscar aluno' });
    }
});


app.put('/aluno/:id', async (requisicao, resposta) => {
    try {
        const id = parseInt(requisicao.params.id);
        
        
        const alunoAtualizado = await prisma.aluno.update({
            where: { id }, 
            data: { 
                nome: requisicao.body.nome,
                email: requisicao.body.email,
                matricula: requisicao.body.matricula
            }
        });
        
        resposta.json({
            message: "Aluno atualizado com sucesso",
            aluno: alunoAtualizado
        });
    } catch (error) {
        console.error(error);
       
        if (error.code === 'P2025') {
            return resposta.status(404).json({ error: 'Aluno não encontrado' });
        }
        resposta.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
});


app.delete('/aluno/:id', async (requisicao, resposta) => {
    try {
        const id = parseInt(requisicao.params.id);
        
        
        await prisma.aluno.delete({
            where: { id }
        });
        
        resposta.json({ message: "Aluno deletado com sucesso" });
    } catch (error) {
        console.error(error);
        
        if (error.code === 'P2025') {
            return resposta.status(404).json({ error: 'Aluno não encontrado' });
        }
        resposta.status(500).json({ error: 'Erro ao deletar aluno' });
    }
});


const gracefulShutdown = async () => {
   
    await prisma.$disconnect();
    process.exit(0); 
};


process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});


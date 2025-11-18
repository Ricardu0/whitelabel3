// src/controllers/alunoController.js
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Aluno = require("../models/aluno");

const SALT_ROUNDS = 10;

exports.createAluno = async (req, res) => {
    // Validação do express-validator (regras no route)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { nome_completo, usuario_acesso, senha, email_aluno, observacao } = req.body;

    try {
        // Verifica unicidade de usuario_acesso e email
        const existsUser = await Aluno.findOne({
            where: {
                usuario_acesso
            }
        });
        if (existsUser) {
            return res.status(409).json({ success: false, message: "Usuário de acesso já existe." });
        }

        const existsEmail = await Aluno.findOne({
            where: { email_aluno }
        });
        if (existsEmail) {
            return res.status(409).json({ success: false, message: "Email já cadastrado." });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const senha_hash = await bcrypt.hash(senha, salt);

        // Cria o registro (note que usamos senha_hash aqui)
        const novoAluno = await Aluno.create({
            nome_completo,
            usuario_acesso,
            senha_hash,
            email_aluno,
            observacao
        });

        // Resposta (não retornamos senha ou hash)
        return res.status(201).json({
            success: true,
            message: "Aluno criado com sucesso.",
            data: {
                id_aluno: novoAluno.id_aluno,
                nome_completo: novoAluno.nome_completo,
                usuario_acesso: novoAluno.usuario_acesso,
                email_aluno: novoAluno.email_aluno,
                data_cadastro: novoAluno.data_cadastro
            }
        });

    } catch (err) {
        console.error("Erro em createAluno:", err);
        // Tratamento de erro genérico
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
};

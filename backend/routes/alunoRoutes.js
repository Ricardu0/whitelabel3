// src/routes/alunoRoutes.js
const express = require("express");
const { body } = require("express-validator");
const alunoController = require("../controllers/alunoController");

const router = express.Router();

// Regras de validação para criação, e tudo mais
const createValidation = [
    body("nome_completo")
        .trim()
        .notEmpty().withMessage("Nome completo é obrigatório.")
        .isLength({ max: 150 }).withMessage("Nome muito longo (máx 150)."),
    body("usuario_acesso")
        .trim()
        .notEmpty().withMessage("Usuário de acesso é obrigatório.")
        .isLength({ min: 4, max: 50 }).withMessage("Usuário precisa ter entre 4 e 50 caracteres."),
    body("senha")
        .notEmpty().withMessage("Senha é obrigatória.")
        .isLength({ min: 6 }).withMessage("Senha muito curta (mínimo 6 caracteres)."),
    body("email_aluno")
        .trim()
        .notEmpty().withMessage("Email é obrigatório.")
        .isEmail().withMessage("Formato de email inválido.")
        .isLength({ max: 120 }).withMessage("Email muito longo (máx 120)."),
    body("observacao")
        .optional()
        .isLength({ max: 500 }).withMessage("Observação muito longa (máx 500).")
];

router.post("/api/alunos", createValidation, alunoController.createAluno);

module.exports = router;

// src/models/aluno.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Aluno = sequelize.define(
    "Aluno",
    {
        id_aluno: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        nome_completo: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        usuario_acesso: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                len: [4, 50],
            },
        },

        senha_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        email_aluno: {
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        observacao: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },

        data_cadastro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "alunos",
        timestamps: false,
    }
);

//exporta para alunos
module.exports = Aluno;

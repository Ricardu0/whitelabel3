// src/index.js
//require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/database");

// Importa model (registra)
require("./models/aluno");

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, "public")));

// Rotas
const alunoRoutes = require("./routes/alunoRoutes");
app.use(alunoRoutes);

// Health check simples
app.get("/health", (req, res) => res.json({ status: "ok" }));

console.log('Verificando variáveis...');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);

async function start() {
    try {
        await sequelize.authenticate();
        console.log("Conectado ao MySQL Azure com sucesso!");

        // Sincroniza o model com o banco; em produção, prefira migrations
        await sequelize.sync({ alter: true });
        console.log("Tabela sincronizada!");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`Acesse o formulário em http://localhost:${PORT}/`);
        });

    } catch (err) {
        console.error("Erro ao conectar:", err);
        process.exit(1);
    }
}

app.use(express.static(path.join(__dirname, "../frontend")));

// rota padrão → index.html
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/index.html"));
});

start();

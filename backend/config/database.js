// src/config/database.js
const { Sequelize } = require("sequelize");

// Carrega variáveis de ambiente (com fallback)
require("dotenv").config();

// ✅ VALORES FIXOS COMO FALLBACK - ajuste conforme necessário
const DB_CONFIG = {
    database: process.env.DB_NAME || "db_rick",           // Nome do banco
    username: process.env.DB_USER || "useradmin",               // Usuário MySQL
    password: process.env.DB_PASS || "admin@123",               // Senha MySQL
    host: process.env.DB_HOST || "serverdbp2.mysql.database.azure.com",              // Host
    port: process.env.DB_PORT || 3306,                     // Porta
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            require: false,
            rejectUnauthorized: false
        },
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    // ✅ CONFIGURAÇÕES DE CONEXÃO ROBUSTAS
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // ✅ RECONEXÃO AUTOMÁTICA
    retry: {
        max: 3,
        timeout: 30000
    }
};

console.log('🔍 Configuração do Banco:');
console.log('   Database:', DB_CONFIG.database);
console.log('   Host:', DB_CONFIG.host);
console.log('   Port:', DB_CONFIG.port);
console.log('   User:', DB_CONFIG.username);

// Cria a instância do Sequelize
const sequelize = new Sequelize(
    DB_CONFIG.database,
    DB_CONFIG.username,
    DB_CONFIG.password,
    {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        dialect: DB_CONFIG.dialect,
        dialectOptions: DB_CONFIG.dialectOptions,
        logging: DB_CONFIG.logging,
        pool: DB_CONFIG.pool,
        retry: DB_CONFIG.retry
    }
);

// ✅ TESTE DE CONEXÃO COM FALLBACK
sequelize.authenticate()
    .then(() => {
        console.log('✅ Conexão com o banco estabelecida com sucesso!');
    })
    .catch(err => {
        console.error('❌ Erro na conexão com o banco:', err.message);
        console.log('⚠️  Continuando sem conexão com banco...');
    });

module.exports = sequelize;
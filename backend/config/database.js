// src/config/database.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        dialectOptions: {
            ssl: {
                require: false,
                rejectUnauthorized: false
            },
        },
        logging: false,
    }
);

module.exports = sequelize;

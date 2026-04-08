require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || 'usuario_db',
    password: process.env.DB_PASSWORD || 'desarrollo',
    database: process.env.DB_NAME     || 'isw306_grupo1',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;

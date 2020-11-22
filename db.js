require('dotenv').config()
const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
  // Comando utilizado para descobrir endereço do container.
  // docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)
  host: '172.17.0.2', 
  port: 3306,
  user:process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: 'cat-products',
  waitForConnections: true,
  connectionLimit:20
});
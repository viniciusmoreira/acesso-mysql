require('dotenv').config()
const mysql = require('mysql2/promise');

const run = async (values) => {
  const connection = await mysql.createConnection({
    // Comando utilizado para descobrir endereço do container.
    // docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)
    host: process.env.DATABASE_HOST, 
    port: process.env.DATABASE_PORT,
    user:process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
  })

  try {
    const [results] = await connection.query('select * from categories');
    console.log('results', results);
  } catch( err ) {
    console.log('err', err)
  }

}

run();
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
    const [results, fields] = await connection.query('insert into categories (category) values (?)', values);
    console.log('results', results, 'fields', fields);
  } catch( err ) {
    console.log('err', err)
  }

}

run(['categoria nova']);
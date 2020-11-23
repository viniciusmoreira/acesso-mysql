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
    const [results, fields] = await connection.query(`insert into products (product, price) values (?,?)`, values);
    await connection.query(`insert into categories_products (category_id, product_id) values (?, ?)`, [values[2], results.insertId])
    console.log('results', results, 'fields', fields);
  } catch( err ) {
    console.log('err', err)
  }

}

run(['novo produto', 123, 4]);
const mysql = require('mysql2/promise');

const run = async (values) => {
  const connection = await mysql.createConnection({
    // Comando utilizado para descobrir endereço do container.
    // docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -aq)
    host: '172.17.0.2', 
    port: 3306,
    user:'root',
    password: 'root',
    database: 'cat-products'
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
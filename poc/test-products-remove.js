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
    const [results] = await connection.query('delete from products where id = ? limit 1', values);
    console.log('results', results);
  } catch( err ) {
    console.log('err', err)
  }
}

run(6);
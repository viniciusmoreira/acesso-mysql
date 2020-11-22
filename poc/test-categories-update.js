const mysql = require('mysql2/promise');

const run = async (id, values) => {
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
    const [results] = await connection.query('update categories set category = ? where id = ? limit 1', [...values, id]);
    console.log('results', results);
  } catch( err ) {
    console.log('err', err)
  }
}

run(3, ['novo nome']);
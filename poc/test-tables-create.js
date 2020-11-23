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
    const [results] = await connection.query(`show tables like 'categories'`);
    console.log('results', results)

    if(results.length === 0){
      await connection.query(`
        CREATE TABLE categories (
          id INT NOT NULL AUTO_INCREMENT,
          category VARCHAR(250) NULL DEFAULT NULL,
          PRIMARY KEY(id)
        )
      `);

      await connection.query(`
        CREATE TABLE products (
          id INT NOT NULL AUTO_INCREMENT,
          product VARCHAR(250) NULL DEFAULT NULL,
          price FLOAT,
          PRIMARY KEY(id)
        )
      `)

      await connection.query(`
        CREATE TABLE images (
          id INT NOT NULL AUTO_INCREMENT,
          description TEXT NULL DEFAULT NULL,
          url VARCHAR(500) NULL DEFAULT NULL,
          product_id INT NOT NULL,
          PRIMARY KEY(id),
          KEY fk_images_products_index (product_id),
          CONSTRAINT fk_images_products_constraint FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
      `)

      await connection.query(`
        CREATE TABLE categories_products (
          category_id INT NOT NULL,
          product_id INT NOT NULL,
          KEY fk_products_index (product_id),
          KEY fk_categories_index (category_id),
          CONSTRAINT fk_products_constraint FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
          CONSTRAINT fk_categories_constraint FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
      `)
    }
  } catch( err ) {
    console.log('err', err)
  }

}

test();
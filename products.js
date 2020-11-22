const init = connection => {
  const create = async (data) => {
    const conn = await connection;

    const [results] = await conn.query('insert into products (product, price) values (?, ?)', data);

    return results;
  }

  const addImage = async(id, data) => {
    const conn = await connection;

    const result = await conn.query(`insert into images (product_id, description, url) values (?, ?, ?)`, [id, ...data]);

    return result;
  }

  const remove = async (id) => {
    const conn = await connection;

    const [results] = await conn.query('delete from products where id = ? limit 1', [id]);

    return results;
  }

  const update = async (id, data) => {
    const conn = await connection;

    const [results] = await conn.query('update products set product = ?, price = ? where id = ?', [...data, id]);

    return results;
  }

  const findImages = async(products) => {
    const conn = await connection;
    const product_ids = products.map(product => product.id).join(',');

    const [images] = await conn.query(`select * from images where product_id in (${product_ids})`);

    const mapImages = images.reduce((anterior, atual) => {
      if(!anterior[atual.product_id]){
        anterior[atual.product_id] = []
      }

      return {
        ...anterior,
        [atual.product_id]: [...anterior[atual.product_id], atual]
      }
    }, {});

    return products.map(product => {
      return {
        ...product,
        images: mapImages[product.id]
      }
    })
  }

  const findAll = async () => {
    const conn = await connection;

    const [results] = await conn.query('select * from products')

    return findImages(results);

  }

  const updateCategories = async(id, data) => {
    const conn = await connection;

    // Controle de transação - Inicio
    await conn.query(`START TRANSACTION`);
    await conn.query(`delete from categories_products where product_id = ?`, [id]);
    for await(category of data){
      await conn.query(`insert into categories_products (product_id, category_id) values (?, ?)`, [id, category])
    }
    // Controle de transação - Fim
    await conn.query(`COMMIT`); //ROLLBACK
  }

  const findAllPaginated = async({ pageSize = 10, page = 1 } = {}) => {
    const conn = await connection;

    const [results] = await conn.query(`select * from products limit ${pageSize+1} offset ${page * pageSize}`);

    const hasNext = results.length > pageSize;

    if(hasNext) results.pop();

    return {
      data: await findImages(results),
      hasNext
    }
  }

  const findAllByCategory = async(data) => {
    const conn = await connection;

    const results = await conn.query(`select * from products where id in ( select product_id from categories_products where category_id = ? )`, [data])

    return findImages(results);
  }
  
  return {
    create,
    addImage,
    update,
    updateCategories,
    remove,
    findAll,
    findAllPaginated,
    findAllByCategory
  }
  
}

module.exports = init;
const init = connection => {
  const create = async (data) => {
    const conn = await connection;

    const [results] = await conn.query('insert into categories (category) values (?)', data);

    return results;
  }

  const remove = async (id) => {
    const conn = await connection;

    const [results] = await conn.query('delete from categories where id = ? limit 1', [id]);

    return results;
  }

  const update = async (id, data) => {
    const conn = await connection;

    const [results] = await conn.query('update categories set category = ? where id = ?', [...data, id]);

    return results;
  }

  const findAll = async () => {
    const conn = await connection;

    const [results] = await conn.query('select * from categories')

    return results;

  }

  const findAllPaginated = async({ pageSize = 10, page = 1 } = {}) => {
    const conn = await connection;

    const [results] = await conn.query(`select * from categories limit ${pageSize+1} offset ${page * pageSize}`);

    const hasNext = results.length > pageSize;
    if(hasNext) results.pop();

    return {
      data: results,
      hasNext
    }
  }
  
  return {
    create,
    update,
    remove,
    findAll,
    findAllPaginated
  }
  
}

module.exports = init;
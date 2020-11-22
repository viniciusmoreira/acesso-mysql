const db = require('./db')
const categories = require('./categories')(db);
const products = require('./products')(db);

const test = async () => {
  // console.log(await categories.create(['Nova categoria 01']));

  // console.log(await categories.findAllPaginated({pageSize: 2, page: 1}));

  // console.log(await categories.findAll());

  // console.log(await products.create(['nome do produto', 321]));

  // console.log(await products.update(7, ['ultimo produto criado', 555]));

  // console.log(await products.remove(7));

  // console.log(await products.addImage(2, ['descricao da imagem 2', 'url da imagem 2']))

  await products.updateCategories(4, [3,4,5])

  console.log(await products.findAll());

  // console.log(await products.findAllPaginated({pageSize:2, page:0}));
}

test();
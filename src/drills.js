require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchByName(term) {
  knexInstance
    .select('*')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${term}%`)
    .then(result => {
      console.log(`Search by name ${term}:`);
      console.log(result);
    })
}

const searchTerm = 'chicken';
searchByName(searchTerm);

function paginateProducts(pageNumber) {
  const productsPerPage = 6
  const offset = productsPerPage * (pageNumber - 1)
  knexInstance
    .select('*')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(`Paginate Products and return page ${pageNumber}:`);
      console.log(result)
    })
}

paginateProducts(2);

function productsAddedMoreThanDaysAgo(daysAgo) {
  knexInstance
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(`Products added less than ${daysAgo} days ago:`);
      console.log(result);
    })
}

productsAddedMoreThanDaysAgo(15);

function totalPriceByCategory() {
  knexInstance
    .select('category')
    .sum('price AS totalPrice')
    .from('shopping_list')
    .groupBy('category')
    .orderBy('category')
    .then(result => {
      console.log(`Total price by category:`);
      console.log(result);
    })
}

totalPriceByCategory();

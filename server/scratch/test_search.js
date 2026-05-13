const { searchProducts } = require('../src/services/vectorService');

async function testSearch() {
  const query = "Bên mình còn iPhone 15 Pro Max 256GB màu Titan tự nhiên không shop?";
  const results = await searchProducts(query, 3);
  console.log(JSON.stringify(results, null, 2));
}

testSearch();

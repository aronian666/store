import Product from "$lib/db/Product";

export async function get() {
  const products = await Product.findAll()
  return { body: products }
}


export async function post({ request }) {
  const data = await request.json()
  const product = await Product.createAll(data.product)
  return { body: product }
}


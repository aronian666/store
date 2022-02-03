import Product from "$lib/db/Product";

export async function get() {
  const products = await Product.findAll()
  return { body: products }
}


export async function post({ request }) {
  const data = await request.json()
  let product
  if (data.product._id) product = await Product.updateOneAll(data.product)
  else product = await Product.createAll(data.product)
  return { body: product }
}


export async function del({ request }) {
  const data = await request.json()
  await Product.deleteOneAll(data.product._id)
  return { body: null }
}

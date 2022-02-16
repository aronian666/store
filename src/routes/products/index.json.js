import Product from "$lib/db/Product";

export async function get({ url }) {
  const replenish = url.searchParams.get("replenish")
  let products = await Product.findAll()
  if (replenish) products = products.filter(product => product.replenish)
  return { body: products }
}


export async function post({ request }) {
  const data = await request.json()
  let product
  if (data.product._id) product = await Product.updateOneAll(data.product)
  else product = await Product.createAll(data.product)
  return { body: product }
}
export async function put({ request }) {
  const data = await request.json()
  const product = await Product.findByIdAndUpdate(data.product._id, data.product)
  return { body: product }
}

export async function del({ request }) {
  const data = await request.json()
  await Product.deleteOneAll(data.product._id)
  return { body: null }
}

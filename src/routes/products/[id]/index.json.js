import Product from "$lib/db/Product";
export async function get({ params }) {
  const product = await Product.findByIdAll(params.id)
  return { body: product }
}
export async function post({ request }) {
  const data = await request.json()
  await Product.updateOneAll(data.product)
  return { body: data.product }
}
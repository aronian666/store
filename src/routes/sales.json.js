import Product from "$lib/db/Product";
import Group from "$lib/db/Group";
export async function get() {
  const products = await Product.findAll()
  const groups = await Group.find()
  return { body: { products, groups } }
}
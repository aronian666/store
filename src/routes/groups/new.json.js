import Group from "$lib/db/Group"
import Product from "$lib/db/Product"

export async function get() {
  const products = await Product.find()
  return { body: products }
}

export async function post({ request }) {
  const data = await request.json()
  let group
  if (data.group._id) group = await Group.findByIdAndUpdate(data.group._id, data.group)
  else group = await Group.create(data.group)
  return { status: 201, body: group }
}
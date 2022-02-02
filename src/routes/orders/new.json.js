import Order from "$lib/db/Order"

export async function post({ request }) {
  const data = await request.json()
  const order = await Order.createAll(data.order)
  return { body: order }
}
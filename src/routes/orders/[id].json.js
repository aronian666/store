
import Order from "$lib/db/Order";


export async function get({ params }) {
  const order = await Order.findByIdAll(params.id)
  return { body: order }
}
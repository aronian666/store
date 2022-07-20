
import Order from "$lib/db/Order";


export async function get({ params }) {
  let order
  try {
    order = await Order.findByIdAll(params.id)
  }
  catch {
    order = null
  }
  return { body: order }
}
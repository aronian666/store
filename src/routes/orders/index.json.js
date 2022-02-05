import CartProduct from "$lib/db/CartProduct";
import Order from "$lib/db/Order";

export async function get({ url }) {
  const start = new Date(parseInt(url.searchParams.get("start")))
  const end = new Date(parseInt(url.searchParams.get("end")))
  const includes = url.searchParams.get("cart_products")
  let orders = await Order.find({ createdAt: { $gte: start, $lt: end } }).populate("client").populate("employee")
  if (includes) {
    const orders_ids = orders.map(order => order._id)
    const cartProducts = await CartProduct.find({ order: { $in: orders_ids } }).populate("product")
    orders = orders.map(order => {
      order.cartProducts = order.cartProducts.map(cartProductId => cartProducts.find(cartProduct => cartProduct._id.toString() === cartProductId.toString()))
      return order
    })
  }

  ///const client_ids = orders.map(order => order.client)
  //const clients = await Client.find({ _id: { $in: client_ids } })
  //const users = await User.find()
  return { body: orders }
}

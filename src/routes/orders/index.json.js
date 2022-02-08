import CartProduct from "$lib/db/CartProduct";
import Order from "$lib/db/Order";
import Unit from "$lib/db/Unit";

export async function get({ url }) {
  const start = new Date(parseInt(url.searchParams.get("start")))
  const end = new Date(parseInt(url.searchParams.get("end")))
  let orders = await Order.find({ createdAt: { $gte: start, $lt: end } }).populate("client").populate("employee")

  const orders_ids = orders.map(order => order._id)
  let cartProducts = await CartProduct.find({ order: { $in: orders_ids } }).populate("product").populate("unitProduct")
  const units = await Unit.find()
  cartProducts = cartProducts.map(cartProduct => {
    const unit = units.find(unit => unit._id.toString() === cartProduct.unitProduct.unit.toString())
    cartProduct.unitProduct.unit = unit
    return cartProduct
  })
  orders = orders.map(order => {
    order.cartProducts = order.cartProducts.map(cartProductId => cartProducts.find(cartProduct => cartProduct._id.toString() === cartProductId.toString()))
    return order
  })
  return { body: orders }
}

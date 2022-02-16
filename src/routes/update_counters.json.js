import Order from "$lib/db/Order";
import Product from "$lib/db/Product";

export async function get() {
  const products = await Product.find()
  const promiseProducts = products.map(async (product, index) => {
    product.code = index + 1
    const algo = await product.save()
    return algo
  })
  const orders = await Order.find()
  const promiseOrders = orders.map(async (order, index) => {
    order.code = index + 1
    const algo = await order.save()
    return algo
  })
  await Promise.all(promiseProducts)
  await Promise.all(promiseOrders)
  return { status: 303, headers: { Location: "/script" } }
}
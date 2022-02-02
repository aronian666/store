import Client from "$lib/db/Client";
import Order from "$lib/db/Order";
import User from "$lib/db/User";

export async function get() {
  let orders = await Order.find()
  const client_ids = orders.map(order => order.client)
  const clients = await Client.find({ _id: { $in: client_ids } })
  const users = await User.find()
  orders = orders.map(order => {
    order.client = clients.find(client => client._id.toString() === order.client.toString())
    order.employee = users.find(user => user._id.toString() === order.employee.toString())
    return order
  })
  return { body: orders }
}

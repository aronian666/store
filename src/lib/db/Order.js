import mongoose from 'mongoose'
import CartProduct from './CartProduct'
import Client from './Client'
import Product from './Product'
import Unit from './Unit'
const orderSchema = mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client"
  },
  cartProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartProduct"
    }
  ]
}, { timestamps: true })
const Order = mongoose.model("Order", orderSchema)
Order.createAll = async function (orderObject) {
  const client = await Client.findOne({ name: orderObject.client.name })
  if (client) orderObject.client = client
  else orderObject.client = await Client.create(orderObject.client)
  const cartProducts = await CartProduct.insertMany(orderObject.cartProducts)
  orderObject.cartProducts = cartProducts
  const order = await Order.create(orderObject)
  return order
}

Order.findByIdAll = async function (id) {
  const order = await Order.findById(id).populate("client").populate("employee").populate("cartProducts")
  order.cartProducts = await Promise.all(order.cartProducts.map(async cartProduct => {
    cartProduct = await cartProduct.populate("product")
    cartProduct.unitProduct.unit = await Unit.findById(cartProduct.unitProduct.unit)
    return cartProduct
  }))
  return order
}
export default Order
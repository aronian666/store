import mongoose, { mongo } from 'mongoose'
import CartProduct from './CartProduct'
import Client from './Client'
import Counter from './Counter'
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
  ],
  code: {
    type: Number,
    unique: true
  }
}, { timestamps: true })
orderSchema.pre("save", async function (next) {
  if (!this.isNew) next()
  const counter = await Counter.findOne({ model: "Order" })
  this.code = counter.count
  counter.count += 1
  counter.save()
  next()
})
const Order = mongoose.model("Order", orderSchema)

Order.createAll = async function (orderObject) {
  const client = await Client.findOne({ name: orderObject.client.name })
  if (client) orderObject.client = client
  else orderObject.client = await Client.create(orderObject.client)
  const order_id = mongoose.Types.ObjectId();
  orderObject.cartProducts = orderObject.cartProducts.map(cartProduct => {
    cartProduct.order = order_id
    return cartProduct
  })
  const cartProducts = await CartProduct.insertMany(orderObject.cartProducts)
  orderObject.cartProducts = cartProducts
  orderObject._id = order_id
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
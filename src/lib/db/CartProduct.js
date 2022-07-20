import mongoose from 'mongoose'
import Unit from './Unit'
import UnitProduct, { unitProductSchema } from './UnitProduct'
import { productSchema } from './Product'

const cartProductSchema = mongoose.Schema({
  options: {
    quantity: Number,
    price: Number,
    measures: {
      width: Number,
      height: Number
    }
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  unitProduct: unitProductSchema,
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quote"
  }
})

cartProductSchema.pre("validate", async function (next) {
  const unit = JSON.parse(JSON.stringify(await Unit.findById(this.unitProduct.unit)))
  const measures = unit.measures ? Object.values(this.options.measures).reduce((a, b) => a * b, 1) : 1
  const quantity = this.options.quantity * measures / unit.divide
  const unitProduct = await UnitProduct.findByIdAndUpdate(this.unitProduct._id, { $inc: { quantity: -quantity } })
  next()
})
const CartProduct = mongoose.model('CartProduct', cartProductSchema)
CartProduct.findAll = async function (filter = {}) {
  const units = await Unit.find()
  const cartProducts = await CartProduct.find(filter)
  cartProducts.forEach(cartProduct => {
    const unit = units.find(unit => unit._id.toString() === cartProduct.unitProduct.unit.toString())
    cartProduct.unitProduct.unit = unit
  })
  return cartProducts
}



export default CartProduct
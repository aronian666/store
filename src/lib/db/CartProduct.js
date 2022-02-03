import mongoose from 'mongoose'
import UnitProduct, { unitProductSchema } from './UnitProduct'

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
    ref: "Product"
  },
  unitProduct: unitProductSchema,
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
})

cartProductSchema.pre("validate", async function (next) {
  const unitProduct = await UnitProduct.findByIdAndUpdate(this.unitProduct._id, { $inc: { quantity: -this.options.quantity } })
  next()
})


export default mongoose.model("CartProduct", cartProductSchema)
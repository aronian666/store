import mongoose from 'mongoose'
import Unit from './Unit'
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
  const unit = JSON.parse(JSON.stringify(await Unit.findById(this.unitProduct.unit)))
  const measures = unit.measures ? Object.values(this.options.measures).reduce((a, b) => a * b, 1) : 1
  const quantity = this.options.quantity * measures / unit.divide
  const unitProduct = await UnitProduct.findByIdAndUpdate(this.unitProduct._id, { $inc: { quantity: -quantity } })
  next()
})


export default mongoose.model("CartProduct", cartProductSchema)
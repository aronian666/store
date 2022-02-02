import mongoose from 'mongoose'
import { unitProductSchema } from './UnitProduct'

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
})

export default mongoose.model("CartProduct", cartProductSchema)
import mongoose from 'mongoose'
import UnitProduct from './UnitProduct'
import Provider from './Provider'

const buySchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  unitProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UnitProduct"
  },
  buyPrice: {
    type: Number,
    default: 0
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider"
  },
  sellPrice: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
  }
}, { timestamps: true })


buySchema.post("save", async function (buy) {
  const unitProduct = await UnitProduct.findById(buy.unitProduct)
  unitProduct.quantity += buy.quantity
  unitProduct.buyPrice = buy.buyPrice
  unitProduct.sellPrice = buy.sellPrice
  unitProduct.save()
  return buy
})

export default mongoose.model("Buy", buySchema)
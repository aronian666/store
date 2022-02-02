import mongoose from 'mongoose'

export const unitProductSchema = mongoose.Schema({
  unit: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Unit"
  },
  buyPrice: {
    type: Number,
    default: 0,
    min: 0,
  },
  sellPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  otherPrice: {
    type: Number,
    min: 0,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 1
  }
})


export default mongoose.model("UnitProduct", unitProductSchema)
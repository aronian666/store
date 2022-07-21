import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema({
  amount: { type: Number },
  contract: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Contract",
  }
}, { timestamps: true })
export default mongoose.model("Payment", paymentSchema)
import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema({
  amount: { type: Number },
  contract: {
    type: mongoose.Types.ObjectId,
    ref: "Contract",
  }
}, { timestamps: true })
export default mongoose.model("Payment", paymentSchema)
import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  contract: {
    type: mongoose.Types.ObjectId,
    ref: "Contract",
    required: true
  }
}, { timestamps: true })
let Payment = mongoose.model("Payment", paymentSchema)
export default Payment
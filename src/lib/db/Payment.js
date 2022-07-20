import mongoose from 'mongoose'
import { assingStaticMethods } from './functions'
const paymentSchema = mongoose.Schema({
  amount: { type: Number, required: true },
  contract: {
    type: mongoose.Types.ObjectId,
    ref: "Contract",
    required: true
  }
}, { timestamps: true })
const Payment = mongoose.model("Payment", paymentSchema)
assingStaticMethods(Payment)
export default Payment
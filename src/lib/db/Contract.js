import mongoose from 'mongoose'
import User from './User'
import Order from './Order'
import Service from './Service'
import Quote from './Quote'
import { assingStaticMethods } from './functions'
import Counter from './Counter'

const contractSchema = mongoose.Schema({
  experts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Service"
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  photos: [String],
  payments: [],
  quote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quote",
    required: true
  },
  code: {
    type: Number,
    required: true
  }
})
contractSchema.pre("save", async function (next) {
  if (!this.isNew) next()
  let counter = await Counter.findOne({ model: "Contract" })
  if (!counter) counter = await Counter.create({ model: "Contract", count: 1 })
  this.code = counter.count
  counter.count += 1
  counter.save()
  next()
})
const Contract = mongoose.model("Contract", contractSchema)

assingStaticMethods(Contract)
export default Contract
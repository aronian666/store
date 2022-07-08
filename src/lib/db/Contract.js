import mongoose from 'mongoose'
import { assingStaticMethods } from './functions'

"AIzaSyDrIqo0eM9GvFIn7Zbe3sgkXAG2g6706qs"
const contractSchema = mongoose.Schema({
  client: {
    type: mongoose.Types.ObjectId,
    requried: true,
    ref: "Client"
  },
  expert: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  service: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Service"
  },
  price: {
    type: Number,
    required: true,
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    required: true
  },
  direction: {
    type: String,
    requierd: true
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  photos: [String],
  payments: []
})
const Contract = mongoose.model("Contract", contractSchema)
assingStaticMethods(Contract)
export default Contract
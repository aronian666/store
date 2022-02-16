import mongoose from 'mongoose'

const counterSchema = mongoose.Schema({
  model: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1,
    requiered: true
  }
})

export default mongoose.model("Counter", counterSchema)

import mongoose from 'mongoose'

const unitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  measures: {
    width: Boolean,
    height: Boolean
  },
  divide: {
    type: Number,
    default: 1
  }
})

export default mongoose.model("Unit", unitSchema)
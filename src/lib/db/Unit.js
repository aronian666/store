import mongoose from 'mongoose'

export const unitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    default: "",
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
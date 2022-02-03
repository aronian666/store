import mongoose from 'mongoose'

const providerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model("Provider", providerSchema)
import mongoose from 'mongoose'

const clientSchema = mongoose.Schema({
  name: String,
  phone: String,
  direction: String
})

export default mongoose.model("Client", clientSchema)
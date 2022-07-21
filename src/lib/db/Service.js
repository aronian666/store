import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  name: String
})


export default mongoose.model('Service', serviceSchema)


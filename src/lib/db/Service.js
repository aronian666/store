import mongoose from "mongoose";
const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
})
export default mongoose.model("Service", serviceSchema)

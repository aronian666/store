import mongoose from "mongoose";
import { assingStaticMethods } from "./functions";
const serviceSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
})
const Service = mongoose.model('Service', serviceSchema)
assingStaticMethods(Service)
export default Service


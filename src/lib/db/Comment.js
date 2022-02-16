import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  product_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Product"
  }
}, { timestamps: true })


export default mongoose.model("Comment", commentSchema)
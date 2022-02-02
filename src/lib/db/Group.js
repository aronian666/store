import mongoose from 'mongoose'

const groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  combinations: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      product_name: String,
      variant: Object
    }
  ],
  variants: [
    {
      name: String,
      values: [String]
    }
  ]
})

export default mongoose.model("Group", groupSchema)
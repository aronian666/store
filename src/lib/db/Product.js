import mongoose from 'mongoose'
import UnitProduct from './UnitProduct'
import Category from './Category'
import Unit from './Unit'

const productSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category"
  },
  unitProducts: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UnitProduct"
    },
  ],
  code: String,
})
const Product = mongoose.model("Product", productSchema)
// update, create and delete
Product.createAll = async function (productObject) {
  productObject.unitProducts = await UnitProduct.insertMany(productObject.unitProducts)
  const product = await Product.create(productObject)
  return product
}
Product.updateOneAll = async function (productObject) {
  await Promise.all(productObject.unitProducts.map(unitProduct => {
    return UnitProduct.findByIdAndUpdate(unitProduct._id, unitProduct)
  }))
  const product = await Product.findByIdAndUpdate(productObject._id, productObject)
  return product
}

Product.insertManyAll = async function (productsObject) {
  const products = await Promise.all(productsObject.map(product => Product.createAll(product)))
  return products
}
Product.deleteOneAll = async function (id) {
  const product = await Product.findByIdAndDelete(id)
  await Product.deleteMany({ _id: { $in: product.unitProducts } })
  return product
}

// get products
Product.findByIdAll = async function (id) {
  const product = await Product.findById(id).populate("unitProducts").populate("category")
  product.unitProducts = await Promise.all(product.unitProducts.map(async unitProduct => {
    unitProduct.unit = await Unit.findById(unitProduct.unit)
    return unitProduct
  }))
  return product
}
Product.findAll = async function () {
  let products = await Product.find().populate("category").populate("unitProducts")
  const units = await Unit.find()
  products = Promise.all(products.map(async product => {
    product.unitProducts = await Promise.all(product.unitProducts.map(async unitProduct => {
      unitProduct.unit = units.find(unit => unitProduct.unit.toString() === unit._id.toString())
      return unitProduct
    }))
    return product
  }))
  return products
}

export default mongoose.model("Product", productSchema)
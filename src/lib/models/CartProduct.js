import { groupBy } from "$lib/scripts/groupBy"
import Group from "./Group"
import Option from "./Option"
import UnitProduct from "./UnitProduct"

export default class CartProduct {
  constructor({ product, unitProduct, group, options, order }) {
    this.product = product
    this.unitProduct = unitProduct instanceof UnitProduct ? unitProduct : new UnitProduct(unitProduct)
    if (group) this.group = group instanceof Group ? group : new Group(group)
    this.options = options instanceof Option ? options : new Option(options)
    this.order = order
  }
  toObject() {
    return JSON.parse(JSON.stringify(this))
  }
  resetPrice() {
    this.options.price = this.unitProduct.sellPrice
    return this
  }
  get changed() {
    return this.unitProduct.buyPrice !== this.options.price
  }
  get measuresValue() {
    return this.unitProduct.unit.measures ? Object.values(this.options.measures).reduce((a, b) => a * b, 1) : 1
  }
  get unitPrice() {
    return parseFloat((this.measuresValue * this.options.price / this.unitProduct.unit.divide).toFixed(2));
  }
  get total() {
    return parseFloat((this.unitPrice * this.options.quantity).toFixed(2))
  }
  get equivalentQuantity() {
    return parseFloat((this.options.quantity * this.measuresValue).toFixed(2))
  }
  get gain() {
    return this.total - this.equivalentQuantity * this.unitProduct.buyPrice
  }
  get showName() {
    const measures = this.unitProduct.unit.measures ? "(" + Object.values(this.options.measures).join(" X ") + ")" : ""
    return `${this.product.name} ${measures}`
  }
  get name() {
    return this.product.name
  }
  static totalSell(cartProducts) {
    return parseFloat(cartProducts.reduce((a, b) => a + b.total, 0).toFixed(2))
  }
  static totalGain(cartProducts) {
    return parseFloat(cartProducts.reduce((a, b) => a + b.gain, 0).toFixed(2))
  }
  static totalQuantity(cartProducts) {
    return cartProducts.reduce((a, b) => a + b.equivalentQuantity, 0)
  }
  static groupProducts(cartProducts) {
    const groupProducts = groupBy(cartProducts, "name")
    const products = []
    for (let productName in groupProducts) {
      const product = { name: productName, cartProducts: groupProducts[productName] }
      product.quantity = CartProduct.totalQuantity(groupProducts[productName])
      product.totalSell = CartProduct.totalSell(groupProducts[productName])
      product.gain = CartProduct.totalGain(groupProducts[productName])
      products.push(product)
    }
    return products
  }
}
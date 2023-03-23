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
    return this.unitProduct.sellPrice !== this.options.price
  }
  get measuresValue() {
    return this.unitProduct.unit.measures ? Object.values(this.options.measures).reduce((a, b) => a * b, 1) : 1
  }
  get unitPrice() {
    return parseFloat((this.measuresValue * this.options.price / this.unitProduct.unit.divide).toFixed(2))
  }

  get total() {
    const price = this.unitPrice * this.options.quantity
    let rest = price % 1
    if (rest === 0) return price
    if (rest <= 0.5) rest = 0.5
    else rest = 1
    return parseFloat((parseInt(price) + rest).toFixed(1))
  }
  get finalUnitPrice() {
    return (this.total / this.options.quantity).toFixed(2)
  }
  get equivalentQuantity() {
    return parseFloat((this.options.quantity * this.measuresValue / this.unitProduct.unit.divide).toFixed(2))
  }
  get gain() {
    return parseFloat((this.total - this.equivalentQuantity * this.unitProduct.buyPrice).toFixed(2))
  }
  get showName() {
    const measures = []
    for (const measure in this.unitProduct.unit.measures) {
      if (this.unitProduct.unit.measures[measure]) measures.push(this.options.measures[measure])
    }
    const measuresString = measures.length ? "(" + measures.join(" X ") + ")" : ""
    return `${this.product?.name.replace(/([(][^)]*[)])/, "")} ${measuresString}`
  }
  get name() {
    return this.product?.name
  }
  static totalSell(cartProducts) {
    return parseFloat(cartProducts.reduce((a, b) => a + b.total, 0).toFixed(2))
  }
  static totalGain(cartProducts) {
    return parseFloat(cartProducts.reduce((a, b) => a + b.gain, 0).toFixed(2))
  }
  static totalQuantity(cartProducts) {
    return cartProducts.reduce((a, b) => a + b.options.quantity, 0)
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

import Group from "./Group"
import Option from "./Option"
import UnitProduct from "./UnitProduct"

export default class CartProduct {
  constructor({ product, unitProduct, group, options }) {
    this.product = product
    this.unitProduct = unitProduct instanceof UnitProduct ? unitProduct : new UnitProduct(unitProduct)
    if (group) this.group = group instanceof Group ? group : new Group(group)
    this.options = options instanceof Option ? options : new Option(options)
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
}
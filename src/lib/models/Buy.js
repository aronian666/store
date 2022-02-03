import ActiveRecord from "./ActiveRecord";

export default class Buy extends ActiveRecord {
  constructor({ _id, sellPrice, quantity, product, unitProduct, buyPrice, provider, date }) {
    super(_id)
    this.quantity = quantity
    this.product = product
    this.unitProduct = unitProduct
    this.buyPrice = buyPrice
    this.provider = provider
    this.sellPrice = sellPrice
    this.date = date
  }
  get investment() {
    return this.quantity * this.buyPrice
  }
  get gain() {
    return this.sellPrice - this.buyPrice
  }
}
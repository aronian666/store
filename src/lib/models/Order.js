
import ActiveRecord from "./ActiveRecord";
import CartProduct from "./CartProduct";
import Client from "./Client";
import User from "./User";

export default class Order extends ActiveRecord {
  constructor({ _id, cartProducts = [], client, employee, createdAt }) {
    super(_id)
    this.cartProducts = cartProducts.map(cartProduct => {
      if (typeof cartProduct === "string") return cartProduct
      return new CartProduct(cartProduct)
    })
    this.employee = new User(employee || {})
    this.client = new Client(client || {})
    this.createdAt = new Date(createdAt)
  }
  setProducts(array) {
    this.cartProducts = array.map(item => new CartProduct(item))
    return this
  }
  get time() {
    return this.createdAt.getTime()
  }
  get total() {
    return parseFloat((this.cartProducts.reduce((a, b) => a + b.total, 0)).toFixed(2))
  }
  get employeeName() {
    return this.employee.name
  }
  get employeeEmail() {
    return this.employee.email
  }
  get clientName() {
    return this.client.name
  }
  get changed() {
    if (this.cartProducts.find(c => c.changed)) return true
    return false
  }
}
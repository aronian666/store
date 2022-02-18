
import { groupBy } from "$lib/scripts/groupBy";
import ActiveRecord from "./ActiveRecord";
import CartProduct from "./CartProduct";
import Client from "./Client";
import User from "./User";

export default class Order extends ActiveRecord {
  constructor({ _id, cartProducts = [], client, employee, createdAt, code }) {
    super(_id)
    this.cartProducts = cartProducts.map(cartProduct => {
      if (typeof cartProduct === "string") return cartProduct
      return new CartProduct(cartProduct)
    })
    this.employee = new User(employee || {})
    this.client = new Client(client || {})
    this.createdAt = new Date(createdAt)
    this.code = code
  }
  setProducts(array) {
    this.cartProducts = array.map(item => new CartProduct(item))
    return this
  }
  get stringCode() {
    const zeros = 5 - this.code.toString().length
    return `V${"0".repeat(zeros > 0 ? zeros : 0)}${this.code}`
  }
  get time() {
    return this.createdAt.getTime()
  }
  get total() {
    return parseFloat((this.cartProducts.reduce((a, b) => a + b.total, 0)).toFixed(2))
  }
  get productCount() {
    return this.cartProducts.length
  }
  get employeeName() {
    return this.employee.name
  }
  get employeeEmail() {
    return this.employee.email
  }
  get clientName() {
    return this.client.showName
  }
  get changed() {
    if (this.cartProducts.find(c => c.changed)) return true
    return false
  }
  static totalSell(orders) {
    return orders.reduce((a, order) => a + CartProduct.totalSell(order.cartProducts), 0).toFixed(2)
  }
  static totalGain(orders) {
    return orders.reduce((a, order) => a + CartProduct.totalGain(order.cartProducts), 0).toFixed(2)
  }
  static totalQuantity(orders) {
    return orders.reduce((a, order) => a + CartProduct.totalQuantity(order.cartProducts), 0)
  }
  static groupEmployess(orders) {
    const employees = groupBy(orders, "employeeEmail")
    const employeesArray = []
    for (let employeeEmail in employees) {
      const employee = { email: employeeEmail, orders: employees[employeeEmail] }
      employee.productQuantity = Order.totalQuantity(employee.orders)
      employee.sellQuantity = Order.totalSell(employee.orders)
      employee.name = employees[employeeEmail][0].employee.name
      employee.ordersCount = employee.orders.length
      employeesArray.push(employee)
    }
    return employeesArray
  }
  static groupProducts(orders) {
    const cartProducts = orders.map(order => order.cartProducts).flat()
    return CartProduct.groupProducts(cartProducts)
  }
}
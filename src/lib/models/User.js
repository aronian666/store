import ActiveRecord from "./ActiveRecord"

export default class User extends ActiveRecord {
  constructor({ role, email, _id, name, code }) {
    super(_id)
    this.name = name
    this.role = role
    this.email = email
    this.code = code
  }
  get cannot() {
    if (this.role === 3) return ["products", "groups", "users", "cuts", "sales", "orders", "cart"]
    if (this.role === 2) return ["products", "groups", "users"]
    if (this.role === 1) return []
    return []
  }
  get roleString() {
    return User.getRoles().find(role => role.role === this.role).name
  }
  can(path) {
    return !this.cannot.includes(path)
  }
  filterOrders(orders = []) {
    if (this.role === 2) return orders.filter(order => order.employee._id === this._id)
    return orders
  }
  static getRoles() {
    return [
      { name: "Super Administrador", role: 0 },
      { name: "Administrador", role: 1 },
      { name: "Empleado", role: 2 },
      { name: "Invitado", role: 3 }
    ]
  }
}
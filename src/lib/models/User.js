import ActiveRecord from "./ActiveRecord"

export default class User extends ActiveRecord {
  constructor({ role, email, _id, name }) {
    super(_id)
    this.name = name
    this.role = role
    this.email = email
  }
  get cannot() {
    if (role === 2) return ["/products", "/groups"]
    return []
  }
  get roleString() {
    return User.getRoles().find(role => role.role === this.role).name
  }
  can(path) {
    return !this.cannot.includes(path)
  }
  static getRoles() {
    return [
      { name: "Administrador", role: 1 },
      { name: "Empleado", role: 2 }
    ]
  }
}
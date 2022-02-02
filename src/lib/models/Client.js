export default class Client {
  constructor({ _id, name = "", phone = "", direction = "" }) {
    this._id = _id
    this.name = name
    this.phone = phone
    this.direction = direction
  }
}
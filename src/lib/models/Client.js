export default class Client {
  constructor({ _id, name = "", phone = "", direction = "" }) {
    this._id = _id
    this.name = name
    this.phone = phone
    this.direction = direction
  }
  get showName() {
    return this.name || "AYAVIRI"
  }
  get showPhone() {
    return this.phone || "AYAVIRI"
  }
  get showDirection() {
    return this.direction || "AYAVIRI"
  }
}
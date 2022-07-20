import ActiveRecord from "./ActiveRecord"

export default class Service extends ActiveRecord {
  constructor({ _id, name }) {
    super(_id)
    this.name = name
  }
  static modelName = "Service"
}
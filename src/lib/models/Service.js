import ActiveRecord from "./ActiveRecord"

export default class Service extends ActiveRecord {
  constructor({ _id, name, createdAt }) {
    super(_id)
    this.name = name
  }
}
import ActiveRecord from "./ActiveRecord";

export default class Category extends ActiveRecord {
  constructor({ _id, name, order = 1 }) {
    super(_id)
    this.name = name
    this.order = order
  }
}
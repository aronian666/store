import ActiveRecord from "./ActiveRecord";

export default class Payment extends ActiveRecord {
  constructor({ _id, amount, createdAt }) {
    super(_id)
    this.amount = amount
    this.createdAt = new Date(createdAt)
  }
}
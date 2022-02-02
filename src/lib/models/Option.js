export default class Option {
  constructor({ quantity = 1, price, measures }) {
    this.quantity = quantity
    this.price = price;
    this.measures = measures || {
      width: 1,
      height: 1
    }
  }
}
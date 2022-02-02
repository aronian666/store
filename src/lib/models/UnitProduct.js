import Unit from "./Unit"

export default class UnitProduct {
  constructor({ _id, unit, buyPrice, sellPrice, otherPrice, quantity, divide }) {
    this._id = _id
    if (unit) this.unit = new Unit(unit)
    else this.unit = new Unit({})
    this.buyPrice = buyPrice || 0
    this.sellPrice = sellPrice || 0
    this.otherPrice = otherPrice || 0
    this.quantity = quantity || 1
    this.divide = divide || 1
  }
  get unitName() {
    return this.unit.name
  }
}
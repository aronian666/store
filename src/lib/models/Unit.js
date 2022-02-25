export default class Unit {
  constructor({ _id, name, measures = { width: false, height: false }, divide = 1 }) {
    this._id = _id
    this.name = name;
    this.measures = measures
    this.divide = divide
  }
}
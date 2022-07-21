import ActiveRecord from "./ActiveRecord";
import Client from "./Client"
import Payment from "./Payment";
import Service from "./Service";
import User from "./User";
import Quote from './Quote'

export default class Contract extends ActiveRecord {
  constructor({ _id, code = 0, quote = {}, direction, coordinates, service = {}, client = {}, experts = [], end, start, status = 0, photos = [], payments = [] }) {
    super(_id)
    this.client = new Client(client);
    this.experts = experts.map(e => new User(e));
    this.status = status;
    this.service = new Service(service);
    this.start = new Date(start);
    this.end = new Date(end);
    this.direction = direction;
    this.coordinates = coordinates;
    this.photos = photos;
    this.payments = payments.map(p => new Payment(p));
    this.quote = new Quote(quote)
    this.code = code
  }
  get statusString() {
    return Contract.statuses[this.status].name
  }
  get stringCode() {
    return super.stringCode("C")
  }
  get statusColor() {
    return Contract.statuses[this.status].color
  }
  static statuses = [{ name: "Pendiente", color: "lime" }, { name: "En ejecucion", color: "gold" }, { name: "Terminado", color: "royalblue" }, { name: "Cancelado", color: "tomato" }]

  static getMinutes(date1, date2) {
    const minutes = date2.getTime() - date1.getTime()
    return minutes / (1000 * 60)
  }
  get total() {
    return this.payments.reduce((a, payment) => a + payment.amount, 0)
  }
  get rest() {
    return this.quote.total - this.total
  }
  static modelName = "Contract"
}
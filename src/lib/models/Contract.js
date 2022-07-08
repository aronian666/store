import ActiveRecord from "./ActiveRecord";
import Client from "./Client"
import Payment from "./Payment";
import Service from "./Service";
import User from "./User";


export default class Contract extends ActiveRecord {
  constructor({ _id, direction, coordinates, service = {}, client = {}, expert = {}, price, end, start, balance, status = 0, photos = [], payments = [] }) {
    super(_id)
    this.client = new Client(client);
    this.expert = new User(expert);
    this.price = price;
    this.balance = balance;
    this.status = status;
    this.service = new Service(service);
    this.start = new Date(start);
    this.end = new Date(end);
    this.direction = direction;
    this.coordinates = coordinates;
    this.photos = photos;
    this.payments = payments.map(p => new Payment(p));
  }
  get statusString() {
    return Contract.statuses[this.status].name
  }
  get statusColor() {
    return Contract.statuses[this.status].color
  }
  static statuses = [{ name: "Pendiente", color: "orange" }, { name: "En ejecucion", color: "cyan" }, { name: "Terminado", color: "green" }, { name: "Cancelado", color: "red" }]

  static getMinutes(date1, date2) {
    const minutes = date2.getTime() - date1.getTime()
    return minutes / (1000 * 60)
  }
  get total() {
    return this.payments.reduce((a, payment) => a + payment.amount, 0)
  }
}
export default class ActiveRecord {
  constructor(_id) {
    this._id = _id
  }
  static async send(form, body) {
    const respose = await fetch(form.action, {
      method: form.method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (respose.redirected) window.location.href = respose.url
    const data = await respose.json()
    if (respose.ok) return { data }
    return { data, error: true }
  }
  static async get(url) {

    const respose = await fetch(url)
    if (respose.redirected) window.location.href = respose.url
    const data = await respose.json()
    if (respose.ok) return { data }
    return { data, error: true }
  }
  static find(array = [], string = "", properties = []) {
    return array.find(item => properties.reduce((init, property) => init || (reduceString(item[property]) === reduceString(string)), false))
  }
  static async create(record) {
    const { data } = await this.send({ action: `/${this.name.toLowerCase()}s.json`, method: "post" }, record)
    return data
  }
  static async update(record) {
    const { data } = await this.send({ action: `/${this.name.toLowerCase()}s.json?_method=PUT`, method: "post" }, record)
    return data
  }
  static async del(record) {
    const { data } = await this.send({ action: `/${this.name.toLowerCase()}s.json?_method=DEL`, method: "post" }, record)
    return data
  }
  static async all() {
    const { data } = await this.get(`/${this.name.toLowerCase()}s.json`)
    return data
  }
}
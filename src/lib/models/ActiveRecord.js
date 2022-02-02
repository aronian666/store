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
}
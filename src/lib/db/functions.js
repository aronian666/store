async function searchAll(item, properties = []) {
  await Promise.all(properties.map(async ({ model, property, type, properties }) => {
    if (type === "array") {
      item[property] = await model.find({ _id: { $in: item[property] } })
      if (properties) item[property] = await Promise.all(item[property].map((item) => searchAll(item, properties)))
    } else {
      item[property.toLowerCase()] = await model.findById(item[property.toLowerCase()])
    }
    return item
  }))
  return item
}
async function getAll({ url = new URL() }, properties = []) {
  const query = Object.fromEntries(url.searchParams)
  let record = await this.find(query)
  if (properties.length) {
    record = await Promise.all(record.map(async (item) => {
      item = await searchAll(item, properties)
      return item
    }))
  }

  return { body: record }
}
async function post({ request = new Request() }) {
  const record = await this.create(await request.json())
  return { body: record }
}
async function put({ request = new Request() }) {
  const data = await request.json()
  const record = await this.findByIdAndUpdate(data._id, data)
  return { body: record }
}
async function del({ request = new Request() }) {
  const data = await request.json()
  const record = await this.findByIdAndDelete(data._id)
  return { body: record }
}
async function get({ params }, properties = []) {
  let data
  try {
    data = await this.findById(params.id)
    if (properties.length) data = await searchAll(data, properties)
  } catch {
    data = null
  }
  return { body: data }
}
const functions = {
  getAll,
  post,
  put,
  del,
  get
}
export function assingStaticMethods(model) {
  for (let fun in functions) {
    model[fun] = functions[fun]
  }
  return model
}
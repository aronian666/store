async function getAll() {
  const record = await this.find()
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
async function get({ params }) {
  const data = await this.findById(params.id)
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
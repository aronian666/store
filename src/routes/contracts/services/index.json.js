import Service from "$lib/db/Service";

export async function get() {
  const services = await Service.find()
  return { body: services }
}
export async function post({ request = new Request() }) {
  const data = await request.json()
  const service = await Service.create(data.service)
  return { body: service }
}
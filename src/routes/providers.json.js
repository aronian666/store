import Provider from "$lib/db/Provider";

export async function get() {
  const providers = await Provider.find()
  return { body: providers }
}
export async function post({ request }) {
  const data = await request.json()
  let provider
  if (data.provider._id) provider = await Provider.findByIdAndUpdate(data.provider._id, data.provider)
  else provider = await Provider.create(data.provider)
  return { body: provider }
}
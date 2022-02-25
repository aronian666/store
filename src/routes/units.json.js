import Unit from "$lib/db/Unit";

export async function get() {
  const units = await Unit.find()
  return { body: units }
}
export async function post({ request }) {
  const data = await request.json()
  let unit
  if (data.unit._id) unit = await Unit.findByIdAndUpdate(data.unit._id, data.unit)
  else unit = await Unit.create(data.unit)
  return { body: unit }
}
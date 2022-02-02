import Group from "$lib/db/Group";

export async function get({ params }) {
  const group = await Group.findById(params.id)
  return { body: group }
}
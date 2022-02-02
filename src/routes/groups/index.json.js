import Group from "$lib/db/Group";

export async function get() {
  const groups = await Group.find()
  return { body: groups }
}

export async function del({ request }) {
  const data = await request.json()
  const algo = await Group.findByIdAndDelete(data.group._id)
  return { status: 200 }
}
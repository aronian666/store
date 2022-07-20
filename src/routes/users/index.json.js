
import User from "$lib/db/User"
export async function get() {
  const users = await User.find()
  return {
    status: 200,
    body: users
  }
}
export async function post({ request }) {
  const data = await request.json()
  const user = await User.findByIdAndUpdate(data.user._id, data.user)
  return { body: user }
}
export async function del({ request }) {
  const data = await request.json()
  const user = await User.findByIdAndDelete(data.user._id)
  return { body: user }
}
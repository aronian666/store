import connection from "$lib/db/connection"
import User from "$lib/db/User"
export async function get() {
  await connection()
  const users = await User.find()
  return {
    status: 200,
    body: { users }
  }
}

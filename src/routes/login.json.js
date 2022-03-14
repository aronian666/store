import User from "$lib/db/User";
import { serialize } from 'cookie'

export async function post({ request }) {
  const formData = await request.formData()
  const email = formData.get("user[email]")
  const password = formData.get("user[password]")
  const user = await User.findOne({ email })
  if (user) {
    const valid = await user.validPassword(password)
    if (valid) {
      const token = user.generateJWT()
      const jwt = serialize("jwt", token, { maxAge: 30 * 24 * 3600, httpOnly: true })
      return { status: 303, headers: { 'Set-Cookie': jwt, Location: '/' } }
    }
    return { status: 303, headers: { Location: `/login?error=Invalid password` } }
  }
  return { status: 303, headers: { Location: "/login?error=User not found" } }
}
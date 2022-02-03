import User from '$lib/db/User'
import { serialize } from 'cookie'
export async function post({ request }) {
  const formData = await request.formData()
  const userObject = {
    name: formData.get("user[name]"),
    email: formData.get("user[email]"),
    password: formData.get("user[password]")
  }
  try {
    const user = await User.create(userObject)
    const token = user.generateJWT()
    const jwt = serialize("jwt", token, { maxAge: 30 * 24 * 3600 * 1000, httpOnly: true })
    return { status: 303, headers: { 'Set-Cookie': jwt, Location: "/" } }
  } catch (error) {
    return { status: 303, headers: { Location: "/sign_up?error=Este usuario ya existe" } }
  }
}

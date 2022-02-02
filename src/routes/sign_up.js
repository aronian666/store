import User from '$lib/db/User'
import { serialize } from 'cookie'
export async function post({ request }) {
  const body = await request.json()
  try {
    const user = await User.create(body.user)
    const token = user.generateJWT()
    const jwt = serialize("jwt", token, { maxAge: 30 * 24 * 3600 * 1000, httpOnly: true })
    return { status: 303, headers: { 'Set-Cookie': jwt, Location: "/" } }
  } catch (error) {
    return { status: 400, body: { error: "Este correo ya existe" } }
  }
}

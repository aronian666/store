import { serialize } from 'cookie'
export async function get() {
  const jwt = serialize("jwt", '', { maxAge: 1 })
  return {
    status: 303,
    headers: { 'Set-Cookie': jwt, Location: "/login" }
  }
}
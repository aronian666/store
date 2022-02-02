import connection from "$lib/db/connection"
import User from "$lib/db/User"
import { parse } from "cookie"

export async function handle({ event, resolve }) {
  await connection()
  const { jwt } = parse(event.request.headers.get("cookie") || "")
  const user = await User.auth(jwt)
  if (user) event.locals.user = JSON.parse(JSON.stringify(user))
  else event.locals.user = null
  return resolve(event)
}
export function getSession(event) {
  return {
    current_user: event.locals.user
  }
}
import Client from "$lib/db/Client";

export async function get() {
  const clients = await Client.find()
  return { body: clients }
}
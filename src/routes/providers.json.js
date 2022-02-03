import Provider from "$lib/db/Provider";

export async function get() {
  const providers = await Provider.find()
  return { body: providers }
}
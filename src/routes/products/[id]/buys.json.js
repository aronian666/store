import Buy from "$lib/db/Buy";

export async function get({ params }) {
  const buys = await Buy.find({ product: params.id }).populate("provider").populate("unitProduct")
  return { body: buys }
}

export async function post({ request }) {
  const data = await request.json()
  const buy = await Buy.create(data.buy)
  return { body: buy }
}
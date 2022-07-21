import Payment from "$lib/db/Payment"


export const get = async ({ url = new URL() }) => {
    const query = Object.fromEntries(url.searchParams)
    let payments = await Payment.find(query)
    return { body: payments }
}
export const post = async ({ request = new Request() }) => {
    const record = await Payment.create(await request.json())
    return { body: record }
}

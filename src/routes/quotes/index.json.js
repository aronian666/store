import Client from "$lib/db/Client";
import Quote from "$lib/db/Quote";
import User from "$lib/db/User";
import CartProduct from "$lib/db/CartProduct";

export async function post({ request }) {
    const quoteObject = await request.json()
    let quote
    if (quoteObject._id) quote = await Quote.updateAll(quoteObject)
    else quote = await Quote.createAll(quoteObject)
    return { body: quote, status: 200 }
}
export const get = async ({ url = new URL() }) => {
    const query = Object.fromEntries(url.searchParams)
    let quotes = await Quote.find(query)
    quotes = await Promise.all(quotes.map(async (quote) => {
        quote.client = await Client.findById(quote.client)
        quote.employee = await User.findById(quote.employee)
        quote.cartProducts = await CartProduct.findAll({ quote: quote._id })
        return quote
    }))

    return { body: quotes }
}
export const put = async ({ request = new Request() }) => {
    const data = await request.json()
    const record = await Quote.findByIdAndUpdate(data._id, data)
    return { body: record }
}
export async function del({ request = new Request() }) {
    const data = await request.json()
    const record = await Quote.findByIdAndDelete(data._id)
    return { body: record }
}
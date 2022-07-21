import Client from "$lib/db/Client";
import Quote1 from "$lib/db/Quote";
import User from "$lib/db/User";
import CartProduct from "$lib/db/CartProduct";
import Product from "$lib/db/Product";
import Unit from "$lib/db/Unit";
import { assingStaticMethods } from "$lib/db/functions"
const Quote = assingStaticMethods(Quote1)
export async function post({ request }) {
    const quoteObject = await request.json()
    let quote
    if (quoteObject._id) quote = await Quote.updateAll(quoteObject)
    else quote = await Quote.createAll(quoteObject)
    return { body: quote, status: 200 }
}
export const get = async (props) => {
    let { body: quotes } = await Quote.getAll(props, [{ model: Client, property: "client" }, { model: CartProduct, property: "cartProducts", type: "array", properties: [{ model: Product, property: "product" }] }, { model: User, property: "employee" }])
    const units = await Unit.find({})
    quotes = quotes.map(quote => {
        quote.cartProducts.forEach(cartProduct => {
            cartProduct.unitProduct.unit = units.find(unit => unit._id.toString() === cartProduct.unitProduct.unit.toString())
        })
        return quote
    })
    return { body: quotes }
}
export const put = (props) => Quote.put(props)
export const del = (props) => Quote.del(props)
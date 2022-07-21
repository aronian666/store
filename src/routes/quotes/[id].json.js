import CartProduct from "$lib/db/CartProduct";
import Client from "$lib/db/Client";
import Product from "$lib/db/Product";
import Quote from "$lib/db/Quote";
import Unit from "$lib/db/Unit";
import User from "$lib/db/User";

export const get = async ({ params }) => {
    const units = await Unit.find({})
    const quote = await Quote.findById(params.id)
    quote.employee = await User.findById(quote.employee)
    quote.client = await Client.findById(quote.client)
    quote.cartProducts = await CartProduct.findAll({ quote: quote._id })
    return { body: quote }
};
export const del = (props) => Quote.del(props)
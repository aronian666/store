import CartProduct from "$lib/db/CartProduct";
import Client from "$lib/db/Client";
import Product from "$lib/db/Product";
import Quote from "$lib/db/Quote";
import Unit from "$lib/db/Unit";
import User from "$lib/db/User";

export const get = async (props) => {
    const units = await Unit.find({})
    const { body: quote } = await Quote.get(props, [{ model: Client, property: "client" }, { model: CartProduct, property: "cartProducts", type: "array", properties: [{ model: Product, property: "product" }] }, { model: User, property: "employee" }])
    quote.cartProducts.forEach(cartProduct => {
        cartProduct.unitProduct.unit = units.find(unit => unit._id.toString() === cartProduct.unitProduct.unit.toString())
    })
    return { body: quote }
};
export const del = (props) => Quote.del(props)
import CartProduct from "$lib/db/CartProduct";
import Unit from "$lib/db/Unit";

export async function get({ url }) {
  let cartProducts = await CartProduct.find({ product: url.searchParams.get("product_id") })
  cartProducts = await Promise.all(cartProducts.map(async cartProduct => {
    cartProduct.unitProduct.unit = await Unit.findById(cartProduct.unitProduct.unit)
    return cartProduct
  }))
  return { body: cartProducts }
}
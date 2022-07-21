import Contract from "$lib/db/Contract"
import CartProduct from "$lib/db/CartProduct"
import User from "$lib/db/User"
import Client from "$lib/db/Client"
import Quote from "$lib/db/Quote"
import Payment from "$lib/db/Payment"
export async function get({ params }) {
  const { id } = params
  const contract = await Contract.findById(id).populate("experts")
  contract.quote = await Quote.findById(contract.quote)
  contract.quote.client = await Client.findById(contract.quote.client)
  contract.quote.employee = await User.findById(contract.quote.employee)
  contract.quote.cartProducts = await CartProduct.findAll({ quote: contract.quote._id })
  contract.payments = await Payment.find({ contract: contract._id })
  return { body: contract }
} 
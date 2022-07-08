import Contract from "$lib/db/Contract"
import Service from "$lib/db/Service"
import Client from "$lib/db/Client"
import Payment from "$lib/db/Payment"
export async function get({ params }) {
  const { id } = params
  const contract = await Contract.findById(id).populate("client").populate("expert").populate("service")
  contract.payments = await Payment.find({ contract: contract._id })
  return { body: contract }
} 
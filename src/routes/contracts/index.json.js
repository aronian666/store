import Client from "$lib/db/Client";
import Contract from "$lib/db/Contract";
import Payment from "$lib/db/Payment";
import User from "$lib/db/User";
import Service from "$lib/db/Service";

export async function get({ request = new Request() }) {
  let contracts = await Contract.find()
  return { body: contracts }
}


export async function post({ request = new Request() }) {
  const data = await request.json()
  const { client } = data.contract
  if (!client._id) {
    data.contract.client = await Client.create(client)
  }
  const contract = await Contract.create(data.contract)
  contract.client = await Client.findById(contract.client)
  contract.expert = await User.findById(contract.expert)
  contract.service = await Service.findById(contract.service)
  contract.paymnets = await Payment.find({ contract: contract._id })
  return { body: contract }
}

export async function put({ request }) {
  const data = await request.json()
  const contract = await Contract.findByIdAndUpdate(data._id, data)
  return { body: contract }
}
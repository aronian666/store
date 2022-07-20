import Client from "$lib/db/Client";
import Contract from "$lib/db/Contract";
import Payment from "$lib/db/Payment";
import Service from "$lib/db/Service";
import User from "$lib/db/User";

export async function get({ request = new Request() }) {
  const users = await User.find()
  const services = await Service.find()
  let contracts = await Contract.find()
  contracts = contracts.map(contract => {
    contract.service = services.find(service => contract.service.toString() === service._id.toString())
    return contract
  })

  return { body: { contracts: [], users, services } }
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
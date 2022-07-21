import Service from "$lib/db/Service";


export async function get({ request = new Request() }) {
    const services = await Service.find()
    return { body: services }
}
export async function del({ request = new Request() }) {
    const data = await request.json()
    const record = await Service.findByIdAndDelete(data._id)
    return { body: record }
}
import Payment from "$lib/db/Payment"

export const get = () => Payment.getAll()
export const post = (props) => Payment.post(props)
export const put = (props) => Payment.put(props)
export const del = (props) => Payment.del(props)
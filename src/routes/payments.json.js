import Payment from "$lib/db/Payment"
import { assingStaticMethods } from "$lib/db/functions"
Payment = assingStaticMethods(Payment)
export const get = () => Payment.getAll()
export const post = (props) => Payment.post(props)
export const put = (props) => Payment.put(props)
export const del = (props) => Payment.del(props)
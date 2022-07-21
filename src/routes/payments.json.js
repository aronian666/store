import Payment from "$lib/db/Payment"
import { assingStaticMethods } from "$lib/db/functions"
const Payment1 = assingStaticMethods(Payment)
export const get = () => Payment1.getAll()
export const post = (props) => Payment1.post(props)
export const put = (props) => Payment1.put(props)
export const del = (props) => Payment1.del(props)
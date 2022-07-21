import Service from "$lib/db/Service";
import { assingStaticMethods } from "$lib/db/functions";
const Service1 = assingStaticMethods(Service);
export const del = (props) => Service1.del(props)
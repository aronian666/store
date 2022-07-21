import Service from "$lib/db/Service";
import { assingStaticMethods } from "$lib/db/functions";
Service = assingStaticMethods(Service);
export const del = (props) => Service.del(props)
import Contract from "./Contract";
import Order from "./Order";

export default class Quote extends Order {
    constructor(quote) {
        super(quote);
        this.contract = quote.contract;
    }
    get assigned() {
        return this.contract ? "Assignado" : "Sin assignar"
    }
}
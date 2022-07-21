import mongoose from 'mongoose'
import CartProduct from './CartProduct'
import Client from './Client'
import Counter from './Counter'
import Product from './Product'

const quoteSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client"
    },
    cartProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartProduct"
        }
    ],
    code: {
        type: Number,
        unique: true
    },
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract"
    }
}, { timestamps: true })
quoteSchema.pre("save", async function (next) {
    if (!this.isNew) next()
    let counter = await Counter.findOne({ model: "Quote" })
    if (!counter) {
        counter = await Counter.create({ model: "Quote", count: 1 })
    }
    this.code = counter.count
    counter.count += 1
    counter.save()
    next()
})
const Quote = mongoose.model("Quote", quoteSchema)
Quote.createAll = async function (quoteObject) {
    const client = await Client.findOne({ name: quoteObject.client.name })
    if (client) quoteObject.client = client
    else quoteObject.client = await Client.create(quoteObject.client)
    const quote_id = mongoose.Types.ObjectId();
    quoteObject.cartProducts = quoteObject.cartProducts.map(cartProduct => {
        cartProduct.quote = quote_id
        return cartProduct
    })
    const cartProducts = await CartProduct.insertMany(quoteObject.cartProducts)
    quoteObject.cartProducts = cartProducts
    quoteObject._id = quote_id
    const quote = await Quote.create(quoteObject)
    return quote
}
Quote.findByIdAll = async function (id) {
    const quote = await Quote.findById(id).populate("client").populate("employee").populate("cartProducts")
    quote.cartProducts = await Promise.all(quote.cartProducts.map(async cartProduct => {
        cartProduct = await cartProduct.populate("product")
        cartProduct.unitProduct.unit = await Unit.findById(cartProduct.unitProduct.unit)
        return cartProduct
    }))
    return quote
}
Quote.updateAll = async function (quoteObject) {
    let quote
    if (quoteObject._id) quote = await Quote.findById(quoteObject._id)
    else quote = await Quote.create(quoteObject)
    quote.cartProducts = await Promise.all(quoteObject.cartProducts.map(cartProduct => {
        return CartProduct.findByIdAndUpdate(cartProduct._id, cartProduct)
    }))
    quote.save()
    return quote
}



export default Quote
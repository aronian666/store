import ActiveRecord from "./ActiveRecord"
import { utils, writeFile } from 'xlsx'
import Category from "./Category"
import { reduceString } from "$lib/scripts/reduceString"
import UnitProduct from "./UnitProduct"
export default class Product extends ActiveRecord {
  constructor({ _id, name, category, unitProducts = [] }) {
    super(_id)
    this.name = name
    if (category) this.category = new Category(category)
    this.unitProducts = unitProducts.map(unit => new UnitProduct(unit))
  }
  get unitProduct() {
    return this.unitProducts[0]
  }
  get categoryName() {
    return this.category.name
  }
  get sellPrice() {
    return this.unitProducts[0].sellPrice
  }
  get quantity() {
    return this.unitProducts[0].quantity
  }
  setUnit(unit) {
    this.unitProducts.push(new UnitProduct({ unit }))
    return this
  }
  static getFormat() {
    const workbook = utils.book_new();
    const units = Array(4).fill(0).map((a, b) => `UNIDAD ${b + 1}`)
    const buyPrices = Array(4).fill(0).map((a, b) => `PRECIO DE COMPRA UNIDAD ${b + 1}`)
    const sellPrices = Array(4).fill(0).map((a, b) => `PRECIO DE VENTA UNIDAD ${b + 1}`)
    const equivalents = Array(4).fill(0).map((a, b) => `EQUIVALENCIA ${b + 1}`)
    const otherSellPrices = Array(4).fill(0).map((a, b) => `PRECIO DE VENTA JULIACA UNIDAD ${b + 1}`)
    const data = [
      ["CATEGORIA", "CODIGO", "DESCRIPCION", ...units, ...buyPrices, ...sellPrices, ...otherSellPrices, ...equivalents]
    ]
    const worksheet = utils.aoa_to_sheet(data)
    utils.book_append_sheet(workbook, worksheet, "Productos")
    writeFile(workbook, 'Formato para actualizar productos.xlsx');
  }
  static saveMany(products = []) {
    products = products.map(excelProduct => {
      const product = new Product({
        name: excelProduct['DESCRIPCION'],
        category: new Category({ name: excelProduct['CATEGORIA'] }),
        code: excelProduct["CODIGO"]
      })
      const units = Array(4).fill(0).map((a, index) => excelProduct[`UNIDAD ${index + 1}`]).filter((unit) => unit && reduceString(unit) !== "");
      product.unitProducts = units.map((u, index) => {
        const buyPrice = parseFloat(excelProduct[`PRECIO DE COMPRA UNIDAD ${index + 1}`])
        const sellPrice = parseFloat(excelProduct[`PRECIO DE VENTA UNIDAD ${index + 1}`])
        const otherPrice = parseFloat(excelProduct[`PRECIO DE VENTA JULIACA UNIDAD ${index + 1}`])
        return new UnitProduct({ buyPrice, sellPrice, unit: { name: u }, otherPrice })
      })
      return product
    })

    return super.send({ action: "/products/add.json", method: "post" }, { products })
  }
}
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
    const otherSellPrices = Array(4).fill(0).map((a, b) => `PRECIO DE VENTA JULIACA UNIDAD ${b + 1}`)
    const data = [
      ["CATEGORIA", "DESCRIPCION", ...units, ...buyPrices, ...sellPrices, ...otherSellPrices]
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
  static export(products = []) {
    const workbook = utils.book_new();
    const columnLengths = [
      { wch: 20 },
      { wch: 15 },
      { wch: 40 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 }, // end of units
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 }, // end of buy prices
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 }, // end of sell prices
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 }, // end of equivalents
      { wch: 10 },
    ]
    const units = Array(4).fill(0).map((a, b) => `UNIDAD ${b + 1}`)
    const buyPrices = Array(4).fill(0).map((a, b) => `PRECIO DE COMPRA UNIDAD ${b + 1}`)
    const sellPrices = Array(4).fill(0).map((a, b) => `PRECIO DE VENTA UNIDAD ${b + 1}`)
    const otherSellPrices = Array(4).fill(0).map((a, b) => `PRECIO DE VENTA JULIACA UNIDAD ${b + 1}`)
    const data = [
      ["CODIGO", "CATEGORIA", "DESCRIPCION", ...units, ...buyPrices, ...sellPrices, ...otherSellPrices]
    ]
    products.forEach(product => {
      const units = Array(4).fill(0).map((a, b) => product.unitProducts[b]?.unit.name)
      const buyPrices = Array(4).fill(0).map((a, b) => product.unitProducts[b]?.buyPrice)
      const sellPrices = Array(4).fill(0).map((a, b) => product.unitProducts[b]?.sellPrice)
      const otherSellPrices = Array(4).fill(0).map((a, b) => product.unitProducts[b]?.otherPrice)
      const row = [product._id, product.category.name, product.name, ...units, ...buyPrices, ...sellPrices, ...otherSellPrices]
      data.push(row)
    })
    const worksheet = utils.aoa_to_sheet(data)
    worksheet["!cols"] = columnLengths
    utils.book_append_sheet(workbook, worksheet, "Productos")
    writeFile(workbook, 'Productos.xlsx');
  }
}
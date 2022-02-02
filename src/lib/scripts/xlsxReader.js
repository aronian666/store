import { read, utils } from 'xlsx'
export class XLSXReader {
  constructor() {
    this.data = []
  }
  parseExcel(file) {
    let reader = new FileReader();
    const that = this
    reader.onload = function (e) {
      let data = e.target.result;
      let workbook = read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function (sheetName) {
        let XL_row_object = utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        that.data.push(XL_row_object)
      })
    };
    reader.onerror = function (ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
  };
};
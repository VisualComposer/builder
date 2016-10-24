export default class CssMixin {
  set data (value) {
    this._data = value
  }
  get data () {
    return this._data || ''
  }
}

import {setData, getData} from 'vc-cake'
export default class Storage {
  constructor (key) {
    Object.defineProperty(this, 'dataKey', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: key
    })
  }
  reset (index, value) {
    setData(this.key, value)
  }
  get () {
    return getData(this.key)
  }
}

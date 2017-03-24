import _ from 'lodash'
import {getService} from 'vc-cake'
import {sortingTool} from './tools'

const cook = getService('cook')

export default class Group {
  constructor (label, categories) {
    this._label = label
    this._categories = categories
  }
  get categories () {
    return this._categories
  }
  get label () {
    return this._label
  }
  get elements () {
    return _(this._categories).map('elements').flatten().map((element) => {
      return cook.get({tag: element}).toJS()
    }).sort(sortingTool).value()
  }
}

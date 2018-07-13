import { getStorage, getService } from 'vc-cake'
const utils = getService('utils')
const cook = getService('cook')
const elementsStorage = getStorage('elements')

export default (content) => {
  let textElement = cook.get({ tag: 'textBlock', output: utils.wpAutoP(content, '__VCVID__') })
  if (textElement) {
    elementsStorage.trigger('add', textElement.toJS())
  }
}

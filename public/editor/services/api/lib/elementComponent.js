import {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
export default class ElementComponent extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }
  updateInlineHtml (tagString = '') {
    const component = ReactDOM.findDOMNode(this)
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(tagString)
    component.innerHTML = ''
    component.appendChild(documentFragment)
  }
  getMixinData (mixinName) {
    const vcCake = require('vc-cake')
    const assetsManager = vcCake.getService('assets-manager')
    let returnData = null
    let mixinData = assetsManager.getCssMixinsByElement(this.props.atts)
    var { tag } = this.props.atts
    if (mixinData[tag][mixinName]) {
      let mixin = Object.keys(mixinData[tag][mixinName])
      mixin = mixin.length ? mixin.pop() : null
      if (mixin) {
        returnData = mixinData[tag][mixinName][mixin]
      }
    }
    return returnData
  }
  render () {
    return null
  }
}

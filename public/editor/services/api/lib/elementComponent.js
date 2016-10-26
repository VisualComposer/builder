import {Component, PropTypes} from 'react'

export default class ElementComponent extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
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

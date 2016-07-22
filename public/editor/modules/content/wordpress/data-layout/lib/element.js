import vcCake from 'vc-cake'
import React from 'react'
let cook = vcCake.getService('cook')
class Element extends React.Component {
  render () {
    let element = cook.get(this.props.element)
    return element.render()
  }
}
Element.propTypes = {
  element: React.PropTypes.object
}

module.exports = Element

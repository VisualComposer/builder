import vcCake from 'vc-cake'
import React from 'react'
import '../css/element.less'

let cook = vcCake.getService('cook')
let documentData = vcCake.getService('document')

class LayoutElement extends React.Component {

  componentDidMount () {
    this.props.api.notify('element:mount', this.props.element.id)
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.props.element.id)
  }

  getContent (content) {
    let currentElement = cook.get(this.props.element) // optimize
    if (currentElement.get('type') === 'container') {
      let elementsList = documentData.children(currentElement.get('id')).map(function (childElement) {
        return <LayoutElement element={childElement} key={childElement.id} api={this.props.api} />
      }, this)
      return elementsList
    }
    return content
  }

  render () {
    let element = cook.get(this.props.element)
    return element.render(this.getContent())
  }
}
LayoutElement.propTypes = {
  element: React.PropTypes.object.isRequired,
  api: React.PropTypes.object.isRequired
}

module.exports = LayoutElement

import vcCake from 'vc-cake'
import React from 'react'
import '../css/element.less'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

class LayoutElement extends React.Component {

  componentDidMount () {
    this.props.api.notify('element:mount', this.props.element.id)
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.props.element.id)
  }

  getContent (content) {
    const currentElement = cook.get(this.props.element) // optimize
    if (currentElement.get('type') === 'container') {
      let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
        return <LayoutElement element={childElement} key={childElement.id} api={this.props.api} />
      })
      return elementsList
    }
    return content
  }

  render () {
    const element = cook.get(this.props.element)

    return element.render(this.getContent())
  }
}
LayoutElement.propTypes = {
  element: React.PropTypes.object.isRequired,
  api: React.PropTypes.object.isRequired
}

export default LayoutElement

import vcCake from 'vc-cake'
import React from 'react'
import '../css/element.less'
import AddElement from '../../../../../sources/primitives/addElement/component'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class Element extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }
  componentDidMount () {
    this.props.api.notify('element:mount', this.props.element.id)
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.props.element.id)
  }

  getContent (content) {
    let returnData = null
    const currentElement = cook.get(this.props.element) // optimize
    let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      return <Element element={childElement} key={childElement.id} api={this.props.api} />
    })
    if (elementsList.length) {
      returnData = elementsList
    } else {
      returnData = currentElement.containerFor().length > 0 ? <AddElement api={this.props.api} id={currentElement.get('id')} /> : content
    }
    return returnData
  }

  render () {
    const element = cook.get(this.props.element)
    return element.render(this.getContent())
  }
}

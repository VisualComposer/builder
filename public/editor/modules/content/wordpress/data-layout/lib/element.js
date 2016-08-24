import vcCake from 'vc-cake'
import React from 'react'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class WordPressElement extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }
  getContent (content) {
    const currentElement = cook.get(this.props.element) // optimize
    if (currentElement.get('type') === 'container') {
      let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
        return <WordPressElement element={childElement} key={childElement.id} api={this.props.api} />
      })
      return elementsList
    }
    return content
  }

  render () {
    const element = cook.get(this.props.element)

    return element.renderFrontend(this.getContent())
  }
}

import vcCake from 'vc-cake'
import React from 'react'

const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class Element extends React.Component {
  static propTypes = {
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired
  }
  getContent (content) {
    const currentElement = cook.get(this.props.element) // optimize
    return DocumentData.children(currentElement.get('id')).map((childElement) => {
      return <Element element={childElement} key={childElement.id} api={this.props.api} />
    }) || content
  }

  render () {
    let el = cook.get(this.props.element)
    let id = el.get('id')
    let ContentComponent = el.getContentComponent()
    return <ContentComponent id={id} key={'vcvLayoutWordpressComponent' + id} atts={el.toJS()}>
      {this.getContent()}
    </ContentComponent>
  }
}

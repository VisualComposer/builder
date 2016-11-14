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
  prepareAttributes (atts) {
    let layoutAtts = {}
    let element = cook.get(atts)
    Object.keys(atts).forEach((key) => {
      let attrSettings = element.settings(key)
      if (attrSettings.settings.type === 'htmleditor' && attrSettings.settings.options && attrSettings.settings.options.inline === true) {
        layoutAtts[key] = <div dangerouslySetInnerHTML={{__html: atts[key]}} />
      } else {
        layoutAtts[key] = atts[key]
      }
    })
    return layoutAtts
  }
  render () {
    let el = cook.get(this.props.element)
    let id = el.get('id')
    let ContentComponent = el.getContentComponent()
    return <ContentComponent id={id} clean key={'vcvLayoutWordpressComponent' + id} atts={this.prepareAttributes(el.getAll())}>
      {this.getContent()}
    </ContentComponent>
  }
}

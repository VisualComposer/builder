import vcCake from 'vc-cake'
import React from 'react'
import '../css/element.less'
import ContentControls from './helpers/contentControls/component'
import ContentEditable from './helpers/contentEditable/component'

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
      returnData = currentElement.containerFor().length > 0 ? <ContentControls api={this.props.api} id={currentElement.get('id')} /> : content
    }
    return returnData
  }
  visualizeAttributes (atts) {
    let layoutAtts = {}
    let element = cook.get(atts)
    Object.keys(atts).forEach((key) => {
      let attrSettings = element.settings(key)
      if (attrSettings.settings.type === 'htmleditor' && attrSettings.settings.options && attrSettings.settings.options.inline === true) {
        layoutAtts[key] = <ContentEditable id={atts.id} field={key} api={this.props.api}>
          {atts[key] || ''}
        </ContentEditable>
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
    let editor = {
      'data-vcv-element': id
    }
    return <ContentComponent id={id} key={'vcvLayoutContentComponent' + id} atts={this.visualizeAttributes(el.toJS())} editor={editor}>
      {this.getContent()}
    </ContentComponent>
  }
}

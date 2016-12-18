import vcCake from 'vc-cake'
import React from 'react'
import '../css/element.less'
import ContentControls from './helpers/contentControls/component'
import ContentEditableComponent from './helpers/contentEditable/contentEditableComponent'

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
      returnData = currentElement.containerFor().length > 0
        ? <ContentControls api={this.props.api} id={currentElement.get('id')} /> : content
    }
    return returnData
  }

  visualizeAttributes (element) {
    let layoutAtts = {}
    let atts = element.getAll()
    Object.keys(atts).forEach((key) => {
      let attrSettings = element.settings(key)
      if (attrSettings.settings.options && attrSettings.settings.options.inline === true) {
        layoutAtts[ key ] = <ContentEditableComponent id={atts.id} field={key} fieldType={attrSettings.type.name} api={this.props.api} options={attrSettings.settings.options}>
          {atts[ key ] || ''}
        </ContentEditableComponent>
      } else {
        layoutAtts[ key ] = atts[ key ]
      }
    })
    return layoutAtts
  }

  render () {
    let el = cook.get(this.props.element)
    let id = el.get('id')
    let ContentComponent = el.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    let editor = {
      'data-vcv-element': id
    }
    if (el.get('metaDisableInteractionInEditor')) {
      editor['data-vcv-element-disable-interaction'] = true
    }
    return <ContentComponent id={id} key={'vcvLayoutContentComponent' + id} atts={this.visualizeAttributes(el)}
      editor={editor}>
      {this.getContent()}
    </ContentComponent>
  }
}

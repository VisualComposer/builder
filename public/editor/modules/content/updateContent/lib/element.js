import vcCake from 'vc-cake'
import React from 'react'
import ContentControls from '../../../../../components/layoutHelpers/contentControls/component'
import ContentEditableComponent from '../../../../../components/layoutHelpers/contentEditable/contentEditableComponent'
import ColumnResizer from '../../../../../components/columnResizer/columnResizer'
import PropTypes from 'prop-types'

const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')
const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')

export default class Element extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.dataUpdate = this.dataUpdate.bind(this)
    this.state = {
      element: props.element
    }
  }

  componentWillReceiveProps (nextProps) {
    assetsStorage.trigger('updateElement', this.state.element.id)
    this.setState({ element: nextProps.element })
  }

  componentDidMount () {
    this.props.api.notify('element:mount', this.state.element.id)
    elementsStorage.on(`element:${this.state.element.id}`, this.dataUpdate)
    assetsStorage.trigger('addElement', this.state.element.id)
  }

  dataUpdate (data, source, options) {
    this.setState({ element: data || this.props.element })
    assetsStorage.trigger('updateElement', this.state.element.id, options)
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.state.element.id)
    elementsStorage.off(`element:${this.state.element.id}`, this.dataUpdate)
    assetsStorage.trigger('removeElement', this.state.element.id)
  }

  getContent (content) {
    let returnData = null
    const currentElement = cook.get(this.state.element) // optimize
    let elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      let elements = [ <Element element={childElement} key={childElement.id} api={this.props.api} /> ]
      if (childElement.tag === 'column') {
        elements.push(
          <ColumnResizer key={`columnResizer-${childElement.id}`} linkedElement={childElement.id} api={this.props.api} />
        )
      }
      return elements
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
    let atts = element.getAll(false)
    Object.keys(atts).forEach((key) => {
      let attrSettings = element.settings(key)
      if (attrSettings.settings.options && attrSettings.settings.options.inline === true) {
        layoutAtts[ key ] =
          <ContentEditableComponent id={atts.id} field={key} fieldType={attrSettings.type.name} api={this.props.api} options={attrSettings.settings.options}>
            {atts[ key ] || ''}
          </ContentEditableComponent>
      } else {
        layoutAtts[ key ] = atts[ key ]
      }
    })
    return layoutAtts
  }

  render () {
    let el = cook.get(this.state.element)
    if (!el) {
      return null
    }
    if (this.state.element && this.state.element.hidden) {
      return null
    }
    let id = el.get('id')
    let ContentComponent = el.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    let editor = {
      'data-vcv-element': id
    }
    if (el.get('metaDisableInteractionInEditor')) {
      editor[ 'data-vcv-element-disable-interaction' ] = true
    }
    return <ContentComponent id={id} key={'vcvLayoutContentComponent' + id} atts={this.visualizeAttributes(el)}
      api={this.props.api}
      editor={editor}>
      {this.getContent()}
    </ContentComponent>
  }
}

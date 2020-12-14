import vcCake from 'vc-cake'
import React from 'react'
import ContentControls from 'public/components/layoutHelpers/contentControls/component'
import ContentEditableComponent from 'public/components/layoutHelpers/contentEditable/contentEditableComponent'
import ColumnResizer from 'public/components/columnResizer/columnResizer'
import PropTypes from 'prop-types'

const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')
const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')
const dataManager = vcCake.getService('dataManager')

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

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    assetsStorage.trigger('updateElement', this.state.element.id)
    this.setState({ element: nextProps.element })
  }

  /* eslint-enable */

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
    const elementsList = DocumentData.children(currentElement.get('id')).map((childElement) => {
      const elements = [<Element element={childElement} key={childElement.id} api={this.props.api} />]
      if (childElement.tag === 'column') {
        if (!vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') || dataManager.get('vcvManageOptions') || !this.state.element.metaIsElementLocked) {
          elements.push(
            <ColumnResizer
              key={`columnResizer-${childElement.id}`}
              linkedElement={childElement.id}
              api={this.props.api}
            />
          )
        }
      }
      return elements
    })
    if (elementsList.length) {
      returnData = elementsList
    } else {
      if (currentElement.containerFor().length > 0) {
        if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !dataManager.get('vcvManageOptions') && currentElement.get('metaIsElementLocked')) {
          returnData = null
        } else {
          returnData = <ContentControls api={this.props.api} id={currentElement.get('id')} />
        }
      } else {
        returnData = content
      }
    }
    return returnData
  }

  visualizeAttributes (element) {
    const layoutAtts = {}
    const atts = element.getAll(false)
    Object.keys(atts).forEach((key) => {
      const attrSettings = element.settings(key)
      if (attrSettings.settings.options && attrSettings.settings.options.inline === true) {
        layoutAtts[key] =
          <ContentEditableComponent id={atts.id} fieldKey={key} fieldType={attrSettings.type.name} api={this.props.api} options={attrSettings.settings.options}>
            {atts[key] || ''}
          </ContentEditableComponent>
      } else {
        layoutAtts[key] = atts[key]
      }
    })
    return layoutAtts
  }

  render () {
    const el = cook.get(this.state.element)
    if (!el) {
      return null
    }
    if (this.state.element && this.state.element.hidden) {
      return null
    }
    const id = el.get('id')
    const ContentComponent = el.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    const editor = {
      'data-vcv-element': id
    }
    if (el.get('metaDisableInteractionInEditor')) {
      editor['data-vcv-element-disable-interaction'] = true
    }

    return (
      <ContentComponent
        id={id} key={'vcvLayoutContentComponent' + id} atts={this.visualizeAttributes(el)}
        api={this.props.api}
        editor={editor}
      >
        {this.getContent()}
      </ContentComponent>
    )
  }
}

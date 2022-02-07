import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import ContentControls from 'public/components/layoutHelpers/contentControls/component'
import ColumnResizer from 'public/components/columnResizer/columnResizer'
import { cloneDeep, defer, isEqual } from 'lodash'
import PropTypes from 'prop-types'
import EmptyCommentElementWrapper from './emptyCommentElementWrapper.tsx'

const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')
const cook = vcCake.getService('cook')
const DocumentData = vcCake.getService('document')
const roleManager = vcCake.getService('roleManager')
const utils = vcCake.getService('utils')

const {
  updateDynamicComments,
  cleanComments
} = cook.dynamicFields

export default class Element extends React.Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.dataUpdate = this.dataUpdate.bind(this)
    this.elementComponentTransformation = this.elementComponentTransformation.bind(this)
    this.getEditorProps = this.getEditorProps.bind(this)
    this.elementComponentRef = React.createRef()
    this.state = {
      element: props.element,
      currentContent: null
    }
  }

  componentDidMount () {
    this.props.api.notify('element:mount', this.state.element.id)
    if (this.elementComponentRef.current) {
      const domNode = ReactDOM.findDOMNode(this.elementComponentRef.current)
      const htmlString = domNode ? utils.normalizeHtml(domNode.parentElement.innerHTML) : ''
      elementsStorage.trigger('addHtmlString', this.state.element.id, htmlString)
    }
    elementsStorage.on(`element:${this.state.element.id}`, this.dataUpdate)
    elementsStorage.state('elementComponentTransformation').onChange(this.elementComponentTransformation)
    if (this.elementComponentRef && this.elementComponentRef.current) {
      const cookElement = cook.get(this.state.element)
      updateDynamicComments(this.elementComponentRef.current, this.state.element.id, cookElement)
    }
    defer(() => {
      assetsStorage.trigger('addElement', this.state.element.id)
    })
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.state.element.id)
    elementsStorage.trigger('removeHtmlString', this.state.element.id)
    elementsStorage.off(`element:${this.state.element.id}`, this.dataUpdate)
    elementsStorage.state('elementComponentTransformation').ignoreChange(this.elementComponentTransformation)
    // Clean everything before/after
    if (!this.elementComponentRef || !this.elementComponentRef.current) {
      return
    }
    const el = ReactDOM.findDOMNode(this.elementComponentRef.current)
    cleanComments(el, this.state.element.id)
  }

  componentDidUpdate (prevProps, prevState) {
    if (!isEqual(prevProps.element, this.props.element)) {
      if (!isEqual(prevState.element, this.props.element)) {
        assetsStorage.trigger('updateElement', prevState.element.id)
      }
      this.setState({ element: this.props.element })
    }
    this.props.api.notify('element:didUpdate', this.props.element.id)
    if (this.elementComponentRef.current) {
      const domNode = ReactDOM.findDOMNode(this.elementComponentRef.current)
      const htmlString = domNode ? utils.normalizeHtml(domNode.parentElement.innerHTML) : ''
      elementsStorage.trigger('addHtmlString', this.state.element.id, htmlString)
    }
    if (this.elementComponentRef && this.elementComponentRef.current) {
      const cookElement = cook.get(this.state.element)
      updateDynamicComments(this.elementComponentRef.current, this.state.element.id, cookElement)
    }
  }

  dataUpdate (data, source, options) {
    const { disableUpdateAssets, disableUpdateComponent } = options || {}
    if (disableUpdateAssets !== true) {
      assetsStorage.trigger('updateElement', this.state.element.id, options)
    }
    if (disableUpdateComponent !== true) {
      this.setState({ element: data || this.props.element })
    }
  }

  elementComponentTransformation (data) {
    if (data && data.transformed) {
      this.props.api.notify('element:didUpdate', this.props.element.id)
    }
  }

  getContent (content) {
    let returnData = null
    const currentElement = cook.get(this.state.element) // optimize
    const elementsList = DocumentData.children(currentElement.get('id')).map((childElement, i) => {
      let elements = [<Element element={childElement} key={childElement.id} api={this.props.api} />]
      if (childElement.tag === 'column') {
        if (!vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') || roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin()) || !this.state.element.metaIsElementLocked) {
          elements.push(
            <ColumnResizer
              key={`columnResizer-${childElement.id}`} linkedElement={childElement.id}
              api={this.props.api}
            />
          )

          if (i === 0) {
            const newElement = <ColumnResizer isFirst={true}
              key={`columnResizer-${childElement.id}-first`} linkedElement={childElement.id}
              api={this.props.api}
            />
            elements = [newElement].concat(elements)
          }

        }
      }
      return elements
    })
    const visibleElementsList = DocumentData.children(currentElement.get('id')).filter(childElement => childElement.hidden !== true)
    if (visibleElementsList.length) {
      returnData = elementsList
    } else {
      if (currentElement.containerFor().length > 0) {
        if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin()) && currentElement.get('metaIsElementLocked')) {
          returnData = <EmptyCommentElementWrapper />
        } else {
          returnData = <EmptyCommentElementWrapper><ContentControls api={this.props.api} id={currentElement.get('id')} /></EmptyCommentElementWrapper>
        }
      } else {
        returnData = content || <EmptyCommentElementWrapper />
      }
    }

    return !returnData ? <EmptyCommentElementWrapper /> : returnData
  }

  getEditorProps (id, cookElement) {
    if (!cookElement) {
      cookElement = cook.getById(id)
    }
    const editor = {
      'data-vcv-element': id
    }
    if (cookElement.get('metaDisableInteractionInEditor')) {
      editor['data-vcv-element-disable-interaction'] = true
    }
    if (vcCake.env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin()) && cookElement.get('metaIsElementLocked')) {
      editor['data-vcv-element-locked'] = true
    }
    return editor
  }

  render () {
    const { api, ...other } = this.props
    const element = this.state.element
    const cookElement = cook.get(element)
    if (!cookElement) {
      return null
    }
    if (element && element.hidden) {
      return null
    }
    const id = cookElement.get('id')
    const ContentComponent = cookElement.getContentComponent()
    if (!ContentComponent) {
      return null
    }
    const editor = this.getEditorProps(id, cookElement)
    const rawAtts = cloneDeep(cookElement.getAll(false))

    return (
      <ContentComponent
        ref={this.elementComponentRef}
        id={id}
        key={'vcvLayoutContentComponent' + id}
        atts={cook.visualizeAttributes(cookElement, api)}
        rawAtts={rawAtts}
        api={api}
        editor={editor}
        getEditorProps={this.getEditorProps}
        {...other}
      >
        {this.getContent()}
      </ContentComponent>
    )
  }
}

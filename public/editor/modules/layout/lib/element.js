import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import { defer } from 'lodash'
import PropTypes from 'prop-types'
import ElementWrapper from './elementWrapper'

const elementsStorage = vcCake.getStorage('elements')
const assetsStorage = vcCake.getStorage('assets')
const cook = vcCake.getService('cook')
const roleManager = vcCake.getService('roleManager')
const utils = vcCake.getService('utils')

export default class Element extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.elementComponentTransformation = this.elementComponentTransformation.bind(this)
    this.getEditorProps = this.getEditorProps.bind(this)
    this.elementComponentRef = React.createRef()
  }

  componentDidMount () {
    window.setTimeout(() => {
      this.props.api.notify('element:mount', this.props.id)
    }, 10)

    if (this.elementComponentRef.current) {
      const domNode = ReactDOM.findDOMNode(this.elementComponentRef.current) // eslint-disable-line
      const htmlString = domNode ? utils.normalizeHtml(domNode.parentElement.innerHTML) : ''
      elementsStorage.trigger('addHtmlString', this.props.id, htmlString)
    }
    elementsStorage.state('elementComponentTransformation').onChange(this.elementComponentTransformation)
    defer(() => {
      assetsStorage.trigger('addElement', this.props.id)
    })
  }

  componentWillUnmount () {
    this.props.api.notify('element:unmount', this.props.id)
    elementsStorage.trigger('removeHtmlString', this.props.id)
    elementsStorage.state('elementComponentTransformation').ignoreChange(this.elementComponentTransformation)
    assetsStorage.trigger('removeElement', this.props.id)
  }

  componentDidUpdate () {
    if (this.elementComponentRef.current) {
      const domNode = ReactDOM.findDOMNode(this.elementComponentRef.current) // eslint-disable-line
      const htmlString = domNode ? utils.normalizeHtml(domNode.parentElement.innerHTML) : ''
      elementsStorage.trigger('addHtmlString', this.props.id, htmlString)
    }
  }

  elementComponentTransformation (data) {
    if (data && data.transformed) {
      this.props.api.notify('element:didUpdate', this.props.id)
    }
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
    return !this.props.disableControls ? editor : {}
  }

  render () {
    const { api, id } = this.props

    console.log('this.props.disableControls', this.props)
    return (
      <ElementWrapper
        ref={this.elementComponentRef}
        id={id}
        key={`vcvLayoutContentComponent${id}:${this.props.postId}`}
        postId={this.props.postId}
        api={api}
        getEditorProps={this.getEditorProps}
      />
    )
  }
}

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import HubTemplateControl from './hubTemplateControl'
import CustomTemplateControl from './customTemplateControl'
import { getService, env } from 'vc-cake'
const dataManager = getService('dataManager')
const hubTemplateTypes = ['predefined', 'hub', 'hubHeader', 'hubFooter', 'hubSidebar', 'block']
const localizations = dataManager.get('localizations')
const addTemplate = localizations ? localizations.addTemplate : 'Add Template'
const removeTemplate = localizations ? localizations.removeTemplate : 'Remove Template'

export default class TemplateControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    applyTemplate: PropTypes.func.isRequired,
    removeTemplate: PropTypes.func.isRequired,
    spinner: PropTypes.bool,
    type: PropTypes.string,
    description: PropTypes.string,
    preview: PropTypes.string,
    thumbnail: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewStyle: {}
    }
    this.handleApplyTemplate = this.handleApplyTemplate.bind(this)
    this.handleRemoveTemplate = this.handleRemoveTemplate.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.hidePreview = this.hidePreview.bind(this)
  }

  componentDidMount () {
    this.ellipsize('.vcv-ui-item-element-name')
    // this.ellipsize('.vcv-ui-item-preview-text')
  }

  showPreview () {
    this.setState({
      previewVisible: true
    }, this.updatePreviewPosition)
  }

  hidePreview () {
    this.setState({
      previewVisible: false
    })
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
      if (typeof document.body[fn] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[matchesFn](selector)) {
        return parent
      }
      el = parent
    }
    return null
  }

  updatePreviewPosition () {
    const element = ReactDOM.findDOMNode(this)

    let container
    if (element.closest === undefined) {
      container = this.getClosest(element, '.vcv-ui-item-list')
    } else {
      container = element.closest('.vcv-ui-item-list')
    }
    const firstElement = container.querySelector('.vcv-ui-item-list-item')
    const trigger = element.querySelector('.vcv-ui-item-element-content')
    const preview = element.querySelector('.vcv-ui-item-preview-container')

    const triggerSizes = trigger.getBoundingClientRect()
    const firsElementSize = firstElement.getBoundingClientRect()
    const previewSizes = preview.getBoundingClientRect()
    const windowSize = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    // default position
    let posX = triggerSizes.left + triggerSizes.width
    let posY = triggerSizes.top
    // position if no place to show on a right side
    if (posX + previewSizes.width > windowSize.width) {
      posX = triggerSizes.left - previewSizes.width
    }
    // position if no place to show on left side (move position down)
    if (posX < 0) {
      posX = triggerSizes.left
      posY = triggerSizes.top + triggerSizes.height
    }
    // position if no place to show on right side
    if (posX + previewSizes.width > windowSize.width) {
      posX = triggerSizes.left + triggerSizes.width - previewSizes.width
    }
    // position if no place from left and right
    if (posX < 0) {
      posX = firsElementSize.left
    }
    // don't show if window size is smaller than preview
    if (posX + previewSizes.width > windowSize.width) {
      return false
    }

    // position if no place to show on bottom
    if (posY + previewSizes.height > windowSize.height) {
      posY = triggerSizes.top + triggerSizes.height - previewSizes.height
      // position if preview is above element
      if (posX === triggerSizes.left || posX === firsElementSize.left) {
        posY = triggerSizes.top - previewSizes.height
      }
    }
    // don't show if window size is smaller than preview
    if (posY < 0) {
      return false
    }

    this.setState({
      previewStyle: {
        left: posX,
        top: posY
      }
    })
    return true
  }

  handleApplyTemplate (e) {
    e && e.preventDefault()
    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      this.props.applyTemplate(this.props.id, this.props.type)
    } else {
      this.props.applyTemplate(this.props.data || {}, this.props.type)
    }
  }

  handleRemoveTemplate () {
    this.props.removeTemplate(this.props.id)
  }

  ellipsize (selector) {
    const element = ReactDOM.findDOMNode(this).querySelector(selector)
    const wordArray = element.innerHTML.split(' ')

    // Check if difference is within a 3px threshold
    // 3px is a safe value to cover the differences between the browsers
    while (((element.scrollHeight - element.offsetHeight) > 3) && wordArray.length > 0) {
      wordArray.pop()
      element.innerHTML = wordArray.join(' ') + '...'
    }
    return this
  }

  getCustomTemplateProps () {
    return {
      ...this.props,
      handleApplyTemplate: this.handleApplyTemplate,
      handleRemoveTemplate: this.handleRemoveTemplate,
      addTemplateText: addTemplate,
      removeTemplateText: removeTemplate
    }
  }

  getHubTemplateProps () {
    return {
      ...this.props,
      handleApplyTemplate: this.handleApplyTemplate,
      handleRemoveTemplate: this.handleRemoveTemplate,
      showPreview: this.showPreview,
      hidePreview: this.hidePreview,
      addTemplateText: addTemplate,
      removeTemplateText: removeTemplate,
      previewStyle: this.state.previewStyle,
      previewVisible: this.state.previewVisible
    }
  }

  getCustomTemplateControl () {
    return <CustomTemplateControl {...this.getCustomTemplateProps()} />
  }

  getHubTemplateControl () {
    return <HubTemplateControl {...this.getHubTemplateProps()} />
  }

  render () {
    const { type } = this.props
    return type && hubTemplateTypes.includes(type) ? this.getHubTemplateControl() : this.getCustomTemplateControl()
  }
}

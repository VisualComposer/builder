import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import HubBlockControl from './hubBlockControl'
import CustomBlockControl from './customBlockControl'
import { env } from 'vc-cake'

const hubBlockTypes = ['block']

export default class BlockControl extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    applyBlock: PropTypes.func.isRequired,
    removeBlock: PropTypes.func.isRequired,
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
    this.handleApplyBlock = this.handleApplyBlock.bind(this)
    this.handleRemoveBlock = this.handleRemoveBlock.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.hidePreview = this.hidePreview.bind(this)
    this.handleUpdatePreviewPosition = this.handleUpdatePreviewPosition.bind(this)
  }

  showPreview () {
    this.setState({
      previewVisible: true
    }, this.handleUpdatePreviewPosition)
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

  handleUpdatePreviewPosition () {
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
    if (!preview) {
      return false
    }
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

  handleApplyBlock (e) {
    e && e.preventDefault()
    if (env('VCV_FT_TEMPLATE_DATA_ASYNC')) {
      this.props.applyBlock(this.props.id, this.props.type)
    } else {
      this.props.applyBlock(this.props.data || {}, this.props.type)
    }
  }

  handleRemoveBlock () {
    this.props.removeBlock(this.props.id, this.props.type)
  }

  getCustomTemplateProps () {
    return {
      ...this.props,
      handleApplyBlock: this.handleApplyBlock,
      handleRemoveBlock: this.handleRemoveBlock
    }
  }

  getHubTemplateProps () {
    return {
      ...this.props,
      handleApplyBlock: this.handleApplyBlock,
      handleRemoveBlock: this.handleRemoveBlock,
      showPreview: this.showPreview,
      hidePreview: this.hidePreview,
      previewStyle: this.state.previewStyle,
      previewVisible: this.state.previewVisible,
      handleUpdatePreviewPosition: this.handleUpdatePreviewPosition
    }
  }

  getCustomTemplateControl () {
    return <CustomBlockControl {...this.getCustomTemplateProps()} />
  }

  getHubTemplateControl () {
    return <HubBlockControl {...this.getHubTemplateProps()} />
  }

  render () {
    const { type } = this.props
    return type && hubBlockTypes.includes(type) ? this.getHubTemplateControl() : this.getCustomTemplateControl()
  }
}

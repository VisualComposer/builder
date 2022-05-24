import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getService, getStorage } from 'vc-cake'

const settingsStorage = getStorage('settings')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default class HubBlockControl extends React.Component {
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
    thumbnail: PropTypes.string,
    handleApplyBlock: PropTypes.func.isRequired,
    handleRemoveBlock: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.itemRef = React.createRef()

    this.state = {
      previewVisible: false,
      previewStyle: {}
    }

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
    const element = this.itemRef.current
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

  render () {
    const { name, spinner, thumbnail, preview, description, handleApplyBlock, handleRemoveBlock } = this.props
    const { previewVisible, previewStyle } = this.state

    const localizations = dataManager.get('localizations')
    const nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    const spinnerClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-wp-spinner-light': true,
      'vcv-ui-state--hidden': !spinner
    })

    const applyClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-add': true,
      'vcv-ui-state--hidden': spinner
    })

    const removeClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-close-thin vcv-ui-form-attach-image-item-control-state--danger': true,
      'vcv-ui-state--hidden': spinner
    })

    const overlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-overlay--visible': spinner,
      'vcv-ui-item-control--visible': this.props.isRemoveStateActive
    })

    const disablePreview = settingsStorage.state('itemPreviewDisabled').get()
    let previewBox = ''
    if (!disablePreview && previewVisible) {
      previewBox = (
        <figure className='vcv-ui-item-preview-container' style={previewStyle}>
          <img
            className='vcv-ui-item-preview-image'
            src={preview}
            alt={name}
            onLoad={this.handleUpdatePreviewPosition}
          />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {description}
            </div>
          </figcaption>
        </figure>
      )
    }

    const overlayProps = {}
    let itemButton = null
    const isAbleToRemove = roleManager.can('editor_content_user_templates_management', roleManager.defaultTrue())
    if (this.props.isRemoveStateActive) {
      if (isAbleToRemove) {
        itemButton = (
          <span
            className={removeClasses}
            title={localizations.removePlaceholder.replace('%', name)}
          />
        )
      } else {
        overlayProps.style = {
          cursor: 'not-allowed'
        }
      }
    } else {
      itemButton = roleManager.can('editor_content_template_add', roleManager.defaultTrue()) ? (
        <span
          className={applyClasses}
          title={localizations.addPlaceholder.replace('%', name)}
        />
      ) : null
    }

    return (
      <div className='vcv-ui-item-list-item' ref={this.itemRef}>
        <span
          className='vcv-ui-item-element'
          onMouseEnter={!disablePreview ? this.showPreview : null}
          onMouseLeave={!disablePreview ? this.hidePreview : null}
          onClick={this.props.isRemoveStateActive && isAbleToRemove ? handleRemoveBlock : handleApplyBlock}
        >
          <span className='vcv-ui-item-element-content'>
            <img
              className='vcv-ui-item-element-image'
              src={thumbnail}
              alt={name}
            />
            <span className={overlayClasses} {...overlayProps}>
              {itemButton}
              <span className={spinnerClasses} />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          {previewBox}
        </span>
      </div>
    )
  }
}

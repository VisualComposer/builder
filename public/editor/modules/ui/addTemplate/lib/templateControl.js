import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

const AssetsManager = vcCake.getService('wipAssetsManager')

export default class TemplateControl extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    id: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    api: React.PropTypes.object.isRequired,
    applyTemplate: React.PropTypes.func.isRequired,
    removeTemplate: React.PropTypes.func.isRequired,
    spinner: React.PropTypes.bool,
    type: React.PropTypes.string,
    description: React.PropTypes.string,
    preview: React.PropTypes.string,
    thumbnail: React.PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      letter: this.props.name.charAt(0).toUpperCase(),
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
    if (this.updatePreviewPosition()) {
      this.setState({
        previewVisible: true
      })
    }
  }

  hidePreview () {
    this.setState({
      previewVisible: false
    })
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      el = parent
    }
    return null
  }

  updatePreviewPosition () {
    let element = ReactDOM.findDOMNode(this)

    let container
    if (element.closest === undefined) {
      container = this.getClosest(element, '.vcv-ui-item-list')
    } else {
      container = element.closest('.vcv-ui-item-list')
    }
    let firstElement = container.querySelector('.vcv-ui-item-list-item')
    let trigger = element.querySelector('.vcv-ui-item-element-content')
    let preview = element.querySelector('.vcv-ui-item-preview-container')

    let triggerSizes = trigger.getBoundingClientRect()
    let firsElementSize = firstElement.getBoundingClientRect()
    let previewSizes = preview.getBoundingClientRect()
    let windowSize = {
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
    this.props.applyTemplate(this.props.data || {})
  }

  handleRemoveTemplate () {
    this.props.removeTemplate(this.props.id)
  }

  ellipsize (selector) {
    let element = ReactDOM.findDOMNode(this).querySelector(selector)
    let wordArray = element.innerHTML.split(' ')
    while (element.scrollHeight > element.offsetHeight && wordArray.length > 0) {
      wordArray.pop()
      element.innerHTML = wordArray.join(' ') + '...'
    }
    return this
  }

  render () {
    let { name, spinner, type, thumbnail, preview, description } = this.props
    let { previewVisible, previewStyle, letter } = this.state

    let nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    let spinnerClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-wp-spinner': true,
      'vcv-ui-state--hidden': !spinner
    })

    let applyClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-add': true,
      'vcv-ui-state--hidden': spinner
    })

    let removeClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-close-thin vcv-ui-form-attach-image-item-control-state--danger': true,
      'vcv-ui-state--hidden': spinner
    })

    let overlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-overlay--visible': spinner
    })

    let previewClasses = classNames({
      'vcv-ui-item-preview-container': true,
      'vcv-ui-state--visible': previewVisible
    })

    if (type && type === 'predefined') {
      return (
        <li className='vcv-ui-item-list-item'>
          <span className='vcv-ui-item-element'
            onMouseEnter={this.showPreview}
            onMouseLeave={this.hidePreview}
          >
            <span className='vcv-ui-item-element-content'>
              <img
                className='vcv-ui-item-element-image'
                src={AssetsManager.getSourcePath(thumbnail)}
                alt='Template thumbnail'
              />
              <span className={overlayClasses}>
                <span
                  className={applyClasses}
                  onClick={this.handleApplyTemplate}
                />
                <span
                  className={removeClasses}
                  style={{cursor: 'not-allowed'}}
                />
              </span>
            </span>
            <span className='vcv-ui-item-element-name'>
              <span className={nameClasses}>
                {name}
              </span>
            </span>
            <figure className={previewClasses} style={previewStyle}>
              <img
                className='vcv-ui-item-preview-image'
                src={AssetsManager.getSourcePath(preview)}
                alt='Template preview'
              />
              <figcaption className='vcv-ui-item-preview-caption'>
                <div className='vcv-ui-item-preview-text'>
                  {description}
                </div>
              </figcaption>
            </figure>
          </span>
        </li>
      )
    }

    return (
      <li className='vcv-ui-item-list-item'>
        <span className='vcv-ui-item-element'>
          <span
            className='vcv-ui-item-element-content'
            data-letter={letter}
          >
            <img
              className='vcv-ui-item-element-image'
              src={AssetsManager.getSourcePath('images/template-thumbnail.png')}
              alt=''
            />
            <span className={overlayClasses}>
              <span
                className={applyClasses}
                onClick={this.handleApplyTemplate}
              />
              <span
                className={removeClasses}
                onClick={this.handleRemoveTemplate}
              />
              <span className={spinnerClasses} />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
        </span>
      </li>
    )
  }
}

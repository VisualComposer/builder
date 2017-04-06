import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

const AssetsManager = vcCake.getService('assetsManager')

export default class TemplateControl extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    id: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    api: React.PropTypes.object.isRequired,
    addClick: React.PropTypes.func.isRequired,
    spinner: React.PropTypes.bool,
    type: React.PropTypes.string,
    description: React.PropTypes.string,
    preview: React.PropTypes.string,
    thumbnail: React.PropTypes.string,
    blank: React.PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      letter: this.props.name.charAt(0).toUpperCase(),
      previewVisible: false,
      previewStyle: {}
    }
    this.handleAddClick = this.handleAddClick.bind(this)
    this.showPreview = this.showPreview.bind(this)
    this.hidePreview = this.hidePreview.bind(this)
  }

  componentDidMount () {
    this.ellipsize('.vcv-ui-item-element-name')
  }

  showPreview () {
    if (!this.props.blank) {
      if (this.updatePreviewPosition()) {
        this.setState({
          previewVisible: true
        })
      }
    }
  }

  hidePreview () {
    if (!this.props.blank) {
      this.setState({
        previewVisible: false
      })
    }
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

  handleAddClick (e) {
    e && e.preventDefault()
    this.props.addClick(this.props.blank)
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
    let { name, thumbnail, preview, description } = this.props
    let { previewVisible, previewStyle } = this.state

    let applyClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-icon-add': true
    })

    let overlayClasses = classNames({
      'vcv-ui-item-overlay': true
    })

    let elementContentClasses = classNames({
      'vcv-ui-item-element-content': true,
      'vcv-ui-item-blank-page': this.props.blank
    })

    let previewClasses = ''
    let figure = ''
    let thumbnailImage = ''
    let blankOverlay = ''

    if (!this.props.blank) {
      previewClasses = classNames({
        'vcv-ui-item-preview-container': true,
        'vcv-ui-state--visible': previewVisible
      })

      figure = (
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
      )

      thumbnailImage = (
        <img
          className='vcv-ui-item-element-image'
          src={AssetsManager.getSourcePath(thumbnail)}
          alt='Template thumbnail'
        />
      )
    } else {
      blankOverlay = (
        <span className='vcv-ui-item-blank-page-icon vcv-ui-icon vcv-ui-icon-add' />
      )
    }

    return (
      <li className='vcv-ui-item-list-item'>
        <span className='vcv-ui-item-element'
          onClick={this.handleAddClick.bind(this)}
          onMouseEnter={this.showPreview}
          onMouseLeave={this.hidePreview}
        >
          <span className={elementContentClasses}>
            {thumbnailImage}
            <span className={overlayClasses}>
              <span className={applyClasses} />
            </span>
            {blankOverlay}
          </span>
          <span className='vcv-ui-item-element-name'>
            {name}
          </span>
          {figure}
        </span>
      </li>
    )
  }
}

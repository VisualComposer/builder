import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

const cook = vcCake.getService('cook')
const AssetsManager = vcCake.getService('assets-manager')

class ElementControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewStyle: {}
    }
  }

  componentDidMount () {
    this.ellipsize('.vcv-ui-add-element-element-name')
    this.ellipsize('.vcv-ui-add-element-preview-text')
  }

  addElement (e) {
    e && e.preventDefault()
    let data = cook.get({ tag: this.props.tag, parent: this.props.api.actions.getParent() })
    this.props.api.request('data:add', data.toJS(true))
    this.props.api.notify('hide', true)
  }

  showPreview (e) {
    if (this.updatePreviewPosition()) {
      this.setState({
        previewVisible: true
      })
    }
  }

  hidePreview (e) {
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
      container = this.getClosest(element, '.vcv-ui-add-element-list')
    } else {
      container = element.closest('.vcv-ui-add-element-list')
    }
    let firstElement = container.querySelector('.vcv-ui-add-element-list-item')
    let trigger = element.querySelector('.vcv-ui-add-element-element-content')
    let preview = element.querySelector('.vcv-ui-add-element-preview-container')

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
    let { name, element } = this.props
    let { previewVisible, previewStyle } = this.state

    let cookElement = cook.get(element)
    let nameClasses = classNames({
      'vcv-ui-add-element-badge vcv-ui-badge-success': false,
      'vcv-ui-add-element-badge vcv-ui-badge-warning': false
    })

    let previewClasses = classNames({
      'vcv-ui-add-element-preview-container': true,
      'vcv-ui-state--visible': previewVisible
    })
    // Possible overlays:

    // <span className="vcv-ui-add-element-add vcv-ui-icon vcv-ui-icon-add"></span>

    // <span className='vcv-ui-add-element-edit'>
    //   <span className='vcv-ui-add-element-move vcv-ui-icon vcv-ui-icon-drag-dots'></span>
    //   <span className='vcv-ui-add-element-remove vcv-ui-icon vcv-ui-icon-close'></span>
    // </span>
    let publicPathThumbnail = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('metaThumbnail'))
    let publicPathPreview = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('metaPreview'))

    return (
      <li className='vcv-ui-add-element-list-item'>
        <a className='vcv-ui-add-element-element'
          onClick={this.addElement.bind(this)}
          onMouseEnter={this.showPreview.bind(this)}
          onMouseLeave={this.hidePreview.bind(this)}>
          <span className='vcv-ui-add-element-element-content'>
            <img className='vcv-ui-add-element-element-image' src={publicPathThumbnail}
              alt='' />
            <span className='vcv-ui-add-element-overlay'>
              <span className='vcv-ui-add-element-add vcv-ui-icon vcv-ui-icon-add'></span>
            </span>
          </span>
          <span className='vcv-ui-add-element-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          <figure className={previewClasses} style={previewStyle}>
            <img className='vcv-ui-add-element-preview-image' src={publicPathPreview} alt='' />
            <figcaption className='vcv-ui-add-element-preview-caption'>
              <div className='vcv-ui-add-element-preview-text'>
                {cookElement.get('metaPreviewDescription')}
              </div>
            </figcaption>
          </figure>
        </a>
      </li>
    )
  }
}
ElementControl.propTypes = {
  tag: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  element: React.PropTypes.object.isRequired,
  api: React.PropTypes.object.isRequired
}

export default ElementControl

var vcCake = require('vc-cake')
var cook = vcCake.getService('cook')
var React = require('react')
var ReactDOM = require('react-dom')
var classNames = require('classnames')

module.exports = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    element: React.PropTypes.object.isRequired,
    api: React.PropTypes.object.isRequired,
    meta_icon: React.PropTypes.string,
    meta_thumbnail: React.PropTypes.string,
    meta_preview: React.PropTypes.string,
    meta_preview_description: React.PropTypes.string
  },
  getInitialState () {
    return {
      previewVisible: false,
      previewStyle: {}
    }
  },
  componentDidMount () {
    this.ellipsize('.vcv-ui-add-element-element-name')
    this.ellipsize('.vcv-ui-add-element-preview-text')
  },
  addElement (e) {
    e && e.preventDefault()
    var data = cook.get({ tag: this.props.tag, parent: this.props.api.actions.getParent() })
    this.props.api.request('data:add', data.toJS(true))
    this.props.api.notify('hide', true)
  },
  showPreview (e) {
    if (this.updatePreviewPosition()) {
      this.setState({
        previewVisible: true
      })
    }
  },
  hidePreview (e) {
    this.setState({
      previewVisible: false
    })
  },
  getClosest (el, selector) {
    var matchesFn;
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    var parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      el = parent
    }
    return null
  },
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
  },
  ellipsize (selector) {
    let element = ReactDOM.findDOMNode(this).querySelector(selector)
    let wordArray = element.innerHTML.split(' ')
    while (element.scrollHeight > element.offsetHeight && wordArray.length > 0) {
      wordArray.pop()
      element.innerHTML = wordArray.join(' ') + '...'
    }
    return this
  },
  render () {
    let element = cook.get(this.props.element)
    let nameClasses = classNames({
      'vcv-ui-add-element-badge vcv-ui-badge-success': true,
      'vcv-ui-add-element-badge vcv-ui-badge-warning': false
    })

    let previewClasses = classNames({
      'vcv-ui-add-element-preview-container': true,
      'vcv-ui-state--visible': this.state.previewVisible
    })
    // Possible overlays:

    // <span className="vcv-ui-add-element-add vcv-ui-icon vcv-ui-icon-add"></span>

    // <span className='vcv-ui-add-element-edit'>
    //   <span className='vcv-ui-add-element-move vcv-ui-icon vcv-ui-icon-drag-dots'></span>
    //   <span className='vcv-ui-add-element-remove vcv-ui-icon vcv-ui-icon-close'></span>
    // </span>
    let publicPathThumbnail = element.getPublicPath(this.props.meta_thumbnail)
    let publicPathPreview = element.getPublicPath(this.props.meta_preview)
    return <li className='vcv-ui-add-element-list-item'>
      <a className='vcv-ui-add-element-element'
        onClick={this.addElement}
        onMouseEnter={this.showPreview}
        onMouseLeave={this.hidePreview}>
        <span className='vcv-ui-add-element-element-content'>
          <img className='vcv-ui-add-element-element-image' src={publicPathThumbnail}
            alt='' />
          <span className='vcv-ui-add-element-overlay'>
            <span className='vcv-ui-add-element-add vcv-ui-icon vcv-ui-icon-add'></span>
          </span>
        </span>
        <span className='vcv-ui-add-element-element-name'>
          <span className={nameClasses}>
            {this.props.name}
          </span>
        </span>
        <figure className={previewClasses} style={this.state.previewStyle}>
          <img className='vcv-ui-add-element-preview-image' src={publicPathPreview} alt='' />
          <figcaption className='vcv-ui-add-element-preview-caption'>
            <div className='vcv-ui-add-element-preview-text'>
              {this.props.meta_preview_description}
            </div>
          </figcaption>
        </figure>
      </a>
    </li>
  }
})

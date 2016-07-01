var vcCake = require('vc-cake')
var cook = vcCake.getService('cook')
var React = require('react')
var ReactDOM = require('react-dom')
var classNames = require('classnames')

module.exports = React.createClass({
  propTypes: {
    tag: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    api: React.PropTypes.object.isRequired,
    icon: React.PropTypes.string
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
    e.preventDefault()
    var data = cook.get({ tag: this.props.tag, parent: this.props.api.actions.getParent() })
    this.props.api.request('data:add', data.toJS(true))
    this.props.api.notify('hide', true)
  },
  showPreview (e) {
    this.updatePreviewPosition()
    this.setState({
      previewVisible: true
    })
  },
  hidePreview (e) {
    this.setState({
      previewVisible: false
    })
  },
  updatePreviewPosition () {
    let element = ReactDOM.findDOMNode(this)
    let trigger = element.querySelector('.vcv-ui-add-element-element-content')
    let preview = element.querySelector('.vcv-ui-add-element-preview-container')

    let triggerSizes = trigger.getBoundingClientRect()
    let previewSizes = preview.getBoundingClientRect()
    let windowSize = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    let middleX = false
    // default position
    let posX = triggerSizes.left + triggerSizes.width
    let posY = triggerSizes.top
    // position if no place to show on a right side
    if (posX + previewSizes.width > windowSize.width) {
      posX = triggerSizes.left - previewSizes.width
    }
    // align center if no place to show on left or right
    if (posX < 0) {
      middleX = true
      posX = (windowSize.width - previewSizes.width) / 2
      posY = triggerSizes.top + triggerSizes.height
    }
    // position if no place to show on bottom
    if (posY + previewSizes.height > windowSize.height) {
      if (middleX) {
        posY = triggerSizes.top - previewSizes.height
      } else {
        posY = triggerSizes.top + triggerSizes.height - previewSizes.height
      }
    }
    // align middle if no place to show on top or bottom
    if (posY < 0) {
      posY = (windowSize.height - previewSizes.height) / 2
    }
    this.setState({
      previewStyle: {
        left: posX,
        top: posY
      }
    })
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

    return <li className='vcv-ui-add-element-list-item'>
      <a className='vcv-ui-add-element-element'
        onClick={this.addElement}
        onMouseEnter={this.showPreview}
        onMouseLeave={this.hidePreview}>
        <span className='vcv-ui-add-element-element-content'>
          <img className='vcv-ui-add-element-element-image' src='https://placehold.it/100x100' alt='' />
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
          <img className='vcv-ui-add-element-preview-image' src='https://placehold.it/520x240' alt='' />
          <figcaption className='vcv-ui-add-element-preview-caption'>
            <div className='vcv-ui-add-element-preview-text'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus amet assumenda dolores eos error
              magnam magni maxime minima modi omnis placeat quia reiciendis repellendus rerum tempora temporibus,
              ut vel veritatis.
            </div>
          </figcaption>
        </figure>
      </a>
    </li>
  }
})

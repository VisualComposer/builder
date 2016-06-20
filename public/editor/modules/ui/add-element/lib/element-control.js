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
  getInitialState: function () {
    return {
      previewRendered: false
    }
  },
  componentDidMount: function () {
    this.ellipsize('.vcv-ui-add-element-element-name')
  },
  addElement: function (e) {
    e.preventDefault()
    var data = cook.get({ tag: this.props.tag, parent: this.props.api.actions.getParent() })
    this.props.api.request('data:add', data.toJS(true))
    this.props.api.notify('hide', true)
  },
  showPreview: function (e) {
    let preview = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-add-element-preview-container')

    // TODO: Add logic to position preview according to free space.

    preview.style.display = 'block'
    if (!this.state.previewRendered) {
      this.ellipsize('.vcv-ui-add-element-preview-text')
      this.setState({ previewRendered: true })
    }
  },
  hidePreview: function (e) {
    let preview = ReactDOM.findDOMNode(this).querySelector('.vcv-ui-add-element-preview-container')
    preview.style.display = 'none'
  },
  ellipsize: function (selector) {
    let element = ReactDOM.findDOMNode(this).querySelector(selector)
    let wordArray = element.innerHTML.split(' ')
    while (element.scrollHeight > element.offsetHeight && wordArray.length > 0) {
      wordArray.pop()
      element.innerHTML = wordArray.join(' ') + '...'
    }
    return this
  },
  render: function () {
    let nameClasses = classNames({
      'vcv-ui-add-element-badge vcv-ui-badge-success': true,
      'vcv-ui-add-element-badge vcv-ui-badge-warning': false
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
        <figure className='vcv-ui-add-element-preview-container'>
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

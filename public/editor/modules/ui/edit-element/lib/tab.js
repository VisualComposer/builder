/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var ReactDOM = require('react-dom')
var classNames = require('classnames')

var TreeContentTab = React.createClass({
  propTypes: {
    container: React.PropTypes.string,
    changeActive: React.PropTypes.func,
    id: React.PropTypes.string.isRequired,
    index: React.PropTypes.number.isRequired,
    title: React.PropTypes.string,
    active: React.PropTypes.bool
  },
  getInitialState: function () {
    return {
      realWidth: undefined
    }
  },
  componentDidMount: function () {
    this.setState({
      realWidth: this.getRealWidth()
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
  getRealWidth: function () {
    let realWidth = this.state.realWidth

    if (realWidth === undefined) {
      let $el = ReactDOM.findDOMNode(this)
      let $tempEl = $el.cloneNode(true)
      $tempEl.style.position = 'fixed'
      let container
      if ($el.closest === undefined) {
        container = this.getClosest($el, this.props.container)
      } else {
        container = $el.closest(this.props.container)
      }
      container.appendChild($tempEl)
      realWidth = $tempEl.offsetWidth
      if (realWidth === 0) {
        $tempEl.remove()
        return undefined
      }
      let style = window.getComputedStyle($tempEl, null)
      realWidth += parseInt(style.marginLeft) + parseInt(style.marginRight)

      $tempEl.remove()
    }
    return realWidth
  },

  clickHandler: function () {
    this.props.changeActive(this.props.index)
  },

  render: function () {
    let { title, active } = this.props

    var tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': active
    })

    return (
      <a className={tabClasses} href="#" onClick={this.clickHandler}>
        <span className="vcv-ui-editor-tab-content">
          <span>{title}</span>
        </span>
      </a>
    )
  }
})
module.exports = TreeContentTab

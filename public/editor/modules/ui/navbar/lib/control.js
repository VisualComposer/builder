import React from 'react'
import ReactDOM from 'react-dom'

class NavbarControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      realSize: {
        width: undefined,
        height: undefined
      },
      navbarPosition: 'top'
    }
  }

  componentDidMount () {
    this.setState({
      realSize: this.getRealSize()
    })
    this.props.api.on('positionChanged', (position) => {
      this.setState({
        navbarPosition: position,
        realSize: this.getRealSize()
      })
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

  getRealSize () {
    let realSize = this.state.realSize
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
    let style = window.getComputedStyle($tempEl, null)
    // get width
    realSize.width = $tempEl.offsetWidth
    realSize.width += parseInt(style.marginLeft) + parseInt(style.marginRight)
    // get height
    realSize.height = $tempEl.offsetHeight
    realSize.height += parseInt(style.marginLeft) + parseInt(style.marginRight)

    $tempEl.remove()
    return realSize
  }

  render () {
    let { value, api } = this.props

    return React.createElement(value.icon, { value: value, api: api })
  }
}
NavbarControl.propTypes = {
  api: React.PropTypes.object.isRequired,
  visibilityHandler: React.PropTypes.func,
  value: React.PropTypes.any,
  container: React.PropTypes.string
}

module.exports = NavbarControl

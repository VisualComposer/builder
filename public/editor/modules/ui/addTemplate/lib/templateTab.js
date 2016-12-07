import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

export default class TemplateTab extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    active: React.PropTypes.number.isRequired,
    index: React.PropTypes.number.isRequired,
    changeActive: React.PropTypes.func.isRequired,
    container: React.PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      realWidth: undefined
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    this.setState({
      realWidth: this.getRealWidth()
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

  getRealWidth () {
    let { realWidth } = this.state
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
  }

  handleClick (e) {
    e && e.preventDefault()
    this.props.changeActive(this.props.index, this.props.title)
  }

  render () {
    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': this.props.active === this.props.index
    })

    return (
      <a className={tabClasses} href='#' onClick={this.handleClick}>
        <span className='vcv-ui-editor-tab-content'>
          <span>{this.props.title}</span>
        </span>
      </a>
    )
  }
}

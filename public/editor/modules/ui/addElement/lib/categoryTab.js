import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

class CategoryTab extends React.Component {
  state = {
    realWidth: undefined
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
  }

  clickHandler (e) {
    e && e.preventDefault()
    this.props.changeActive(this.props.index)
  }

  render () {
    let { title, active } = this.props

    let tabClasses = classNames({
      'vcv-ui-editor-tab': true,
      'vcv-ui-state--active': active
    })

    return (
      <a className={tabClasses} href='#' onClick={this.clickHandler.bind(this)}>
        <span className='vcv-ui-editor-tab-content'>
          <span>{title}</span>
        </span>
      </a>
    )
  }
}
CategoryTab.propTypes = {
  container: React.PropTypes.string,
  changeActive: React.PropTypes.func,
  id: React.PropTypes.string.isRequired,
  index: React.PropTypes.number.isRequired,
  title: React.PropTypes.string,
  active: React.PropTypes.bool
}

export default CategoryTab

import React from 'react'
import ReactDOM from 'react-dom'

export default class Control extends React.Component {
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

  getRealSize () {
    let realSize = this.state.realSize
    let $el = ReactDOM.findDOMNode(this)
    let $tempEl = $el.cloneNode(true)
    $tempEl.style.position = 'fixed'
    $el.closest(this.props.container).appendChild($tempEl)
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
    let value = this.props.value
    return React.createElement(value.icon, { value: value })
  }
}
Control.propTypes = {
  api: React.PropTypes.object.isRequired,
  visibilityHandler: React.PropTypes.func,
  value: React.PropTypes.any,
  container: React.PropTypes.string
}

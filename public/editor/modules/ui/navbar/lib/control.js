import React from 'react'

export default class Control extends React.Component {
  componentDidMount () {
    // Here specify event like window resize but based on vc-cake events to enable trigger this.checkVisibility
    this.checkVisibility()
  }
  checkVisibility () {
    if (this.props.visibilityHandler) {
      // Check visibility by DOM element
      let visible = true
      this.props.visibilityHandler(this.props.value.name, visible)
    }
  }
  render () {
    let value = this.props.value
    return React.createElement(value.icon, { value: value })
  }
}
Control.propTypes = {
  visibilityHandler: React.PropTypes.func,
  value: React.PropTypes.any
}

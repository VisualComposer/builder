import React from 'react'
import classNames from 'classnames'
const { Component, PropTypes } = React
export default class ColorGradientBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, applyBackground } = this.props

    let containerClasses = [
      `vce-asset-color-gradient-container`,
      `vce-visible-${deviceKey}-only`
    ]

    return <div className={classNames(containerClasses)} {...applyBackground} />
  }
}

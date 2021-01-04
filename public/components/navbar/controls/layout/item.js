import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'
import Tooltip from '../../../tooltip/tooltip'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

export default class Item extends React.Component {
  static propTypes = {
    device: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
  }

  handleClick = (index, e) => {
    e && e.preventDefault()
    this.props.onChange(index)
  }

  render () {
    const widthText = localizations.width || 'Width'
    const pixelsUnit = localizations.pixelsUnit || 'px'
    const { device, index } = this.props
    const deviceIconClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      'vcv-ui-icon-' + device.className
    )
    const widthLabel = `(${widthText}: ${device.viewport.width} ${pixelsUnit})`
    let helper = <em>{widthLabel}</em>
    if (device.className === 'multiple-devices') {
      const responsiveView = localizations.responsiveView || 'Responsive View'
      helper = <Tooltip>{responsiveView}</Tooltip>
    }
    return (
      <span
        className='vcv-ui-navbar-control'
        title={device.type}
        key={index}
        onClick={this.handleClick.bind(this, index)}
      >
        <span className='vcv-ui-navbar-control-content'>
          <i className={deviceIconClasses} />
          <span>{device.type}{helper}</span>
        </span>
      </span>
    )
  }
}

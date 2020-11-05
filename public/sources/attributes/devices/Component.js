import React from 'react'
import classNames from 'classnames'
import Attribute from '../attribute'
import Dropdown from '../dropdown/Component'
import Tooltip from '../../../components/tooltip/tooltip'
import vcCake from 'vc-cake'
const dataManager = vcCake.getService('dataManager')

export default class Devices extends Attribute {
  static defaultProps = {
    fieldType: 'devices'
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()

    this.devicesSettingsHandler = this.devicesSettingsHandler.bind(this)
    this.handleCustomDeviceClick = this.handleCustomDeviceClick.bind(this)
  }

  /**
   * Get devices type, all or custom
   * @returns {JSX}
   */
  getDevicesSettings () {
    const options = {
      values: [
        {
          label: 'All',
          value: 'all'
        },
        {
          label: 'Custom',
          value: 'custom'
        }
      ]
    }
    return (
      <div className='vcv-ui-form-group'>
        <Dropdown
          api={this.props.api}
          fieldKey='settings'
          options={options}
          updater={this.devicesSettingsHandler}
          value={this.state.value === 'all' ? 'all' : 'custom'}
        />
      </div>
    )
  }

  /**
   * Handle device type change
   * @param fieldKey
   * @param value
   */
  devicesSettingsHandler (fieldKey, value) {
    this.setFieldValue(value === 'custom' ? 'xl' : value)
  }

  /**
   * Check if it is custom devices
   * @returns {boolean}
   */
  isCustomDevices () {
    return this.state.value !== 'all'
  }

  /**
   * Get custom devices JSX
   * @returns {*}
   */
  getCustomDevices () {
    const { fieldKey } = this.props
    let returnData = null
    if (this.isCustomDevices()) {
      let customDevices = [
        {
          label: 'Desktop',
          value: 'xl',
          icon: 'vcv-ui-icon-desktop'
        },
        {
          label: 'Tablet Landscape',
          value: 'lg',
          icon: 'vcv-ui-icon-tablet-landscape'
        },
        {
          label: 'Tablet Portrait',
          value: 'md',
          icon: 'vcv-ui-icon-tablet-portrait'
        },
        {
          label: 'Mobile Landscape',
          value: 'sm',
          icon: 'vcv-ui-icon-mobile-landscape'
        },
        {
          label: 'Mobile Portrait',
          value: 'xs',
          icon: 'vcv-ui-icon-mobile-portrait'
        }
      ]
      if (this.props.options && this.props.options.customDevices) {
        customDevices = this.props.options.customDevices
      }

      const devices = []
      customDevices.forEach((device) => {
        const classes = classNames({
          'vcv-ui-form-button': true,
          'vcv-ui-form-button--active': this.state.value === device.value
        })
        const icon = classNames([
          'vcv-ui-form-button-icon',
          'vcv-ui-icon',
          device.icon
        ])
        devices.push(
          <button
            type='button' className={classes} title={device.label}
            key={`${fieldKey}:${device.value}`}
            onClick={this.handleCustomDeviceClick}
            value={device.value}
          >
            <i className={icon} />
          </button>
        )
      })

      returnData = (
        <div className='vcv-ui-col vcv-ui-col--fixed-width'>
          <div className='vcv-ui-form-buttons-group vcv-ui-form-group vcv-ui-form-button-group--attribute vcv-ui-form-devices'>
            {devices}
          </div>
        </div>
      )
    }
    return returnData
  }

  /**
   * Handle custom device change
   * @param event
   */
  handleCustomDeviceClick (event) {
    const value = event && event.currentTarget.value
    this.setFieldValue(value)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const manageIfTheElementAppearsOnAParticularDevice = localizations ? localizations.manageIfTheElementAppearsOnAParticularDevice : 'Manage if the element appears on a particular device.'

    return (
      <div className='vcv-ui-row vcv-ui-row-gap--md'>
        <div className='vcv-ui-col vcv-ui-col--fixed-width'>
          {this.getDevicesSettings()}
        </div>
        {this.getCustomDevices()}
        <Tooltip>
          {manageIfTheElementAppearsOnAParticularDevice}
        </Tooltip>
      </div>
    )
  }
}

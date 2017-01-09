import React from 'react'
import Attribute from '../attribute'
import String from '../string/Component'
import Color from '../color/Component'
import Radio from '../radio/Component'
import Devices from '../devices/Component'
import BoxModel from '../boxModel/Component'
import Toggle from '../toggle/Component'

class DesignOptionsAdvanced extends Attribute {
  /**
   * Attribute Mixins
   */
  static attributeMixin = {
    src: require('raw-loader!./cssMixins/designeOptionsAdvanced.pcss'),
    variables: {
      elId: {
        value: ''
      },
      color: {
        namePattern: '[\\da-f]+',
        value: ''
      },
      background: {
        namePattern: '[\\da-f]+',
        value: ''
      }
    }
  }

  /**
   * Default state values
   */
  static defaultState = {
    currentDevice: 'all',
    devices: {}
  }

  constructor (props) {
    super(props)

    // TODO: refactor
    // this.state.value.attributeMixin = Object.assign({}, DesignOptionsAdvanced.attributeMixin)

    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.deviceVisibilityChangeHandler = this.deviceVisibilityChangeHandler.bind(this)
  }

  /**
   * Prepare data for setState
   * @param props
   * @returns {{value: *}}
   */
  updateState (props) {
    let newState = {}
    // data came from props if there is set value
    if (props.value) {
      newState = this.parseValue(props.value)
    } else {
      // data came from state update
      newState = Object.assign({}, DesignOptionsAdvanced.defaultState, props)
    }
    return newState
  }

  /**
   * Parse value data and set states based on it
   * @param value
   * @returns {*}
   */
  parseValue (value) {
    // set default values
    let newState = Object.assign({}, DesignOptionsAdvanced.defaultState)
    // set values for computed fields
    // get devices data
    let devices = this.getCustomDevicesKeys()
    // set current device
    if (Object.keys(value).length) {
      newState.currentDevice = Object.keys(value).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[ device ] = {}
      if (value[ device ]) {
        newState.devices[ device ] = Object.assign({}, value[ device ])
      }
    })

    return newState
  }

  /**
   * Update value
   * @param newState
   */
  updateValue (newState) {
    // update value
    let newValue = {}
    // prepare data for state
    newState = this.updateState(newState)
    // save only needed data
    let checkDevices = []
    if (newState.currentDevice === 'all') {
      checkDevices.push('all')
    } else {
      checkDevices = checkDevices.concat(this.getCustomDevicesKeys())
    }
    checkDevices.forEach((device) => {
      if (Object.keys(newState.devices[ device ]).length) {
        newValue[ device ] = newState.devices[ device ]
      }
    })

    this.setFieldValue(newValue)
    this.setState(newState)
  }

  /**
   * Flush field value to updater
   * @param value
   */
  setFieldValue (value) {
    console.log('===== Value =====')
    console.log(value)
    console.log('===== /Value =====')
    let { updater, fieldKey } = this.props
    updater(fieldKey, value)
  }

  /**
   * Get custom devices
   * @returns Array
   */
  getCustomDevices () {
    return [
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
  }

  getCustomDevicesKeys () {
    return this.getCustomDevices().map((device) => {
      return device.value
    })
  }

  /**
   * Render device selector
   * @returns {XML}
   */
  getDevicesRender () {
    return <Devices
      api={this.props.api}
      fieldKey='currentDevice'
      options={{
        customDevices: this.getCustomDevices()
      }}
      updater={this.devicesChangeHandler}
      value={this.state.currentDevice} />
  }

  /**
   * Handle devices change
   * @returns {XML}
   */
  devicesChangeHandler (fieldKey, value) {
    let newState = Object.assign({}, this.state, { [fieldKey]: value })

    if (newState.currentDevice === 'all') {
      // clone data from xl in to all except display property
      newState.devices.all = Object.assign({}, newState.devices[ this.getCustomDevicesKeys().shift() ])
      delete newState.devices.all.display
    } else if (this.state.currentDevice === 'all') {
      // clone data to custom devices from all
      this.getCustomDevicesKeys().forEach((device) => {
        newState.devices[ device ] = Object.assign({}, newState.devices.all)
      })
    }

    this.updateValue(newState)
  }

  /**
   * Render device visibility toggle
   * @returns {XML}
   */
  getDeviceVisibilityRender () {
    if (this.state.currentDevice === 'all') {
      return null
    }

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey={`currentDeviceVisible`}
          updater={this.deviceVisibilityChangeHandler}
          options={{ labelText: `Show on device` }}
          value={!this.state.devices[ this.state.currentDevice ].display}
        />
      </div>
    )
  }

  /**
   * Handle show on device toggle change
   * @returns {XML}
   */
  deviceVisibilityChangeHandler (fieldKey, isVisible) {
    let newState = Object.assign({}, this.state)
    if (isVisible) {
      delete newState.devices[ this.state.currentDevice ].display
    } else {
      // remove all other styles
      newState.devices[ this.state.currentDevice ] = {}
      // set display to none
      newState.devices[ this.state.currentDevice ].display = 'none'
    }

    this.updateValue(newState)
  }

  // ==============================================
  /**
   * TODO: refactor
   * Handle change of input field
   * @param event
   */
  dataUpdater (fieldKey, value) {
    let newValue = Object.assign({}, this.state.value, { [fieldKey]: value })
    if (newValue.attributeMixin.variables[ fieldKey ]) {
      newValue.attributeMixin.variables[ fieldKey ].value = value
    }
    this.setFieldValue(newValue)
  }

  /**
   * TODO: refactor
   * @returns {XML}
   */
  getStringRender () {
    let { value } = this.state
    return <String
      api={this.props.api}
      fieldKey='elId'
      updater={this.dataUpdater}
      value={value.elId || ''} />
  }

  /**
   * TODO: refactor
   * @returns {XML}
   */
  getColorRender () {
    let { value } = this.state
    return <Color
      api={this.props.api}
      fieldKey='color'
      updater={this.dataUpdater}
      value={value.color || ''}
      defaultValue='' />
  }

  /**
   * TODO: refactor
   * @returns {XML}
   */
  getBackgroundRender () {
    let { value } = this.state
    return <Color
      api={this.props.api}
      fieldKey='background'
      updater={this.dataUpdater}
      value={value.background || ''}
      defaultValue='' />
  }

  /**
   * TODO: refactor
   * @returns {XML}
   */
  getRadioRender () {
    let { value } = this.state
    let options = {
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
    return <Radio
      api={this.props.api}
      fieldKey='radio'
      options={options}
      updater={this.dataUpdater}
      value={value.radio || 'all'} />
  }

  /**
   * TODO: refactor
   * @returns {XML}
   */
  getBoxModelRender () {
    let { value } = this.state
    return <BoxModel
      api={this.props.api}
      fieldKey='boxModel'
      updater={this.dataUpdater}
      value={value.boxModel || {}} />
  }

  /**
   * @returns {XML}
   */
  render () {
    return (
      <div className='advanced-design-options'>
        {this.getDevicesRender()}
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getDeviceVisibilityRender()}
          </div>
        </div>
      </div>
    )
  }
}

export default DesignOptionsAdvanced

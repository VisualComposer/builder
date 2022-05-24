/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Toggle from '../toggle/Component'
import Color from '../color/Component'
import Range from '../range/Component'

const getBoxShadowEffects = (hover) => {
  return [
    {
      fieldKey: hover ? 'hoverHorizontalOffset' : 'horizontalOffset',
      value: '0',
      min: -300,
      max: 300,
      measurement: 'px',
      description: hover ? 'Hover horizontal offset' : 'Horizontal offset',
      attributeType: 'range'
    },
    {
      fieldKey: hover ? 'hoverVerticalOffset' : 'verticalOffset',
      value: '5',
      min: -300,
      max: 300,
      measurement: 'px',
      description: hover ? 'Hover vertical offset' : 'Vertical offset',
      attributeType: 'range'
    },
    {
      fieldKey: hover ? 'hoverBlurRadius' : 'blurRadius',
      value: '8',
      min: 0,
      max: 300,
      measurement: 'px',
      description: hover ? 'Hover blur radius' : 'Blur radius',
      attributeType: 'range'
    },
    {
      fieldKey: hover ? 'hoverSpreadRadius' : 'spreadRadius',
      value: '3',
      min: -300,
      max: 300,
      measurement: 'px',
      description: hover ? 'Hover spread radius' : 'Spread radius',
      attributeType: 'range'
    },
    {
      fieldKey: hover ? 'hoverShadowColor' : 'shadowColor',
      value: '#555',
      description: hover ? 'Hover shadow color' : 'Shadow color',
      attributeType: 'color'
    }
  ]
}

export default class BoxShadow extends Attribute {
  static defaultProps = {
    fieldType: 'boxShadow'
  }

  static deviceDefaults = {
    boxShadowEnable: false,
    horizontalOffset: '0',
    verticalOffset: '0',
    blurRadius: '4',
    spreadRadius: '2',
    shadowColor: 'rgba(85, 85, 85, 0.5)',
    hoverBoxShadowEnable: false,
    hoverHorizontalOffset: '0',
    hoverVerticalOffset: '0',
    hoverBlurRadius: '4',
    hoverSpreadRadius: '2',
    hoverShadowColor: 'rgba(85, 85, 85, 0.8)'
  }

  static defaultState = {
    currentDevice: 'all',
    devices: {},
    attributeMixins: {}
  }

  static attributeMixins = {
    boxShadow: {
      src: require('raw-loader!./cssMixins/boxShadow.pcss'),
      variables: {
        device: {
          value: 'all'
        }
      }
    },
    hoverBoxShadow: {
      src: require('raw-loader!./cssMixins/hoverBoxShadow.pcss'),
      variables: {
        device: {
          value: 'all'
        }
      }
    }
  }

  static addPixelToNumber (number) {
    return /^-?\d+$/.test(number) ? `${number}px` : number
  }

  static getMixins (newValue, device, newMixins) {
    if (Object.prototype.hasOwnProperty.call(newValue[device], 'boxShadow')) {
      const value = newValue[device].boxShadow
      const mixinName = `boxShadowMixin:${device}`
      newMixins[mixinName] = lodash.defaultsDeep({}, BoxShadow.attributeMixins.boxShadow)
      newMixins[mixinName].variables.device = {
        value: device
      }
      newMixins[mixinName].variables.boxShadow = {
        value: value
      }
    }
    if (Object.prototype.hasOwnProperty.call(newValue[device], 'hoverBoxShadow')) {
      const value = newValue[device].hoverBoxShadow
      const mixinName = `hoverBoxShadowMixin:${device}`
      newMixins[mixinName] = lodash.defaultsDeep({}, BoxShadow.attributeMixins.hoverBoxShadow)
      newMixins[mixinName].variables.device = {
        value: device
      }
      newMixins[mixinName].variables.hoverBoxShadow = {
        value: value
      }
    }
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
    this.showHoverFields = (!(props.options && (props.options.hoverBoxShadow === false)))
  }

  getBoxShadowValue (deviceValue) {
    const newDeviceValue = lodash.defaultsDeep({}, deviceValue)
    if (!newDeviceValue.boxShadowEnable) {
      newDeviceValue.boxShadowEnable = BoxShadow.deviceDefaults.boxShadowEnable
    }
    if (!newDeviceValue.shadowColor) {
      newDeviceValue.shadowColor = BoxShadow.deviceDefaults.shadowColor
    }

    if (this.showHoverFields) {
      if (!newDeviceValue.hoverBoxShadowEnable) {
        newDeviceValue.hoverBoxShadowEnable = BoxShadow.deviceDefaults.hoverBoxShadowEnable
      }
      if (!newDeviceValue.hoverShadowColor) {
        newDeviceValue.hoverShadowColor = BoxShadow.deviceDefaults.hoverShadowColor
      }
    }

    // Compile and assign actual box-shadow value
    const horizontalOffset = BoxShadow.addPixelToNumber(newDeviceValue.horizontalOffset)
    const verticalOffset = BoxShadow.addPixelToNumber(newDeviceValue.verticalOffset)
    const blurRadius = BoxShadow.addPixelToNumber(newDeviceValue.blurRadius)
    const spreadRadius = BoxShadow.addPixelToNumber(newDeviceValue.spreadRadius)
    const shadowColor = newDeviceValue.shadowColor
    newDeviceValue.boxShadow = `${horizontalOffset} ${verticalOffset} ${blurRadius} ${spreadRadius} ${shadowColor}`

    if (this.showHoverFields) {
      // Compile and assign actual hover box-shadow value
      const hoverHorizontalOffset = BoxShadow.addPixelToNumber(newDeviceValue.hoverHorizontalOffset)
      const hoverVerticalOffset = BoxShadow.addPixelToNumber(newDeviceValue.hoverVerticalOffset)
      const hoverBlurRadius = BoxShadow.addPixelToNumber(newDeviceValue.hoverBlurRadius)
      const hoverSpreadRadius = BoxShadow.addPixelToNumber(newDeviceValue.hoverSpreadRadius)
      const hoverShadowColor = newDeviceValue.hoverShadowColor
      newDeviceValue.hoverBoxShadow = `${hoverHorizontalOffset} ${hoverVerticalOffset} ${hoverBlurRadius} ${hoverSpreadRadius} ${hoverShadowColor}`
    }

    return newDeviceValue
  }

  updateValue (newState, fieldKey) {
    const newValue = {}
    const newMixins = {}

    // prepare data for state
    newState = this.updateState(newState)
    // save only needed data
    const checkDevices = []
    if (newState.currentDevice === 'all') {
      checkDevices.push('all')
    }

    checkDevices.forEach((device) => {
      if (!lodash.isEmpty(newState.devices[device])) {
        newState.devices[device] = this.getBoxShadowValue(newState.devices[device])

        newValue[device] = lodash.defaultsDeep({}, newState.devices[device])

        // Prepare newMixins object
        BoxShadow.getMixins(newValue, device, newMixins)

        // remove device from list if it's empty
        if (!Object.keys(newValue[device]).length) {
          delete newValue[device]
        }
      }
    })

    this.setFieldValue(newValue, newMixins, fieldKey)
    this.setState(newState)
  }

  updateState (props) {
    let newState = {}
    // data came from props if there is set value
    if (props.value) {
      newState = this.parseValue(props.value)
      if (newState.devices) {
        this.setFieldValue(newState.devices, newState.attributeMixins)
      }
    } else {
      // data came from state update
      if (!this.hasEnabledOptions(props.devices)) {
        return newState
      }
      newState = lodash.defaultsDeep({}, props, BoxShadow.defaultState)
    }
    return newState
  }

  valueChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    if (!newState.currentDevice) {
      newState = lodash.defaultsDeep({}, BoxShadow.defaultState)
      newState.devices.all = lodash.defaultsDeep({}, BoxShadow.deviceDefaults)
    } else {
      // add updated to be able to disable toggles when !hasEnabledOptions
      newState.devices[newState.currentDevice].updated = true
    }
    newState.devices[newState.currentDevice][fieldKey] = value
    this.updateValue(newState, fieldKey)
  }

  // Checks if shadow toggles are enabled and if component updated before to prevent applying default values without a change
  hasEnabledOptions (value) {
    if (!value) {
      return false
    }
    return Object.keys(value).find(device => value[device].boxShadowEnable || value[device].hoverBoxShadowEnable || value[device].updated)
  }

  parseValue (value) {
    // set default values
    let newState = {}

    if (!this.hasEnabledOptions(value.device)) {
      return newState
    }

    newState = lodash.defaultsDeep({}, BoxShadow.defaultState)
    const newMixins = {}
    // get devices data
    const devices = []
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[device] = lodash.defaultsDeep({}, BoxShadow.deviceDefaults)
      if (value.device && value.device[device]) {
        newState.devices[device] = lodash.defaultsDeep({}, value.device[device], newState.devices[device])
      }
      newState.devices[device] = this.getBoxShadowValue(newState.devices[device])
      BoxShadow.getMixins(newState.devices, device, newMixins)
    })
    newState.attributeMixins = newMixins

    return newState
  }

  setFieldValue (value, mixins, innerFieldKey) {
    const { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value,
      attributeMixins: mixins
    }, innerFieldKey)
  }

  getBoxShadowToggle (hover) {
    const fieldKey = hover ? 'hoverBoxShadowEnable' : 'boxShadowEnable'
    const deviceData = this.state.devices && this.state.currentDevice ? this.state.devices[this.state.currentDevice] : null
    const value = deviceData && deviceData[fieldKey] ? deviceData[fieldKey] : false
    const labelText = hover ? 'Enable hover box shadow' : 'Enable box shadow'

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey={fieldKey}
          updater={this.valueChangeHandler}
          options={{ labelText: labelText }}
          value={value}
        />
      </div>
    )
  }

  getBoxShadowFields (hover) {
    const deviceData = this.state.devices && this.state.currentDevice ? this.state.devices[this.state.currentDevice] : null
    const enableToggleKey = hover ? 'hoverBoxShadowEnable' : 'boxShadowEnable'

    if (!(deviceData && deviceData[enableToggleKey])) {
      return null
    }

    return getBoxShadowEffects(hover).map((effect) => {
      let field
      if (effect.attributeType === 'range') {
        field = (
          <Range
            api={this.props.api}
            fieldKey={effect.fieldKey}
            updater={this.valueChangeHandler}
            options={{ min: effect.min, max: effect.max, measurement: effect.measurement }}
            value={deviceData[effect.fieldKey]}
          />
        )
      } else {
        field = (
          <Color
            api={this.props.api}
            fieldKey={effect.fieldKey}
            updater={this.valueChangeHandler}
            value={deviceData[effect.fieldKey] || effect.value}
            defaultValue={effect.value}
          />
        )
      }

      return (
        <div className='vcv-ui-form-group' key={`box-shadow-fields-${effect.fieldKey}`}>
          <span className='vcv-ui-form-group-heading'>{effect.description}</span>
          {field}
        </div>
      )
    })
  }

  render () {
    let hoverBoxShadowFields = null
    if (this.showHoverFields) {
      hoverBoxShadowFields = (
        <>
          {this.getBoxShadowToggle(true)}
          {this.getBoxShadowFields(true)}
        </>
      )
    }

    return (
      <div className='vcv-ui-box-shadow'>
        {this.getBoxShadowToggle()}
        {this.getBoxShadowFields()}
        {hoverBoxShadowFields}
      </div>
    )
  }
}

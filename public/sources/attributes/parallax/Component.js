/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Toggle from '../toggle/Component'
import Devices from '../devices/Component'
import Dropdown from '../dropdown/Component'
import Number from '../number/Component'
import { getStorage, getService } from 'vc-cake'
import Tooltip from 'public/components/tooltip/tooltip'
const dataManager = getService('dataManager')
const defaultValues = ['simple', 'simple-fade', 'mouse-move']

export default class Parallax extends Attribute {
  static defaultProps = {
    fieldType: 'parallax'
  }

  static localizations = dataManager.get('localizations')

  static deviceDefaults = {
    parallaxEnable: false,
    parallax: 'simple',
    parallaxSpeed: '',
    parallaxReverse: false
  }

  static defaultState = {
    currentDevice: 'all',
    devices: {},
    attributeMixins: {}
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
    this.getDevicesRender = this.getDevicesRender.bind(this)
    this.parseValue = this.parseValue.bind(this)
    this.parallaxSpeedChangeHandler = this.parallaxSpeedChangeHandler.bind(this)
  }

  updateValue (newState, fieldKey) {
    const newValue = {}
    const newMixins = {}

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
      if (!lodash.isEmpty(newState.devices[device])) {
        if (!newState.devices[device].parallaxEnable) {
          newState.devices[device].parallaxEnable = Parallax.deviceDefaults.parallaxEnable
        }
        if (!newState.devices[device].parallax) {
          newState.devices[device].parallax = Parallax.deviceDefaults.parallax
        }
        if (!newState.devices[device].parallaxSpeed) {
          newState.devices[device].parallaxSpeed = Parallax.deviceDefaults.parallaxSpeed
        }
        if (!newState.devices[device].parallaxReverse) {
          newState.devices[device].parallaxReverse = Parallax.deviceDefaults.parallaxReverse
        }

        newValue[device] = lodash.defaultsDeep({}, newState.devices[device])

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
      newState = this.parseValue(props.value, Parallax.defaultState, Parallax.deviceDefaults)
    } else {
      // data came from state update
      newState = lodash.defaultsDeep({}, props, Parallax.defaultState)
    }
    return newState
  }

  setFieldValue (value, mixins, innerFieldKey) {
    const { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value,
      attributeMixins: mixins
    }, innerFieldKey)
  }

  getParallaxToggle () {
    const fieldKey = 'parallaxEnable'
    const deviceData = this.state.devices[this.state.currentDevice]
    const value = deviceData[fieldKey] || false
    const labelText = 'Enable parallax effect'

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

  getDevicesRender () {
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group--has-inner-fields'>
        <span className='vcv-ui-form-group-heading'>
          Device type
        </span>
        <Devices
          api={this.props.api}
          fieldKey='currentDevice'
          options={{
            customDevices: this.getCustomDevices()
          }}
          updater={this.devicesChangeHandler}
          value={this.state.currentDevice}
        />
      </div>
    )
  }

  getParallaxEffectDropdown () {
    if (!this.state.devices[this.state.currentDevice].parallaxEnable) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Simple',
          value: 'simple'
        },
        {
          label: 'Simple with fade',
          value: 'simple-fade'
        }, {
          label: 'Fixed',
          value: 'fixed'
        },
        {
          label: 'Mouse move',
          value: 'mouse-move'
        }
      ]
    }
    const downloadPremiumDesignOptions = Parallax.localizations ? Parallax.localizations.downloadPremiumDesignOptions : 'Download Premium Design Options'
    const availableInPremiumText = Parallax.localizations ? Parallax.localizations.availableInPremiumText : 'Available in Premium'

    const labelPostFix = dataManager.get('isPremiumActivated') ? `(${downloadPremiumDesignOptions})` : `(${availableInPremiumText})`
    const premiumOptions = [
      {
        label: `Tilt ${labelPostFix}`,
        value: 'tilt',
        disabled: true
      },
      {
        label: `Tilt glare ${labelPostFix}`,
        value: 'tilt-glare',
        disabled: true
      },
      {
        label: `Tilt reverse ${labelPostFix}`,
        value: 'tilt-reverse',
        disabled: true
      },
      {
        label: `Tilt reset ${labelPostFix}`,
        value: 'tilt-reset',
        disabled: true
      },
      {
        label: `Mouse follow animation ${labelPostFix}`,
        value: 'backgroundAnimation',
        disabled: true
      }
    ]
    options.values = options.values.concat(premiumOptions)

    const storage = getStorage('fieldOptions')
    storage.state('currentAttribute:settings').set(options)
    const fieldKey = 'parallax'
    storage.trigger('fieldOptions', fieldKey, options)
    options = storage.state('currentAttribute:settings').get()
    storage.state('currentAttribute:settings').delete()
    const value = this.state.devices[this.state.currentDevice].parallax || 'simple'
    const currentOption = options.values.find(option => option.value === value)
    let tooltip = null
    if (currentOption && currentOption.description) {
      tooltip = (
        <Tooltip>
          {currentOption.description}
        </Tooltip>
      )
    }

    const parallaxEffect = Parallax.localizations ? Parallax.localizations.parallaxEffect : 'Parallax effect'

    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>
            {parallaxEffect}
          </span>
          {tooltip}
        </div>
        <Dropdown
          api={this.props.api}
          fieldKey={fieldKey}
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  parallaxSpeedChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = parseInt(value)
    this.updateValue(newState, fieldKey)
  }

  getParallaxSpeedInput () {
    if (!this.state.devices[this.state.currentDevice].parallaxEnable || !defaultValues.includes(this.state.devices[this.state.currentDevice].parallax)) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].parallaxSpeed || ''
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Parallax effect speed
        </span>
        <Number
          api={this.props.api}
          fieldKey='parallaxSpeed'
          updater={this.parallaxSpeedChangeHandler}
          placeholder='30'
          options={{
            min: 1
          }}
          value={value}
        />
      </div>
    )
  }

  getParallaxReverseToggle () {
    if (!this.state.devices[this.state.currentDevice].parallaxEnable || !defaultValues.includes(this.state.devices[this.state.currentDevice].parallax)) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].parallaxReverse || false
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Reverse parallax effect
        </span>
        <Toggle
          api={this.props.api}
          fieldKey='parallaxReverse'
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  render () {
    return (
      <div className='vcv-ui-parallax-section'>
        {this.getDevicesRender()}
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getParallaxToggle()}
            {this.getParallaxEffectDropdown()}
            {this.getParallaxSpeedInput()}
            {this.getParallaxReverseToggle()}
          </div>
        </div>
      </div>
    )
  }
}

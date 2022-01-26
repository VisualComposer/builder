/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import lodash from 'lodash'
import Attribute from '../attribute'
import Toggle from '../toggle/Component'
import Number from '../number/Component'
import Tooltip from '../../../components/tooltip/tooltip'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class Sticky extends Attribute {
  static defaultProps = {
    fieldType: 'sticky'
  }

  static localizations = dataManager.get('localizations')

  static deviceDefaults = {
    stickyEnable: false,
    stickyOffsetTop: '0',
    stickyZIndex: null
  }

  static defaultState = {
    currentDevice: 'all',
    devices: {}
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
    this.getStickyOffset = this.getStickyOffset.bind(this)
  }

  updateState (props) {
    let newState = {}
    // data came from props if there is set value
    if (props.value) {
      newState = this.parseValue(props.value)
    } else {
      // data came from state update
      newState = lodash.defaultsDeep({}, props, Sticky.defaultState)
    }
    return newState
  }

  parseValue (value) {
    // set default values
    const newState = lodash.defaultsDeep({}, Sticky.defaultState)
    // get devices data
    const devices = []
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[device] = lodash.defaultsDeep({}, Sticky.deviceDefaults)
      if (value.device && value.device[device]) {
        newState.devices[device] = lodash.defaultsDeep({}, value.device[device], newState.devices[device])
      }
    })

    return newState
  }

  updateValue (newState, fieldKey) {
    const newValue = {}

    // prepare data for state
    newState = this.updateState(newState)
    // save only needed data
    const checkDevices = []
    if (newState.currentDevice === 'all') {
      checkDevices.push('all')
    }

    checkDevices.forEach((device) => {
      if (!lodash.isEmpty(newState.devices[device])) {
        if (!newState.devices[device].stickyEnable) {
          newState.devices[device].stickyEnable = Sticky.deviceDefaults.stickyEnable
        }

        newValue[device] = lodash.defaultsDeep({}, newState.devices[device])

        // remove device from list if it's empty
        if (!Object.keys(newValue[device]).length) {
          delete newValue[device]
        }
      }
    })

    this.setFieldValue(newValue, fieldKey)
    this.setState(newState)
  }

  setFieldValue (value, innerFieldKey) {
    const { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value
    }, innerFieldKey)
  }

  valueChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = value
    this.updateValue(newState, fieldKey)
  }

  getStickyToggle () {
    const fieldKey = 'stickyEnable'
    const deviceData = this.state.devices[this.state.currentDevice]
    const value = deviceData[fieldKey] || false
    const labelText = 'Enable stickiness'

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

  getStickyOffset () {
    const fieldKey = 'stickyOffsetTop'
    const deviceData = this.state.devices[this.state.currentDevice]
    if (!deviceData.stickyEnable) {
      return null
    }
    const value = deviceData[fieldKey] || false
    const labelText = Sticky.localizations ? Sticky.localizations.marginTop : 'Margin top'
    const tooltipText = Sticky.localizations ? Sticky.localizations.specifySpacesFromTheScreenTop : 'Specify space (in pixels) from the screen top where element should stick.'
    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>{labelText}</span>
          <Tooltip>
            {tooltipText}
          </Tooltip>
        </div>
        <Number
          api={this.props.api}
          fieldKey={fieldKey}
          updater={this.valueChangeHandler}
          options={{ placeholder: Sticky.deviceDefaults.stickyOffsetTop }}
          value={value}
        />
      </div>
    )
  }

  getStickyZIndex () {
    const fieldKey = 'stickyZIndex'
    const deviceData = this.state.devices[this.state.currentDevice]
    if (!deviceData.stickyEnable) {
      return null
    }
    const value = deviceData[fieldKey] || false
    const labelText = Sticky.localizations ? Sticky.localizations.zIndex : 'Z-index'
    const tooltipText = Sticky.localizations ? Sticky.localizations.controlZIndexForElement : 'Control the z-index for the section to place it over or under the following content. Sections with a higher index will be placed on top of sections with a lower index.'
    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>{labelText}</span>
          <Tooltip>
            {tooltipText}
          </Tooltip>
        </div>
        <Number
          api={this.props.api}
          fieldKey={fieldKey}
          updater={this.valueChangeHandler}
          options={{ placeholder: '999' }}
          value={value}
        />
      </div>
    )
  }

  getStickyContainerToggle () {
    const fieldKey = 'stickyContainer'
    const deviceData = this.state.devices[this.state.currentDevice]
    if (!deviceData.stickyEnable) {
      return null
    }
    const value = deviceData[fieldKey] || false
    const labelText = Sticky.localizations ? Sticky.localizations.relateToParent : 'Relate to parent'
    const tooltipText = Sticky.localizations ? Sticky.localizations.limitStickinessToWorkOnlyInTheParentContainer : 'Limit stickiness to work only in the parent container.'

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey={fieldKey}
          updater={this.valueChangeHandler}
          options={{ labelText: labelText }}
          value={value}
        />
        <Tooltip>
          {tooltipText}
        </Tooltip>
      </div>
    )
  }

  getStickyVisibilityToggle () {
    const fieldKey = 'stickyVisibility'
    const deviceData = this.state.devices[this.state.currentDevice]
    if (!deviceData.stickyEnable) {
      return null
    }
    const value = deviceData[fieldKey] || false
    const labelText = Sticky.localizations ? Sticky.localizations.showOnSticky : 'Show on sticky'
    const tooltipText = Sticky.localizations ? Sticky.localizations.showOnlyWhenItBecomesSticky : 'Show only when it becomes sticky.'
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey={fieldKey}
          updater={this.valueChangeHandler}
          options={{ labelText: labelText }}
          value={value}
        />
        <Tooltip>
          {tooltipText}
        </Tooltip>
      </div>
    )
  }

  render () {
    return (
      <div className='vcv-ui-sticky-section'>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getStickyToggle()}
            {this.getStickyOffset()}
            {this.getStickyZIndex()}
            {this.getStickyContainerToggle()}
            {this.getStickyVisibilityToggle()}
          </div>
        </div>
      </div>
    )
  }
}

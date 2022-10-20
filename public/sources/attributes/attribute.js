import React from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { getService, getStorage } from 'vc-cake'

const dataManager = getService('dataManager')

export default class Attribute extends React.Component {
  static propTypes = {
    updater: PropTypes.func.isRequired,
    elementAccessPoint: PropTypes.object,
    fieldKey: PropTypes.string.isRequired,
    fieldType: PropTypes.string,
    value: PropTypes.any.isRequired,
    defaultValue: PropTypes.any,
    options: PropTypes.any
  }

  constructor (props) {
    super(props)
    this.state = this.updateState(this.props)

    this.setFieldValue = this.setFieldValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.updateValue = lodash.debounce(this.updateValue.bind(this), 0)
  }

  componentDidUpdate (prevProps) {
    if (!lodash.isEqual(prevProps, this.props)) {
      this.setState(this.updateState(this.props))
    }
  }

  updateState (props) {
    return {
      value: props.value
    }
  }

  handleChange (event) {
    this.setFieldValue(event.currentTarget.value)
  }

  updateValue () {
    const { updater, fieldKey, fieldType } = this.props
    updater(fieldKey, this.state.value, null, fieldType)
  }

  setFieldValue (value) {
    this.setState({ value: value })
    this.updateValue()
  }

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

  devicesChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, { [fieldKey]: value }, this.state)

    if (newState.currentDevice === 'all') {
      // clone data from xl in to all except display property
      newState.devices.all = lodash.defaultsDeep({}, newState.devices[this.getCustomDevicesKeys().shift()])
      delete newState.devices.all.display
    } else if (this.state.currentDevice === 'all') {
      // clone data to custom devices from all
      this.getCustomDevicesKeys().forEach((device) => {
        newState.devices[device] = lodash.defaultsDeep({}, newState.devices.all)
      })
    }

    this.updateValue(newState, fieldKey)
  }

  parseValue (value, defaultState, deviceDefaults) {
    // set default values
    const newState = lodash.defaultsDeep({}, defaultState)
    // get devices data
    const devices = this.getCustomDevicesKeys()
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[device] = lodash.defaultsDeep({}, deviceDefaults)
      if (value.device && value.device[device]) {
        newState.devices[device] = lodash.defaultsDeep({}, value.device[device], newState.devices[device])
      }
    })

    return newState
  }

  valueChangeHandler (fieldKey, value) {
    const storage = getStorage('fieldOptions')
    const options = {
      fieldKey: fieldKey,
      fieldType: this.props.fieldType,
      id: this.props.elementAccessPoint.id
    }
    storage.trigger('fieldOptionsChange', options)
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = value
    this.updateValue(newState, fieldKey)
  }

  initMediaGlobals () {
    window.wp.media.model.settings.post.id = dataManager.get('sourceID')
    window.wp.media.model.settings.post.nonce = dataManager.get('nonce')
    window.wp.media.model.settings.post.featuredImageId = dataManager.get('featuredImage')
  }

  render () {
    // This method will be overwritten
    return (
      <div />
    )
  }
}

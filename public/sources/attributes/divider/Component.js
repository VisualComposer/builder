/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import lodash from 'lodash'
import Attribute from '../attribute'
import Devices from '../devices/Component'
import Toggle from '../toggle/Component'
import Dropdown from '../dropdown/Component'
import AttachImage from '../attachimage/Component'
import AttachVideo from '../attachvideo/Component'
import Color from '../color/Component'
import ButtonGroup from '../buttonGroup/Component'
import Range from '../range/Component'
import Dividerpicker from '../dividerpicker/Component'
import String from '../string/Component'

export default class Divider extends Attribute {
  static defaultProps = {
    fieldType: 'divider'
  }

  /**
   * Attribute Mixins
   */
  static attributeMixins = {
    dividerTopMixin: {
      src: require('raw-loader!./cssMixins/dividerTop.pcss'),
      variables: {
        device: {
          value: 'all'
        }
      }
    },
    dividerBottomMixin: {
      src: require('raw-loader!./cssMixins/dividerBottom.pcss'),
      variables: {
        device: {
          value: 'all'
        }
      }
    }
  }

  /**
   * Default state values
   */
  static deviceDefaults = {
    dividerTopBackgroundStyle: 'cover',
    dividerTopBackgroundPosition: 'center-top',
    dividerTopFlipHorizontal: 'horizontally-left',
    dividerTopFlipVertical: 'vertically-down',
    dividerTopBackgroundType: 'color',
    dividerTopShape: { icon: 'vcv-ui-icon-divider vcv-ui-icon-divider-zigzag', iconSet: 'dividers' },
    dividerTopBackgroundColor: '#6567df',
    dividerTopBackgroundGradientStartColor: 'rgb(226, 135, 135)',
    dividerTopBackgroundGradientEndColor: 'rgb(93, 55, 216)',
    dividerTopBackgroundGradientAngle: 0,
    dividerTopWidth: '100',
    dividerTopHeight: '20',
    dividerBottomBackgroundStyle: 'cover',
    dividerBottomBackgroundPosition: 'center-top',
    dividerBottomFlipHorizontal: 'horizontally-left',
    dividerBottomFlipVertical: 'vertically-down',
    dividerBottomBackgroundType: 'color',
    dividerBottomShape: { icon: 'vcv-ui-icon-divider vcv-ui-icon-divider-zigzag', iconSet: 'dividers' },
    dividerBottomBackgroundColor: '#6567df',
    dividerBottomBackgroundGradientStartColor: 'rgb(226, 135, 135)',
    dividerBottomBackgroundGradientEndColor: 'rgb(93, 55, 216)',
    dividerBottomBackgroundGradientAngle: 0,
    dividerBottomWidth: '100',
    dividerBottomHeight: '20'
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
      newState = lodash.defaultsDeep({}, props, Divider.defaultState)
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
    const newState = lodash.defaultsDeep({}, Divider.defaultState)
    // get devices data
    const devices = this.getCustomDevicesKeys()
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[device] = lodash.defaultsDeep({}, Divider.deviceDefaults)
      if (value.device && value.device[device]) {
        newState.devices[device] = lodash.defaultsDeep({}, value.device[device], newState.devices[device])
      }
    })

    return newState
  }

  /**
   * Update value
   * @param newState
   */
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
        // set default values
        if (!newState.devices[device].dividerTopBackgroundStyle) {
          newState.devices[device].dividerTopBackgroundStyle = Divider.deviceDefaults.dividerTopBackgroundStyle
        }
        if (!newState.devices[device].dividerBottomBackgroundStyle) {
          newState.devices[device].dividerBottomBackgroundStyle = Divider.deviceDefaults.dividerBottomBackgroundStyle
        }
        if (!newState.devices[device].dividerTopBackgroundPosition) {
          newState.devices[device].dividerTopBackgroundPosition = Divider.deviceDefaults.dividerTopBackgroundPosition
        }
        if (!newState.devices[device].dividerBottomBackgroundPosition) {
          newState.devices[device].dividerBottomBackgroundPosition = Divider.deviceDefaults.dividerBottomBackgroundPosition
        }

        // values
        newValue[device] = lodash.defaultsDeep({}, newState.devices[device])

        if (!newValue[device].dividerTop) {
          Object.keys(newValue[device]).forEach((style) => {
            if (style !== 'dividerTop' && style.includes('dividerTop')) {
              delete newValue[device][style]
            }
          })
        } else {
          if (newState.devices[device].dividerTopBackgroundType !== 'image' && newState.devices[device].dividerTopBackgroundType !== 'videoEmbed' && newState.devices[device].dividerTopBackgroundType !== 'videoYoutube' && newState.devices[device].dividerTopBackgroundType !== 'videoVimeo') {
            delete newValue[device].dividerTopBackgroundImage
            delete newValue[device].dividerTopBackgroundStyle
            delete newValue[device].dividerTopBackgroundPosition
            delete newValue[device].dividerTopVideoEmbed
            delete newValue[device].dividerTopVideoYoutube
            delete newValue[device].dividerTopVideoVimeo
          }

          if (newState.devices[device].dividerTopBackgroundType === 'image') {
            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerTopBackgroundImage')) {
              const dividerImages = newValue[device].dividerTopBackgroundImage
              const isArray = dividerImages.constructor === Array
              if ((isArray && dividerImages.length === 0) || (!isArray && (!dividerImages.urls || dividerImages.urls.length === 0))) {
                delete newValue[device].dividerTopBackgroundStyle
                delete newValue[device].dividerTopBackgroundPosition
                delete newValue[device].dividerTopVideoEmbed
                delete newValue[device].dividerTopVideoYoutube
                delete newValue[device].dividerTopVideoVimeo
              }
            } else {
              delete newValue[device].dividerTopBackgroundStyle
              delete newValue[device].dividerTopBackgroundPosition
              delete newValue[device].dividerTopVideoEmbed
              delete newValue[device].dividerTopVideoYoutube
              delete newValue[device].dividerTopVideoVimeo
            }
          }

          if (newState.devices[device].dividerTopBackgroundType === 'videoEmbed') {
            delete newValue[device].dividerTopBackgroundStyle

            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerTopVideoEmbed')) {
              const dividerVideos = newValue[device].dividerTopVideoEmbed
              const isArray = dividerVideos.constructor === Array

              if ((isArray && dividerVideos.length === 0) || (!isArray && (!dividerVideos.urls || dividerVideos.urls.length === 0))) {
                delete newValue[device].dividerTopBackgroundPosition
                delete newValue[device].dividerTopBackgroundImage
                delete newValue[device].dividerTopVideoYoutube
                delete newValue[device].dividerTopVideoVimeo
              }
            } else {
              delete newValue[device].dividerTopBackgroundPosition
              delete newValue[device].dividerTopBackgroundImage
              delete newValue[device].dividerTopVideoYoutube
              delete newValue[device].dividerTopVideoVimeo
            }
          }

          if (newState.devices[device].dividerTopBackgroundType === 'videoYoutube') {
            delete newValue[device].dividerTopBackgroundStyle

            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerTopVideoYoutube')) {
              const dividerYoutubeUrl = newValue[device].dividerTopVideoYoutube
              if (!dividerYoutubeUrl) {
                delete newValue[device].dividerTopBackgroundPosition
                delete newValue[device].dividerTopBackgroundImage
                delete newValue[device].dividerTopVideoEmbed
                delete newValue[device].dividerTopVideoVimeo
              }
            } else {
              delete newValue[device].dividerTopBackgroundPosition
              delete newValue[device].dividerTopBackgroundImage
              delete newValue[device].dividerTopVideoEmbed
              delete newValue[device].dividerTopVideoVimeo
            }
          }

          if (newState.devices[device].dividerTopBackgroundType === 'videoVimeo') {
            delete newValue[device].dividerTopBackgroundStyle

            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerTopVideoVimeo')) {
              const dividerVimeoUrl = newValue[device].dividerTopVideoVimeo
              if (!dividerVimeoUrl) {
                delete newValue[device].dividerTopBackgroundPosition
                delete newValue[device].dividerTopBackgroundImage
                delete newValue[device].dividerTopVideoEmbed
                delete newValue[device].dividerTopVideoYoutube
              }
            } else {
              delete newValue[device].dividerTopBackgroundPosition
              delete newValue[device].dividerTopBackgroundImage
              delete newValue[device].dividerTopVideoEmbed
              delete newValue[device].dividerTopVideoYoutube
            }
          }
        }

        if (!newValue[device].dividerBottom) {
          Object.keys(newValue[device]).forEach((style) => {
            if (style !== 'dividerBottom' && style.includes('dividerBottom')) {
              delete newValue[device][style]
            }
          })
        } else {
          if (newState.devices[device].dividerBottomBackgroundType !== 'image' && newState.devices[device].dividerBottomBackgroundType !== 'videoEmbed' && newState.devices[device].dividerBottomBackgroundType !== 'videoYoutube' && newState.devices[device].dividerBottomBackgroundType !== 'videoVimeo') {
            delete newValue[device].dividerBottomBackgroundImage
            delete newValue[device].dividerBottomBackgroundStyle
            delete newValue[device].dividerBottomBackgroundPosition
            delete newValue[device].dividerBottomVideoEmbed
            delete newValue[device].dividerBottomVideoYoutube
            delete newValue[device].dividerBottomVideoVimeo
          }

          if (newState.devices[device].dividerBottomBackgroundType === 'image') {
            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerBottomBackgroundImage')) {
              const dividerImages = newValue[device].dividerBottomBackgroundImage
              const isArray = dividerImages.constructor === Array
              if ((isArray && dividerImages.length === 0) || (!isArray && (!dividerImages.urls || dividerImages.urls.length === 0))) {
                delete newValue[device].dividerBottomBackgroundStyle
                delete newValue[device].dividerBottomBackgroundPosition
                delete newValue[device].dividerBottomVideoEmbed
                delete newValue[device].dividerBottomVideoYoutube
                delete newValue[device].dividerBottomVideoVimeo
              }
            } else {
              delete newValue[device].dividerBottomBackgroundStyle
              delete newValue[device].dividerBottomBackgroundPosition
              delete newValue[device].dividerBottomVideoEmbed
              delete newValue[device].dividerBottomVideoYoutube
              delete newValue[device].dividerBottomVideoVimeo
            }
          }

          if (newState.devices[device].dividerBottomBackgroundType === 'videoEmbed') {
            delete newValue[device].dividerBottomBackgroundStyle

            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerBottomVideoEmbed')) {
              const dividerVideos = newValue[device].dividerBottomVideoEmbed
              const isArray = dividerVideos.constructor === Array

              if ((isArray && dividerVideos.length === 0) || (!isArray && (!dividerVideos.urls || dividerVideos.urls.length === 0))) {
                delete newValue[device].dividerBottomBackgroundPosition
                delete newValue[device].dividerBottomBackgroundImage
                delete newValue[device].dividerBottomVideoYoutube
                delete newValue[device].dividerBottomVideoVimeo
              }
            } else {
              delete newValue[device].dividerBottomBackgroundPosition
              delete newValue[device].dividerBottomBackgroundImage
              delete newValue[device].dividerBottomVideoYoutube
              delete newValue[device].dividerBottomVideoVimeo
            }
          }

          if (newState.devices[device].dividerBottomBackgroundType === 'videoYoutube') {
            delete newValue[device].dividerBottomBackgroundStyle

            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerBottomVideoYoutube')) {
              const dividerYoutubeUrl = newValue[device].dividerBottomVideoYoutube
              if (!dividerYoutubeUrl) {
                delete newValue[device].dividerBottomBackgroundPosition
                delete newValue[device].dividerBottomBackgroundImage
                delete newValue[device].dividerBottomVideoEmbed
                delete newValue[device].dividerBottomVideoVimeo
              }
            } else {
              delete newValue[device].dividerBottomBackgroundPosition
              delete newValue[device].dividerBottomBackgroundImage
              delete newValue[device].dividerBottomVideoEmbed
              delete newValue[device].dividerBottomVideoVimeo
            }
          }

          if (newState.devices[device].dividerBottomBackgroundType === 'videoVimeo') {
            delete newValue[device].dividerBottomBackgroundStyle

            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerBottomVideoVimeo')) {
              const dividerVimeoUrl = newValue[device].dividerBottomVideoVimeo
              if (!dividerVimeoUrl) {
                delete newValue[device].dividerBottomBackgroundPosition
                delete newValue[device].dividerBottomBackgroundImage
                delete newValue[device].dividerBottomVideoEmbed
                delete newValue[device].dividerBottomVideoYoutube
              }
            } else {
              delete newValue[device].dividerBottomBackgroundPosition
              delete newValue[device].dividerBottomBackgroundImage
              delete newValue[device].dividerBottomVideoEmbed
              delete newValue[device].dividerBottomVideoYoutube
            }
          }
        }

        // remove device from list if it's empty
        if (!Object.keys(newValue[device]).length) {
          delete newValue[device]
        }
      }
    })

    const allDevices = checkDevices.concat(this.getCustomDevicesKeys())
    allDevices.push('all')
    allDevices.forEach((device) => {
      let mixinName = `dividerTopMixin:${device}`
      newMixins[mixinName] = lodash.defaultsDeep({}, Divider.attributeMixins.dividerTopMixin)
      newMixins[mixinName].variables.device = {
        value: device
      }

      mixinName = `dividerBottomMixin:${device}`
      newMixins[mixinName] = lodash.defaultsDeep({}, Divider.attributeMixins.dividerBottomMixin)
      newMixins[mixinName].variables.device = {
        value: device
      }
    })

    this.setFieldValue(newValue, newMixins, fieldKey)
    this.setState(newState)
  }

  /**
   * Flush field value to updater
   * @param value
   * @param mixins
   */
  setFieldValue (value, mixins, innerFieldKey) {
    const { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value,
      attributeMixins: mixins
    }, innerFieldKey)
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

  /**
   * Get custom devices keys
   * @returns {Array}
   */
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

  /**
   * Handle devices change
   * @returns {XML}
   */
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

  /**
   * Handle simple fieldKey - value type change
   * @param fieldKey
   * @param value
   */
  valueChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = value
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render divider toggle
   * @returns {XML}
   */
  getDividerRender (type) {
    const dividerType = `divider${type}`
    const deviceData = this.state.devices[this.state.currentDevice]

    const value = deviceData[dividerType] || false
    const fieldKey = dividerType
    const labelText = `Enable ${type.toLowerCase()} shape divider`

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

  /**
   * Render divider shape - icon picker
   * @returns {XML}
   */
  getDividerShapeRender (type) {
    const dividerType = `divider${type}`
    const dividerShapeName = `${dividerType}Shape`
    const deviceData = this.state.devices[this.state.currentDevice]

    if (!deviceData[dividerType]) {
      return null
    }

    const value = deviceData[dividerShapeName] || Divider.deviceDefaults[dividerShapeName]

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider shape
        </span>
        <Dividerpicker
          api={this.props.api}
          fieldKey={dividerShapeName}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider flip button group
   * @returns {XML}
   */
  getDividerFlipRender (type) {
    const dividerType = `divider${type}`
    const dividerFlipName = `${dividerType}FlipHorizontal`
    const deviceData = this.state.devices[this.state.currentDevice]

    if (!deviceData[dividerType]) {
      return null
    }

    const value = deviceData[dividerFlipName] || Divider.deviceDefaults[dividerFlipName]
    const options = {
      values: [
        {
          label: 'Left',
          value: 'horizontally-left',
          icon: 'vcv-ui-icon-attribute-mirror-horizontally-left'
        },
        {
          label: 'Right',
          value: 'horizontally-right',
          icon: 'vcv-ui-icon-attribute-mirror-horizontally-right'
        }
      ]
    }

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Flip
        </span>
        <ButtonGroup
          api={this.props.api}
          fieldKey={dividerFlipName}
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider height range
   * @returns {XML}
   */
  getDividerHeightRender (type) {
    const dividerType = `divider${type}`
    const dividerHeightName = `${dividerType}Height`
    const deviceData = this.state.devices[this.state.currentDevice]

    if (!deviceData[dividerType]) {
      return null
    }

    const value = deviceData[dividerHeightName]
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <span className='vcv-ui-form-group-heading'>
          Divider size
        </span>
        <Range
          api={this.props.api}
          fieldKey={dividerHeightName}
          updater={this.valueChangeHandler}
          options={{ min: 0, max: 200, measurement: '%' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider width range
   * @returns {XML}
   */
  getDividerWidthRender (type) {
    const dividerType = `divider${type}`
    const dividerWidthName = `${dividerType}Width`
    const deviceData = this.state.devices[this.state.currentDevice]

    if (!deviceData[dividerType]) {
      return null
    }

    const value = deviceData[dividerWidthName]

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <span className='vcv-ui-form-group-heading'>
          Divider form scale
        </span>
        <Range
          api={this.props.api}
          fieldKey={dividerWidthName}
          updater={this.valueChangeHandler}
          options={{ min: 100, max: 300, measurement: '%' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider background type dropdown
   * @returns {*}
   */
  getDividerBackgroundTypeRender (type) {
    const dividerType = `divider${type}`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const deviceData = this.state.devices[this.state.currentDevice]

    if (!deviceData[dividerType]) {
      return null
    }

    const options = {
      values: [
        {
          label: 'Color',
          value: 'color'
        },
        {
          label: 'Gradient',
          value: 'gradient'
        },
        {
          label: 'Image',
          value: 'image'
        },
        {
          label: 'Self-hosted video',
          value: 'videoEmbed'
        },
        {
          label: 'Youtube video',
          value: 'videoYoutube'
        },
        {
          label: 'Vimeo video',
          value: 'videoVimeo'
        }
      ]
    }

    const value = deviceData[dividerBgTypeName] || Divider.deviceDefaults[dividerBgTypeName]

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider background type
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey={dividerBgTypeName}
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render color picker for divider background color
   * @returns {*}
   */
  getDividerBackgroundColorRender (type) {
    const dividerType = `divider${type}`
    const dividerBgColorName = `${dividerType}BackgroundColor`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'color') {
      return null
    }

    const value = deviceData[dividerBgColorName] || Divider.deviceDefaults[dividerBgColorName]

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider background color
        </span>
        <Color
          api={this.props.api}
          fieldKey={dividerBgColorName}
          updater={this.valueChangeHandler}
          value={value}
          defaultValue={Divider.deviceDefaults[dividerBgColorName]}
        />
      </div>
    )
  }

  /**
   * Render color picker for divider gradient background start color
   * @returns {*}
   */
  getDividerBackgroundGradientStartColorRender (type) {
    const dividerType = `divider${type}`
    const dividerGradientStartName = `${dividerType}BackgroundGradientStartColor`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'gradient') {
      return null
    }

    const value = deviceData[dividerGradientStartName] || Divider.deviceDefaults[dividerGradientStartName]
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider start color
        </span>
        <Color
          api={this.props.api}
          fieldKey={dividerGradientStartName}
          updater={this.valueChangeHandler}
          value={value}
          defaultValue={Divider.deviceDefaults[dividerGradientStartName]}
        />
      </div>
    )
  }

  /**
   * Render color picker for divider gradient background end color
   * @returns {*}
   */
  getDividerBackgroundGradientEndColorRender (type) {
    const dividerType = `divider${type}`
    const dividerGradientEndName = `${dividerType}BackgroundGradientEndColor`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'gradient') {
      return null
    }

    const value = deviceData[dividerGradientEndName] || Divider.deviceDefaults[dividerGradientEndName]
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider end color
        </span>
        <Color
          api={this.props.api}
          fieldKey={dividerGradientEndName}
          updater={this.valueChangeHandler}
          value={value}
          defaultValue={Divider.deviceDefaults[dividerGradientEndName]}
        />
      </div>
    )
  }

  /**
   * Render range input for divider gradient background angle
   * @returns {*}
   */
  getDividerBackgroundGradientAngleRender (type) {
    const dividerType = `divider${type}`
    const dividerAngleName = `${dividerType}BackgroundGradientAngle`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'gradient') {
      return null
    }

    const value = deviceData[dividerAngleName]
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider gradient angle
        </span>
        <Range
          api={this.props.api}
          fieldKey={dividerAngleName}
          updater={this.valueChangeHandler}
          options={{ min: 0, max: 180, measurement: '°' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render attach image for divider background
   * @returns {*}
   */
  getDividerAttachImageRender (type) {
    const dividerType = `divider${type}`
    const dividerImageName = `${dividerType}BackgroundImage`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'image') {
      return null
    }

    const value = deviceData[dividerImageName] || ''

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider image
        </span>
        <AttachImage
          api={this.props.api}
          fieldKey={dividerImageName}
          options={{
            multiple: false
          }}
          updater={this.valueChangeHandler}
          value={value}
          elementAccessPoint={this.props.elementAccessPoint}
        />
      </div>
    )
  }

  /**
   * Render divider background style
   * @returns {*}
   */
  getDividerBackgroundStyleRender (type) {
    const dividerType = `divider${type}`
    const dividerBgStyleName = `${dividerType}BackgroundStyle`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const dividerImageName = `${dividerType}BackgroundImage`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'image' || !Object.prototype.hasOwnProperty.call(deviceData, dividerImageName)) {
      return null
    }

    const images = deviceData[dividerImageName]
    const isArray = images.constructor === Array

    if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
      return null
    }

    const options = {
      values: [
        {
          label: 'Cover',
          value: 'cover'
        },
        {
          label: 'Contain',
          value: 'contain'
        },
        {
          label: 'Full width',
          value: 'full-width'
        },
        {
          label: 'Full height',
          value: 'full-height'
        },
        {
          label: 'Repeat',
          value: 'repeat'
        },
        {
          label: 'Repeat horizontal',
          value: 'repeat-x'
        },
        {
          label: 'Repeat vertical',
          value: 'repeat-y'
        },
        {
          label: 'No repeat',
          value: 'no-repeat'
        }
      ]
    }
    const value = deviceData[dividerBgStyleName] || Divider.deviceDefaults[dividerBgStyleName]
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider background style
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey={dividerBgStyleName}
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider background position control
   * @returns {*}
   */
  getDividerBackgroundPositionRender (type) {
    const dividerType = `divider${type}`
    const dividerBgPositionName = `${dividerType}BackgroundPosition`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const dividerImageName = `${dividerType}BackgroundImage`
    const dividerVideoEmbedName = `${dividerType}VideoEmbed`
    const dividerVideoYoutubeName = `${dividerType}VideoYoutube`
    const dividerVideoVimeoName = `${dividerType}VideoVimeo`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if ((backgroundType !== 'image' && backgroundType !== 'videoEmbed' && backgroundType !== 'videoYoutube' && backgroundType !== 'videoVimeo') || !deviceData[dividerType]) {
      return null
    }

    if (backgroundType === 'image') {
      if (!Object.prototype.hasOwnProperty.call(deviceData, dividerImageName)) {
        return null
      }
      const images = deviceData[dividerImageName]
      const isArray = images.constructor === Array

      if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
        return null
      }
    }

    if (backgroundType === 'videoEmbed') {
      if (!Object.prototype.hasOwnProperty.call(deviceData, dividerVideoEmbedName)) {
        return null
      }
      const videos = deviceData[dividerVideoEmbedName]
      const isArray = videos.constructor === Array

      if ((isArray && videos.length === 0) || (!isArray && (!videos.urls || videos.urls.length === 0))) {
        return null
      }
    }

    if (backgroundType === 'videoYoutube' && !deviceData[dividerVideoYoutubeName]) {
      return null
    }

    if (backgroundType === 'videoVimeo' && !deviceData[dividerVideoVimeoName]) {
      return null
    }

    const options = {
      values: [
        {
          label: 'Left top',
          value: 'left-top',
          icon: 'vcv-ui-icon-attribute-background-position-left-top'
        },
        {
          label: 'Center top',
          value: 'center-top',
          icon: 'vcv-ui-icon-attribute-background-position-center-top'
        },
        {
          label: 'Right top',
          value: 'right-top',
          icon: 'vcv-ui-icon-attribute-background-position-right-top'
        },
        {
          label: 'Left center',
          value: 'left-center',
          icon: 'vcv-ui-icon-attribute-background-position-left-center'
        },
        {
          label: 'Center center',
          value: 'center-center',
          icon: 'vcv-ui-icon-attribute-background-position-center-center'
        },
        {
          label: 'Right center',
          value: 'right-center',
          icon: 'vcv-ui-icon-attribute-background-position-right-center'
        },
        {
          label: 'Left bottom',
          value: 'left-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-left-bottom'
        },
        {
          label: 'Center bottom',
          value: 'center-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-center-bottom'
        },
        {
          label: 'Right bottom',
          value: 'right-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-right-bottom'
        }
      ]
    }
    const value = deviceData[dividerBgPositionName] || Divider.deviceDefaults[dividerBgPositionName]

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider background position
        </span>
        <ButtonGroup
          api={this.props.api}
          fieldKey={dividerBgPositionName}
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider Self hosted video control
   * @returns {*}
   */
  getDividerEmbedVideoRender (type) {
    const dividerType = `divider${type}`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const dividerVideoEmbedName = `${dividerType}VideoEmbed`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'videoEmbed') {
      return null
    }

    const value = deviceData[dividerVideoEmbedName] || {}

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider background video
        </span>
        <AttachVideo
          api={this.props.api}
          fieldKey={dividerVideoEmbedName}
          options={{
            multiple: false
          }}
          updater={this.valueChangeHandler}
          value={value}
        />
        <p className='vcv-ui-form-helper'>For better browser compatibility please use <b>mp4</b> video format</p>
      </div>
    )
  }

  /**
   * Render Youtube video control
   * @returns {*}
   */
  getDividerYoutubeVideoRender (type) {
    const dividerType = `divider${type}`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const dividerVideoYoutubeName = `${dividerType}VideoYoutube`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'videoYoutube') {
      return null
    }

    const value = deviceData[dividerVideoYoutubeName] || ''

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          YouTube video link
        </span>
        <String
          api={this.props.api}
          fieldKey={dividerVideoYoutubeName}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render Vimeo video control
   * @returns {*}
   */
  getDividerVimeoVideoRender (type) {
    const dividerType = `divider${type}`
    const dividerBgTypeName = `${dividerType}BackgroundType`
    const dividerVideoVimeoName = `${dividerType}VideoVimeo`
    const deviceData = this.state.devices[this.state.currentDevice]
    const backgroundType = deviceData[dividerBgTypeName]

    if (!deviceData[dividerType] || backgroundType !== 'videoVimeo') {
      return null
    }

    const value = deviceData[dividerVideoVimeoName] || ''

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Vimeo video link
        </span>
        <String
          api={this.props.api}
          fieldKey={dividerVideoVimeoName}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * @returns {XML}
   */
  render () {
    return (
      <div className='vcv-ui-divider-section'>
        {this.getDevicesRender()}
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getDividerRender('Top')}
            {this.getDividerShapeRender('Top')}
            {this.getDividerFlipRender('Top')}
            {this.getDividerHeightRender('Top')}
            {this.getDividerWidthRender('Top')}
            {this.getDividerBackgroundTypeRender('Top')}
            {this.getDividerBackgroundColorRender('Top')}
            {this.getDividerBackgroundGradientStartColorRender('Top')}
            {this.getDividerBackgroundGradientEndColorRender('Top')}
            {this.getDividerBackgroundGradientAngleRender('Top')}
            {this.getDividerAttachImageRender('Top')}
            {this.getDividerBackgroundStyleRender('Top')}
            {this.getDividerEmbedVideoRender('Top')}
            {this.getDividerYoutubeVideoRender('Top')}
            {this.getDividerVimeoVideoRender('Top')}
            {this.getDividerBackgroundPositionRender('Top')}
            {this.getDividerRender('Bottom')}
            {this.getDividerShapeRender('Bottom')}
            {this.getDividerFlipRender('Bottom')}
            {this.getDividerHeightRender('Bottom')}
            {this.getDividerWidthRender('Bottom')}
            {this.getDividerBackgroundTypeRender('Bottom')}
            {this.getDividerBackgroundColorRender('Bottom')}
            {this.getDividerBackgroundGradientStartColorRender('Bottom')}
            {this.getDividerBackgroundGradientEndColorRender('Bottom')}
            {this.getDividerBackgroundGradientAngleRender('Bottom')}
            {this.getDividerAttachImageRender('Bottom')}
            {this.getDividerBackgroundStyleRender('Bottom')}
            {this.getDividerEmbedVideoRender('Bottom')}
            {this.getDividerYoutubeVideoRender('Bottom')}
            {this.getDividerVimeoVideoRender('Bottom')}
            {this.getDividerBackgroundPositionRender('Bottom')}
          </div>
        </div>
      </div>
    )
  }
}

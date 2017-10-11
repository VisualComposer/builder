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
import IconPicker from '../iconpicker/Component'
import vcCake from 'vc-cake'

export default class DesignOptionsAdvanced extends Attribute {
  /**
   * Attribute Mixins
   */
  static attributeMixins = {
    visibilityMixin: {
      src: require('raw-loader!./cssMixins/visibility.pcss'),
      variables: {
        device: {
          value: `all`
        }
      }
    },
    dividerMixin: {
      src: require('raw-loader!./cssMixins/divider.pcss'),
      variables: {
        device: {
          value: `all`
        }
      }
    }
  }

  /**
   * Default state values
   */
  static deviceDefaults = {
    backgroundStyle: 'cover',
    backgroundPosition: 'center-top',
    dividerFlipHorizontal: 'horizontally-left',
    dividerFlipVertical: 'vertically-down',
    dividerPosition: 'top',
    dividerBackgroundType: 'color',
    dividerShape: { icon: 'vcv-ui-icon-dividers vcv-ui-icon-dividers-zigzag', iconSet: 'all' },
    dividerShapeNew: { icon: 'vcv-ui-icon-divider vcv-ui-icon-divider-zigzag', iconSet: 'all' },
    dividerBackgroundColor: '#6567DF',
    dividerBackgroundGradientStartColor: 'rgb(226, 135, 135)',
    dividerBackgroundGradientEndColor: 'rgb(93, 55, 216)',
    dividerBackgroundGradientAngle: 0
  }
  static defaultState = {
    currentDevice: 'all',
    devices: {},
    attributeMixins: {}
  }

  constructor (props) {
    super(props)
    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.deviceVisibilityChangeHandler = this.deviceVisibilityChangeHandler.bind(this)
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
      newState = lodash.defaultsDeep({}, props, DesignOptionsAdvanced.defaultState)
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
    let newState = lodash.defaultsDeep({}, DesignOptionsAdvanced.defaultState)
    // get devices data
    let devices = this.getCustomDevicesKeys()
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[ device ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.deviceDefaults)
      if (value.device && value.device[ device ]) {
        newState.devices[ device ] = lodash.defaultsDeep({}, value.device[ device ], newState.devices[ device ])
      }
    })

    return newState
  }

  /**
   * Update value
   * @param newState
   */
  updateValue (newState, fieldKey) {
    let newValue = {}
    let newMixins = {}

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
      if (!lodash.isEmpty(newState.devices[ device ])) {
        // set default values
        if (!newState.devices[ device ].dividerBackgroundStyle) {
          newState.devices[ device ].dividerBackgroundStyle = DesignOptionsAdvanced.deviceDefaults.backgroundStyle
        }
        if (!newState.devices[ device ].dividerBackgroundPosition) {
          newState.devices[ device ].dividerBackgroundPosition = DesignOptionsAdvanced.deviceDefaults.backgroundPosition
        }

        // values
        newValue[ device ] = lodash.defaultsDeep({}, newState.devices[ device ])
        // remove all values if display is provided
        if (newValue[ device ].hasOwnProperty('display')) {
          Object.keys(newValue[ device ]).forEach((style) => {
            if (style !== 'display') {
              delete newValue[ device ][ style ]
            }
          })
        } else {
          if (newState.devices[ device ].dividerBackgroundType !== 'image' && newState.devices[ device ].dividerBackgroundType !== 'videoEmbed') {
            delete newValue[ device ].dividerBackgroundImage
            delete newValue[ device ].dividerBackgroundStyle
            delete newValue[ device ].dividerBackgroundPosition
            delete newValue[ device ].dividerVideoEmbed
          }

          if (newState.devices[ device ].dividerBackgroundType === 'image') {
            if (newValue[ device ].hasOwnProperty('dividerBackgroundImage')) {
              let dividerImages = newValue[ device ].dividerBackgroundImage
              let isArray = dividerImages.constructor === Array
              if ((isArray && dividerImages.length === 0) || (!isArray && (!dividerImages.urls || dividerImages.urls.length === 0))) {
                delete newValue[ device ].dividerBackgroundStyle
                delete newValue[ device ].dividerBackgroundPosition
                delete newValue[ device ].dividerVideoEmbed
              }
            } else {
              delete newValue[ device ].dividerBackgroundStyle
              delete newValue[ device ].dividerBackgroundPosition
              delete newValue[ device ].dividerVideoEmbed
            }
          }

          if (newState.devices[ device ].dividerBackgroundType === 'videoEmbed') {
            delete newValue[ device ].dividerBackgroundStyle

            if (newValue[ device ].hasOwnProperty('dividerVideoEmbed')) {
              let dividerVideos = newValue[ device ].dividerVideoEmbed
              let isArray = dividerVideos.constructor === Array

              if ((isArray && dividerVideos.length === 0) || (!isArray && (!dividerVideos.urls || dividerVideos.urls.length === 0))) {
                delete newValue[ device ].dividerBackgroundPosition
                delete newValue[ device ].dividerBackgroundImage
              }
            } else {
              delete newValue[ device ].dividerBackgroundPosition
              delete newValue[ device ].dividerBackgroundImage
            }
          }
        }
        // mixins
        if (newValue[ device ].hasOwnProperty('display')) {
          newMixins[ `visibilityMixin:${device}` ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.visibilityMixin)
          newMixins[ `visibilityMixin:${device}` ].variables = {
            device: {
              value: device
            }
          }
        } else {
          // dividerMixin
          if (newValue[ device ] && newValue[ device ].divider && (newValue[ device ].dividerBackgroundType === 'image' || newValue[ device ].dividerBackgroundType === 'videoEmbed')) {
            let mixinName = `dividerMixin:${device}`
            newMixins[ mixinName ] = {}
            newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.dividerMixin)

            newMixins[ mixinName ].variables.device = {
              value: device
            }
          }
        }

        // remove device from list if it's empty
        if (!Object.keys(newValue[ device ]).length) {
          delete newValue[ device ]
        }
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
    let { updater, fieldKey } = this.props
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
    let newState = lodash.defaultsDeep({}, { [fieldKey]: value }, this.state)

    if (newState.currentDevice === 'all') {
      // clone data from xl in to all except display property
      newState.devices.all = lodash.defaultsDeep({}, newState.devices[ this.getCustomDevicesKeys().shift() ])
      delete newState.devices.all.display
    } else if (this.state.currentDevice === 'all') {
      // clone data to custom devices from all
      this.getCustomDevicesKeys().forEach((device) => {
        newState.devices[ device ] = lodash.defaultsDeep({}, newState.devices.all)
      })
    }

    this.updateValue(newState, fieldKey)
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
    let newState = lodash.defaultsDeep({}, this.state)
    if (isVisible) {
      delete newState.devices[ this.state.currentDevice ].display
    } else {
      // set display to none
      newState.devices[ this.state.currentDevice ].display = 'none'
    }

    this.updateValue(newState, fieldKey)
  }

  /**
   * Handle simple fieldKey - value type change
   * @param fieldKey
   * @param value
   */
  valueChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render divider flip button group
   * @returns {XML}
   */
  getDividerFlipRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let options = {
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

    let value = this.state.devices[ this.state.currentDevice ].dividerFlipHorizontal || DesignOptionsAdvanced.deviceDefaults.dividerFlipHorizontal
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Flip
        </span>
        <ButtonGroup
          api={this.props.api}
          fieldKey='dividerFlipHorizontal'
          options={options}
          updater={this.valueChangeHandler}
          value={value} />
      </div>
    )
  }

  /**
   * Render divider shape - icon picker
   * @returns {XML}
   */
  getDividerShapeRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let iconType = 'shapes'
    let fieldKey = 'dividerShape'
    let value = this.state.devices[ this.state.currentDevice ].dividerShape || DesignOptionsAdvanced.deviceDefaults.dividerShape

    if (vcCake.env('NEW_DIVIDER_SHAPES')) {
      iconType = 'newShapes'
      value = this.state.devices[ this.state.currentDevice ].dividerShapeNew || DesignOptionsAdvanced.deviceDefaults.dividerShapeNew
      fieldKey = 'dividerShapeNew'
    }

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Divider shape
        </span>
        <IconPicker
          api={this.props.api}
          fieldKey={fieldKey}
          options={{ iconType: iconType }}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider width range
   * @returns {XML}
   */
  getDividerWidthRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerWidth || '100'
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <span className='vcv-ui-form-group-heading'>
          Divider form scale
        </span>
        <Range
          api={this.props.api}
          fieldKey='dividerWidth'
          updater={this.valueChangeHandler}
          options={{ min: 100, max: 300, measurement: '%' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider height range
   * @returns {XML}
   */
  getDividerHeightRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerHeight || '200'
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <span className='vcv-ui-form-group-heading'>
          Divider size
        </span>
        <Range
          api={this.props.api}
          fieldKey='dividerHeight'
          updater={this.valueChangeHandler}
          options={{ min: 0, max: 1600, measurement: 'px' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render divider background type dropdown
   * @returns {*}
   */
  getDividerBackgroundTypeRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let options = {
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
        }
      ]
    }

    if (vcCake.env('CONTAINER_DIVIDER_EMBED_VIDEO')) {
      options.values.push({
        label: 'Self-hosted video',
        value: 'videoEmbed'
      })
    }
    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundType || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundType
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background type
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='dividerBackgroundType'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render color picker for divider background color
   * @returns {*}
   */
  getDividerBackgroundColorRender () {
    let backgroundType = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || backgroundType !== 'color') {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundColor || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundColor
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background color
      </span>
      <Color
        api={this.props.api}
        fieldKey='dividerBackgroundColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue={DesignOptionsAdvanced.deviceDefaults.dividerBackgroundColor} />
    </div>
  }

  /**
   * Render color picker for divider gradient background start color
   * @returns {*}
   */
  getDividerBackgroundGradientStartColorRender () {
    let backgroundType = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || backgroundType !== 'gradient') {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundGradientStartColor || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientStartColor
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider start color
      </span>
      <Color
        api={this.props.api}
        fieldKey='dividerBackgroundGradientStartColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue={DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientStartColor} />
    </div>
  }

  /**
   * Render color picker for divider gradient background end color
   * @returns {*}
   */
  getDividerBackgroundGradientEndColorRender () {
    let backgroundType = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || backgroundType !== 'gradient') {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundGradientEndColor || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientEndColor
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider end color
      </span>
      <Color
        api={this.props.api}
        fieldKey='dividerBackgroundGradientEndColor'
        updater={this.valueChangeHandler}
        value={value}
        defaultValue={DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientEndColor} />
    </div>
  }

  /**
   * Render range input for divider gradient background angle
   * @returns {*}
   */
  getDividerBackgroundGradientAngleRender () {
    let backgroundType = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || backgroundType !== 'gradient') {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundGradientAngle || DesignOptionsAdvanced.deviceDefaults.dividerBackgroundGradientAngle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider gradient angle
      </span>
      <Range
        api={this.props.api}
        fieldKey='dividerBackgroundGradientAngle'
        updater={this.valueChangeHandler}
        options={{ min: 0, max: 180, measurement: '°' }}
        value={value}
      />
    </div>
  }

  /**
   * Render attach image for divider background
   * @returns {*}
   */
  getDividerAttachImageRender () {
    let backgroundType = this.state.devices[ this.state.currentDevice ].dividerBackgroundType

    if (this.state.devices[ this.state.currentDevice ].display || backgroundType !== 'image') {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundImage || ''

    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider image
      </span>
      <AttachImage
        api={this.props.api}
        fieldKey='dividerBackgroundImage'
        options={{
          multiple: false
        }}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render divider background style
   * @returns {*}
   */
  getDividerBackgroundStyleRender () {
    let backgroundType = this.state.devices[ this.state.currentDevice ].dividerBackgroundType
    let deviceData = this.state.devices[ this.state.currentDevice ]

    if (deviceData.display || backgroundType !== 'image' || !deviceData.hasOwnProperty('dividerBackgroundImage')) {
      return null
    }
    let images = deviceData.dividerBackgroundImage
    let isArray = images.constructor === Array

    if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
      return null
    }

    let options = {
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
    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundStyle || DesignOptionsAdvanced.deviceDefaults.backgroundStyle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background style
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='dividerBackgroundStyle'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render divider background position control
   * @returns {*}
   */
  getDividerBackgroundPositionRender () {
    let deviceData = this.state.devices[ this.state.currentDevice ]
    let backgroundType = deviceData.dividerBackgroundType

    if ((backgroundType !== 'image' && backgroundType !== 'videoEmbed') || deviceData.display) {
      return null
    }

    if (backgroundType === 'image') {
      if (!deviceData.hasOwnProperty('dividerBackgroundImage')) {
        return null
      }
      let images = deviceData.dividerBackgroundImage
      let isArray = images.constructor === Array

      if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
        return null
      }
    }

    if (backgroundType === 'videoEmbed') {
      if (!deviceData.hasOwnProperty('dividerVideoEmbed') || !vcCake.env('CONTAINER_DIVIDER_EMBED_VIDEO')) {
        return null
      }
      let videos = deviceData.dividerVideoEmbed
      let isArray = videos.constructor === Array

      if ((isArray && videos.length === 0) || (!isArray && (!videos.urls || videos.urls.length === 0))) {
        return null
      }
    }

    let options = {
      values: [
        {
          label: 'Left Top',
          value: 'left-top',
          icon: 'vcv-ui-icon-attribute-background-position-left-top'
        },
        {
          label: 'Center Top',
          value: 'center-top',
          icon: 'vcv-ui-icon-attribute-background-position-center-top'
        },
        {
          label: 'Right Top',
          value: 'right-top',
          icon: 'vcv-ui-icon-attribute-background-position-right-top'
        },
        {
          label: 'Left Center',
          value: 'left-center',
          icon: 'vcv-ui-icon-attribute-background-position-left-center'
        },
        {
          label: 'Center Center',
          value: 'center-center',
          icon: 'vcv-ui-icon-attribute-background-position-center-center'
        },
        {
          label: 'Right Center',
          value: 'right-center',
          icon: 'vcv-ui-icon-attribute-background-position-right-center'
        },
        {
          label: 'Left Bottom',
          value: 'left-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-left-bottom'
        },
        {
          label: 'Center Bottom',
          value: 'center-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-center-bottom'
        },
        {
          label: 'Right Bottom',
          value: 'right-bottom',
          icon: 'vcv-ui-icon-attribute-background-position-right-bottom'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].dividerBackgroundPosition || DesignOptionsAdvanced.deviceDefaults.backgroundPosition
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background position
      </span>
      <ButtonGroup
        api={this.props.api}
        fieldKey='dividerBackgroundPosition'
        options={options}
        updater={this.valueChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render divider Self hosted video control
   * @returns {*}
   */
  getDividerEmbedVideoRender () {
    let deviceData = this.state.devices[ this.state.currentDevice ]
    let backgroundType = deviceData.dividerBackgroundType

    if (deviceData.display || backgroundType !== 'videoEmbed') {
      return null
    }

    let value = deviceData.dividerVideoEmbed || {}
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Divider background video
      </span>
      <AttachVideo
        api={this.props.api}
        fieldKey='dividerVideoEmbed'
        options={{
          multiple: false
        }}
        updater={this.valueChangeHandler}
        value={value} />
      <p className='vcv-ui-form-helper'>For better browser compatibility please use <b>mp4</b> video format</p>
    </div>
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
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getDividerShapeRender()}
            {this.getDividerFlipRender()}
            {this.getDividerHeightRender()}
            {this.getDividerWidthRender()}
            {this.getDividerBackgroundTypeRender()}
            {this.getDividerBackgroundColorRender()}
            {this.getDividerBackgroundGradientStartColorRender()}
            {this.getDividerBackgroundGradientEndColorRender()}
            {this.getDividerBackgroundGradientAngleRender()}
            {this.getDividerAttachImageRender()}
            {this.getDividerBackgroundStyleRender()}
            {this.getDividerEmbedVideoRender()}
            {this.getDividerBackgroundPositionRender()}
          </div>
        </div>
      </div>
    )
  }
}

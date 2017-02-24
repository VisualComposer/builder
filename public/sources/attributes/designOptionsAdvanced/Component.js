import React from 'react'
import lodash from 'lodash'
import Attribute from '../attribute'
import Devices from '../devices/Component'
import Toggle from '../toggle/Component'
import Dropdown from '../dropdown/Component'
import BoxModel from '../boxModel/Component'
import AttachImage from '../attachimage/Component'
import AttachVideo from '../attachvideo/Component'
import Color from '../color/Component'
import String from '../string/Component'
import Number from '../number/Component'
import Animate from '../animateDropdown/Component'

class DesignOptionsAdvanced extends Attribute {
  /**
   * Attribute Mixins
   */
  static attributeMixins = {
    boxModelMixin: {
      src: require('raw-loader!./cssMixins/boxModel.pcss'),
      variables: {
        device: {
          value: false
        },
        margin: {
          value: false
        },
        padding: {
          value: false
        },
        borderWidth: {
          value: false
        },
        borderRadius: {
          value: false
        },
        borderBottomLeftRadius: {
          value: false
        },
        borderBottomRightRadius: {
          value: false
        },
        borderBottomWidth: {
          value: false
        },
        borderLeftWidth: {
          value: false
        },
        borderRightWidth: {
          value: false
        },
        borderTopLeftRadius: {
          value: false
        },
        borderTopRightRadius: {
          value: false
        },
        borderTopWidth: {
          value: false
        },
        marginBottom: {
          value: false
        },
        marginLeft: {
          value: false
        },
        marginRight: {
          value: false
        },
        marginTop: {
          value: false
        },
        paddingBottom: {
          value: false
        },
        paddingLeft: {
          value: false
        },
        paddingRight: {
          value: false
        },
        paddingTop: {
          value: false
        },
        borderStyle: {
          value: false
        },
        borderTopStyle: {
          value: false
        },
        borderRightStyle: {
          value: false
        },
        borderBottomStyle: {
          value: false
        },
        borderLeftStyle: {
          value: false
        },
        borderColor: {
          value: false
        },
        borderTopColor: {
          value: false
        },
        borderRightColor: {
          value: false
        },
        borderBottomColor: {
          value: false
        },
        borderLeftColor: {
          value: false
        }
      }
    },
    visibilityMixin: {
      src: require('raw-loader!./cssMixins/visibility.pcss'),
      variables: {
        device: {
          value: `all`
        }
      }
    },
    backgroundColorMixin: {
      src: require('raw-loader!./cssMixins/backgroundColor.pcss'),
      variables: {
        device: {
          value: `all`
        },
        backgroundColor: {
          value: false
        }
      }
    },
    gradientMixin: {
      src: require('raw-loader!./cssMixins/gradientColor.pcss'),
      variables: {
        device: {
          value: `all`
        },
        startColor: {
          value: `rgba(0, 0, 0, 0)`
        },
        endColor: {
          value: `rgba(0, 0, 0, 0)`
        },
        angle: {
          value: 0
        }
      }
    }
  }

  /**
   * Default state values
   */
  static deviceDefaults = {
    backgroundType: 'imagesSimple',
    borderStyle: 'solid',
    backgroundStyle: 'cover',
    gradientAngle: 45,
    sliderEffect: 'slide'
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
    this.backgroundTypeChangeHandler = this.backgroundTypeChangeHandler.bind(this)
    this.boxModelChangeHandler = this.boxModelChangeHandler.bind(this)
    this.attachImageChangeHandler = this.attachImageChangeHandler.bind(this)
    this.backgroundStyleChangeHandler = this.backgroundStyleChangeHandler.bind(this)
    this.colorChangeHandler = this.colorChangeHandler.bind(this)
    this.sliderTimeoutChangeHandler = this.sliderTimeoutChangeHandler.bind(this)
    this.sliderEffectChangeHandler = this.sliderEffectChangeHandler.bind(this)
    this.gradientOverlayChangeHandler = this.gradientOverlayChangeHandler.bind(this)
    this.gradientAngleChangeHandler = this.gradientAngleChangeHandler.bind(this)
    this.animationChangeHandler = this.animationChangeHandler.bind(this)
    this.borderStyleChangeHandler = this.borderStyleChangeHandler.bind(this)
    this.youtubeVideoChangeHandler = this.youtubeVideoChangeHandler.bind(this)
    this.vimeoVideoChangeHandler = this.vimeoVideoChangeHandler.bind(this)
    this.embedVideoChangeHandler = this.embedVideoChangeHandler.bind(this)
    this.parallaxChangeHandler = this.parallaxChangeHandler.bind(this)
    this.parallaxSpeedChangeHandler = this.parallaxSpeedChangeHandler.bind(this)
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
  updateValue (newState) {
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
        if (!newState.devices[ device ].backgroundType) {
          newState.devices[ device ].backgroundType = DesignOptionsAdvanced.deviceDefaults.backgroundType
        }
        if (!newState.devices[ device ].borderStyle) {
          newState.devices[ device ].borderStyle = DesignOptionsAdvanced.deviceDefaults.borderStyle
        }
        if (!newState.devices[ device ].backgroundStyle) {
          newState.devices[ device ].backgroundStyle = DesignOptionsAdvanced.deviceDefaults.backgroundStyle
        }
        if (typeof newState.devices[ device ].gradientAngle === 'undefined') {
          newState.devices[ device ].gradientAngle = DesignOptionsAdvanced.deviceDefaults.gradientAngle
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
          // Image type backgrounds
          let imgTypeBackgrounds = [
            'imagesSimple',
            'imagesSlideshow'
          ]
          if (imgTypeBackgrounds.indexOf(newState.devices[ device ].backgroundType) === -1) {
            // not image type background selected
            delete newValue[ device ].images
            delete newValue[ device ].backgroundStyle
          } else if (!newValue[ device ].hasOwnProperty('images') || newValue[ device ].images.urls.length === 0) {
            // images are empty
            delete newValue[ device ].images
            delete newValue[ device ].backgroundType
            delete newValue[ device ].backgroundStyle
            delete newValue[ device ].sliderTimeout
            delete newValue[ device ].sliderEffect
          }

          // Embed video bg
          let embedVideoTypeBackgrounds = [
            'videoEmbed'
          ]
          if (embedVideoTypeBackgrounds.indexOf(newState.devices[ device ].backgroundType) === -1) {
            // not image type background selected
            delete newValue[ device ].videoEmbed
          } else if (!newValue[ device ].hasOwnProperty('videoEmbed') || newValue[ device ].videoEmbed.urls.length === 0) {
            // images are empty
            delete newValue[ device ].videoEmbed
            delete newValue[ device ].backgroundType
          }

          // slider timeout is empty
          if (newValue[ device ].sliderTimeout === '' || newValue[ device ].backgroundType !== 'imagesSlideshow') {
            delete newValue[ device ].sliderTimeout
          }
          if (newValue[ device ].sliderEffect === '' || newValue[ device ].backgroundType !== 'imagesSlideshow') {
            delete newValue[ device ].sliderEffect
          }

          // youtube video is empty
          if (newValue[ device ].backgroundType === 'videoYoutube') {
            if (!newValue[ device ].videoYoutube) {
              delete newValue[ device ].videoYoutube
              delete newValue[ device ].backgroundType
            }
          } else {
            delete newValue[ device ].videoYoutube
          }

          // vimeo video is empty
          if (newValue[ device ].backgroundType === 'videoVimeo') {
            if (!newValue[ device ].videoVimeo) {
              delete newValue[ device ].videoVimeo
              delete newValue[ device ].backgroundType
            }
          } else {
            delete newValue[ device ].videoVimeo
          }

          // gradient stat color is empty
          if (newValue[ device ].gradientStartColor === '') {
            delete newValue[ device ].gradientStartColor
          }

          // gradient end color is empty
          if (newValue[ device ].gradientEndColor === '') {
            delete newValue[ device ].gradientEndColor
          }

          // gradient angle is not set
          if (!newValue[ device ].gradientOverlay) {
            delete newValue[ device ].gradientAngle
            delete newValue[ device ].gradientEndColor
            delete newValue[ device ].gradientStartColor
            delete newValue[ device ].gradientOverlay
          } else if (!newValue[ device ].gradientStartColor && !newValue[ device ].gradientEndColor) {
            delete newValue[ device ].gradientOverlay
            delete newValue[ device ].gradientAngle
          }

          // background color is empty
          if (newValue[ device ].backgroundColor === '') {
            delete newValue[ device ].backgroundColor
          }

          let parallaxBackgrounds = [
            'imagesSimple',
            'imagesSlideshow',
            'videoYoutube',
            'videoVimeo',
            'videoEmbed'
          ]
          if (parallaxBackgrounds.indexOf(newState.devices[ device ].backgroundType) === -1 || newValue[ device ].parallax === '') {
            // not parallax background selected
            delete newValue[ device ].parallax
            delete newValue[ device ].parallaxSpeed
          }

          // animation is not set
          if (newValue[ device ].animation === '') {
            delete newValue[ device ].animation
          }

          // border is empty
          if (newValue[ device ].borderColor === '') {
            delete newValue[ device ].borderColor
          }
          if (newValue[ device ].borderStyle === '') {
            delete newValue[ device ].borderStyle
          }
          if (!newValue[ device ].boxModel || !(newValue[ device ].boxModel.borderBottomWidth || newValue[ device ].boxModel.borderLeftWidth || newValue[ device ].boxModel.borderRightWidth || newValue[ device ].boxModel.borderTopWidth || newValue[ device ].boxModel.borderWidth)) {
            delete newValue[ device ].borderStyle
            delete newValue[ device ].borderColor
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
          // boxModelMixin
          if (newValue[ device ].hasOwnProperty('boxModel')) {
            let value = newValue[ device ].boxModel
            if (!lodash.isEmpty(value)) {
              // update mixin
              let mixinName = `boxModelMixin:${device}`
              newMixins[ mixinName ] = {}
              newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.boxModelMixin)
              let syncData = {
                borderWidth: [ { key: 'borderStyle', value: 'borderStyle' }, { key: 'borderColor', value: 'borderColor' } ],
                borderTopWidth: [ { key: 'borderTopStyle', value: 'borderStyle' }, { key: 'borderTopColor', value: 'borderColor' } ],
                borderRightWidth: [ { key: 'borderRightStyle', value: 'borderStyle' }, { key: 'borderRightColor', value: 'borderColor' } ],
                borderBottomWidth: [ { key: 'borderBottomStyle', value: 'borderStyle' }, { key: 'borderBottomColor', value: 'borderColor' } ],
                borderLeftWidth: [ { key: 'borderLeftStyle', value: 'borderStyle' }, { key: 'borderLeftColor', value: 'borderColor' } ]
              }
              for (let property in value) {
                newMixins[ mixinName ].variables[ property ] = {
                  value: value[ property ]
                }
                if (syncData[ property ]) {
                  syncData[ property ].forEach((syncProp) => {
                    newMixins[ mixinName ].variables[ syncProp.key ] = {
                      value: newValue[ device ][ syncProp.value ] || false
                    }
                  })
                }
              }
              // devices
              newMixins[ mixinName ].variables.device = {
                value: device
              }
            }
          }
          // backgroundMixin
          if (newValue[ device ] && newValue[ device ].backgroundColor) {
            let mixinName = `backgroundColorMixin:${device}`
            newMixins[ mixinName ] = {}
            newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.backgroundColorMixin)
            newMixins[ mixinName ].variables.backgroundColor = {
              value: newValue[ device ].backgroundColor
            }
            newMixins[ mixinName ].variables.device = {
              value: device
            }
          }
          // gradientMixin
          if (newValue[ device ] && newValue[ device ].gradientOverlay) {
            let mixinName = `gradientMixin:${device}`
            newMixins[ mixinName ] = {}
            newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.gradientMixin)
            if (newValue[ device ].gradientStartColor) {
              newMixins[ mixinName ].variables.startColor = {
                value: newValue[ device ].gradientStartColor
              }
            }
            if (newValue[ device ].gradientEndColor) {
              newMixins[ mixinName ].variables.endColor = {
                value: newValue[ device ].gradientEndColor
              }
            }
            newMixins[ mixinName ].variables.angle = {
              value: newValue[ device ].gradientAngle || 0
            }
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

    this.setFieldValue(newValue, newMixins)
    this.setState(newState)
  }

  /**
   * Flush field value to updater
   * @param value
   */
  setFieldValue (value, mixins) {
    let { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value,
      attributeMixins: mixins
    })
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
    let newState = lodash.defaultsDeep({}, this.state)
    if (isVisible) {
      delete newState.devices[ this.state.currentDevice ].display
    } else {
      // set display to none
      newState.devices[ this.state.currentDevice ].display = 'none'
    }

    this.updateValue(newState)
  }

  /**
   * Render background type dropdown
   * @returns {*}
   */
  getBackgroundTypeRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let options = {
      values: [
        {
          label: 'Simple images',
          value: 'imagesSimple'
        },
        {
          label: 'Image slideshow',
          value: 'imagesSlideshow'
        },
        {
          label: 'Youtube video',
          value: 'videoYoutube'
        },
        {
          label: 'Vimeo video',
          value: 'videoVimeo'
        },
        {
          label: 'Self-hosted video',
          value: 'videoEmbed'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].backgroundType || DesignOptionsAdvanced.deviceDefaults.backgroundType
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background type
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='backgroundType'
        options={options}
        updater={this.backgroundTypeChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle background type change
   * @param fieldKey
   * @param value
   */
  backgroundTypeChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ].backgroundType = value
    this.updateValue(newState)
  }

  /**
   * Render box model
   * @returns {*}
   */
  getBoxModelRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].boxModel || {}

    let defaultStyles = this.getDefaultStyles()
    return <div className='vcv-ui-form-group'>
      <BoxModel
        api={this.props.api}
        fieldKey='boxModel'
        updater={this.boxModelChangeHandler}
        placeholder={defaultStyles}
        value={value} />
    </div>
  }

  /**
   * Get default element styles
   * @returns {{margin: {}, padding: {}, border: {}}}
   */
  getDefaultStyles () {
    let mainDefaultStyles = {
      margin: {},
      padding: {},
      border: {}
    }
    let doAttribute = 'data-vce-do-apply'
    let frame = document.querySelector('#vcv-editor-iframe')
    let frameDocument = frame.contentDocument || frame.contentWindow.document
    let elementIdSelector = `el-${this.props.element.data.id}`
    let element = frameDocument.querySelector(`#${elementIdSelector}`)
    let styles = [ 'border', 'padding', 'margin' ]

    if (element) {
      let dolly = element.cloneNode(true)
      dolly.id = ''
      dolly.height = '0'
      dolly.width = '0'
      dolly.overflow = 'hidden'
      dolly.position = 'fixed'
      dolly.bottom = '0'
      dolly.right = '0'
      element.parentNode.appendChild(dolly)

      let elementDOAttribute = element.getAttribute(doAttribute)

      if (elementDOAttribute) {
        let allDefaultStyles = this.getElementStyles(dolly)

        if (elementDOAttribute.indexOf('all') >= 0) {
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            if (elementDOAttribute.indexOf(style) >= 0) {
              mainDefaultStyles[ style ] = allDefaultStyles
            } else {
              let innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
              mainDefaultStyles[ style ] = this.getElementStyles(dolly, innerSelector)
            }
          })
        }
      } else {
        let allStyleElement = dolly.querySelector(`[${doAttribute}*='all'][${doAttribute}*='${elementIdSelector}']`)

        if (allStyleElement) {
          let allDefaultStyles = this.getElementStyles(allStyleElement)
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            let innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
            mainDefaultStyles[ style ] = this.getElementStyles(dolly, innerSelector)
          })
        }
      }

      dolly.remove()
    }

    let parsedStyles = {}
    for (let style in mainDefaultStyles) {
      let styleObject = mainDefaultStyles.all || mainDefaultStyles[ style ]
      for (let computedStyle in styleObject) {
        if (computedStyle.indexOf(style) >= 0) {
          parsedStyles[ computedStyle ] = styleObject[ computedStyle ]
        }
      }
    }
    return parsedStyles
  }

  /**
   * Gets additional style (margin, padding, border) element styles
   * @param clonedElement
   * @param innerSelector
   * @returns {{}}
   */
  getElementStyles (clonedElement, innerSelector) {
    let styles = {}
    if (clonedElement) {
      let defaultStyles = ''
      if (innerSelector) {
        defaultStyles = Object.assign({}, window.getComputedStyle(clonedElement.querySelector(innerSelector)))
      } else {
        defaultStyles = Object.assign({}, window.getComputedStyle(clonedElement))
      }

      for (let style in BoxModel.defaultState) {
        if (defaultStyles && defaultStyles[ style ] &&
          defaultStyles[ style ] !== '0px' &&
          defaultStyles[ style ].split(' ').length === 1) {
          styles[ style ] = defaultStyles[ style ]
        }
      }
    }
    return styles
  }

  /**
   * Handle box model change
   * @param fieldKey
   * @param value
   */
  boxModelChangeHandler (fieldKey, value) {
    let currentValue = this.state.devices[ this.state.currentDevice ].boxModel || {}

    if (!lodash.isEqual(currentValue, value)) {
      let newState = lodash.defaultsDeep({}, this.state)
      // update value
      if (lodash.isEmpty(value)) {
        delete newState.devices[ newState.currentDevice ].boxModel
      } else {
        newState.devices[ newState.currentDevice ].boxModel = value
      }
      this.updateValue(newState)
    }
  }

  /**
   * Render attach image
   * @returns {*}
   */
  getAttachImageRender () {
    let allowedBackgroundTypes = [
      'imagesSimple',
      'imagesSlideshow'
    ]
    let backgroundTypeToSearch = this.state.devices[ this.state.currentDevice ].backgroundType
    if (!backgroundTypeToSearch) {
      backgroundTypeToSearch = this.state.backgroundType
    }
    if (this.state.devices[ this.state.currentDevice ].display ||
      allowedBackgroundTypes.indexOf(backgroundTypeToSearch) === -1) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].images || {}

    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Images
      </span>
      <AttachImage
        api={this.props.api}
        fieldKey='attachImage'
        options={{
          multiple: true
        }}
        updater={this.attachImageChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle attach image change
   * @param fieldKey
   * @param value
   */
  attachImageChangeHandler (fieldKey, value) {
    if (value.hasOwnProperty(value.draggingIndex)) {
      delete value.draggingIndex
    }
    let newState = lodash.defaultsDeep({}, this.state)
    // update value
    if (lodash.isEmpty(value)) {
      delete newState.devices[ newState.currentDevice ].images
    } else {
      newState.devices[ newState.currentDevice ].images = value
    }
    this.updateValue(newState)
  }

  /**
   * Render background style
   * @returns {*}
   */
  getBackgroundStyleRender () {
    let allowedBackgroundTypes = [
      'imagesSimple',
      'imagesSlideshow'
    ]

    if (this.state.devices[ this.state.currentDevice ].display ||
      allowedBackgroundTypes.indexOf(this.state.devices[ this.state.currentDevice ].backgroundType) === -1 || !this.state.devices[ this.state.currentDevice ].hasOwnProperty('images') ||
      this.state.devices[ this.state.currentDevice ].images.urls.length === 0) {
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
    let value = this.state.devices[ this.state.currentDevice ].backgroundStyle || DesignOptionsAdvanced.deviceDefaults.backgroundStyle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background style
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='backgroundStyle'
        options={options}
        updater={this.backgroundStyleChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle background style change
   * @param fieldKey
   * @param value
   */
  backgroundStyleChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ].backgroundStyle = value
    this.updateValue(newState)
  }

  /**
   * Render color picker for background color
   * @returns {*}
   */
  getBackgroundColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].backgroundColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background color
      </span>
      <Color
        api={this.props.api}
        fieldKey='backgroundColor'
        updater={this.colorChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Render gradient overlay toggle
   * @returns {XML}
   */
  getGradientOverlayRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].gradientOverlay || false
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey='gradientOverlay'
          updater={this.gradientOverlayChangeHandler}
          options={{ labelText: `Use gradient overlay` }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Handle colors change
   * @param fieldKey
   * @param value
   */
  gradientOverlayChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Render color picker for gradient start color
   * @returns {*}
   */
  getGradientStartColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].gradientOverlay) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].gradientStartColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Start color
      </span>
      <Color
        api={this.props.api}
        fieldKey='gradientStartColor'
        updater={this.colorChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Render color picker for gradient end color
   * @returns {*}
   */
  getGradientEndColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].gradientOverlay) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].gradientEndColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        End color
      </span>
      <Color
        api={this.props.api}
        fieldKey='gradientEndColor'
        updater={this.colorChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Render border style dropdown
   * @returns {*}
   */
  getBorderStyleRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let device = this.state.devices[ this.state.currentDevice ]
    if (!device.boxModel || !(device.boxModel.borderBottomWidth || device.boxModel.borderLeftWidth || device.boxModel.borderRightWidth || device.boxModel.borderTopWidth || device.boxModel.borderWidth)) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Solid',
          value: 'solid'
        },
        {
          label: 'Dotted',
          value: 'dotted'
        },
        {
          label: 'Dashed',
          value: 'dashed'
        },
        {
          label: 'None',
          value: 'none'
        },
        {
          label: 'Hidden',
          value: 'hidden'
        },
        {
          label: 'Double',
          value: 'double'
        },
        {
          label: 'Groove',
          value: 'groove'
        },
        {
          label: 'Ridge',
          value: 'ridge'
        },
        {
          label: 'Inset',
          value: 'inset'
        },
        {
          label: 'Outset',
          value: 'outset'
        },
        {
          label: 'Initial',
          value: 'initial'
        },
        {
          label: 'Inherit',
          value: 'inherit'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].borderStyle || DesignOptionsAdvanced.deviceDefaults.borderStyle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Border style
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='borderStyle'
        options={options}
        updater={this.borderStyleChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle border style change
   * @param fieldKey
   * @param value
   */
  borderStyleChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Render border color control
   * @returns {*}
   */
  getBorderColorRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let device = this.state.devices[ this.state.currentDevice ]
    if (!device.boxModel || !(device.boxModel.borderBottomWidth || device.boxModel.borderLeftWidth || device.boxModel.borderRightWidth || device.boxModel.borderTopWidth || device.boxModel.borderWidth)) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].borderColor || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Border color
      </span>
      <Color
        api={this.props.api}
        fieldKey='borderColor'
        updater={this.colorChangeHandler}
        value={value}
        defaultValue='' />
    </div>
  }

  /**
   * Handle colors change
   * @param fieldKey
   * @param value
   */
  colorChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Render slider timeout field
   * @returns {*}
   */
  getSliderTimeoutRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `imagesSlideshow`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].sliderTimeout || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Animation timeout (in seconds)
      </span>
      <Number
        api={this.props.api}
        fieldKey='sliderTimeout'
        updater={this.sliderTimeoutChangeHandler}
        placeholder='5'
        options={{
          min: 1,
          max: false
        }}
        value={value}
      />
    </div>
  }

  /**
   * Render slider effect type field
   * @returns {*}
   */
  getSliderEffectRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `imagesSlideshow`) {
      return null
    }

    let options = {
      values: [
        {
          label: 'Slide',
          value: 'slide'
        },
        {
          label: 'Fade',
          value: 'fade'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].sliderEffect || DesignOptionsAdvanced.deviceDefaults.sliderEffect
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Slideshow effect
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='sliderEffect'
        options={options}
        updater={this.sliderEffectChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle slider effect type change
   * @param fieldKey
   * @param value
   */
  sliderEffectChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Handle slider timeout change
   * @param fieldKey
   * @param value
   */
  sliderTimeoutChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = parseInt(value)
    this.updateValue(newState)
  }

  /**
   * Render gradient angle control
   * @returns {*}
   */
  getGradientAngleRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].gradientOverlay) {
      return null
    }
    let options = {
      values: [
        {
          label: '0',
          value: '0'
        },
        {
          label: '30',
          value: '30'
        },
        {
          label: '45',
          value: '45'
        },
        {
          label: '60',
          value: '60'
        },
        {
          label: '90',
          value: '90'
        },
        {
          label: '120',
          value: '120'
        },
        {
          label: '135',
          value: '135'
        },
        {
          label: '150',
          value: '150'
        },
        {
          label: '180',
          value: '180'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].gradientAngle || DesignOptionsAdvanced.deviceDefaults.gradientAngle
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Gradient angle
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='gradientAngle'
        options={options}
        updater={this.gradientAngleChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle change of gradient angle control
   * @param fieldKey
   * @param value
   */
  gradientAngleChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Render animation control
   * @returns {*}
   */
  getAnimationRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].animation || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Animate
      </span>
      <Animate
        api={this.props.api}
        fieldKey='animation'
        updater={this.animationChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Handle change of animation control
   * @param fieldKey
   * @param value
   */
  animationChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Render Youtube video control
   * @returns {*}
   */
  getYoutubeVideoRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `videoYoutube`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].videoYoutube || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        YouTube video link
      </span>
      <String
        api={this.props.api}
        fieldKey='videoYoutube'
        updater={this.youtubeVideoChangeHandler}
        value={value}
      />
    </div>
  }

  /**
   * Handle change of youtube video control
   * @param fieldKey
   * @param value
   */
  youtubeVideoChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Render Vimeo video control
   * @returns {*}
   */
  getVimeoVideoRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `videoVimeo`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].videoVimeo || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Vimeo video link
      </span>
      <String
        api={this.props.api}
        fieldKey='videoVimeo'
        updater={this.vimeoVideoChangeHandler}
        value={value}
      />
    </div>
  }

  /**
   * Handle change of vimeo video control
   * @param fieldKey
   * @param value
   */
  vimeoVideoChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Render parallax control
   * @returns {*}
   */
  getParallaxRender () {
    let allowedBackgroundTypes = [
      'imagesSimple',
      'imagesSlideshow',
      'videoYoutube',
      'videoVimeo',
      'videoEmbed'
    ]

    if (this.state.devices[ this.state.currentDevice ].display ||
      allowedBackgroundTypes.indexOf(this.state.devices[ this.state.currentDevice ].backgroundType) === -1) {
      return null
    }

    let options = {
      values: [
        {
          label: 'None',
          value: ''
        },
        {
          label: 'Simple',
          value: 'simple'
        },
        {
          label: 'Simple with fade',
          value: 'simple-fade'
        }
      ]
    }
    let value = this.state.devices[ this.state.currentDevice ].parallax || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Parallax effect
      </span>
      <Dropdown
        api={this.props.api}
        fieldKey='parallax'
        options={options}
        updater={this.parallaxChangeHandler}
        value={value} />
    </div>
  }

  /**
   * Render parallax speed field
   * @returns {*}
   */
  getParallaxSpeedRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].parallax) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].parallaxSpeed || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Parallax effect speed
      </span>
      <Number
        api={this.props.api}
        fieldKey='parallaxSpeed'
        updater={this.parallaxSpeedChangeHandler}
        placeholder='30'
        options={{
          min: 1,
          max: false
        }}
        value={value}
      />
    </div>
  }

  /**
   * Handle parallax speed change
   * @param fieldKey
   * @param value
   */
  parallaxSpeedChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = parseInt(value)
    this.updateValue(newState)
  }

  /**
   * Render Self hosted video control
   * @returns {*}
   */
  getEmbedVideoRender () {
    if (this.state.devices[ this.state.currentDevice ].display ||
      this.state.devices[ this.state.currentDevice ].backgroundType !== `videoEmbed`) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].videoEmbed || {}
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Video
      </span>
      <AttachVideo
        api={this.props.api}
        fieldKey='videoEmbed'
        options={{
          multiple: false
        }}
        updater={this.embedVideoChangeHandler}
        value={value} />
      <p className='vcv-ui-form-helper'>For better browser compatibility please use <b>mp4</b> video format</p>
    </div>
  }

  /**
   * Handle change of self hosted video control
   * @param fieldKey
   * @param value
   */
  embedVideoChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
  }

  /**
   * Handle change of parallax control
   * @param fieldKey
   * @param value
   */
  parallaxChangeHandler (fieldKey, value) {
    let newState = lodash.defaultsDeep({}, this.state)
    newState.devices[ newState.currentDevice ][ fieldKey ] = value
    this.updateValue(newState)
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
            {this.getBoxModelRender()}
          </div>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getBorderStyleRender()}
            {this.getBorderColorRender()}
            {this.getBackgroundTypeRender()}
            {this.getAttachImageRender()}
            {this.getSliderEffectRender()}
            {this.getSliderTimeoutRender()}
            {this.getYoutubeVideoRender()}
            {this.getVimeoVideoRender()}
            {this.getEmbedVideoRender()}
            {this.getBackgroundStyleRender()}
            {this.getBackgroundColorRender()}
            {this.getGradientOverlayRender()}
            {this.getGradientStartColorRender()}
            {this.getGradientEndColorRender()}
            {this.getGradientAngleRender()}
            {this.getParallaxRender()}
            {this.getParallaxSpeedRender()}
            {this.getAnimationRender()}
          </div>
        </div>
      </div>
    )
  }
}

export default DesignOptionsAdvanced

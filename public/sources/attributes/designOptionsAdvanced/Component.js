/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import lodash from 'lodash'
import { getStorage, getService } from 'vc-cake'
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
import ButtonGroup from '../buttonGroup/Component'
import Range from '../range/Component'
import Tooltip from '../../../components/tooltip/tooltip'

const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const documentService = getService('document')
const { getBlockRegexp } = getService('utils')
const blockRegexp = getBlockRegexp()
const { getDynamicValue, getDefaultDynamicFieldKey } = getService('cook').dynamicFields

export default class DesignOptionsAdvanced extends Attribute {
  static localizations = dataManager.get('localizations')

  static defaultProps = {
    fieldType: 'designOptionsAdvanced'
  }

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
          value: 'all'
        }
      }
    },
    backgroundColorMixin: {
      src: require('raw-loader!./cssMixins/backgroundColor.pcss'),
      variables: {
        device: {
          value: 'all'
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
          value: 'all'
        },
        startColor: {
          value: 'rgba(0, 0, 0, 0)'
        },
        endColor: {
          value: 'rgba(0, 0, 0, 0)'
        },
        angle: {
          value: 0
        }
      }
    },
    radialGradientMixin: {
      src: require('raw-loader!./cssMixins/radialGradientColor.pcss'),
      variables: {
        device: {
          value: 'all'
        },
        startColor: {
          value: 'rgba(0, 0, 0, 0)'
        },
        endColor: {
          value: 'rgba(0, 0, 0, 0)'
        }
      }
    },
    dividerMixin: {
      src: require('raw-loader!./cssMixins/divider.pcss'),
      variables: {
        device: {
          value: 'all'
        }
      }
    },
    animationDelayMixin: {
      src: require('raw-loader!./cssMixins/animationDelay.pcss'),
      variables: {
        device: {
          value: 'all'
        },
        animationDelay: {
          value: false
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
    backgroundPosition: 'center-top',
    backgroundZoom: 50,
    backgroundZoomSpeed: 30,
    backgroundZoomReverse: false,
    gradientAngle: 45,
    sliderEffect: 'slide',
    dividerFlipHorizontal: 'horizontally-left',
    dividerFlipVertical: 'vertically-down',
    dividerPosition: 'top',
    dividerBackgroundType: 'color',
    dividerShape: { icon: 'vcv-ui-icon-dividers vcv-ui-icon-dividers-zigzag', iconSet: 'all' },
    dividerShapeNew: { icon: 'vcv-ui-icon-divider vcv-ui-icon-divider-zigzag', iconSet: 'all' },
    gradientStartColor: 'rgba(226, 135, 135, 0.5)',
    gradientEndColor: 'rgba(93, 55, 216, 0.5)',
    dividerBackgroundColor: '#6567df',
    dividerBackgroundGradientStartColor: 'rgb(226, 135, 135)',
    dividerBackgroundGradientEndColor: 'rgb(93, 55, 216)',
    dividerBackgroundGradientAngle: 0
  }

  static defaultState = {
    currentDevice: 'all',
    devices: {},
    attributeMixins: {},
    defaultStyles: null,
    lazyLoad: true
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.deviceVisibilityChangeHandler = this.deviceVisibilityChangeHandler.bind(this)
    this.handleElementVisibilityChange = this.handleElementVisibilityChange.bind(this)
    this.boxModelChangeHandler = this.boxModelChangeHandler.bind(this)
    this.attachImageChangeHandler = this.attachImageChangeHandler.bind(this)
    this.sliderTimeoutChangeHandler = this.sliderTimeoutChangeHandler.bind(this)
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
    this.handleElementChange = this.handleElementChange.bind(this)
    this.backgroundLazyLoadHandler = this.backgroundLazyLoadHandler.bind(this)
  }

  componentDidMount () {
    window.setTimeout(() => {
      this.getDefaultStyles()
    }, 200)
    this.setDefaultState()
    const id = this.props.elementAccessPoint.id
    elementsStorage.on(`element:${id}`, this.handleElementChange)
  }

  componentWillUnmount () {
    const id = this.props.elementAccessPoint.id
    elementsStorage.off(`element:${id}`, this.handleElementChange)
  }

  handleElementChange (data, source, options) {
    if (!options || options.action !== 'hide') {
      setTimeout(() => {
        this.getDefaultStyles()
      }, 200)
    } else {
      this.forceUpdate()
    }
  }

  /**
   * Set component's default state for lazy load option
   */
  setDefaultState () {
    const { devices } = this.state
    const newState = lodash.defaultsDeep({}, this.state)
    const isLazyLoadSet = {
      isValueExists: false,
      value: null,
      isImageSet: false
    }
    Object.keys(devices).forEach((device) => {
      if (Object.prototype.hasOwnProperty.call(devices[device], 'lazyLoad') && Object.prototype.hasOwnProperty.call(devices[device], 'images')) {
        isLazyLoadSet.isValueExists = true
        isLazyLoadSet.value = devices[device].lazyLoad
        isLazyLoadSet.isImageSet = true
      }
    })

    if (!isLazyLoadSet.isValueExists && isLazyLoadSet.isImageSet) {
      Object.keys(devices).forEach((device) => {
        newState.devices[device].lazyLoad = DesignOptionsAdvanced.defaultState.lazyLoad
      })
      this.updateValue(newState, 'lazyLoad')
    }
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
    const newState = lodash.defaultsDeep({}, DesignOptionsAdvanced.defaultState)
    // get devices data
    const devices = this.getCustomDevicesKeys()
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[device] = lodash.defaultsDeep({}, DesignOptionsAdvanced.deviceDefaults)
      if (value.device && value.device[device]) {
        newState.devices[device] = lodash.defaultsDeep({}, value.device[device], newState.devices[device])
      }
    })

    return newState
  }

  static addPixelToNumber (number) {
    return /^\d+$/.test(number) ? `${number}px` : number
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
        if (!newState.devices[device].backgroundType) {
          newState.devices[device].backgroundType = DesignOptionsAdvanced.deviceDefaults.backgroundType
        }
        if (!newState.devices[device].borderStyle) {
          newState.devices[device].borderStyle = DesignOptionsAdvanced.deviceDefaults.borderStyle
        }
        if (!newState.devices[device].backgroundStyle) {
          newState.devices[device].backgroundStyle = DesignOptionsAdvanced.deviceDefaults.backgroundStyle
        }
        if (!newState.devices[device].backgroundPosition) {
          newState.devices[device].backgroundPosition = DesignOptionsAdvanced.deviceDefaults.backgroundPosition
        }
        if (typeof newState.devices[device].gradientAngle === 'undefined') {
          newState.devices[device].gradientAngle = DesignOptionsAdvanced.deviceDefaults.gradientAngle
        }
        if (!newState.devices[device].dividerBackgroundStyle) {
          newState.devices[device].dividerBackgroundStyle = DesignOptionsAdvanced.deviceDefaults.backgroundStyle
        }
        if (!newState.devices[device].dividerBackgroundPosition) {
          newState.devices[device].dividerBackgroundPosition = DesignOptionsAdvanced.deviceDefaults.backgroundPosition
        }

        // values
        newValue[device] = lodash.defaultsDeep({}, newState.devices[device])
        // remove all values if display is provided
        if (Object.prototype.hasOwnProperty.call(newValue[device], 'display')) {
          Object.keys(newValue[device]).forEach((style) => {
            if (style !== 'display') {
              delete newValue[device][style]
            }
          })
        } else {
          // Image type backgrounds
          const imgTypeBackgrounds = [
            'imagesSimple',
            'backgroundZoom',
            'imagesSlideshow'
          ]
          if (imgTypeBackgrounds.indexOf(newState.devices[device].backgroundType) === -1) {
            // not image type background selected
            delete newValue[device].images
            delete newValue[device].backgroundStyle
            delete newValue[device].backgroundPosition
            delete newValue[device].backgroundZoom
            delete newValue[device].backgroundZoomSpeed
            delete newValue[device].backgroundZoomReverse
          } else if (!Object.prototype.hasOwnProperty.call(newValue[device], 'images')) {
            // images are empty
            delete newValue[device].images
            delete newValue[device].backgroundType
            delete newValue[device].backgroundStyle
            delete newValue[device].sliderTimeout
            delete newValue[device].sliderDirection
            delete newValue[device].sliderEffect
            delete newValue[device].backgroundPosition
            delete newValue[device].backgroundZoom
            delete newValue[device].backgroundZoomSpeed
            delete newValue[device].backgroundZoomReverse
          } else {
            const images = newValue[device].images
            const isArray = images ? images.constructor === Array : false
            const imageValue = images && images.urls && images.urls[0] ? images.urls[0].full : false
            const isDynamic = imageValue && typeof imageValue === 'string' && imageValue.match(blockRegexp)

            if (!isDynamic && ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0)))) {
              delete newValue[device].images
              delete newValue[device].backgroundType
              delete newValue[device].backgroundStyle
              delete newValue[device].sliderTimeout
              delete newValue[device].sliderDirection
              delete newValue[device].sliderEffect
              delete newValue[device].backgroundPosition
              delete newValue[device].backgroundZoom
              delete newValue[device].backgroundZoomSpeed
              delete newValue[device].backgroundZoomReverse
            }
          }

          if (newValue[device].images) {
            if (newValue[device].lazyLoad === undefined) {
              newValue[device].lazyLoad = true
            }
          } else {
            if (newValue[device].lazyLoad !== undefined) {
              delete newValue[device].lazyLoad
            }
          }

          // Embed video bg
          const embedVideoTypeBackgrounds = [
            'videoEmbed'
          ]

          if (embedVideoTypeBackgrounds.indexOf(newState.devices[device].backgroundType) === -1) {
            // not image type background selected
            delete newValue[device].videoEmbed
          } else {
            if (Object.prototype.hasOwnProperty.call(newValue[device], 'videoEmbed')) {
              const videos = newValue[device].videoEmbed
              const isArray = videos.constructor === Array
              if ((isArray && videos.length === 0) || (!isArray && (!videos.urls || videos.urls.length === 0))) {
                delete newValue[device].videoEmbed
                delete newValue[device].backgroundType
              }
            } else {
              delete newValue[device].videoEmbed
              delete newValue[device].backgroundType
            }
          }

          // slider timeout is empty
          if (newValue[device].sliderTimeout === '' || newValue[device].backgroundType !== 'imagesSlideshow') {
            delete newValue[device].sliderTimeout
          }
          if (newValue[device].sliderEffect === '' || newValue[device].backgroundType !== 'imagesSlideshow') {
            delete newValue[device].sliderEffect
          }
          if (newValue[device].sliderDirection === '' || newValue[device].backgroundType !== 'imagesSlideshow' || newValue[device].sliderEffect !== 'carousel') {
            delete newValue[device].sliderDirection
          }

          // youtube video is empty
          if (newValue[device].backgroundType === 'videoYoutube') {
            if (!newValue[device].videoYoutube) {
              delete newValue[device].videoYoutube
              delete newValue[device].backgroundType
            }
          } else {
            delete newValue[device].videoYoutube
          }

          // vimeo video is empty
          if (newValue[device].backgroundType === 'videoVimeo') {
            if (!newValue[device].videoVimeo) {
              delete newValue[device].videoVimeo
              delete newValue[device].backgroundType
            }
          } else {
            delete newValue[device].videoVimeo
          }

          // gradient stat color is empty
          if (newValue[device].gradientStartColor === '') {
            delete newValue[device].gradientStartColor
          }

          // gradient end color is empty
          if (newValue[device].gradientEndColor === '') {
            delete newValue[device].gradientEndColor
          }

          // gradient angle is not set
          if (!newValue[device].gradientOverlay && !newValue[device].gradientType === 'linear') {
            delete newValue[device].gradientAngle
            delete newValue[device].gradientEndColor
            delete newValue[device].gradientStartColor
            delete newValue[device].gradientOverlay
          } else if (!newValue[device].gradientStartColor && !newValue[device].gradientEndColor) {
            delete newValue[device].gradientOverlay
            delete newValue[device].gradientAngle
          }

          // background color is empty
          if (newValue[device].backgroundColor === '') {
            delete newValue[device].backgroundColor
          }

          // animation is not set
          if (newValue[device].animation === '') {
            delete newValue[device].animation
            delete newValue[device].animationDelay
          }
          if (newValue[device].animationDelay === '') {
            delete newValue[device].animationDelay
          }

          // border is empty
          if (newValue[device].borderColor === '') {
            delete newValue[device].borderColor
          }
          if (newValue[device].borderStyle === '') {
            delete newValue[device].borderStyle
          }
          if (!newValue[device].boxModel || !(newValue[device].boxModel.borderBottomWidth || newValue[device].boxModel.borderLeftWidth || newValue[device].boxModel.borderRightWidth || newValue[device].boxModel.borderTopWidth || newValue[device].boxModel.borderWidth)) {
            delete newValue[device].borderStyle
            delete newValue[device].borderColor
          }

          if (newState.devices[device].dividerBackgroundType !== 'image' && newState.devices[device].dividerBackgroundType !== 'videoEmbed') {
            delete newValue[device].dividerBackgroundImage
            delete newValue[device].dividerBackgroundStyle
            delete newValue[device].dividerBackgroundPosition
            delete newValue[device].dividerVideoEmbed
          }

          if (newState.devices[device].dividerBackgroundType === 'image') {
            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerBackgroundImage')) {
              const dividerImages = newValue[device].dividerBackgroundImage
              const isArray = dividerImages.constructor === Array
              if ((isArray && dividerImages.length === 0) || (!isArray && (!dividerImages.urls || dividerImages.urls.length === 0))) {
                delete newValue[device].dividerBackgroundStyle
                delete newValue[device].dividerBackgroundPosition
                delete newValue[device].dividerVideoEmbed
              }
            } else {
              delete newValue[device].dividerBackgroundStyle
              delete newValue[device].dividerBackgroundPosition
              delete newValue[device].dividerVideoEmbed
            }
          }

          if (newState.devices[device].dividerBackgroundType === 'videoEmbed') {
            delete newValue[device].dividerBackgroundStyle

            if (Object.prototype.hasOwnProperty.call(newValue[device], 'dividerVideoEmbed')) {
              const dividerVideos = newValue[device].dividerVideoEmbed
              const isArray = dividerVideos.constructor === Array

              if ((isArray && dividerVideos.length === 0) || (!isArray && (!dividerVideos.urls || dividerVideos.urls.length === 0))) {
                delete newValue[device].dividerBackgroundPosition
                delete newValue[device].dividerBackgroundImage
              }
            } else {
              delete newValue[device].dividerBackgroundPosition
              delete newValue[device].dividerBackgroundImage
            }
          }
        }
        device = DesignOptionsAdvanced.getMixins(newValue, device, newMixins)

        // remove device from list if it's empty
        if (!Object.keys(newValue[device]).length) {
          delete newValue[device]
        }
      }
    })

    this.setFieldValue(newValue, newMixins, fieldKey)
    this.setState(newState)
  }

  static getAnimationDelayMixin (newValue, device, newMixins) {
    if (Object.prototype.hasOwnProperty.call(newValue[device], 'animationDelay')) {
      const value = newValue[device].animationDelay
      if (!lodash.isEmpty(value)) {
        // update mixin
        const mixinName = `animationDelayMixin:${device}`
        newMixins[mixinName] = {}
        newMixins[mixinName] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.animationDelayMixin)

        newMixins[mixinName].variables.animationDelay = {
          value: value
        }

        const selector = `vce-o-animate-delay--${value}`
        newMixins[mixinName].variables.selector = {
          value: device === 'all' ? selector : selector + `-${device}`
        }

        // devices
        newMixins[mixinName].variables.device = {
          value: device
        }
      }
    }
  }

  static getMixins (newValue, device, newMixins) {
    // mixins
    if (Object.prototype.hasOwnProperty.call(newValue[device], 'display')) {
      newMixins[`visibilityMixin:${device}`] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.visibilityMixin)
      newMixins[`visibilityMixin:${device}`].variables = {
        device: {
          value: device
        }
      }
    } else {
      // boxModelMixin
      if (Object.prototype.hasOwnProperty.call(newValue[device], 'boxModel')) {
        const value = newValue[device].boxModel
        if (!lodash.isEmpty(value)) {
          // update mixin
          const mixinName = `boxModelMixin:${device}`
          newMixins[mixinName] = {}
          newMixins[mixinName] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.boxModelMixin)
          const syncData = {
            borderWidth: [{ key: 'borderStyle', value: 'borderStyle' }, { key: 'borderColor', value: 'borderColor' }],
            borderTopWidth: [{ key: 'borderTopStyle', value: 'borderStyle' }, { key: 'borderTopColor', value: 'borderColor' }],
            borderRightWidth: [{ key: 'borderRightStyle', value: 'borderStyle' }, { key: 'borderRightColor', value: 'borderColor' }],
            borderBottomWidth: [{ key: 'borderBottomStyle', value: 'borderStyle' }, { key: 'borderBottomColor', value: 'borderColor' }],
            borderLeftWidth: [{ key: 'borderLeftStyle', value: 'borderStyle' }, { key: 'borderLeftColor', value: 'borderColor' }]
          }
          for (const property in value) {
            newMixins[mixinName].variables[property] = {
              value: this.addPixelToNumber(value[property])
            }
            if (syncData[property]) {
              syncData[property].forEach((syncProp) => {
                const propVal = newValue[device][syncProp.value] || false
                newMixins[mixinName].variables[syncProp.key] = {
                  value: DesignOptionsAdvanced.addPixelToNumber(propVal)
                }
              })
            }
          }
          // devices
          newMixins[mixinName].variables.device = {
            value: device
          }
        }
      }
      // backgroundMixin
      if (newValue[device] && newValue[device].backgroundColor) {
        const mixinName = `backgroundColorMixin:${device}`
        newMixins[mixinName] = {}
        newMixins[mixinName] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.backgroundColorMixin)
        newMixins[mixinName].variables.backgroundColor = {
          value: newValue[device].backgroundColor
        }
        newMixins[mixinName].variables.device = {
          value: device
        }
      }
      // gradientMixin
      if (newValue[device] && newValue[device].gradientOverlay) {
        const mixinName = `gradientMixin:${device}`
        newMixins[mixinName] = {}
        if (newValue[device].gradientType === 'radial') {
          newMixins[mixinName] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.radialGradientMixin)
        } else {
          newMixins[mixinName] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.gradientMixin)
          newMixins[mixinName].variables.angle = {
            value: newValue[device].gradientAngle || 0
          }
        }
        if (newValue[device].gradientStartColor) {
          newMixins[mixinName].variables.startColor = {
            value: newValue[device].gradientStartColor
          }
        }
        if (newValue[device].gradientEndColor) {
          newMixins[mixinName].variables.endColor = {
            value: newValue[device].gradientEndColor
          }
        }
        newMixins[mixinName].variables.device = {
          value: device
        }
      }

      // dividerMixin
      if (newValue[device] && newValue[device].divider && (newValue[device].dividerBackgroundType === 'image' || newValue[device].dividerBackgroundType === 'videoEmbed')) {
        const mixinName = `dividerMixin:${device}`
        newMixins[mixinName] = {}
        newMixins[mixinName] = lodash.defaultsDeep({}, DesignOptionsAdvanced.attributeMixins.dividerMixin)

        newMixins[mixinName].variables.device = {
          value: device
        }
      }

      // animationDelayMixin
      DesignOptionsAdvanced.getAnimationDelayMixin(newValue, device, newMixins)
    }
    return device
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
   * Render device visibility toggle
   * @returns {XML}
   */
  getDeviceVisibilityRender () {
    const useTheShowElementToggle = DesignOptionsAdvanced.localizations ? DesignOptionsAdvanced.localizations.useTheShowElementToggle : 'Use the Show element toggle to hide or show elements on all or custom devices.'

    if (this.state.currentDevice === 'all') {
      const id = this.props.elementAccessPoint.id
      const element = documentService.get(id)
      if (!element) {
        return null
      }

      // TODO: Check maybe elementAccessPoint.cook().get will be correct here, not the documentManager
      if (element.tag === 'column') {
        return null
      } else {
        const checked = !element.hidden
        // TODO: Use correct localization here

        return (
          <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
            <div className='vcv-ui-form-switch-container'>
              <label className='vcv-ui-form-switch'>
                <input type='checkbox' onChange={this.handleElementVisibilityChange} id='show_element' checked={checked} />
                <span className='vcv-ui-form-switch-indicator' />
                <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
                <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
              </label>
              <label htmlFor='show_element' className='vcv-ui-form-switch-trigger-label'>
                Show element
              </label>
              <Tooltip>
                {useTheShowElementToggle}
              </Tooltip>
            </div>
          </div>
        )
      }
    }

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey='currentDeviceVisible'
          updater={this.deviceVisibilityChangeHandler}
          options={{ labelText: 'Show on device' }}
          value={!this.state.devices[this.state.currentDevice].display}
        />
        <Tooltip>
          {useTheShowElementToggle}
        </Tooltip>
      </div>
    )
  }

  handleElementVisibilityChange () {
    workspaceStorage.trigger('hide', this.props.elementAccessPoint.id)
  }

  /**
   * Handle show on device toggle change
   * @returns {XML}
   */
  deviceVisibilityChangeHandler (fieldKey, isVisible) {
    const newState = lodash.defaultsDeep({}, this.state)
    if (isVisible) {
      delete newState.devices[this.state.currentDevice].display
    } else {
      // set display to none
      newState.devices[this.state.currentDevice].display = 'none'
    }

    this.updateValue(newState, fieldKey)
  }

  /**
   * Update and apply the same lazyLoad property state for each device
   * @param fieldKey
   * @param value
   */
  backgroundLazyLoadHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    const deviceKeys = Object.keys(newState.devices)
    deviceKeys.forEach((device) => {
      newState.devices[device].lazyLoad = value
    })
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
   * Render background type dropdown
   * @returns {*}
   */
  getBackgroundTypeRender () {
    if (this.state.devices[this.state.currentDevice].display) {
      return null
    }
    const options = {
      values: [
        {
          label: 'Single image',
          value: 'imagesSimple'
        },
        {
          label: 'Background zoom',
          value: 'backgroundZoom'
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
    const value = this.state.devices[this.state.currentDevice].backgroundType || DesignOptionsAdvanced.deviceDefaults.backgroundType
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background type
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='backgroundType'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render box model
   * @returns {*}
   */
  renderBoxModel (defaultStyles) {
    if (this.state.devices[this.state.currentDevice].display) {
      return null
    }
    const value = this.state.devices[this.state.currentDevice].boxModel || {}

    return (
      <div className='vcv-ui-form-group'>
        <BoxModel
          api={this.props.api}
          fieldKey='boxModel'
          updater={this.boxModelChangeHandler}
          placeholder={this.state.defaultStyles}
          value={value}
        />
      </div>
    )
  }

  /**
   * Get default element styles
   * calls renderBoxModel
   */
  getDefaultStyles () {
    const mainDefaultStyles = {
      margin: {},
      padding: {},
      border: {}
    }
    const doAttribute = 'data-vce-do-apply'
    const frame = document.querySelector('#vcv-editor-iframe')
    const frameDocument = frame.contentDocument || frame.contentWindow.document
    const elementIdSelector = `el-${this.props.elementAccessPoint.id}`
    const element = frameDocument.querySelector(`#${elementIdSelector}`)
    const styles = ['border', 'padding', 'margin']

    if (element) {
      const elementDOAttribute = element.getAttribute(doAttribute)

      if (elementDOAttribute) {
        const allDefaultStyles = this.getElementStyles(element)

        if (elementDOAttribute.indexOf('all') >= 0) {
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            if (elementDOAttribute.indexOf(style) >= 0) {
              mainDefaultStyles[style] = allDefaultStyles
            } else {
              const innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
              mainDefaultStyles[style] = this.getElementStyles(element, innerSelector)
            }
          })
        }
      } else {
        const allStyleElement = (element).querySelector(`[${doAttribute}*='all'][${doAttribute}*='${elementIdSelector}']`)

        if (allStyleElement) {
          mainDefaultStyles.all = this.getElementStyles(allStyleElement)
        } else {
          styles.forEach((style) => {
            const innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
            mainDefaultStyles[style] = this.getElementStyles(element, innerSelector)
          })
        }
      }
    }

    const parsedStyles = this.parseStyles(mainDefaultStyles)
    this.setState({
      defaultStyles: parsedStyles
    })
  }

  /**
   * Parse default element styles
   * @returns {}
   */
  parseStyles (mainDefaultStyles) {
    const parsedStyles = {}
    for (const style in mainDefaultStyles) {
      const styleObject = mainDefaultStyles.all || mainDefaultStyles[style]
      for (const computedStyle in styleObject) {
        if (computedStyle.indexOf(style) >= 0) {
          parsedStyles[computedStyle] = styleObject[computedStyle]
        }
      }
    }
    return parsedStyles
  }

  /**
   * Gets additional style (margin, padding, border) element styles
   * @param domElement
   * @param innerSelector
   * @returns {{}}
   */
  getElementStyles (domElement, innerSelector) {
    const styles = {}
    if (domElement) {
      let computedStyles = ''
      const styleElement = innerSelector ? domElement.querySelector(innerSelector) : domElement
      if (styleElement) {
        // Remove transition for correct default value calculation
        styleElement.setAttribute('data-vcv-transition-disabled', true)

        computedStyles = window.getComputedStyle(styleElement)

        window.setTimeout(() => {
          styleElement.removeAttribute('data-vcv-transition-disabled')
        }, 100)
      }

      for (const style in BoxModel.defaultState) {
        if (computedStyles && computedStyles.getPropertyValue) {
          const styleValue = computedStyles.getPropertyValue(style.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)) // Transform camelCase to hyphen-case
          if (styleValue && styleValue !== '0px' && styleValue.split(' ').length === 1) {
            styles[style] = styleValue
          }
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
    const currentValue = this.state.devices[this.state.currentDevice].boxModel || {}

    if (!lodash.isEqual(currentValue, value)) {
      const newState = lodash.defaultsDeep({}, this.state)
      // update value
      if (lodash.isEmpty(value)) {
        delete newState.devices[newState.currentDevice].boxModel
      } else {
        newState.devices[newState.currentDevice].boxModel = value
      }
      this.updateValue(newState, fieldKey)
    }
  }

  /**
   * Render attach image
   * @returns {*}
   */
  getAttachImageRender () {
    const allowedBackgroundTypes = [
      'imagesSimple',
      'backgroundZoom',
      'imagesSlideshow'
    ]
    let backgroundTypeToSearch = this.state.devices[this.state.currentDevice].backgroundType
    if (!backgroundTypeToSearch) {
      backgroundTypeToSearch = this.state.backgroundType
    }
    if (this.state.devices[this.state.currentDevice].display ||
      allowedBackgroundTypes.indexOf(backgroundTypeToSearch) === -1) {
      return null
    }
    const value = this.state.devices[this.state.currentDevice].images || ''

    const fieldKey = 'attachImage'
    const dynamicTemplateProps = {
      value: '$dynamicFieldKey',
      type: 'backgroundImage',
      sourceId: '$sourceId'
    }

    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>
            Background images
          </span>
        </div>
        <AttachImage
          api={this.props.api}
          fieldKey={fieldKey}
          options={{
            multiple: true,
            dynamicField: true
          }}
          defaultValue=''
          updater={this.attachImageChangeHandler}
          value={value}
          prevValue={this.state.devices[this.state.currentDevice].prevValue}
          elementAccessPoint={this.props.elementAccessPoint}
          onDynamicFieldOpen={(fieldType, prevAttrDynamicKey) => {
            const defaultDynamicFieldKey = prevAttrDynamicKey || getDefaultDynamicFieldKey(fieldType.fieldType)
            return getDynamicValue(defaultDynamicFieldKey, null, null, { dynamicTemplateProps: dynamicTemplateProps })
          }}
          onDynamicFieldChange={(dynamicFieldKey, sourceId, forceSaveSourceId = false) => {
            return getDynamicValue(dynamicFieldKey, sourceId, null, { dynamicTemplateProps: dynamicTemplateProps, forceSaveSourceId })
          }}
          onDynamicFieldClose={this.props.onDynamicFieldClose}
        />
      </div>
    )
  }

  /**
   * Handle attach image change
   * @param fieldKey
   * @param value
   * @param prevValue
   */
  attachImageChangeHandler (fieldKey, value, prevValue) {
    if (value && Object.prototype.hasOwnProperty.call(value, value.draggingIndex)) {
      delete value.draggingIndex
    }
    const newState = lodash.defaultsDeep({}, this.state)
    const deviceData = newState.devices[newState.currentDevice]
    // update value
    if (lodash.isEmpty(value)) {
      delete deviceData.images
    } else {
      deviceData.images = value
    }
    if (!deviceData.prevValue && prevValue) {
      deviceData.prevValue = prevValue
    }
    if (deviceData.prevValue && !prevValue) {
      deviceData.prevValue = null
    }
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render background style
   * @returns {*}
   */
  getBackgroundStyleRender () {
    const allowedBackgroundTypes = [
      'imagesSimple',
      'imagesSlideshow'
    ]
    const deviceData = this.state.devices[this.state.currentDevice]
    if (deviceData.display || allowedBackgroundTypes.indexOf(deviceData.backgroundType) === -1 || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
      return null
    }
    const images = deviceData.images
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
    const value = deviceData.backgroundStyle || DesignOptionsAdvanced.deviceDefaults.backgroundStyle
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background style
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='backgroundStyle'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render background position control
   * @returns {*}
   */
  getBackgroundPositionRender () {
    const allowedBackgroundTypes = [
      'imagesSimple',
      'backgroundZoom',
      'imagesSlideshow'
    ]
    const deviceData = this.state.devices[this.state.currentDevice]
    if (deviceData.display || allowedBackgroundTypes.indexOf(deviceData.backgroundType) === -1 || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
      return null
    }
    const images = deviceData.images
    const isArray = images.constructor === Array

    if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
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
    const value = deviceData.backgroundPosition || DesignOptionsAdvanced.deviceDefaults.backgroundPosition
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background position
        </span>
        <ButtonGroup
          api={this.props.api}
          fieldKey='backgroundPosition'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render background zoom control
   * @returns {*}
   */
  getBackgroundZoomRender () {
    const deviceData = this.state.devices[this.state.currentDevice]
    if (deviceData.display || deviceData.backgroundType !== 'backgroundZoom' || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
      return null
    }
    const images = deviceData.images
    const isArray = images.constructor === Array

    if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
      return null
    }

    const options = {
      min: 0,
      max: 100,
      measurement: '%'
    }
    const value = deviceData.backgroundZoom || DesignOptionsAdvanced.deviceDefaults.backgroundZoom
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background zoom scale
        </span>
        <Range
          api={this.props.api}
          fieldKey='backgroundZoom'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render background zoom speed control
   * @returns {*}
   */
  getBackgroundZoomSpeedRender () {
    const deviceData = this.state.devices[this.state.currentDevice]
    if (deviceData.display || deviceData.backgroundType !== 'backgroundZoom' || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
      return null
    }
    const images = deviceData.images
    const isArray = images.constructor === Array

    if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
      return null
    }

    const options = {
      min: 1
    }
    const value = deviceData.backgroundZoomSpeed || DesignOptionsAdvanced.deviceDefaults.backgroundZoomSpeed
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background zoom time (in seconds)
        </span>
        <Number
          api={this.props.api}
          fieldKey='backgroundZoomSpeed'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render background zoom reverse control
   * @returns {*}
   */
  getBackgroundZoomReverseRender () {
    const deviceData = this.state.devices[this.state.currentDevice]
    if (deviceData.display || deviceData.backgroundType !== 'backgroundZoom' || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
      return null
    }
    const images = deviceData.images
    const isArray = images.constructor === Array

    if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
      return null
    }

    const value = deviceData.backgroundZoomReverse || DesignOptionsAdvanced.deviceDefaults.backgroundZoomReverse

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey='backgroundZoomReverse'
          updater={this.valueChangeHandler}
          options={{ labelText: 'Use reverse zoom' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render color picker for background color
   * @returns {*}
   */
  getBackgroundColorRender () {
    if (this.state.devices[this.state.currentDevice].display) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].backgroundColor || ''
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background color
        </span>
        <Color
          api={this.props.api}
          fieldKey='backgroundColor'
          updater={this.valueChangeHandler}
          value={value}
          defaultValue=''
        />
      </div>
    )
  }

  /**
   * Render gradient overlay toggle
   * @returns {XML}
   */
  getGradientOverlayRender () {
    if (this.state.devices[this.state.currentDevice].display) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].gradientOverlay || false
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <Toggle
          api={this.props.api}
          fieldKey='gradientOverlay'
          updater={this.valueChangeHandler}
          options={{ labelText: 'Use gradient overlay' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render gradient type dropdown
   * @returns {XML}
   */
  getGradientTypeRender () {
    if (this.state.devices[this.state.currentDevice].display || !this.state.devices[this.state.currentDevice].gradientOverlay) {
      return null
    }

    const options = {
      values: [
        {
          label: 'Linear gradient',
          value: 'linear'
        },
        {
          label: 'Radial gradient',
          value: 'radial'
        }
      ]
    }
    const value = this.state.devices[this.state.currentDevice].gradientType || ''
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Gradient type
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='gradientType'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render color picker for gradient start color
   * @returns {*}
   */
  getGradientStartColorRender () {
    if (this.state.devices[this.state.currentDevice].display || !this.state.devices[this.state.currentDevice].gradientOverlay) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].gradientStartColor || DesignOptionsAdvanced.deviceDefaults.gradientStartColor
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Start color
        </span>
        <Color
          api={this.props.api}
          fieldKey='gradientStartColor'
          updater={this.valueChangeHandler}
          value={value}
          defaultValue={DesignOptionsAdvanced.deviceDefaults.gradientStartColor}
        />
      </div>
    )
  }

  /**
   * Render color picker for gradient end color
   * @returns {*}
   */
  getGradientEndColorRender () {
    if (this.state.devices[this.state.currentDevice].display || !this.state.devices[this.state.currentDevice].gradientOverlay) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].gradientEndColor || DesignOptionsAdvanced.deviceDefaults.gradientEndColor
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          End color
        </span>
        <Color
          api={this.props.api}
          fieldKey='gradientEndColor'
          updater={this.valueChangeHandler}
          value={value}
          defaultValue={DesignOptionsAdvanced.deviceDefaults.gradientEndColor}
        />
      </div>
    )
  }

  /**
   * Render border style dropdown
   * @returns {*}
   */
  getBorderStyleRender () {
    if (this.state.devices[this.state.currentDevice].display) {
      return null
    }
    const device = this.state.devices[this.state.currentDevice]
    if (!device.boxModel || !(device.boxModel.borderBottomWidth || device.boxModel.borderLeftWidth || device.boxModel.borderRightWidth || device.boxModel.borderTopWidth || device.boxModel.borderWidth)) {
      return null
    }

    const options = {
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
          label: 'Double',
          value: 'double'
        }
      ]
    }
    const value = this.state.devices[this.state.currentDevice].borderStyle || DesignOptionsAdvanced.deviceDefaults.borderStyle
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Border style
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='borderStyle'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render border color control
   * @returns {*}
   */
  getBorderColorRender () {
    if (this.state.devices[this.state.currentDevice].display) {
      return null
    }
    const device = this.state.devices[this.state.currentDevice]
    if (!device.boxModel || !(device.boxModel.borderBottomWidth || device.boxModel.borderLeftWidth || device.boxModel.borderRightWidth || device.boxModel.borderTopWidth || device.boxModel.borderWidth)) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].borderColor || ''
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Border color
        </span>
        <Color
          api={this.props.api}
          fieldKey='borderColor'
          updater={this.valueChangeHandler}
          value={value}
          defaultValue=''
        />
      </div>
    )
  }

  /**
   * Render slider timeout field
   * @returns {*}
   */
  getSliderTimeoutRender () {
    if (this.state.devices[this.state.currentDevice].display ||
      this.state.devices[this.state.currentDevice].backgroundType !== 'imagesSlideshow') {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].sliderTimeout || ''
    const defaultValue = this.state.devices[this.state.currentDevice].sliderEffect === 'carousel' ? 10 : 5
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Animation timeout (in seconds)
        </span>
        <Number
          api={this.props.api}
          fieldKey='sliderTimeout'
          updater={this.sliderTimeoutChangeHandler}
          placeholder={defaultValue}
          options={{
            min: 1
          }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render grid slider direction field
   * @returns {*}
   */
  getSliderDirectionRender () {
    if (this.state.devices[this.state.currentDevice].display ||
      this.state.devices[this.state.currentDevice].backgroundType !== 'imagesSlideshow' ||
      this.state.devices[this.state.currentDevice].sliderEffect !== 'carousel') {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].sliderDirection || 'left'
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Slider direction
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='sliderDirection'
          updater={this.valueChangeHandler}
          placeholder='Left'
          options={{
            values: [
              { label: 'Left', value: 'left' },
              { label: 'Top', value: 'top' },
              { label: 'Right', value: 'right' },
              { label: 'Bottom', value: 'bottom' }
            ]
          }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render slider effect type field
   * @returns {*}
   */
  getSliderEffectRender () {
    if (this.state.devices[this.state.currentDevice].display ||
      this.state.devices[this.state.currentDevice].backgroundType !== 'imagesSlideshow') {
      return null
    }

    const options = {
      values: [
        {
          label: 'Slide',
          value: 'slide'
        },
        {
          label: 'Fade',
          value: 'fade'
        },
        {
          label: 'Carousel',
          value: 'carousel'
        }
      ]
    }
    const value = this.state.devices[this.state.currentDevice].sliderEffect || DesignOptionsAdvanced.deviceDefaults.sliderEffect
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Slideshow effect
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='sliderEffect'
          options={options}
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Handle slider timeout change
   * @param fieldKey
   * @param value
   */
  sliderTimeoutChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = parseInt(value)
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render gradient angle control
   * @returns {*}
   */
  getGradientAngleRender () {
    if (this.state.devices[this.state.currentDevice].display || !this.state.devices[this.state.currentDevice].gradientOverlay || this.state.devices[this.state.currentDevice].gradientType === 'radial') {
      return null
    }
    const value = this.state.devices[this.state.currentDevice].gradientAngle
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Gradient angle
        </span>
        <Range
          api={this.props.api}
          fieldKey='gradientAngle'
          updater={this.valueChangeHandler}
          options={{ min: 0, max: 180, measurement: '°' }}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render animation control
   * @returns {*}
   */
  getAnimationRender () {
    if (this.state.devices[this.state.currentDevice].display) {
      return null
    }
    const value = this.state.devices[this.state.currentDevice].animation || ''

    let animationDelayHtml = null
    if (value) {
      const delayValue = this.state.devices[this.state.currentDevice].animationDelay || ''
      const defaultDelayValue = 0
      animationDelayHtml = (
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            Animation delay (in seconds)
          </span>
          <Number
            api={this.props.api}
            fieldKey='animationDelay'
            updater={this.valueChangeHandler}
            placeholder={defaultDelayValue}
            options={{
              min: 0
            }}
            value={delayValue}
          />
        </div>
      )
    }

    return (
      <>
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            Animate
          </span>
          <Animate
            api={this.props.api}
            fieldKey='animation'
            updater={this.valueChangeHandler}
            value={value}
          />
        </div>
        {animationDelayHtml}
      </>
    )
  }

  /**
   * Render Youtube video control
   * @returns {*}
   */
  getYoutubeVideoRender () {
    if (this.state.devices[this.state.currentDevice].display ||
      this.state.devices[this.state.currentDevice].backgroundType !== 'videoYoutube') {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].videoYoutube || ''
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          YouTube video link
        </span>
        <String
          api={this.props.api}
          fieldKey='videoYoutube'
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
  getVimeoVideoRender () {
    if (this.state.devices[this.state.currentDevice].display ||
      this.state.devices[this.state.currentDevice].backgroundType !== 'videoVimeo') {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].videoVimeo || ''
    const vimeoVideoLink = DesignOptionsAdvanced.localizations ? DesignOptionsAdvanced.localizations.vimeoVideoLink : 'Vimeo video link'
    const hidingPlayerControls = DesignOptionsAdvanced.localizations ? DesignOptionsAdvanced.localizations.hidingPlayerControls : 'Hiding player controls available only for Vimeo PRO users.'
    return (
      <div className='vcv-ui-form-group'>
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>
            {vimeoVideoLink}
          </span>
          <Tooltip>
            {hidingPlayerControls}
          </Tooltip>
        </div>
        <String
          api={this.props.api}
          fieldKey='videoVimeo'
          updater={this.valueChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Render Self hosted video control
   * @returns {*}
   */
  getEmbedVideoRender () {
    if (this.state.devices[this.state.currentDevice].display ||
      this.state.devices[this.state.currentDevice].backgroundType !== 'videoEmbed') {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].videoEmbed || {}
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Video
        </span>
        <AttachVideo
          api={this.props.api}
          fieldKey='videoEmbed'
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
   * @returns {XML}
   */
  render () {
    return (
      <div className='advanced-design-options'>
        {this.getDevicesRender()}
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getDeviceVisibilityRender()}
            {this.renderBoxModel()}
          </div>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {this.getBorderStyleRender()}
            {this.getBorderColorRender()}
            {this.getBackgroundTypeRender()}
            {this.getAttachImageRender()}
            {this.getSliderEffectRender()}
            {this.getSliderTimeoutRender()}
            {this.getSliderDirectionRender()}
            {this.getYoutubeVideoRender()}
            {this.getVimeoVideoRender()}
            {this.getEmbedVideoRender()}
            {this.getBackgroundStyleRender()}
            {this.getBackgroundPositionRender()}
            {this.getBackgroundZoomRender()}
            {this.getBackgroundZoomSpeedRender()}
            {this.getBackgroundZoomReverseRender()}
            {this.getBackgroundColorRender()}
            {this.getGradientOverlayRender()}
            {this.getGradientTypeRender()}
            {this.getGradientStartColorRender()}
            {this.getGradientEndColorRender()}
            {this.getGradientAngleRender()}
            {this.getAnimationRender()}
          </div>
        </div>
      </div>
    )
  }
}

/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import lodash from 'lodash'
import Attribute from '../attribute'
import Devices from '../devices/Component'
import Toggle from '../toggle/Component'
import Dropdown from '../dropdown/Component'
import BoxModel from '../boxModel/Component'
import AttachImage from '../attachimage/Component'
import Color from '../color/Component'
import Animate from '../animateDropdown/Component'
import ButtonGroup from '../buttonGroup/Component'
import { getStorage, getService } from 'vc-cake'
import Number from '../number/Component'
import Tooltip from 'public/components/tooltip/tooltip'

const elementsStorage = getStorage('elements')
const dataManager = getService('dataManager')
const documentService = getService('document')
const { getBlockRegexp } = getService('utils')
const { getDynamicValue, getDynamicFieldsData, getDefaultDynamicFieldKey } = getService('cook').dynamicFields
const blockRegexp = getBlockRegexp()

export default class DesignOptions extends Attribute {
  static defaultProps = {
    fieldType: 'designOptions'
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
    backgroundImageMixin: {
      src: require('raw-loader!./cssMixins/backgroundImage.pcss'),
      variables: {
        device: {
          value: 'all'
        },
        backgroundImage: {
          value: false
        }
      }
    },
    backgroundLazyImageMixin: {
      src: require('raw-loader!./cssMixins/backgroundLazyImage.pcss'),
      variables: {
        device: {
          value: 'all'
        },
        backgroundImage: {
          value: false
        }
      }
    },
    backgroundColorMixin: {
      src: require('raw-loader!./cssMixins/backgroundStyles.pcss'),
      variables: {
        device: {
          value: 'all'
        },
        backgroundColor: {
          value: false
        },
        backgroundPosition: {
          value: false
        },
        backgroundRepeat: {
          value: false
        },
        backgroundSize: {
          value: false
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
   * Simple attribute Mixins
   */
  static simpleAttributeMixins = {
    boxModelMixin: {
      src: require('raw-loader!./cssMixinsSimple/boxModel.pcss'),
      variables: DesignOptions.attributeMixins.boxModelMixin.variables
    },
    backgroundImageMixin: {
      src: require('raw-loader!./cssMixinsSimple/backgroundImage.pcss'),
      variables: DesignOptions.attributeMixins.backgroundImageMixin.variables
    },
    backgroundColorMixin: {
      src: require('raw-loader!./cssMixinsSimple/backgroundStyles.pcss'),
      variables: DesignOptions.attributeMixins.backgroundColorMixin.variables
    }
  }

  /**
   * Default state values
   */
  static defaultState = {
    currentDevice: 'all',
    borderStyle: 'solid',
    backgroundPosition: 'center top',
    devices: {},
    defaultStyles: null,
    lazyLoad: true
  }

  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    if (props.elementSelector) {
      this.state.lazyLoad = false
    }

    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.deviceVisibilityChangeHandler = this.deviceVisibilityChangeHandler.bind(this)
    this.getHiddenState = this.getHiddenState.bind(this)
    this.boxModelChangeHandler = this.boxModelChangeHandler.bind(this)
    this.attachImageChangeHandler = this.attachImageChangeHandler.bind(this)
    this.backgroundStyleChangeHandler = this.backgroundStyleChangeHandler.bind(this)
    this.backgroundPositionChangeHandler = this.backgroundPositionChangeHandler.bind(this)
    this.colorChangeHandler = this.colorChangeHandler.bind(this)
    this.animationChangeHandler = this.animationChangeHandler.bind(this)
    this.borderStyleChangeHandler = this.borderStyleChangeHandler.bind(this)
    this.handleElementChange = this.handleElementChange.bind(this)
    this.backgroundImageLazyLoadHandler = this.backgroundImageLazyLoadHandler.bind(this)
  }

  componentDidMount () {
    window.setTimeout(() => {
      this.getDefaultStyles()
    }, 200)

    if (!this.props.elementSelector) {
      this.setDefaultState()
    }

    if (this.props.elementAccessPoint) {
      const id = this.props.elementAccessPoint.id
      elementsStorage.on(`element:${id}`, this.handleElementChange)
    }
  }

  componentWillUnmount () {
    if (this.props.elementAccessPoint) {
      const id = this.props.elementAccessPoint.id
      elementsStorage.off(`element:${id}`, this.handleElementChange)
    }
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

  getHiddenState () {
    const id = this.props.elementAccessPoint.id
    const element = documentService.get(id)
    if (!element) {
      return false
    }
    return element.hidden
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
        newState.devices[device].lazyLoad = DesignOptions.defaultState.lazyLoad
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
      newState = lodash.defaultsDeep({}, props, DesignOptions.defaultState)
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
    const newState = lodash.defaultsDeep({}, DesignOptions.defaultState)
    // get devices data
    const devices = this.getCustomDevicesKeys()
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[device] = {}
      if (value.device && value.device[device]) {
        newState.devices[device] = lodash.defaultsDeep({}, value.device[device])
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
   * @param fieldKey
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
        if (!newState.devices[device].borderStyle) {
          newState.devices[device].borderStyle = DesignOptions.defaultState.borderStyle
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
          // image is empty
          const imageValue = newValue[device].image && newValue[device].image.urls && newValue[device].image.urls[0] ? newValue[device].image.urls[0].full : false
          const isDynamic = imageValue && typeof imageValue === 'string' && imageValue.match(blockRegexp)
          if (!isDynamic && (!Object.prototype.hasOwnProperty.call(newValue[device], 'image') || ((!newValue[device].image.urls || newValue[device].image.urls.length === 0) && newValue[device].image.length === 0))) {
            delete newValue[device].image
            delete newValue[device].backgroundStyle
          }

          if (!this.props.elementSelector) {
            if (imageValue) {
              if (newValue[device].lazyLoad === undefined) {
                newValue[device].lazyLoad = true
              }
            } else {
              if (newValue[device].lazyLoad !== undefined) {
                delete newValue[device].lazyLoad
              }
            }
          }

          // background style is empty
          if (newValue[device].backgroundStyle === '') {
            delete newValue[device].backgroundStyle
          }

          // background position is empty
          if (newValue[device].backgroundPosition === '') {
            delete newValue[device].backgroundPosition
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
        }
        DesignOptions.getMixins(newValue, device, newMixins, !!this.props.elementSelector)

        // remove device from list if it's empty
        if (!Object.keys(newValue[device]).length) {
          delete newValue[device]
        }
      }
    })

    this.setFieldValue(newValue, newMixins, fieldKey)
    this.setState(newState)
  }

  static buildMixins (data, value, cookElement, attributeSettings, isSimple = false) {
    const mixins = {}
    const devices = ['all', 'xs', 'sm', 'md', 'lg', 'xl']
    devices.forEach((device) => {
      if (value.device && typeof value.device[device] !== 'undefined') {
        DesignOptions.getMixins(value.device, device, mixins, isSimple)
      }
    })

    return mixins
  }

  static getMixins (newValue, device, newMixins, isSimple) {
    // mixins
    if (Object.prototype.hasOwnProperty.call(newValue[device], 'display')) {
      newMixins[`visibilityMixin:${device}`] = lodash.defaultsDeep({}, DesignOptions.attributeMixins.visibilityMixin)
      newMixins[`visibilityMixin:${device}`].variables = {
        device: {
          value: device
        }
      }
    } else {
      // boxModelMixin
      DesignOptions.getBoxModelMixin(newValue, device, newMixins, isSimple)
      // backgroundMixin
      DesignOptions.getBackgroundMixin(newValue, device, newMixins, isSimple)
      // animationDelayMixin
      DesignOptions.getAnimationDelayMixin(newValue, device, newMixins)
    }
  }

  static getBoxModelMixin (newValue, device, newMixins, isSimple) {
    if (Object.prototype.hasOwnProperty.call(newValue[device], 'boxModel')) {
      const value = newValue[device].boxModel
      if (!lodash.isEmpty(value)) {
        // update mixin
        const mixinName = `boxModelMixin:${device}`
        newMixins[mixinName] = {}
        const attributeMixins = isSimple ? DesignOptions.simpleAttributeMixins : DesignOptions.attributeMixins
        newMixins[mixinName] = lodash.defaultsDeep({}, attributeMixins.boxModelMixin)
        const syncData = {
          borderWidth: [{ key: 'borderStyle', value: 'borderStyle' }, { key: 'borderColor', value: 'borderColor' }],
          borderTopWidth: [{ key: 'borderTopStyle', value: 'borderStyle' }, { key: 'borderTopColor', value: 'borderColor' }],
          borderRightWidth: [{ key: 'borderRightStyle', value: 'borderStyle' }, { key: 'borderRightColor', value: 'borderColor' }],
          borderBottomWidth: [{ key: 'borderBottomStyle', value: 'borderStyle' }, { key: 'borderBottomColor', value: 'borderColor' }],
          borderLeftWidth: [{ key: 'borderLeftStyle', value: 'borderStyle' }, { key: 'borderLeftColor', value: 'borderColor' }]
        }
        for (const property in value) {
          newMixins[mixinName].variables[property] = {
            value: DesignOptions.addPixelToNumber(value[property])
          }
          if (syncData[property]) {
            syncData[property].forEach((syncProp) => {
              const propVal = newValue[device][syncProp.value] || false
              newMixins[mixinName].variables[syncProp.key] = {
                value: DesignOptions.addPixelToNumber(propVal)
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
  }

  static getBackgroundMixin (newValue, device, newMixins, isSimple) {
    if (newValue[device] && (newValue[device].backgroundColor || (newValue[device].image && newValue[device].image.urls && newValue[device].image.urls.length))) {
      const mixinName = `backgroundColorMixin:${device}`
      const mixinNameImage = newValue[device].lazyLoad ? `backgroundLazyImageMixin:${device}` : `backgroundImageMixin:${device}`
      newMixins[mixinName] = {}
      const attributeMixins = isSimple ? DesignOptions.simpleAttributeMixins : DesignOptions.attributeMixins
      newMixins[mixinName] = lodash.defaultsDeep({}, attributeMixins.backgroundColorMixin)
      if (newValue[device].lazyLoad) {
        newMixins[mixinNameImage] = lodash.defaultsDeep({}, attributeMixins.backgroundLazyImageMixin)
      } else {
        newMixins[mixinNameImage] = lodash.defaultsDeep({}, attributeMixins.backgroundImageMixin)
      }

      if (newValue[device].backgroundColor) {
        newMixins[mixinName].variables.backgroundColor = {
          value: newValue[device].backgroundColor
        }
      }

      const imageValue = newValue[device].image && newValue[device].image.urls && newValue[device].image.urls[0] ? newValue[device].image.urls[0].full : false
      if (imageValue && typeof imageValue === 'string' && imageValue.match(blockRegexp)) {
        const blockInfo = imageValue.split(blockRegexp)
        const blockAtts = JSON.parse(blockInfo[4])
        const imageUrl = getDynamicFieldsData({
          blockAtts: blockAtts
        })
        newMixins[mixinNameImage].variables.backgroundImage = {
          value: imageUrl
        }
        // We don't save this mixins for backend
        newMixins[mixinNameImage].skipOnSave = true
      } else if (newValue[device].image && newValue[device].image.urls && newValue[device].image.urls.length) {
        newMixins[mixinNameImage].variables.backgroundImage = {
          value: newValue[device].image.urls[0].full
        }
      }

      if (newValue[device].backgroundStyle) {
        const sizeStyles = ['cover', 'contain', 'full-width', 'full-height']
        const sizeState = sizeStyles.indexOf(newValue[device].backgroundStyle) >= 0

        if (sizeState) {
          newMixins[mixinName].variables.backgroundRepeat = {
            value: false
          }
          switch (newValue[device].backgroundStyle) {
            case 'full-width':
              newMixins[mixinName].variables.backgroundSize = {
                value: '100% auto'
              }
              break
            case 'full-height':
              newMixins[mixinName].variables.backgroundSize = {
                value: 'auto 100%'
              }
              break
            default:
              newMixins[mixinName].variables.backgroundRepeat = {
                value: 'no-repeat'
              }
              newMixins[mixinName].variables.backgroundSize = {
                value: newValue[device].backgroundStyle
              }
              newMixins[mixinName].variables.backgroundPosition = {
                value: DesignOptions.defaultState.backgroundPosition
              }
          }
        } else {
          newMixins[mixinName].variables.backgroundRepeat = {
            value: newValue[device].backgroundStyle
          }
          newMixins[mixinName].variables.backgroundSize = {
            value: false
          }
        }
      }

      if (newValue[device].backgroundPosition) {
        newMixins[mixinName].variables.backgroundPosition = {
          value: newValue[device].backgroundPosition
        }
      }

      newMixins[mixinName].variables.device = {
        value: device
      }
      newMixins[mixinNameImage].variables.device = {
        value: device
      }
    }
  }

  static getAnimationDelayMixin (newValue, device, newMixins) {
    if (Object.prototype.hasOwnProperty.call(newValue[device], 'animationDelay')) {
      const value = newValue[device].animationDelay
      if (!lodash.isEmpty(value)) {
        // update mixin
        const mixinName = `animationDelayMixin:${device}`
        newMixins[mixinName] = {}
        newMixins[mixinName] = lodash.defaultsDeep({}, DesignOptions.attributeMixins.animationDelayMixin)

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

  /**
   * Flush field value to updater
   * @param value
   */
  setFieldValue (value, mixins, innerFieldKey) {
    const { updater, fieldKey } = this.props
    const newValue = { device: value }
    if (this.props.elementSelector) {
      newValue.attributeMixins = mixins
    }
    updater(fieldKey, newValue, innerFieldKey)
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
    const manageIfTheElementAppearsOnAParticularDevice = DesignOptions.localizations ? DesignOptions.localizations.manageIfTheElementAppearsOnAParticularDevice : 'Manage if the element appears on a particular device.'

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group--has-inner-fields'>
        <div className='vcv-ui-form-group-heading-wrapper'>
          <span className='vcv-ui-form-group-heading'>
            Device type
          </span>
          <Tooltip>
            {manageIfTheElementAppearsOnAParticularDevice}
          </Tooltip>
        </div>
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
    const useTheShowElementToggle = DesignOptions.localizations ? DesignOptions.localizations.useTheShowElementToggle : 'Use the Show element toggle to hide or show elements on all or custom devices.'

    if (!this.props.elementAccessPoint) {
      return null
    }

    if (this.state.currentDevice === 'all') {
      const checked = !this.getHiddenState()

      // TODO: Use correct localization here
      return (
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <div className='vcv-ui-form-switch-container'>
            <label className='vcv-ui-form-switch'>
              <input type='checkbox' onChange={this.deviceVisibilityChangeHandler.bind(this, 'currentDeviceVisible', !checked)} id='show_element' checked={checked} />
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

    if (this.state.currentDevice === 'all') {
      this.props.updater('hidden', !isVisible)
    } else {
      this.props.updater('hidden', false)
    }
  }

  /**
   * Render box model
   * @returns {*}
   */
  renderBoxModel () {
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
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
    let domElement = null
    let elementIdSelector = ''

    if (this.props.elementAccessPoint) {
      elementIdSelector = `el-${this.props.elementAccessPoint.id}`
      domElement = frameDocument.querySelector(`#${elementIdSelector}`)
    } else if (this.props.elementSelector) {
      domElement = frameDocument.querySelector(this.props.elementSelector)
    }

    const styles = ['border', 'padding', 'margin']

    if (domElement) {
      const elementDOAttribute = domElement.getAttribute(doAttribute)

      if (this.props.elementSelector) {
        mainDefaultStyles.all = this.getElementStyles(domElement)
      } else if (elementDOAttribute) {
        const allDefaultStyles = this.getElementStyles(domElement)

        if (elementDOAttribute.indexOf('all') >= 0) {
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            if (elementDOAttribute.indexOf(style) >= 0) {
              mainDefaultStyles[style] = allDefaultStyles
            } else {
              const innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
              mainDefaultStyles[style] = this.getElementStyles(domElement, innerSelector)
            }
          })
        }
      } else {
        const allStyleElement = (domElement).querySelector(`[${doAttribute}*='all'][${doAttribute}*='${elementIdSelector}']`)

        if (allStyleElement) {
          mainDefaultStyles.all = this.getElementStyles(allStyleElement)
        } else {
          styles.forEach((style) => {
            const innerSelector = `[${doAttribute}*='${style}'][${doAttribute}*='${elementIdSelector}']`
            mainDefaultStyles[style] = this.getElementStyles(domElement, innerSelector)
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
   * Update and apply the same lazyLoad property state for each device
   * @param fieldKey
   * @param value
   */
  backgroundImageLazyLoadHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    const deviceKeys = Object.keys(newState.devices)
    deviceKeys.forEach((device) => {
      newState.devices[device].lazyLoad = value
    })
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render attach image
   * @returns {*}
   */
  getAttachImageRender () {
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
      return null
    }

    const fieldKey = 'attachImage'
    const value = this.state.devices[this.state.currentDevice].image || ''

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
          key={`${this.state.currentDevice}-${fieldKey}`}
          options={{
            multiple: true,
            dynamicField: true
          }}
          updater={this.attachImageChangeHandler}
          value={value}
          defaultValue=''
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
      delete deviceData.image
    } else {
      deviceData.image = value
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
    const { devices, currentDevice } = this.state
    if (devices[currentDevice].display || this.getHiddenState()) {
      return null
    }
    const imageData = devices[currentDevice].image || ''

    if (!this.isBackgroundActive(imageData)) {
      return null
    }

    const options = {
      values: [
        {
          label: 'Default',
          value: ''
        },
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
    const value = devices[currentDevice].backgroundStyle || ''
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background style
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='backgroundStyle'
          options={options}
          updater={this.backgroundStyleChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Handle background style change
   * @param fieldKey
   * @param value
   */
  backgroundStyleChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice].backgroundStyle = value
    this.updateValue(newState, fieldKey)
  }

  /**
   * Check if background is set
   * @param imageData
   *
   * @return bool
   */
  isBackgroundActive (imageData) {
    if (!imageData || !imageData.urls || imageData.urls.length === 0) {
      return false
    }

    return true
  }

  /**
   * Render background position control
   * @returns {*}
   */
  getBackgroundPositionRender () {
    const { devices, currentDevice } = this.state
    if (devices[currentDevice].display || this.getHiddenState()) {
      return null
    }

    const imageData = devices[currentDevice].image || ''

    if (!this.isBackgroundActive(imageData)) {
      return null
    }

    const options = {
      values: [
        {
          label: 'Left top',
          value: 'left top',
          icon: 'vcv-ui-icon-attribute-background-position-left-top'
        },
        {
          label: 'Center top',
          value: 'center top',
          icon: 'vcv-ui-icon-attribute-background-position-center-top'
        },
        {
          label: 'Right top',
          value: 'right top',
          icon: 'vcv-ui-icon-attribute-background-position-right-top'
        },
        {
          label: 'Left center',
          value: 'left center',
          icon: 'vcv-ui-icon-attribute-background-position-left-center'
        },
        {
          label: 'Center center',
          value: 'center center',
          icon: 'vcv-ui-icon-attribute-background-position-center-center'
        },
        {
          label: 'Right center',
          value: 'right center',
          icon: 'vcv-ui-icon-attribute-background-position-right-center'
        },
        {
          label: 'Left bottom',
          value: 'left bottom',
          icon: 'vcv-ui-icon-attribute-background-position-left-bottom'
        },
        {
          label: 'Center bottom',
          value: 'center bottom',
          icon: 'vcv-ui-icon-attribute-background-position-center-bottom'
        },
        {
          label: 'Right bottom',
          value: 'right bottom',
          icon: 'vcv-ui-icon-attribute-background-position-right-bottom'
        }
      ]
    }
    const value = devices[currentDevice].backgroundPosition || DesignOptions.defaultState.backgroundPosition
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Background position
        </span>
        <ButtonGroup
          api={this.props.api}
          fieldKey='backgroundPosition'
          options={options}
          updater={this.backgroundPositionChangeHandler}
          value={value}
        />
      </div>
    )
  }

  /**
   * Handle background position change
   * @param fieldKey
   * @param value
   */
  backgroundPositionChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice].backgroundPosition = value
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render color picker for background color
   * @returns {*}
   */
  getBackgroundColorRender () {
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
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
          updater={this.colorChangeHandler}
          value={value}
          defaultValue=''
        />
      </div>
    )
  }

  getBorderStyleRender () {
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
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
    const value = this.state.devices[this.state.currentDevice].borderStyle || DesignOptions.deviceDefaults.borderStyle
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Border style
        </span>
        <Dropdown
          api={this.props.api}
          fieldKey='borderStyle'
          options={options}
          updater={this.borderStyleChangeHandler}
          value={value}
        />
      </div>
    )
  }

  borderStyleChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = value
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render border color control
   * @returns {*}
   */
  getBorderColorRender () {
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
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
          updater={this.colorChangeHandler}
          value={value}
          defaultValue=''
        />
      </div>
    )
  }

  /**
   * Handle colors change
   * @param fieldKey
   * @param value
   */
  colorChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = value
    this.updateValue(newState, fieldKey)
  }

  /**
   * Render animation control
   * @returns {*}
   */
  getAnimationRender () {
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
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
            updater={this.animationChangeHandler}
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
            updater={this.animationChangeHandler}
            value={value}
          />
        </div>
        {animationDelayHtml}
      </>
    )
  }

  /**
   * Handle change of animation control
   * @param fieldKey
   * @param value
   */
  animationChangeHandler (fieldKey, value) {
    const newState = lodash.defaultsDeep({}, this.state)
    newState.devices[newState.currentDevice][fieldKey] = value
    this.updateValue(newState, fieldKey)
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
            {this.getBackgroundColorRender()}
            {this.getAttachImageRender()}
            {this.getBackgroundStyleRender()}
            {this.getBackgroundPositionRender()}
            {this.getBorderStyleRender()}
            {this.getBorderColorRender()}
            {this.props.elementSelector ? null : this.getAnimationRender()}
          </div>
        </div>
      </div>
    )
  }
}

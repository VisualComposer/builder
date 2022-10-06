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
import {
  defaultState,
  deviceDefaults,
  getCustomDevices,
  getCustomDevicesKeys,
  getUpdatedValues,
  getUpdatedState
} from './helpers'

const elementsStorage = getStorage('elements')
const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const documentService = getService('document')

const { getDynamicValue, getDefaultDynamicFieldKey } = getService('cook').dynamicFields

export default class DesignOptionsAdvanced extends Attribute {
  static localizations = dataManager.get('localizations')

  static defaultProps = {
    fieldType: 'designOptionsAdvanced'
  }

  constructor (props) {
    super(props)
    props.setInnerFieldStatus && props.setInnerFieldStatus()
    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.deviceVisibilityChangeHandler = this.deviceVisibilityChangeHandler.bind(this)
    this.getHiddenState = this.getHiddenState.bind(this)
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

  getHiddenState () {
    const id = this.props.elementAccessPoint.id
    const element = documentService.get(id)
    if (!element) {
      return false
    }
    return element.hidden
  }

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
        newState.devices[device].lazyLoad = defaultState.lazyLoad
      })
      this.updateValue(newState, 'lazyLoad')
    }
  }

  updateState (props) {
    return getUpdatedState(props)
  }

  static addPixelToNumber (number) {
    return /^\d+$/.test(number) ? `${number}px` : number
  }

  updateValue (newState, fieldKey) {
    // prepare data for state
    newState = this.updateState(newState)

    const { newValue, newMixins } = getUpdatedValues(newState)

    this.setFieldValue(newValue, newMixins, fieldKey)
    this.setState(newState)
  }

  setFieldValue (value, mixins, innerFieldKey) {
    const { updater, fieldKey } = this.props
    updater(fieldKey, {
      device: value,
      attributeMixins: mixins
    }, innerFieldKey)
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
            customDevices: getCustomDevices()
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
      newState.devices.all = lodash.defaultsDeep({}, newState.devices[getCustomDevicesKeys().shift()])
      delete newState.devices.all.display
    } else if (this.state.currentDevice === 'all') {
      // clone data to custom devices from all
      getCustomDevicesKeys().forEach((device) => {
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
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
    const value = this.state.devices[this.state.currentDevice].backgroundType || deviceDefaults.backgroundType
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() ||
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
    if (deviceData.display || this.getHiddenState() || allowedBackgroundTypes.indexOf(deviceData.backgroundType) === -1 || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
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
    const value = deviceData.backgroundStyle || deviceDefaults.backgroundStyle
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
    if (deviceData.display || this.getHiddenState() || allowedBackgroundTypes.indexOf(deviceData.backgroundType) === -1 || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
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
    const value = deviceData.backgroundPosition || deviceDefaults.backgroundPosition
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
    if (deviceData.display || this.getHiddenState() || deviceData.backgroundType !== 'backgroundZoom' || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
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
    const value = deviceData.backgroundZoom || deviceDefaults.backgroundZoom
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
    if (deviceData.display || this.getHiddenState() || deviceData.backgroundType !== 'backgroundZoom' || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
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
    const value = deviceData.backgroundZoomSpeed || deviceDefaults.backgroundZoomSpeed
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
    if (deviceData.display || this.getHiddenState() || deviceData.backgroundType !== 'backgroundZoom' || !Object.prototype.hasOwnProperty.call(deviceData, 'images')) {
      return null
    }
    const images = deviceData.images
    const isArray = images.constructor === Array

    if ((isArray && images.length === 0) || (!isArray && (!images.urls || images.urls.length === 0))) {
      return null
    }

    const value = deviceData.backgroundZoomReverse || deviceDefaults.backgroundZoomReverse

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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState()) {
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() || !this.state.devices[this.state.currentDevice].gradientOverlay) {
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() || !this.state.devices[this.state.currentDevice].gradientOverlay) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].gradientStartColor || ''
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
          defaultValue={deviceDefaults.gradientStartColor}
        />
      </div>
    )
  }

  /**
   * Render color picker for gradient end color
   * @returns {*}
   */
  getGradientEndColorRender () {
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() || !this.state.devices[this.state.currentDevice].gradientOverlay) {
      return null
    }

    const value = this.state.devices[this.state.currentDevice].gradientEndColor || ''
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
          defaultValue={deviceDefaults.gradientEndColor}
        />
      </div>
    )
  }

  /**
   * Render border style dropdown
   * @returns {*}
   */
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
    const value = this.state.devices[this.state.currentDevice].borderStyle || deviceDefaults.borderStyle
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() ||
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() ||
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() ||
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
    const value = this.state.devices[this.state.currentDevice].sliderEffect || deviceDefaults.sliderEffect
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() || !this.state.devices[this.state.currentDevice].gradientOverlay || this.state.devices[this.state.currentDevice].gradientType === 'radial') {
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() ||
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() ||
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
    if (this.state.devices[this.state.currentDevice].display || this.getHiddenState() ||
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

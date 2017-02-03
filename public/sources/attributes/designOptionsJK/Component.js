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

class DesignOptionsJK extends Attribute {
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
      src: require('raw-loader!./cssMixins/backgroundStyles.pcss'),
      variables: {
        device: {
          value: `all`
        },
        backgroundColor: {
          value: false
        },
        backgroundImage: {
          value: false
        },
        backgroundRepeat: {
          value: false
        },
        backgroundSize: {
          value: false
        }
      }
    }
  }

  /**
   * Default state values
   */
  static defaultState = {
    currentDevice: 'all',
    borderStyle: 'solid',
    devices: {},
    attributeMixins: {}
  }

  static defaultStyles = ''

  constructor (props) {
    super(props)

    this.devicesChangeHandler = this.devicesChangeHandler.bind(this)
    this.deviceVisibilityChangeHandler = this.deviceVisibilityChangeHandler.bind(this)
    this.boxModelChangeHandler = this.boxModelChangeHandler.bind(this)
    this.attachImageChangeHandler = this.attachImageChangeHandler.bind(this)
    this.backgroundStyleChangeHandler = this.backgroundStyleChangeHandler.bind(this)
    this.colorChangeHandler = this.colorChangeHandler.bind(this)
    this.animationChangeHandler = this.animationChangeHandler.bind(this)
    this.borderStyleChangeHandler = this.borderStyleChangeHandler.bind(this)
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
      newState = lodash.defaultsDeep({}, props, DesignOptionsJK.defaultState)
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
    let newState = lodash.defaultsDeep({}, DesignOptionsJK.defaultState)
    // get devices data
    let devices = this.getCustomDevicesKeys()
    // set current device
    if (!lodash.isEmpty(value.device)) {
      newState.currentDevice = Object.keys(value.device).shift()
    }
    // update devices values
    devices.push('all')
    devices.forEach((device) => {
      newState.devices[ device ] = {}
      if (value.device && value.device[ device ]) {
        newState.devices[ device ] = lodash.defaultsDeep({}, value.device[ device ])
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
        if (!newState.devices[ device ].borderStyle) {
          newState.devices[ device ].borderStyle = DesignOptionsJK.defaultState.borderStyle
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
          // image is empty
          if (!newValue[ device ].hasOwnProperty('image') || newValue[ device ].image.urls.length === 0) {
            delete newValue[ device ].image
            delete newValue[ device ].backgroundStyle
          }

          // background style is empty
          if (newValue[ device ].backgroundStyle === '') {
            delete newValue[ device ].backgroundStyle
          }

          // background color is empty
          if (newValue[ device ].backgroundColor === '') {
            delete newValue[ device ].backgroundColor
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
          newMixins[ `visibilityMixin:${device}` ] = lodash.defaultsDeep({}, DesignOptionsJK.attributeMixins.visibilityMixin)
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
              newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsJK.attributeMixins.boxModelMixin)
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
          if (newValue[ device ] && (newValue[ device ].backgroundColor || newValue[ device ].image)) {
            let mixinName = `backgroundColorMixin:${device}`
            newMixins[ mixinName ] = {}
            newMixins[ mixinName ] = lodash.defaultsDeep({}, DesignOptionsJK.attributeMixins.backgroundColorMixin)

            if (newValue[ device ].backgroundColor) {
              newMixins[ mixinName ].variables.backgroundColor = {
                value: newValue[ device ].backgroundColor
              }
            }

            if (newValue[ device ].image && newValue[ device ].image.urls.length) {
              newMixins[ mixinName ].variables.backgroundImage = {
                value: newValue[ device ].image.urls[ 0 ].full
              }
            }

            if (newValue[ device ].backgroundStyle) {
              let sizeStyles = [ 'cover', 'contain', 'full-width', 'full-height' ]
              let sizeState = sizeStyles.indexOf(newValue[ device ].backgroundStyle) >= 0

              if (sizeState) {
                switch (newValue[ device ].backgroundStyle) {
                  case 'full-width':
                    newMixins[ mixinName ].variables.backgroundSize = {
                      value: '100% auto'
                    }
                    break
                  case 'full-height':
                    newMixins[ mixinName ].variables.backgroundSize = {
                      value: 'auto 100%'
                    }
                    break
                  default:
                    newMixins[ mixinName ].variables.backgroundSize = {
                      value: newValue[ device ].backgroundStyle
                    }
                }
                newMixins[ mixinName ].variables.backgroundRepeat = {
                  value: false
                }
              } else {
                newMixins[ mixinName ].variables.backgroundRepeat = {
                  value: newValue[ device ].backgroundStyle
                }
                newMixins[ mixinName ].variables.backgroundSize = {
                  value: false
                }
              }
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
    console.log('===================')
    console.log(value)
    console.log(mixins)
    console.log('===================')
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
   * Render box model
   * @returns {*}
   */
  getBoxModelRender () {
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }
    let value = this.state.devices[ this.state.currentDevice ].boxModel || {}

    this.getDefaultStyles()

    return <div className='vcv-ui-form-group'>
      <BoxModel
        api={this.props.api}
        fieldKey='boxModel'
        updater={this.boxModelChangeHandler}
        placeholder={DesignOptionsJK.defaultStyles}
        value={value} />
    </div>
  }

  getDefaultStyles () {
    let mainDefaultStyles = {
      margin: {},
      padding: {},
      border: {}
    }
    let doAttribute = 'data-vce-do-apply'
    let frame = document.querySelector('#vcv-editor-iframe')
    let frameDocument = frame.contentDocument || frame.contentWindow.document
    let element = frameDocument.querySelector('#el-' + this.props.element.data.id)
    let styles = [ 'border', 'padding', 'margin' ]

    if (element) {
      let elementDOAttribute = element.getAttribute(doAttribute)

      if (elementDOAttribute) {
        let allDefaultStyles = this.getElementStyles(element)

        if (elementDOAttribute === 'all') {
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            if (elementDOAttribute.indexOf(style) >= 0) {
              mainDefaultStyles[ style ] = allDefaultStyles
            } else {
              mainDefaultStyles[ style ] = this.getStylesByAttributeValue(element, style)
            }
          })
        }
      } else {
        let allStyleElement = element.querySelector(`[${doAttribute}='all']`)

        if (allStyleElement) {
          let allDefaultStyles = this.getElementStyles(allStyleElement)
          mainDefaultStyles.all = allDefaultStyles
        } else {
          styles.forEach((style) => {
            mainDefaultStyles[ style ] = this.getStylesByAttributeValue(element, style)
          })
        }
      }
    }
    DesignOptionsJK.defaultStyles = mainDefaultStyles
  }

  getStylesByAttributeValue (parentSelector, value) {
    let doAttribute = 'data-vce-do-apply'
    let element = parentSelector.querySelector(`[${doAttribute}*='${value}']`)
    return this.getElementStyles(element)
  }

  getElementStyles (element) {
    let styles = {}
    if (element) {
      let dolly = element.cloneNode(false)
      dolly.id = ''
      dolly.height = '0'
      dolly.width = '0'
      dolly.overflow = 'hidden'
      element.parentNode.appendChild(dolly)
      let defaultStyles = window.getComputedStyle(dolly)
      for (let style in defaultStyles) {
        if (style !== ~~style + '' && !(typeof defaultStyles[ style ] === 'object' || typeof defaultStyles[ style ] === 'function')) {
          styles[ style ] = defaultStyles[ style ]
        }
      }
      dolly.remove()
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
    if (this.state.devices[ this.state.currentDevice ].display) {
      return null
    }

    let value = this.state.devices[ this.state.currentDevice ].image || ''
    return <div className='vcv-ui-form-group'>
      <span className='vcv-ui-form-group-heading'>
        Background image
      </span>
      <AttachImage
        api={this.props.api}
        fieldKey='attachImage'
        options={{
          multiple: false
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
      delete newState.devices[ newState.currentDevice ].image
    } else {
      newState.devices[ newState.currentDevice ].image = value
    }
    this.updateValue(newState)
  }

  /**
   * Render background style
   * @returns {*}
   */
  getBackgroundStyleRender () {
    if (this.state.devices[ this.state.currentDevice ].display || !this.state.devices[ this.state.currentDevice ].hasOwnProperty('image') ||
      this.state.devices[ this.state.currentDevice ].image.urls.length === 0) {
      return null
    }
    let options = {
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
    let value = this.state.devices[ this.state.currentDevice ].backgroundStyle || ''
    if (value === '') {

    }
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
          label: 'Default',
          value: ''
        },
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
    let value = this.state.devices[ this.state.currentDevice ].borderStyle || ''
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
            {this.getBackgroundColorRender()}
            {this.getAttachImageRender()}
            {this.getBackgroundStyleRender()}
            {this.getBorderStyleRender()}
            {this.getBorderColorRender()}
            {this.getAnimationRender()}
          </div>
        </div>
      </div>
    )
  }
}

export default DesignOptionsJK

import React from 'react'
import classNames from 'classnames'
import lodash from 'lodash'
import AttachImage from '../attachimage/Component'
import Toggle from '../toggle/Component'
import AnimateDropdown from '../animateDropdown/Component'
import Color from '../color/Component'
import Devices from './devices'
import Attribute from '../attribute'
import vcCake from 'vc-cake'

class DesignOptions extends Attribute {
  static propTypes = {
    value: React.PropTypes.any
  }

  static defaultState = {
    deviceTypes: 'all',
    device: 'all',
    used: false,
    visibleDevices: {}
  }

  updateState (props) {
    let state = {
      deviceTypes: this.getValue(props, 'deviceTypes', null, DesignOptions.defaultState.deviceTypes),
      device: this.getValue(props, 'device', null, DesignOptions.defaultState.device),
      used: this.getValue(props, 'used', null, DesignOptions.defaultState.used),
      visibleDevices: this.getValue(props, 'visibleDevices', null, DesignOptions.defaultState.visibleDevices)
    }
    if (!vcCake.env('FEATURE_ROW_LAYOUT')) {
      state.defaultStyles = {}
      let frame = document.querySelector('#vcv-editor-iframe')
      let frameDocument = frame.contentDocument || frame.contentWindow.document
      let element = frameDocument.querySelector('#el-' + this.props.element.data.id)
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
            state[ 'defaultStyles' ][ style ] = defaultStyles[ style ]
          }
        }
        dolly.remove()
      }
    }
    // TODO: refactor DO, completely because of THIS kind of states
    Devices.getAll().map((device) => {
      state[ device.strid ] = {
        showOnDevice: this.getValue(props, 'showOnDevice', device, DesignOptions.defaultState[ device.strid ].showOnDevice),
        backgroundImage: this.getValue(props, 'backgroundImage', device, DesignOptions.defaultState[ device.strid ].backgroundImage),
        backgroundColor: this.getValue(props, 'backgroundColor', device, DesignOptions.defaultState[ device.strid ].backgroundColor),
        backgroundStyle: this.getValue(props, 'backgroundStyle', device, DesignOptions.defaultState[ device.strid ].backgroundStyle),
        borderColor: this.getValue(props, 'borderColor', device, DesignOptions.defaultState[ device.strid ].borderColor),
        borderStyle: this.getValue(props, 'borderStyle', device, DesignOptions.defaultState[ device.strid ].borderStyle),
        simplified: this.getValue(props, 'simplified', device, DesignOptions.defaultState[ device.strid ].simplified),
        borderTopLeftRadius: this.getValue(props, 'borderTopLeftRadius', device, DesignOptions.defaultState[ device.strid ].borderTopLeftRadius),
        borderTopRightRadius: this.getValue(props, 'borderTopRightRadius', device, DesignOptions.defaultState[ device.strid ].borderTopRightRadius),
        borderBottomLeftRadius: this.getValue(props, 'borderBottomLeftRadius', device, DesignOptions.defaultState[ device.strid ].borderBottomLeftRadius),
        borderBottomRightRadius: this.getValue(props, 'borderBottomRightRadius', device, DesignOptions.defaultState[ device.strid ].borderBottomRightRadius),
        marginTop: this.getValue(props, 'marginTop', device, DesignOptions.defaultState[ device.strid ].marginTop),
        marginLeft: this.getValue(props, 'marginLeft', device, DesignOptions.defaultState[ device.strid ].marginLeft),
        marginRight: this.getValue(props, 'marginRight', device, DesignOptions.defaultState[ device.strid ].marginRight),
        marginBottom: this.getValue(props, 'marginBottom', device, DesignOptions.defaultState[ device.strid ].marginBottom),
        borderTop: this.getValue(props, 'borderTop', device, DesignOptions.defaultState[ device.strid ].borderTop),
        borderLeft: this.getValue(props, 'borderLeft', device, DesignOptions.defaultState[ device.strid ].borderLeft),
        borderRight: this.getValue(props, 'borderRight', device, DesignOptions.defaultState[ device.strid ].borderRight),
        borderBottom: this.getValue(props, 'borderBottom', device, DesignOptions.defaultState[ device.strid ].borderBottom),
        paddingTop: this.getValue(props, 'paddingTop', device, DesignOptions.defaultState[ device.strid ].paddingTop),
        paddingLeft: this.getValue(props, 'paddingLeft', device, DesignOptions.defaultState[ device.strid ].paddingLeft),
        paddingRight: this.getValue(props, 'paddingRight', device, DesignOptions.defaultState[ device.strid ].paddingRight),
        paddingBottom: this.getValue(props, 'paddingBottom', device, DesignOptions.defaultState[ device.strid ].paddingBottom),
        animation: this.getValue(props, 'animation', device, DesignOptions.defaultState[ device.strid ].animation)
      }
    })
    return state
  }

  componentWillMount () {
    this.initBackgroundStyles()
    this.initBorderStyles()
  }

  componentDidMount () {
    let { updater, fieldKey } = this.props
    updater(fieldKey, this.state)
  }

  /**
   * Get object property using dot notation.
   *
   * @param {object} obj
   * @param {string} key E.g. 'foo.baz.baz'
   * @param defaultValue
   * @returns {*} Undefined if property doesn't exist.
   */
  getNested (obj, key, defaultValue) {
    let value = key.split('.').reduce((o, x) => {
      return (typeof o === 'undefined' || o === null) ? o : o[ x ]
    }, obj)
    if (typeof value === 'undefined' || value === null) {
      return defaultValue
    }
    return value
  }

  /**
   * Check if object property exists using dot notation.
   *
   * @param {object} obj
   * @param {string} key E.g. 'foo.baz.baz'
   * @returns {boolean}
   */
  hasNested (obj, key) {
    return key.split('.').every((x) => {
      if (typeof obj !== 'object' || obj === null || !(x in obj)) {
        return false
      }
      obj = obj[ x ]
      return true
    })
  }

  initBackgroundStyles () {
    let backgroundStyles = []
    let backgroundStyleValues = [
      { value: '', label: 'Default' },
      { value: 'cover', label: 'Cover' },
      { value: 'contain', label: 'Contain' },
      { value: 'no-repeat', label: 'No Repeat' },
      { value: 'repeat', label: 'Repeat' }
    ]

    for (let i = 0, len = backgroundStyleValues.length; i < len; i++) {
      let value = backgroundStyleValues[ i ].value
      let label = backgroundStyleValues[ i ].label
      backgroundStyles.push(<option key={`${this.props.fieldKey}.backgroundStyle:${value}`} value={value}>{label}</option>)
    }

    this.backgroundStyles = backgroundStyles
  }

  initBorderStyles () {
    let borderStyles = []
    let borderStyleValues = [
      { value: '', label: 'Default' },
      { value: 'solid', label: 'Solid' },
      { value: 'dotted', label: 'Dotted' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'none', label: 'None' },
      { value: 'hidden', label: 'Hidden' },
      { value: 'double', label: 'Double' },
      { value: 'groove', label: 'Groove' },
      { value: 'ridge', label: 'Ridge' },
      { value: 'inset', label: 'Inset' },
      { value: 'outset', label: 'Outset' },
      { value: 'initial', label: 'Initial' },
      { value: 'inherit', label: 'Inherit' }
    ]

    for (let i = 0, len = borderStyleValues.length; i < len; i++) {
      let value = borderStyleValues[ i ].value
      let label = borderStyleValues[ i ].label
      borderStyles.push(<option key={`${this.props.fieldKey}.borderStyle:${value}`} value={value}>{label}</option>)
    }

    this.borderStyles = borderStyles
  }

  validateBoxInput = (e) => {
    let value = e.target.value
    let units = [ 'px', 'em', 'rem', '%', 'vw', 'vh' ]
    let re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')

    if (value === '' || value.match(re)) {
      return
    }

    let deviceState = this.state[ this.state.device ]

    deviceState[ e.target.name ] = ''

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeBoxInput = (e) => {
    let deviceState = this.state[ this.state.device ]
    let deviceValue = e.target.value
    deviceValue = deviceValue.replace(/\s+/g, '')
    deviceState[ e.target.name ] = deviceValue
    if (this.state[ this.state.device ].simplified) {
      switch (e.target.name) {
        case 'marginTop':
          deviceState.marginRight = deviceValue
          deviceState.marginBottom = deviceValue
          deviceState.marginLeft = deviceValue
          break
        case 'paddingTop':
          deviceState.paddingRight = deviceValue
          deviceState.paddingBottom = deviceValue
          deviceState.paddingLeft = deviceValue
          break
        case 'borderTop':
          deviceState.borderRight = deviceValue
          deviceState.borderBottom = deviceValue
          deviceState.borderLeft = deviceValue
          break
        case 'borderTopRightRadius':
          deviceState.borderBottomRightRadius = deviceValue
          deviceState.borderBottomLeftRadius = deviceValue
          deviceState.borderTopLeftRadius = deviceValue
          break
      }
    }
    this.changeState({
      [this.state.device]: deviceState
    })
  }

  toggleSimplifyControls = (fieldKey, active) => {
    let deviceState = this.state[ this.state.device ]
    let margin = deviceState.marginTop
    let radius = deviceState.borderTopRightRadius
    let border = deviceState.borderTop
    let padding = deviceState.paddingTop
    this.changeState({
      [this.state.device]: {
        simplified: active,

        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,

        marginTop: margin,
        marginLeft: margin,
        marginRight: margin,
        marginBottom: margin,

        borderTop: border,
        borderLeft: border,
        borderRight: border,
        borderBottom: border,

        paddingTop: padding,
        paddingLeft: padding,
        paddingRight: padding,
        paddingBottom: padding
      }
    })
  }

  changeBackgroundImage = (fieldKey, value) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.backgroundImage = value

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeBackgroundColor = (fieldKey, value) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.backgroundColor = value

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeBorderColor = (fieldKey, value) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.borderColor = value

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeAnimation = (fieldKey, value) => {
    let deviceState = this.state[ this.state.device ]
    deviceState.animation = value
    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeBackgroundStyle = (e) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.backgroundStyle = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeBorderStyle = (e) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.borderStyle = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeState (state) {
    let newState = lodash.merge({}, this.state, state)
    let { updater, fieldKey } = this.props
    newState.visibleDevices = {}
    let omitStates = [ 'used', 'visibleDevices', 'device', 'defaultStyles', 'deviceTypes' ]
    newState.used = !lodash.isEqual(lodash.omit(newState, omitStates), lodash.omit(DesignOptions.defaultState, omitStates))
    Devices.getAll().forEach((device) => {
      if (newState[ device.strid ].showOnDevice && !lodash.isEqual(newState[ device.strid ], DesignOptions.defaultState[ device.strid ])) {
        newState.visibleDevices[ device.strid ] = device.prefix
      }
    })
    this.setState(newState)
    // remove working variables
    delete newState.defaultStyles
    updater(fieldKey, newState)
  }

  getValue (props, name, device, defaultValue) {
    let key = (device ? device.strid + '.' : '') + name

    if (this.hasNested(props.value, key)) {
      return this.getNested(props.value, key, defaultValue)
    }

    return defaultValue
  }

  renderInput (name, position, isDisabled = false) {
    let classes = classNames([
      'vcv-ui-form-input',
      'vcv-ui-design-options-onion-control-position--' + position
    ])

    let value = this.state[ this.state.device ][ name ]
    let placeholder = '-'
    if (!vcCake.env('FEATURE_ROW_LAYOUT')) {
      if (parseInt(this.state.defaultStyles[ name ])) {
        placeholder = this.state.defaultStyles[ name ]
      }
    }
    return (
      <input
        type='text'
        placeholder={placeholder}
        className={classes}
        name={name}
        onChange={this.changeBoxInput}
        onBlur={this.validateBoxInput}
        disabled={isDisabled}
        title={value}
        value={value} />
    )
  }

  changeDevice = (value) => {
    this.changeState({
      device: value
    })
  }

  changeDeviceType = (e) => {
    // set active device. Desktop by default. ( First device is always 'all', so desktop is 2nd)
    let desktop = Devices.getAll()[ 1 ].strid
    let newState = {
      deviceTypes: e.target.value,
      device: e.target.value === 'all' ? 'all' : desktop
    }

    if (newState.device === 'all') {
      // get switch to all, take values from desktop
      Devices.getAll().forEach((device) => {
        if (device.strid === 'all') {
          newState[ device.strid ] = this.state[ desktop ]
          newState[ device.strid ].showOnDevice = DesignOptions.defaultState[ device.strid ].showOnDevice
        } else {
          newState[ device.strid ] = DesignOptions.defaultState[ device.strid ]
        }
      })
    } else {
      // get switch to custom, take values from all
      Devices.getAll().forEach((device) => {
        if (device.strid === 'all') {
          newState[ device.strid ] = DesignOptions.defaultState[ device.strid ]
        } else {
          newState[ device.strid ] = this.state[ 'all' ]
        }
      })
    }
    this.changeState(newState)
  }

  changeShowOnDevice = (fieldKey, show) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.showOnDevice = show

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  render () {
    let backgroundImageProps = {
      updater: this.changeBackgroundImage,
      fieldKey: `${this.props.fieldKey}.backgroundImage`,
      value: this.state[ this.state.device ].backgroundImage,
      options: {
        multiple: false
      }
    }

    let isBorderSpecified = !!(
      parseInt(this.state[ this.state.device ].borderTop) ||
      parseInt(this.state[ this.state.device ].borderRight) ||
      parseInt(this.state[ this.state.device ].borderBottom) ||
      parseInt(this.state[ this.state.device ].borderLeft)
    )

    let hasImages = this.state[ this.state.device ].backgroundImage.ids.length > 0
    let borderStyleOutput = null
    let borderColorOutput = null
    let animationOutput = null
    if (isBorderSpecified) {
      borderStyleOutput = (
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            Border style
          </span>
          <select
            name='borderStyle'
            className='vcv-ui-form-dropdown'
            value={this.state[ this.state.device ].borderStyle}
            onChange={this.changeBorderStyle}>
            {this.borderStyles}
          </select>
        </div>
      )
      borderColorOutput = (
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>
            Border color
          </span>
          <Color
            value={this.state[ this.state.device ].borderColor}
            updater={this.changeBorderColor}
            fieldKey={`${this.props.fieldKey}.borderColor`}
            api={this.props.api}
          />
        </div>
      )
    }
    animationOutput = (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          Animate
        </span>
        <AnimateDropdown
          value={this.state[ this.state.device ].animation}
          updater={this.changeAnimation}
          fieldKey={`${this.props.fieldKey}.animation`}
          api={this.props.api}
        />
      </div>
    )

    let devicesListOutput = null
    let showOnDeviceCustomOutput = null
    if (this.state.deviceTypes === 'custom') {
      devicesListOutput = (
        <div className='vcv-ui-col vcv-ui-col--fixed-width'>
          <div className='vcv-ui-form-group'>
            <Devices value={this.state.device} onChange={this.changeDevice} />
          </div>
        </div>
      )
      showOnDeviceCustomOutput = (
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <Toggle
            value={this.state[ this.state.device ].showOnDevice}
            fieldKey={`${this.props.fieldKey}.showOnDevice`}
            updater={this.changeShowOnDevice}
          />
          <span className='vcv-ui-form-group-heading'>Show on device</span>
        </div>
      )
    }
    return (
      <div className='vcv-ui-design-options-container'>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            <div className='vcv-ui-form-group'>
              <select className='vcv-ui-form-dropdown' onChange={this.changeDeviceType} value={this.state.deviceTypes}>
                <option value='all'>All devices</option>
                <option value='custom'>Custom device settings</option>
              </select>
            </div>
          </div>
          {devicesListOutput}
        </div>
        <div className='vcv-ui-row vcv-ui-row-gap--md'>
          <div className='vcv-ui-col vcv-ui-col--fixed-width'>
            {showOnDeviceCustomOutput}
            {(this.state.deviceTypes === 'all' || this.state[ this.state.device ].showOnDevice) && (
              <div className='vcv-ui-form-group'>
                <div className='vcv-ui-design-options-onion'>
                  <div className='vcv-ui-design-options-onion-layers'>
                    <div className='vcv-ui-design-options-onion-layer--margin'>
                      <span className='vcv-ui-form-group-heading'>
                        Margin
                      </span>
                      {this.renderInput('marginTop', 'top')}
                      {this.renderInput('marginRight', 'right', this.state[ this.state.device ].simplified)}
                      {this.renderInput('marginBottom', 'bottom', this.state[ this.state.device ].simplified)}
                      {this.renderInput('marginLeft', 'left', this.state[ this.state.device ].simplified)}
                    </div>
                    <div className='vcv-ui-design-options-onion-layer--padding'>
                      <span className='vcv-ui-form-group-heading'>
                        Padding
                      </span>
                      {this.renderInput('paddingTop', 'top')}
                      {this.renderInput('paddingRight', 'right', this.state[ this.state.device ].simplified)}
                      {this.renderInput('paddingBottom', 'bottom', this.state[ this.state.device ].simplified)}
                      {this.renderInput('paddingLeft', 'left', this.state[ this.state.device ].simplified)}
                    </div>
                    <div className='vcv-ui-design-options-onion-layer--border'>
                      <span className='vcv-ui-form-group-heading'>
                        Border
                      </span>
                      {this.renderInput('borderTop', 'top')}
                      {this.renderInput('borderRight', 'right', this.state[ this.state.device ].simplified)}
                      {this.renderInput('borderBottom', 'bottom', this.state[ this.state.device ].simplified)}
                      {this.renderInput('borderLeft', 'left', this.state[ this.state.device ].simplified)}
                    </div>
                    <div className='vcv-ui-design-options-onion-layer--border-radius'>
                      <span className='vcv-ui-form-group-heading'>
                        Radius
                      </span>
                      {this.renderInput('borderTopRightRadius', 'top-right')}
                      {this.renderInput('borderBottomRightRadius', 'bottom-right', this.state[ this.state.device ].simplified)}
                      {this.renderInput('borderBottomLeftRadius', 'bottom-left', this.state[ this.state.device ].simplified)}
                      {this.renderInput('borderTopLeftRadius', 'top-left', this.state[ this.state.device ].simplified)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(this.state.deviceTypes === 'all' || this.state[ this.state.device ].showOnDevice) && (
              <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
                <Toggle
                  value={this.state[ this.state.device ].simplified}
                  fieldKey={`${this.props.fieldKey}.showOnDevice`}
                  updater={this.toggleSimplifyControls}
                  api={this.props.api}
                />
                <span className='vcv-ui-form-group-heading'>Simple controls</span>
              </div>
            )}
          </div>
          {(this.state.deviceTypes === 'all' || this.state[ this.state.device ].showOnDevice) && (
            <div className='vcv-ui-col vcv-ui-col--fixed-width'>
              <div className='vcv-ui-form-group'>
                <span className='vcv-ui-form-group-heading'>
                  Background color
                </span>
                <Color
                  value={this.state[ this.state.device ].backgroundColor}
                  updater={this.changeBackgroundColor}
                  fieldKey={`${this.props.fieldKey}.backgroundColor`}
                  api={this.props.api}
                />
              </div>
              <div className='vcv-ui-form-group'>
                <span className='vcv-ui-form-group-heading'>
                  Background image
                </span>
                <AttachImage {...backgroundImageProps} />
              </div>
              {(hasImages) && (
                <div className='vcv-ui-form-group'>
                  <span className='vcv-ui-form-group-heading'>
                    Background style
                  </span>
                  <select
                    name='backgroundStyle'
                    className='vcv-ui-form-dropdown'
                    value={this.state[ this.state.device ].backgroundStyle}
                    disabled={!hasImages}
                    onChange={this.changeBackgroundStyle}>
                    {this.backgroundStyles}
                  </select>
                </div>
              )}
              {borderStyleOutput}
              {borderColorOutput}
              {animationOutput}
            </div>
          )}
        </div>
      </div>
    )
  }
}

Devices.getAll().map((device) => {
  DesignOptions.defaultState[ device.strid ] = {
    showOnDevice: true,
    backgroundImage: { ids: [], urls: [] },
    backgroundColor: '',
    backgroundStyle: '',
    borderColor: '',
    borderStyle: 'solid',
    simplified: false,
    borderTopLeftRadius: '',
    borderTopRightRadius: '',
    borderBottomLeftRadius: '',
    borderBottomRightRadius: '',
    marginTop: '',
    marginLeft: '',
    marginRight: '',
    marginBottom: '',
    borderTop: '',
    borderLeft: '',
    borderRight: '',
    borderBottom: '',
    paddingTop: '',
    paddingLeft: '',
    paddingRight: '',
    paddingBottom: '',
    animation: ''
  }
})

export default DesignOptions

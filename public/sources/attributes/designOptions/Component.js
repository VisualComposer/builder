import React from 'react'
import classNames from 'classnames'
import lodash from 'lodash'
import AttachImage from '../attachimage/Component'
import Toggle from '../toggle/Component'
import Devices from './devices'
import Attribute from '../attribute'

class DesignOptions extends Attribute {
  static propTypes = {
    value: React.PropTypes.object
  }

  updateState (props) {
    let state = {
      deviceTypes: this.getValue(props, 'deviceTypes', null, 'all'),
      device: this.getValue(props, 'device', null, 'all')
    }
    Devices.getAll().map((device) => {
      state[ device.strid ] = {
        showOnDevice: this.getValue(props, 'showOnDevice', device, true),
        backgroundImage: this.getValue(props, 'backgroundImage', device, { ids: [], urls: [] }),
        backgroundColor: this.getValue(props, 'backgroundColor', device, ''),
        backgroundStyle: this.getValue(props, 'backgroundStyle', device, ''),
        borderColor: this.getValue(props, 'borderColor', device, ''),
        borderStyle: this.getValue(props, 'borderStyle', device, ''),
        simplified: this.getValue(props, 'simplified', device, true),
        borderTopLeftRadius: this.getValue(props, 'borderTopLeftRadius', device, ''),
        borderTopRightRadius: this.getValue(props, 'borderTopRightRadius', device, ''),
        borderBottomLeftRadius: this.getValue(props, 'borderBottomLeftRadius', device, ''),
        borderBottomRightRadius: this.getValue(props, 'borderBottomRightRadius', device, ''),
        marginTop: this.getValue(props, 'marginTop', device, ''),
        marginLeft: this.getValue(props, 'marginLeft', device, ''),
        marginRight: this.getValue(props, 'marginRight', device, ''),
        marginBottom: this.getValue(props, 'marginBottom', device, ''),
        borderTop: this.getValue(props, 'borderTop', device, ''),
        borderLeft: this.getValue(props, 'borderLeft', device, ''),
        borderRight: this.getValue(props, 'borderRight', device, ''),
        borderBottom: this.getValue(props, 'borderBottom', device, ''),
        paddingTop: this.getValue(props, 'paddingTop', device, ''),
        paddingLeft: this.getValue(props, 'paddingLeft', device, ''),
        paddingRight: this.getValue(props, 'paddingRight', device, ''),
        paddingBottom: this.getValue(props, 'paddingBottom', device, '')
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
      backgroundStyles.push(<option key={'borderStyle:' + value} value={value}>{label}</option>)
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
      borderStyles.push(<option key={'borderStyle:' + value} value={value}>{label}</option>)
    }

    this.borderStyles = borderStyles
  }

  validateBoxInput = (e) => {
    let value = e.target.value
    let units = [ 'px', 'em', 'rem', '%' ]
    let re = new RegExp('^-?\\d+(\\.\\d{0,9})?(' + units.join('|') + ')?$')

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

  changeBackgroundColor = (e) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.backgroundColor = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  }

  changeBorderColor = (e) => {
    let deviceState = this.state[ this.state.device ]

    deviceState.borderColor = e.target.value

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
    let newState = lodash.merge(this.state, state)
    let { updater, fieldKey } = this.props
    this.setState(newState)
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

    return (
      <input
        type='text'
        placeholder='-'
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
    // First device is always 'all', so we choose 2nd.
    let device = (e.target.value === 'all' ? 'all' : Devices.getAll()[ 1 ].strid)

    let newState = {
      deviceTypes: e.target.value,
      device: device
    }

    if (e.target.value === 'custom') {
      Devices.getAll().map((device) => {
        if (device.strid !== 'all') {
          newState[ device.strid ] = this.state.all
        }
      })
    } else {
      Devices.getAll().map((device) => {
        if (device.strid === 'all') {
          newState[ device.strid ] = this.state[ this.state.device ]
        } else {
          newState[ device.strid ] = null
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
      fieldKey: 'backgroundImage',
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
    if (isBorderSpecified) {
      borderStyleOutput = (
        <div className='vcv-ui-col vcv-ui-col--xs-8'>
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
        </div>
      )
      borderColorOutput = (
        <div className='vcv-ui-col vcv-ui-col--xs-4'>
          <div className='vcv-ui-form-group'>
            <span className='vcv-ui-form-group-heading'>
              Border color
            </span>
            <input
              name='borderColor'
              type='color'
              value={this.state[ this.state.device ].borderColor}
              onChange={this.changeBorderColor} />
          </div>
        </div>
      )
    }

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
            fieldKey='showOnDevice'
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
                  fieldKey='showOnDevice'
                  updater={this.toggleSimplifyControls}
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
                <input
                  className='vcv-ui-form-input-color'
                  name='backgroundColor'
                  type='color'
                  value={this.state[ this.state.device ].backgroundColor}
                  onChange={this.changeBackgroundColor} />
              </div>
              <div className='vcv-ui-form-group'>
                <span className='vcv-ui-form-group-heading'>
                  Background image
                </span>
                <AttachImage {...backgroundImageProps} />
              </div>

              <div className='vcv-ui-row vcv-ui-row-gap--sm'>
                <div className='vcv-ui-col vcv-ui-col--xs-8'>
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
                </div>
                {borderStyleOutput}
                {borderColorOutput}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default DesignOptions

/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var classNames = require('classnames')
import lodash from 'lodash'
import AttachImage from '../../../../../../sources/attributes/attachimage/Component'
import Toggle from '../../../../../../sources/attributes/toggle/Component'
import Devices from './devices'

var DesignOptions = React.createClass({
  propTypes: {
    changeDesignOption: React.PropTypes.func,
    values: React.PropTypes.object
  },

  getInitialState: function () {
    let state = {
      deviceTypes: 'all',
      device: 'all'
    }

    Devices.getAll().map((device) => {
      state[ device.strid ] = {
        showOnDevice: true,
        backgroundImage: { ids: [], urls: [] },
        backgroundColor: '',
        backgroundStyle: '',
        borderColor: '',
        borderStyle: '',
        simplified: true,
        borderTopRightRadius: '',
        borderBottomRightRadius: '',
        borderBottomLeftRadius: '',
        borderTopLeftRadius: '',
        marginTop: '',
        marginRight: '',
        marginBottom: '',
        marginLeft: '',
        borderTop: '',
        borderRight: '',
        borderBottom: '',
        borderLeft: '',
        paddingTop: '',
        paddingRight: '',
        paddingBottom: '',
        paddingLeft: ''
      }
    })

    return state
  },

  componentWillMount () {
    this.initBackgroundStyles()
    this.initBorderStyles()

    let state = {
      deviceTypes: this.getValue('deviceTypes'),
      device: this.getValue('device')
    }

    Devices.getAll().map((device) => {
      state[ device.strid ] = {
        showOnDevice: this.getValue('showOnDevice', device),
        backgroundImage: this.getValue('backgroundImage', device),
        backgroundColor: this.getValue('backgroundColor', device),
        backgroundStyle: this.getValue('backgroundStyle', device),
        borderColor: this.getValue('borderColor', device),
        borderStyle: this.getValue('borderStyle', device),
        simplified: this.getValue('simplified', device),
        borderTopRightRadius: this.getValue('borderTopRightRadius', device),
        borderBottomRightRadius: this.getValue('borderBottomRightRadius', device),
        borderBottomLeftRadius: this.getValue('borderBottomLeftRadius', device),
        borderTopLeftRadius: this.getValue('borderTopLeftRadius', device),
        marginTop: this.getValue('marginTop', device),
        marginRight: this.getValue('marginRight', device),
        marginBottom: this.getValue('marginBottom', device),
        marginLeft: this.getValue('marginLeft', device),
        borderTop: this.getValue('borderTop', device),
        borderRight: this.getValue('borderRight', device),
        borderBottom: this.getValue('borderBottom', device),
        borderLeft: this.getValue('borderLeft', device),
        paddingTop: this.getValue('paddingTop', device),
        paddingRight: this.getValue('paddingRight', device),
        paddingBottom: this.getValue('paddingBottom', device),
        paddingLeft: this.getValue('paddingLeft', device)
      }
    })

    this.setState(state)
  },

  /**
   * Get object property using dot notation.
   *
   * @param {object} obj
   * @param {string} key E.g. 'foo.baz.baz'
   * @returns {*} Undefined if property doesn't exist.
   */
  getNested: function (obj, key) {
    return key.split('.').reduce((o, x) => {
      return (typeof o === 'undefined' || o === null) ? o : o[ x ]
    }, obj)
  },

  /**
   * Check if object property exists using dot notation.
   *
   * @param {object} obj
   * @param {string} key E.g. 'foo.baz.baz'
   * @returns {boolean}
   */
  hasNested: function (obj, key) {
    return key.split('.').every((x) => {
      if (typeof obj !== 'object' || obj === null || !(x in obj)) {
        return false
      }
      obj = obj[ x ]
      return true
    })
  },

  initBackgroundStyles: function () {
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
  },

  initBorderStyles: function () {
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
  },

  validateBoxInput: function (e) {
    let value = e.target.value
    let units = ['px', 'em', 'rem', '%']
    let re = new RegExp('^-?\\d+(\\.\\d{0,9})?(' + units.join('|') + ')?$')

    if (value === '' || value.match(re)) {
      return
    }

    let deviceState = this.state[ this.state.device ]

    deviceState[ e.target.name ] = ''

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  changeBoxInput: function (e) {
    let deviceState = this.state[ this.state.device ]

    deviceState[ e.target.name ] = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  toggleSimplifyControls: function (fieldKey, active) {
    let deviceState = this.state[ this.state.device ]
    this.changeState({
      [this.state.device]: {
        simplified: active,
        borderTopRightRadius: deviceState.borderTopRightRadius,
        borderBottomRightRadius: deviceState.borderTopRightRadius,
        borderBottomLeftRadius: deviceState.borderTopRightRadius,
        borderTopLeftRadius: deviceState.borderTopRightRadius,
        marginRight: deviceState.marginTop,
        marginBottom: deviceState.marginTop,
        marginLeft: deviceState.marginTop,
        borderRight: deviceState.borderTop,
        borderBottom: deviceState.borderTop,
        borderLeft: deviceState.borderTop,
        paddingRight: deviceState.paddingTop,
        paddingBottom: deviceState.paddingTop,
        paddingLeft: deviceState.paddingTop
      }
    })
  },

  changeBackgroundImage: function (fieldKey, value) {
    let deviceState = this.state[ this.state.device ]

    deviceState.backgroundImage = value

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  changeBackgroundColor: function (e) {
    let deviceState = this.state[ this.state.device ]

    deviceState.backgroundColor = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  changeBorderColor: function (e) {
    let deviceState = this.state[ this.state.device ]

    deviceState.borderColor = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  changeBackgroundStyle: function (e) {
    let deviceState = this.state[ this.state.device ]

    deviceState.backgroundStyle = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  changeBorderStyle: function (e) {
    let deviceState = this.state[ this.state.device ]

    deviceState.borderStyle = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  changeState: function (state) {
    let newState = lodash.merge(this.state, state)
    this.replaceState(newState)
    this.props.changeDesignOption(newState)
  },

  getValue: function (name, device) {
    let key = (device ? device.strid + '.' : '') + name

    if (this.hasNested(this.props.values, key)) {
      return this.getNested(this.props.values, key)
    }

    return this.getNested(this.state, key)
  },

  renderInput: function (name, position, isDisabled = false) {
    var classes = classNames([
      'vcv-ui-form-input',
      'vcv-ui-design-options-onion-control-position--' + position
    ])

    let value = isDisabled ? '' : this.state[ this.state.device ][ name ]

    return <input
      type="text"
      placeholder="-"
      className={classes}
      name={name}
      onChange={this.changeBoxInput}
      onBlur={this.validateBoxInput}
      disabled={isDisabled}
      value={value} />
  },

  changeDevice: function (value) {
    this.changeState({
      device: value
    })
  },

  changeDeviceType: function (e) {
    // First device is always "all", so we choose 2nd.
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
  },

  changeShowOnDevice: function (fieldKey, show) {
    let deviceState = this.state[ this.state.device ]

    deviceState.showOnDevice = show

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  render: function () {
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

    return (
      <div className="vcv-ui-design-options-container">
        <div className="vcv-ui-row vcv-ui-row-gap--md">
          <div className="vcv-ui-col vcv-ui-col--fixed-width">
            <div className="vcv-ui-form-group">
              <select className="vcv-ui-form-dropdown" onChange={this.changeDeviceType} value={this.state.deviceTypes}>
                <option value="all">All devices</option>
                <option value="custom">Custom device settings</option>
              </select>
            </div>
          </div>
          {this.state.deviceTypes === 'custom' &&
            <div className="vcv-ui-col vcv-ui-col--fixed-width">
              <div className="vcv-ui-form-group">
                <Devices value={this.state.device} onChange={this.changeDevice} />
              </div>
            </div>
          }
        </div>
        <div className="vcv-ui-row vcv-ui-row-gap--md">
          <div className="vcv-ui-col vcv-ui-col--fixed-width">
            {this.state.deviceTypes === 'custom' &&
              <div className="vcv-ui-form-group vcv-ui-form-group-style--inline">
                <Toggle
                  value={this.state[ this.state.device ].showOnDevice}
                  fieldKey="showOnDevice"
                  updater={this.changeShowOnDevice}
                />
                <span className="vcv-ui-form-group-heading">Show on device</span>
              </div>
            }
            {(this.state.deviceTypes === 'all' || this.state[ this.state.device ].showOnDevice) &&
              <div className="vcv-ui-form-group">
                <div className="vcv-ui-design-options-onion">
                  <div className="vcv-ui-design-options-onion-layers">
                    <div className="vcv-ui-design-options-onion-layer--margin">
                      <span className="vcv-ui-form-group-heading">
                        Margin
                      </span>
                      {this.renderInput('marginTop', 'top')}
                      {this.renderInput('marginRight', 'right', this.state[ this.state.device ].simplified)}
                      {this.renderInput('marginBottom', 'bottom', this.state[ this.state.device ].simplified)}
                      {this.renderInput('marginLeft', 'left', this.state[ this.state.device ].simplified)}
                    </div>
                    <div className="vcv-ui-design-options-onion-layer--padding">
                      <span className="vcv-ui-form-group-heading">
                        Padding
                      </span>
                      {this.renderInput('paddingTop', 'top')}
                      {this.renderInput('paddingRight', 'right', this.state[ this.state.device ].simplified)}
                      {this.renderInput('paddingBottom', 'bottom', this.state[ this.state.device ].simplified)}
                      {this.renderInput('paddingLeft', 'left', this.state[ this.state.device ].simplified)}
                    </div>
                    <div className="vcv-ui-design-options-onion-layer--border">
                      <span className="vcv-ui-form-group-heading">
                        Border
                      </span>
                      {this.renderInput('borderTop', 'top')}
                      {this.renderInput('borderRight', 'right', this.state[ this.state.device ].simplified)}
                      {this.renderInput('borderBottom', 'bottom', this.state[ this.state.device ].simplified)}
                      {this.renderInput('borderLeft', 'left', this.state[ this.state.device ].simplified)}
                    </div>
                    <div className="vcv-ui-design-options-onion-layer--border-radius">
                      <span className="vcv-ui-form-group-heading">
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
            }
            {(this.state.deviceTypes === 'all' || this.state[ this.state.device ].showOnDevice) &&
              <div className="vcv-ui-form-group vcv-ui-form-group-style--inline">
                <Toggle
                  value={this.state[ this.state.device ].simplified}
                  fieldKey="showOnDevice"
                  updater={this.toggleSimplifyControls}
                />
                <span className="vcv-ui-form-group-heading">Simple controls</span>
              </div>
            }
          </div>
          {(this.state.deviceTypes === 'all' || this.state[ this.state.device ].showOnDevice) &&
            <div className="vcv-ui-col vcv-ui-col--fixed-width">
              <div className="vcv-ui-form-group">
                <span className="vcv-ui-form-group-heading">
                  Background color
                </span>
                <input
                  className="vcv-ui-form-input-color"
                  name="backgroundColor"
                  type="color"
                  value={this.state[ this.state.device ].backgroundColor}
                  onChange={this.changeBackgroundColor} />
              </div>
              <div className="vcv-ui-form-group">
                <span className="vcv-ui-form-group-heading">
                  Background image
                </span>
                <AttachImage {...backgroundImageProps} />
              </div>

              <div className="vcv-ui-row vcv-ui-row-gap--sm">
                <div className="vcv-ui-col vcv-ui-col--xs-8">
                  <div className="vcv-ui-form-group">
                    <span className="vcv-ui-form-group-heading">
                      Background style
                    </span>
                    <select
                      name="backgroundStyle"
                      className="vcv-ui-form-dropdown"
                      value={this.state[ this.state.device ].backgroundStyle}
                      disabled={!hasImages}
                      onChange={this.changeBackgroundStyle}>
                      {this.backgroundStyles}
                    </select>
                  </div>
                </div>
                <div className="vcv-ui-col vcv-ui-col--xs-8">
                  <div className="vcv-ui-form-group">
                    <span className="vcv-ui-form-group-heading">
                      Border style
                    </span>
                    <select
                      name="borderStyle"
                      className="vcv-ui-form-dropdown"
                      value={this.state[ this.state.device ].borderStyle}
                      disabled={!isBorderSpecified}
                      onChange={this.changeBorderStyle}>
                      {this.borderStyles}
                    </select>
                  </div>
                </div>
                <div className="vcv-ui-col vcv-ui-col--xs-4">
                  <div className="vcv-ui-form-group">
                    <span className="vcv-ui-form-group-heading">
                      Border color
                    </span>
                    <input
                      name="borderColor"
                      type="color"
                      value={this.state[ this.state.device ].borderColor}
                      disabled={!isBorderSpecified}
                      onChange={this.changeBorderColor} />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
})

module.exports = DesignOptions

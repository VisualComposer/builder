/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var classNames = require('classnames')
import lodash from 'lodash'
import AttachImage from '../../../../../../sources/attributes/attachimage/Component'
import Toggle from '../../../../../../sources/attributes/toggle/Component'
import Devices from './devices'

require('../../css/styles.less')

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

  changeBoxInput: function (e) {
    let deviceState = this.state[ this.state.device ]

    deviceState[ e.target.name ] = e.target.value

    this.changeState({
      [this.state.device]: deviceState
    })
  },

  toggleSimplifyControls: function (e) {
    let deviceState = this.state[ this.state.device ]

    this.changeState({
      [this.state.device]: {
        simplified: e.target.checked,
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

  renderInput: function (name, position) {
    var classes = classNames([ 'vcv-ui-design-options-input', 'vcv-ui-design-options-input-' + position ])

    return <input
      type="number"
      placeholder="-"
      className={classes}
      name={name}
      onChange={this.changeBoxInput}
      value={this.state[ this.state.device ][ name ]} />
  },

  handleDeviceChange: function (value) {
    this.changeState({
      device: value
    })
  },

  handleDeviceTypesChange: function (e) {
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
      newState[ 'all' ] = this.state[ this.state.device ]
    }

    this.changeState(newState)
  },

  handleShowOnDeviceChange: function (fieldKey, show) {
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

    let cssBoxClasses = classNames({
      'vcv-ui-form-group': true,
      'vcv-ui-design-options': true,
      'vcv-ui-design-options-simplified': this.state[ this.state.device ].simplified
    })

    let isBorderSpecified = !!(
      parseInt(this.state[ this.state.device ].borderTop) ||
      parseInt(this.state[ this.state.device ].borderRight) ||
      parseInt(this.state[ this.state.device ].borderBottom) ||
      parseInt(this.state[ this.state.device ].borderLeft)
    )

    return (
      <div>

        <table width="100%">
          <tbody>
            <tr>
              <td width="50%">
                <select onChange={this.handleDeviceTypesChange} value={this.state.deviceTypes}>
                  <option value="all">All devices</option>
                  <option value="custom">Custom device settings</option>
                </select>

                {this.state.deviceTypes === 'custom' &&
                  <Toggle
                    value={this.state[ this.state.device ].showOnDevice}
                    fieldKey="showOnDevice"
                    updater={this.handleShowOnDeviceChange}
                  />
                }

              </td>
              <td width="50%">
                {this.state.deviceTypes === 'custom' &&
                  <Devices value={this.state.device} onChange={this.handleDeviceChange} />
                }
              </td>
            </tr>
          </tbody>
        </table>

        <div className="vcv-ui-design-options-container">

          <div className="vcv-ui-design-options-css-box">
            <div className="vcv-ui-form-group">
              <span className="vcv-ui-form-group-heading">
                CSS box
              </span>
            </div>

            <div className={cssBoxClasses}>
              <div className="vcv-ui-design-options-box vcv-ui-design-options-margins-box">
                <label className="vcv-ui-design-options-label">Margin</label>
                <label className="vcv-ui-design-options-label vcv-ui-design-options-label-top-right">Radius</label>

                {this.renderInput('borderTopRightRadius', 'top-right')}
                {this.renderInput('borderBottomRightRadius', 'bottom-right')}
                {this.renderInput('borderBottomLeftRadius', 'bottom-left')}
                {this.renderInput('borderTopLeftRadius', 'top-left')}

                {this.renderInput('marginTop', 'top')}
                {this.renderInput('marginRight', 'right')}
                {this.renderInput('marginBottom', 'bottom')}
                {this.renderInput('marginLeft', 'left')}
                <div className="vcv-ui-design-options-box vcv-ui-design-options-borders-box">
                  <label className="vcv-ui-design-options-label">Border</label>
                  {this.renderInput('borderTop', 'top')}
                  {this.renderInput('borderRight', 'right')}
                  {this.renderInput('borderBottom', 'bottom')}
                  {this.renderInput('borderLeft', 'left')}
                  <div className="vcv-ui-design-options-box vcv-ui-design-options-paddings-box">
                    <label className="vcv-ui-design-options-label">Padding</label>
                    {this.renderInput('paddingTop', 'top')}
                    {this.renderInput('paddingRight', 'right')}
                    {this.renderInput('paddingBottom', 'bottom')}
                    {this.renderInput('paddingLeft', 'left')}
                    <div className="vcv-ui-design-options-logo">
                      <img src={require('../../images/logo.png')} />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="vcv-ui-form-group">
              <label className="vcv-ui-form-checkbox">
                <input
                  type="checkbox"
                  onChange={this.toggleSimplifyControls}
                  checked={this.state[ this.state.device ].simplified}
                />
                <span className="vcv-ui-form-checkbox-indicator"></span>
                Simplify controls
              </label>
            </div>
          </div>

          <div className="vcv-ui-design-options-other">

            <div className="vcv-ui-form-group">
              <span className="vcv-ui-form-group-heading">
                Background color
              </span>
              <input
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

            {(this.state[ this.state.device ].backgroundImage.ids.length > 0) &&
              <div className="vcv-ui-form-group">
                <span className="vcv-ui-form-group-heading">
                  Background style
                </span>
                <select
                  name="backgroundStyle"
                  className="vcv-ui-form-dropdown"
                  value={this.state[ this.state.device ].backgroundStyle}
                  onChange={this.changeBackgroundStyle}>
                  {this.backgroundStyles}
                </select>
              </div>}

            {isBorderSpecified &&
              <div className="vcv-ui-form-group">
                <span className="vcv-ui-form-group-heading">
                  Border style
                </span>
                <select
                  name="borderStyle"
                  className="vcv-ui-form-dropdown"
                  value={this.state[ this.state.device ].borderStyle}
                  onChange={this.changeBorderStyle}>
                  {this.borderStyles}
                </select>
              </div>}

            {isBorderSpecified &&
              <div className="vcv-ui-form-group">
                <span className="vcv-ui-form-group-heading">
                  Border color
                </span>
                <input
                  name="borderColor"
                  type="color"
                  value={this.state[ this.state.device ].borderColor}
                  onChange={this.changeBorderColor} />
              </div>}

          </div>

        </div>
      </div>
    )
  }
})

module.exports = DesignOptions

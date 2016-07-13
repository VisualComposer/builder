/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var classNames = require('classnames')
import lodash from 'lodash'

require('../css/styles.less')

var DesignOptions = React.createClass({
  propTypes: {
    changeDesignOption: React.PropTypes.func,
    values: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      backgroundColor: '',
      borderColor: '',
      borderStyle: '',
      borderRadius: '',
      simplified: false,
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
  },

  componentWillMount () {
    this.initBorderStyles()
    this.initBorderRadiuses()
  },

  componentDidMount: function () {
    this.setState({
      backgroundColor: this.getValue('backgroundColor'),
      borderColor: this.getValue('borderColor'),
      borderStyle: this.getValue('borderStyle'),
      borderRadius: this.getValue('borderRadius'),
      simplified: this.getValue('simplified'),
      marginTop: this.getValue('marginTop'),
      marginRight: this.getValue('marginRight'),
      marginBottom: this.getValue('marginBottom'),
      marginLeft: this.getValue('marginLeft'),
      borderTop: this.getValue('borderTop'),
      borderRight: this.getValue('borderRight'),
      borderBottom: this.getValue('borderBottom'),
      borderLeft: this.getValue('borderLeft'),
      paddingTop: this.getValue('paddingTop'),
      paddingRight: this.getValue('paddingRight'),
      paddingBottom: this.getValue('paddingBottom'),
      paddingLeft: this.getValue('paddingLeft')
    })
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

  initBorderRadiuses: function () {
    let borderRadiuses = []
    let borderRadiusValues = [
      { value: '', label: 'None' },
      { value: '1px', label: '1px' },
      { value: '2px', label: '2px' },
      { value: '3px', label: '3px' },
      { value: '4px', label: '4px' },
      { value: '5px', label: '5px' },
      { value: '10px', label: '10px' },
      { value: '15px', label: '15px' },
      { value: '20px', label: '20px' },
      { value: '25px', label: '25px' },
      { value: '30px', label: '30px' },
      { value: '35px', label: '35px' }
    ]

    for (let i = 0, len = borderRadiusValues.length; i < len; i++) {
      let value = borderRadiusValues[ i ].value
      let label = borderRadiusValues[ i ].label
      borderRadiuses.push(<option key={'borderRadius:' + value} value={value}>{label}</option>)
    }

    this.borderRadiuses = borderRadiuses
  },

  changeBoxInput: function (e) {
    this.changeState({
      [e.target.name]: e.target.value
    })
  },

  toggleSimplifyControls: function (e) {
    this.changeState({
      simplified: e.target.checked,
      marginRight: this.state.marginTop,
      marginBottom: this.state.marginTop,
      marginLeft: this.state.marginTop,
      borderRight: this.state.borderTop,
      borderBottom: this.state.borderTop,
      borderLeft: this.state.borderTop,
      paddingRight: this.state.paddingTop,
      paddingBottom: this.state.paddingTop,
      paddingLeft: this.state.paddingTop
    })
  },

  changeBackgroundColor: function (e) {
    this.changeState({
      backgroundColor: e.target.value
    })
  },

  changeBorderColor: function (e) {
    this.changeState({
      borderColor: e.target.value
    })
  },

  changeBorderStyle: function (e) {
    this.changeState({
      borderStyle: e.target.value
    })
  },

  changeBorderRadius: function (e) {
    this.changeState({
      borderRadius: e.target.value
    })
  },

  changeState: function (state) {
    let newState = lodash.merge(this.state, state)
    this.replaceState(newState)
    this.props.changeDesignOption(newState)
  },

  getValue: function (name) {
    return (this.props.values && this.props.values[ name ]) ? this.props.values[ name ] : ''
  },

  renderInput: function (name, position) {
    var classes = classNames([ 'vcv-ui-design-options-input', 'vcv-ui-design-options-input-' + position ])

    return <input
      type="number"
      placeholder="-"
      className={classes}
      name={name}
      onChange={this.changeBoxInput}
      value={this.state[name]} />
  },

  render: function () {
    var cssBoxClasses = classNames({
      'vc_ui-form-group': true,
      'vcv-ui-design-options': true,
      'vcv-ui-design-options-simplified': this.state.simplified
    })

    return (
      <div className="vcv-ui-design-options-container">

        <div className="vcv-ui-design-options-css-box">
          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
              CSS box
            </span>
          </div>

          <div className={cssBoxClasses}>
            <div className="vcv-ui-design-options-box vcv-ui-design-options-margins-box">
              <label className="vcv-ui-design-options-label">margin</label>
              {this.renderInput('marginTop', 'top')}
              {this.renderInput('marginRight', 'right')}
              {this.renderInput('marginBottom', 'bottom')}
              {this.renderInput('marginLeft', 'left')}
              <div className="vcv-ui-design-options-box vcv-ui-design-options-borders-box">
                <label className="vcv-ui-design-options-label">border</label>
                {this.renderInput('borderTop', 'top')}
                {this.renderInput('borderRight', 'right')}
                {this.renderInput('borderBottom', 'bottom')}
                {this.renderInput('borderLeft', 'left')}
                <div className="vcv-ui-design-options-box vcv-ui-design-options-paddings-box">
                  <label className="vcv-ui-design-options-label">padding</label>
                  {this.renderInput('paddingTop', 'top')}
                  {this.renderInput('paddingRight', 'right')}
                  {this.renderInput('paddingBottom', 'bottom')}
                  {this.renderInput('paddingLeft', 'left')}
                  <div className="vcv-ui-design-options-logo">
                    <img src={require('../images/logo.png')} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="vc_ui-form-group">
            <label className="vc_ui-form-checkbox">
              <input type="checkbox" onClick={this.toggleSimplifyControls} checked={this.state.simplified} />
              <span className="vc_ui-form-checkbox-indicator"></span>
              Simplify controls
            </label>
          </div>
        </div>

        <div className="vcv-ui-design-options-other">

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
              Border color
            </span>
            <input
              name="borderColor"
              type="color"
              value={this.state.borderColor}
              onChange={this.changeBorderColor} />
          </div>

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
              Border style
            </span>
            <select
              name="borderStyle"
              className="vc_ui-form-dropdown"
              value={this.state.borderStyle}
              onChange={this.changeBorderStyle}>
              {this.borderStyles}
            </select>
          </div>

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
              Border radius
            </span>
            <select
              name="borderRadius"
              className="vc_ui-form-dropdown"
              value={this.state.borderRadius}
              onChange={this.changeBorderRadius}>
              {this.borderRadiuses}
            </select>
          </div>

          <div className="vc_ui-form-group">
            <span className="vc_ui-form-group-heading">
              Background color
            </span>
            <input
              name="backgroundColor"
              type="color"
              value={this.state.backgroundColor}
              onChange={this.changeBackgroundColor} />
          </div>

        </div>

      </div>
    )
  }
})

module.exports = DesignOptions

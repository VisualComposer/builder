/*eslint jsx-quotes: [2, "prefer-double"]*/
var React = require('react')
var classNames = require('classnames')
import lodash from 'lodash'
import AttachImage from '../../../../../sources/attributes/attachimage/Component'

require('../css/styles.less')

var DesignOptions = React.createClass({
  propTypes: {
    changeDesignOption: React.PropTypes.func,
    values: React.PropTypes.object
  },

  getInitialState: function () {
    return {
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
  },

  componentWillMount () {
    this.initBackgroundStyles()
    this.initBorderStyles()

    this.setState({
      backgroundImage: this.getValue('backgroundImage'),
      backgroundColor: this.getValue('backgroundColor'),
      backgroundStyle: this.getValue('backgroundStyle'),
      borderColor: this.getValue('borderColor'),
      borderStyle: this.getValue('borderStyle'),
      simplified: this.getValue('simplified'),
      borderTopRightRadius: this.getValue('borderTopRightRadius'),
      borderBottomRightRadius: this.getValue('borderBottomRightRadius'),
      borderBottomLeftRadius: this.getValue('borderBottomLeftRadius'),
      borderTopLeftRadius: this.getValue('borderTopLeftRadius'),
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
    this.changeState({
      [e.target.name]: e.target.value
    })
  },

  toggleSimplifyControls: function (e) {
    this.changeState({
      simplified: e.target.checked,
      borderTopRightRadius: this.state.borderTopRightRadius,
      borderBottomRightRadius: this.state.borderTopRightRadius,
      borderBottomLeftRadius: this.state.borderTopRightRadius,
      borderTopLeftRadius: this.state.borderTopRightRadius,
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

  changeBackgroundImage: function (fieldKey, value) {
    this.changeState({
      backgroundImage: value
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

  changeBackgroundStyle: function (e) {
    this.changeState({
      backgroundStyle: e.target.value
    })
  },

  changeBorderStyle: function (e) {
    this.changeState({
      borderStyle: e.target.value
    })
  },

  changeState: function (state) {
    let newState = lodash.merge(this.state, state)
    this.replaceState(newState)
    this.props.changeDesignOption(newState)
  },

  getValue: function (name) {
    return (this.props.values && this.props.values[ name ]) ? this.props.values[ name ] : this.state[ name ]
  },

  renderInput: function (name, position) {
    var classes = classNames([ 'vcv-ui-design-options-input', 'vcv-ui-design-options-input-' + position ])

    return <input
      type="number"
      placeholder="-"
      className={classes}
      name={name}
      onChange={this.changeBoxInput}
      value={this.state[ name ]} />
  },

  render: function () {
    let backgroundImageProps = {
      updater: this.changeBackgroundImage,
      fieldKey: 'backgroundImage',
      value: this.state.backgroundImage,
      options: {
        multiple: false
      }
    }

    let cssBoxClasses = classNames({
      'vcv-ui-form-group': true,
      'vcv-ui-design-options': true,
      'vcv-ui-design-options-simplified': this.state.simplified
    })

    let isBorderSpecified = !!(
      parseInt(this.state.borderTop) ||
      parseInt(this.state.borderRight) ||
      parseInt(this.state.borderBottom) ||
      parseInt(this.state.borderLeft)
    )

    return (
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
                    <img src={require('../images/logo.png')} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="vcv-ui-form-group">
            <label className="vcv-ui-form-checkbox">
              <input type="checkbox" onClick={this.toggleSimplifyControls} defaultChecked={this.state.simplified} />
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
              value={this.state.backgroundColor}
              onChange={this.changeBackgroundColor} />
          </div>

          <div className="vcv-ui-form-group">
            <span className="vcv-ui-form-group-heading">
              Background image
            </span>
            <AttachImage {...backgroundImageProps} />
          </div>

          {(this.state.backgroundImage.ids.length > 0) &&
            <div className="vcv-ui-form-group">
              <span className="vcv-ui-form-group-heading">
                Background style
              </span>
              <select
                name="backgroundStyle"
                className="vcv-ui-form-dropdown"
                value={this.state.backgroundStyle}
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
                value={this.state.borderStyle}
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
                value={this.state.borderColor}
                onChange={this.changeBorderColor} />
            </div>}

        </div>

      </div>
    )
  }
})

module.exports = DesignOptions

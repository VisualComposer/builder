import React from 'react';

export default class Component extends React.Component {
  componentWillMount() {
    var optionElements = [];
    var {values} = this.props.options;
    var {fieldKey} = this.props;

    for (let key in values) {
      let value = values[key].value;
      let label = values[key].label;
      optionElements.push(<option key={fieldKey+':'+value} value={value}>{label}</option>);
    }

    this.selectChilds = optionElements;
  }

  render() {
    console.log({renderDropdownAttribute: this.props});

    var {fieldKey, value} = this.props;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{fieldKey}</label>
        <select
          value={value}
          className="vc_ui-form-dropdown"
        >
          {this.selectChilds}
        </select>
      </div>
    );
  }
}

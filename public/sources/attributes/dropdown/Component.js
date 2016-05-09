import React from 'react';
import Attribute from '../attribute';

export default class Component extends Attribute {
  componentWillMount() {
    let optionElements = [];
    let {values} = this.props.options;
    let {fieldKey} = this.props;

    for (let key in values) {
      let value = values[key].value;
      let label = values[key].label;
      optionElements.push(<option key={fieldKey+':'+key+':'+value} value={value}>{label}</option>);
    }

    this.selectChilds = optionElements;
  }

  render() {
    // TODO: Fix title.
    let {fieldKey} = this.props;
    let {value} = this.state;
    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{fieldKey}</label>
        <select
          value={value}
          onChange={this.handleChange.bind(this)}
          className="vc_ui-form-dropdown"
        >
          {this.selectChilds}
        </select>
      </div>
    );
  }
}

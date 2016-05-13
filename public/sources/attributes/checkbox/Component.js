import React from 'react';
import Attribute from '../attribute';
export default class Component extends Attribute {
  handleChange(event) {
    let value = event.target.value;
    let values = [];
    if (typeof this.state.value === 'string' && this.state.value) {
      values = this.state.value.split(',');
    }
    if (event.target.checked) {
      values.push(value);
    } else {
      values.splice(values.indexOf(value), 1);
    }
    value = values.join(',');
    this.setFieldValue(value);
  }

  render() {
    let {fieldKey} = this.props;
    let optionElements = [];
    let values = this.props.options.values;
    let currentValues = [];
    if (typeof this.state.value === 'string' && this.state.value) {
      currentValues = this.state.value.split(',');
    }
    for (let key in values) {
      let value = values[key].value;
      let checked = currentValues.indexOf(value) !== -1 ? "checked" : "";
      optionElements.push(
        <label key={fieldKey+':'+key+':'+value} className="vc_ui-form-checkbox">
          <input type='checkbox' onChange={this.handleChange} checked={checked} value={value}/>
          <span className="vc_ui-form-checkbox-indicator"></span>
          {values[key].label}
        </label>
      );
    }
    return (
      <div>
        {optionElements}
      </div>);
  }
}

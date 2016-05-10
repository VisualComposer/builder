import React from 'react';
import Attribute from '../attribute';
export default class Component extends Attribute {
  handleChange(event) {
    let values = this.state.value;
    let value = event.target.value;
    values = values.split(',');
    if (-1 === values.indexOf(value)) {
      values.push(value);
    } else {
      values.splice(values.indexOf(value), 1);
    }
    event.target.value = values.join(',');
    super.handleChange(event);
  }

  render() {
    let optionElements = [];
    let values = this.props.options.values;
    let currentValues = (this.state.value || "").split(',');
    //TODO: change key to something unique
    for (let key in values) {
      let value = values[key].value;
      let checked = currentValues.indexOf(value) !== -1 ? "checked" : "";
      optionElements.push(
        <label key={value} className="vc_ui-form-checkbox">
          <input type='checkbox' onChange={this.handleChange} checked={checked} value={value}/>
          <span className="vc_ui-form-checkbox-indicator"></span>
          {values[key].label}
        </label>
      );
    }
    return (<div>{optionElements}</div>);
  }
}

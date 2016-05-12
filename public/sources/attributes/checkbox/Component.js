import React from 'react';
import Attribute from '../attribute';
export default class Component extends Attribute {
  handleChange(event) {
    let values = this.state.value;
    let targetValue = event.target.value;
    values = values.split(',');
    if (event.target.checked) {
      // If checked add value
      values.push(targetValue);
    } else {
      // Else remove from list
      values.splice(values.indexOf(targetValue), 1);
    }
    var value = values.join(',');
    super.handleChange(event, value);
  }

  render() {
    let {fieldKey} = this.props;
    let optionElements = [];
    let values = this.props.options.values;
    let currentValues = (this.state.value || "").split(',');
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
      <div key={fieldKey}>
        {optionElements}
      </div>);
  }
}

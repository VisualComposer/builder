import React from 'react';
import Attribute from '../attribute';

export default class Component extends Attribute {
  handleChange(event) {
    var combinedValue = Array.from(
      this.refs[this.props.name + 'Component'].querySelectorAll('[name*=' + this.props.name + ']:checked')
    ).map(
      function(item) {
        return item.value;
      }
    ).join(',');
    event.target.value = combinedValue;
    super.handleChange(event);
  }

  render() {
    let optionElements = [];
    let values = this.props.options.values;
    let name = this.props.name + '[]';
    let currentValues = (this.state.value || "").split(',');
    // TODO: change key to something unique
    for (let key in values) {
      let value = values[key].value;
      let checked = currentValues.indexOf(value) !== -1 ? "checked" : "";
      optionElements.push(
        <label key={value} className="vc_ui-form-checkbox">
          <input type='checkbox' name={name} onChange={this.handleChange.bind(this)} checked={checked} value={value}/>
          <span className="vc_ui-form-checkbox-indicator"></span>
          {values[key].label}
        </label>
      );
    }
    return (
      <div ref={this.props.name + 'Component'} value={this.state.value} className="vc_ui-form-group">
        <div className="vc_ui-form-group-heading">Checkbox</div>
        {optionElements}
      </div>
    );
  }
}

import React from 'react';

export default class Component extends React.Component {
  handleChange() {
    var combinedValue = Array.from(
      this.refs[this.props.name + 'Component'].querySelectorAll('[name*=' + this.props.name + ']:checked')
    ).map(
      function(item) {
        return item.value;
      }
    ).join(',');
    //this.setState(value);
    //this.updateElement(value.value);
  }

  render() {
    console.log({renderCheckboxAttribute: this.props});
    var optionElements = [];
    var values = this.props.settings.options.values;
    var name = this.props.name + '[]';
    var currentValues = (this.state.value || "").split(',');
    // TODO: change key to something unique
    for (let key in values) {
      let value = options[key].value;
      let checked = currentValues.indexOf(value) !== -1 ? "checked" : "";
      optionElements.push(
        <label key={value} className="vc_ui-form-checkbox">
          <input type='checkbox' name={name} onChange={this.handleChange} checked={checked} value={value}/>
          <span className="vc_ui-form-checkbox-indicator"></span>
          {options[key].label}
        </label>
      );
    }
    return (
      <div ref={this.props.name + 'Component'} value={this.state.value} className="vc_ui-form-group">
        <div className="vc_ui-form-group-heading">{this.props.settings.getTitle()}</div>
        {optionElements}
      </div>
    );
  }
}

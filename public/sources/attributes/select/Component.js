var React = require('react');
var ParamMixin = require('../param-mixin');
module.exports = React.createClass({
  mixins: [ParamMixin],
  componentWillMount: function() {
    let settings = this.props.settings.getSettings(),
      options = settings.options ? settings.options : [];

    this.options = this.normalizeOptions(options);
  },

  /**
   * Convert options into standardized form
   *
   * Options can be passed as:
   * - Array of objects: [ { value: 'LV', label: 'Latvia' }, { value: 'LT', label: 'Lithuania' }, { value: 'EE', label: 'Estonia' } ]
   * - Object: { 'LV': 'Latvia', 'LT': 'Lithuania', 'EE': 'Estonia' }
   * - Array: [ 'Latvia', 'Lithuania', 'Estonia' ]
   *
   * and are returned as first variant (array of objects)
   *
   * @param options Object
   * @returns Object
   */
  normalizeOptions: function(options) {
    var isArray = Object.prototype.toString.call(options) === '[object Array]',
      normalizedOptions = [];

    if (!options) {
      return normalizedOptions;
    }

    for (let key in options) {
      let item;

      if (!options.hasOwnProperty(key)) {
        continue;
      }

      if (typeof(options[key]) === 'string') {
        if (isArray) {
          item = {value: options[key], label: options[key]};
        } else {
          item = {value: key, label: options[key]}
        }
      } else {
        item = {value: options[key].value, label: options[key].label};
      }

      normalizedOptions.push(item);
    }

    return normalizedOptions;
  },

  render: function() {
    console.log('render select');
    // TODO: change key to something unique
    var optionElements = [<option key="-1"></option>],
      options = this.options;

    for (let key in this.options) {
      let value = options[key].value;
      optionElements.push(<option key={value} value={value}>{options[key].label}</option>);
    }

    return (
      <div className="vc_ui-form-group">
        <label className="vc_ui-form-group-heading">{this.props.settings.getTitle()}</label>
        <select
          onChange={this.handleChange}
          ref={this.props.name + 'Component'}
          value={this.state.value}
          className="vc_ui-form-dropdown"
        >
          {optionElements}
        </select>
      </div>
    );
  }
});

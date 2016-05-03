/**
 * Attribute uses React-Select component. For more info see:
 * @link https://github.com/JedWatson/react-select
 */

var React = require('react');
var Select = require('react-select');
var ParamMixin = require('../param-mixin');


require('../../../../node_modules/react-select/dist/react-select.min.css');

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

  onChange: function(selected) {
    let value = selected ? selected.value : null;

    this.setState({
      value: value
    });

    this.updateElement(value);
  },

  render: function() {
    let value = this.state.value;

    return (
      <div>
        <label>{this.props.settings.getTitle()}</label>

        <Select
          ref={this.props.name + 'Component'}
          onChange={this.onChange}
          options={this.options}
          value={value}
        />
      </div>
    );
  }
});

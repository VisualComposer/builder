var vcCake = require('vc-cake');
let React = require('react');
let ParamMixin = require('../param-mixin');
let Setter = require('./Setter');
let Getter = require('./Getter');
let ElementComponents = vcCake.getService('element').components;

var AttributesChecker = function(update) {
  return {
    values: {},
    setAttribute: function(name, value) {
      this.values[name] = value;
      update(this.values);
    },
    getAttribute: function(element, key) {
      return this.values[key];
    }
  };
};
module.exports = React.createClass({
  mixins: [ParamMixin],
  setter: Setter,
  getter: Getter,
  values: {},
  componentWillMount: function() {
    this.attributesChecker = new AttributesChecker(this.customHandleChange);
  },
  getParams: function(component) {
    return ElementComponents.get(component);
  },
  getComponent: function(component) {
    return require('../' + component + '/Component');
  },
  getElement: function(name, settings, value, element) {
    if ('public' === settings.getAccess()) {
      let ComponentView = this.getComponent(settings.getType().toLowerCase());
      return React.createElement(ComponentView, {
        value: value,
        key: vcCake.getService('utils').createKey(),
        element: element,
        settings: settings,
        name: name
      });
    }
    return null;
  },
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  },
  customHandleChange: function(values) {
    this.values = values;
    this.setState({value: JSON.stringify(values)});// todo fix this
    this.updateElement(values);
  },
  render: function() {
    let settings = this.props.settings.getSettings();
    if (settings && settings.component) {
      let returnList = "";
      let values = this.values = JSON.parse(this.state.value || null) || {};
      //ucfirst
      let params = settings.params || this.getParams(
          settings.component.charAt(0).toUpperCase() + settings.component.slice(1)
        );

      // render component params
      if (Object.getOwnPropertyNames(params).length) {
        returnList = Object.keys(params).map(function(key) {
          let ParamSettings = params[key];
          let ParamView = this.getElement(key,
            ParamSettings,
            values[key] || ParamSettings.toString(),
            this.attributesChecker);
          if (ParamView) {
            return (<div className="vc-v-form-row" key={['vc-v-edit-form-element-' , key]}>
              <div className="vc-v-form-row-control">
                {ParamView}
              </div>
            </div>);
          }
        }, this);
      }
      return (
        <div ref={this.props.name + 'Component'} value={this.state.value}>
          <label>{this.props.settings.getTitle()}</label>
          <div style={{padding:"20px"}}>{returnList}</div>
        </div>
      );
    } else {
      // return error. component must exist.
      throw new Error('no component provided for settings' + this.props.name);
    }
  }
});

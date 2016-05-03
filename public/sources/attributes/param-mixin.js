var vcCake = require('vc-cake');
var Mixin = {
  getInitialState: function() {
    //console.log( 'mixin getInitialState called' );
    /*var settings = this.props.settings.getSettings();
     if ( settings ) {
     if ( settings.onOpen ) {
     this.props.rulesManager.check(
     this.props,
     settings.onOpen,
     this.props.rulesManager.EVENT_TYPES.onOpen,
     (function () {
     console.log( 'check for onOpen:param finished', arguments, this );
     }).bind( this )
     );
     }
     }*/
    return {
      value: this.getValue()
    }
  },
  getValue: function() {
    return this.props.getValue();
  },
  handleChange: function(e) {
    var value = {value: this.refs[this.props.name + 'Component'].value};
    // this.props.rulesManager.onChange(value);
    // this.setState(value);
    this.updateElement(value.value);
  },
  updateElement: function(value) {
    this.props.setValue(value);
    // send it to manager
/*    if (this.setter) {
      this.props.element = this.setter(this.props.element, this.props.name, value);
    } else {
      this.props.element[this.props.name] = value;
    }*/
    // Her comes callback to update element not document data. from wrapper sent as props/state
  }
};

module.exports = Mixin;
var Mediator = require('../../helpers/Mediator');
var DataService = Mediator.getService('data');
var Mixin = {
    getInitialState: function() {
		console.log( 'mixin getInitialState called' );
		var settings = this.props.settings.getSettings();
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
		}
        return {
            value: this.props.value
        }
    },
    handleChange: function(e) {
        var value = { value: this.refs[this.props.name + 'Component'].value };
		var settings = this.props.settings.getSettings();
		if ( settings ) {
			if ( settings.onChange ) {
				this.props.rulesManager.check(
					value,
					settings.onChange,
					this.props.rulesManager.EVENT_TYPES.onChange,
					(function () {
						console.log( 'check for onChange:param finished', arguments, this );
					}).bind( this )
				);
			}
		}
        this.setState(value);
        this.updateElement(value.value);
    },
    updateElement: function(value) {
        this.setter(this.props.element, this.props.name, value);
        DataService.mutate(this.props.element);
    }
};

module.exports = Mixin;
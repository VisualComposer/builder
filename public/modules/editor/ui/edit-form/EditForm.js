var React = require( 'react' );
var Mediator = require( '../../../../helpers/Mediator' ); // need to remove too
var Modal = require('react-modal');
var Validator = require( '../../../validation/Validation' );
var ElementComponents = require( '../../../../helpers/ElementComponents' );
require('./EditForm.less');

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border				  : '0',
        backgroundColor		  : 'transparent'
    }
};
var DataChanged = {
    componentDidMount: function(){
        this.subscribe('app:edit', function(element){
            if('string' === typeof element) {
                element = Mediator.getService('data').get(element);
            }
            this.setState({editElement: element, modalIsOpen: true});
        }.bind(this));
    }
};
var reactObject = {
    mixins: [DataChanged],
    getInitialState: function () {
        return {modalIsOpen: false, editElement: {}};
    },
    cancelChanges: function(e) {
      this.closeModal(e);
    },
    closeModal: function (e) {
        e && e.preventDefault();
        this.setState(this.getInitialState());
    },
    getSettings: function() {
        return this.state.editElement.tagName ? ElementComponents.get(this.state.editElement.tagName) : {};
    },
	saveForm: function ( e ) {
		e && e.preventDefault();
		var settings = this.getSettings();
		var attributesService = Mediator.getService( 'attributes' );
		var returnList = Object.keys( settings ).map( function ( key ) {
			var ParamSettings = settings[ key ];
			var settingsValue = ParamSettings.getSettings();
			if ( settingsValue && settingsValue.validation ) {
				var value = attributesService.getElementValue( key, ParamSettings, this.state.editElement );
				console.log(
					{ "Param": key },
					{ "Value": value },
					{ "Rule": settingsValue.validation },
					{ isValid: Validator.checkValue( settingsValue.validation, value ) }
				);
			}
		}, this );
		this.closeModal();
	},
    getForm: function() {
        var settings = this.getSettings();
        var attributesService = Mediator.getService('attributes');
        var returnList = Object.keys(settings).map(function(key){
            var ParamSettings = settings[key];
            var ParamView = attributesService.getElement(key, ParamSettings, this.state.editElement);
            if(ParamView) {
                return <div className="vc-v-form-row" key={['vc-v-edit-form-element-' , key]}>
                        <label>{ParamSettings.getTitle()}</label>
                        <div className="vc-v-form-row-control">
                            {ParamView}
                        </div>
                    </div>;
            }
        }, this);
        return returnList;
    },
    render: function () {
        var elementSettings = this.getSettings();
        var title = elementSettings.name ? elementSettings.name.toString() : 'unknown';
        return (<Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">Edit {title}</h4>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={this.saveForm}>
                            {this.getForm()}
                            <button type="submit" onClick={this.saveForm}>Save</button> <button type="button" onClick={this.cancelChanges}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>);
    }
};

Mediator.installTo(reactObject);
module.exports = React.createClass( reactObject );
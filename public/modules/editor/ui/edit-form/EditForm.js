var React = require( 'react' );
var Mediator = require( '../../../../helpers/Mediator' ); // need to remove too
var Modal = require( 'react-modal' );
var RulesManager = require( '../../../rules-manager/RulesManager' );
var ElementComponents = require( '../../../../helpers/ElementComponents' );
var EditFormElement = require( './EditFormElement' );
require( './EditForm.less' );

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		border: '0',
		backgroundColor: 'transparent'
	}
};
var DataChanged = {
	componentDidMount: function () {
		this.subscribe( 'app:edit', function ( element ) {
			if ( 'string' === typeof element ) {
				element = Mediator.getService( 'data' ).get( element );
			}
			Mediator.channels['save'] = false;
			Mediator.channels['cancel'] = false;
			var settings = ElementComponents.get( element.tagName );
			var onSaveItems = settings.onSaveItems.toString();
			var onCancelItems = settings.onCancelItems.toString();
			var onValidateItems = settings.onValidateItems.toString();

			this.validateItems = 0;
			this.saveItems = 0;
			this.cancelItems = 0;
			this.setState( {
				editElement: element,
				modalIsOpen: true,
				onSaveItemsTotal: onSaveItems,
				onCancelItemsTotal: onCancelItems,
				onValidateItemsTotal: onValidateItems
			} );
		}.bind( this ) );
	}
};
var reactObject = {
	mixins: [ DataChanged ],
	validateItems: 0,
	saveItems:0,
	cancelItems:0,
	onValidateItemsAdd: function(data, cb) {
		this.validateItems+=data;
		this.state.onValidateItemsTotal == this.validateItems && cb();
	},
	onSaveItemsAdd: function(data, cb) {
		this.saveItems+=data;
		this.state.onSaveItemsTotal == this.saveItems && cb();
	},
	onCancelItemsAdd: function(data, cb) {
		this.cancelItems+=data;
		this.state.onCancelItemsTotal == this.cancelItems && cb();
	},
	getInitialState: function () {
		return { modalIsOpen: false, editElement: {}, valid: true };
	},
	cancelChanges: function ( e ) {
		e && e.preventDefault();
		this.publish( 'cancel', (function () {
			console.log( 'cancel callback called' );
			this.closeModal();
		}).bind( this ) );
	},
	closeModal: function ( e ) {
		e && e.preventDefault();
		this.replaceState( this.getInitialState() );
	},
	getSettings: function () {
		return this.state.editElement.tagName ? ElementComponents.get( this.state.editElement.tagName ) : {};
	},
	saveForm: function ( e ) {
		e && e.preventDefault();
		this.publish( 'save', (function () {
			console.log( 'save callback called' );
			this.closeModal();
		}).bind( this ) );
	},
	toggleVisible: function ( key, visible ) {
		var newState = {};
		newState[ 'editFormElementsVisible' + key ] = visible;
		this.setState( newState );
	},
	getForm: function () {
		console.log( 'getForm called' );
		var settings = this.getSettings();
		var returnList = [];
		var settingsKeys = Object.keys( settings );
		if ( settingsKeys.length ) {
			returnList = settingsKeys.map( function ( key ) {
				var paramSettings = settings[ key ];
				if ( 'public' === paramSettings.getAccess() ) {
					var isVisible = typeof this.state[ 'editFormElementsVisible' + key ] !== 'undefined' ? this.state[ 'editFormElementsVisible' + key ] : true;
					return (
						<EditFormElement
							key={['vc-v-edit-form-element-' , key]}
							paramSettings={paramSettings}
							editElement={this.state.editElement}
							paramKey={key}
							toggleVisible={this.toggleVisible}
							isVisible={isVisible}
							onSaveItemsAdd={this.onSaveItemsAdd}
							onCancelItemsAdd={this.onCancelItemsAdd}
							onValidateItemsAdd={this.onValidateItemsAdd}
							closeModal={this.closeModal}
							subscribe={this.subscribe}
							publish={this.publish}
						/>
					);
				}
			}, this ).filter( i=>i );
		}
		return returnList;
	},
	render: function () {
		console.log( 'render editForm' );
		var elementSettings = this.getSettings();
		var title = elementSettings.name ? elementSettings.name.toString() : 'unknown';
		return (<Modal
			isOpen={this.state.modalIsOpen}
			onRequestClose={this.cancelChanges}
			style={customStyles}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" onClick={this.cancelChanges}>
							<span aria-hidden="true">&times;</span>
						</button>
						<h4 className="modal-title">Edit {title}</h4>
					</div>
					<div className="modal-body">
						<form onSubmit={this.saveForm}>
							{this.getForm()}
							<button type="submit" onClick={this.saveForm} disabled={!this.state.valid}>Save</button>
							<button type="button" onClick={this.cancelChanges}>Cancel</button>
						</form>
					</div>
				</div>
			</div>
		</Modal>);
	}
};

Mediator.installTo( reactObject );
module.exports = React.createClass( reactObject );
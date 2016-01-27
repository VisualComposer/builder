var React = require( 'react' );
var Mediator = require( '../../../../helpers/Mediator' ); // need to remove too
var classNames = require( 'classnames' );
var RulesManager = require( '../../../rules-manager/RulesManager' );

require( './EditFormElement.less' );
var EditFormElement = React.createClass( {
	onOpen: function () {
		var { paramKey, paramSettings, editElement } = this.props;
		var settingsValue = paramSettings.getSettings();
		if ( settingsValue && settingsValue.onOpen ) {
			console.log( 'onOpen called' );
			var toggleVisible = this.props.toggleVisible;
			var type = paramSettings.getType().toLowerCase();
			var paramValue = this.getValue( editElement, type, paramKey );
			RulesManager.check(
				{ value: paramValue },
				settingsValue.onOpen,
				RulesManager.EVENT_TYPES.onOpen, (function () {
					this.props.publish( 'onOpenFinished', paramKey );
				}).bind( this ),
				{
					toggleVisible: toggleVisible
				}
			);
		}
	},
	onCancel: function ( cancelCallback ) {
		var { paramKey, paramSettings, editElement } = this.props;
		var settingsValue = paramSettings.getSettings();
		if ( settingsValue && settingsValue.onCancel ) {
			console.log( 'onCancel called' );
			var toggleVisible = this.props.toggleVisible;
			var type = paramSettings.getType().toLowerCase();
			var paramValue = this.getValue( editElement, type, paramKey );
			RulesManager.check(
				{ value: paramValue },
				settingsValue.onCancel,
				RulesManager.EVENT_TYPES.onCancel, (function () {
					this.props.onCancelItemsAdd( 1, cancelCallback );
				}).bind( this ),
				{
					toggleVisible: toggleVisible
				}
			);
		}
	},
	onSave: function ( saveCallback ) {
		var { paramKey, paramSettings, editElement } = this.props;
		var settingsValue = paramSettings.getSettings();
		if ( settingsValue && settingsValue.onSave ) {
			console.log( 'onSave called' );
			var toggleVisible = this.props.toggleVisible;
			var type = paramSettings.getType().toLowerCase();
			var paramValue = this.getValue( editElement, type, paramKey );
			RulesManager.check(
				{ value: paramValue },
				settingsValue.onSave,
				RulesManager.EVENT_TYPES.onSave, (function () {
					this.props.onSaveItemsAdd( 1, saveCallback );
				}).bind( this ),
				{
					toggleVisible: toggleVisible
				}
			);
		}
	},
	onChange: function ( value ) {
		var { paramKey, paramSettings } = this.props;
		var settingsValue = paramSettings.getSettings();
		if ( settingsValue && settingsValue.onChange ) {
			console.log( 'onChange called' );
			var toggleVisible = this.props.toggleVisible;
			RulesManager.check(
				value,
				settingsValue.onChange,
				RulesManager.EVENT_TYPES.onChange, (function () {
					this.props.publish( 'onChangeFinished', paramKey );
				}).bind( this ),
				{
					toggleVisible: toggleVisible
				}
			);
		}
	},
	componentWillMount: function () {
		//console.log( "EditFormElement componentWillMount call" );
		this.props.subscribe( 'save', (function ( saveCallback ) {
			this.onSave( saveCallback );
		}).bind( this ) );
		this.props.subscribe( 'cancel', (function ( cancelCallback ) {
			this.onCancel( cancelCallback );
		}).bind( this ) );
		this.onOpen();
	},
	getInitialState: function () {
		//console.log( 'EditFormElement getInitialState called' );
		return {};
	},
	getComponent: function ( type ) {
		return require( '../../../../sources/attributes/' + type + '/Component' );
	},
	getValue: function ( element, type, key ) {
		var Getter = require( '../../../../sources/attributes/' + type + '/Getter' );
		return Getter( element, key ); // todo fix maxlength/class/style names with prefix-postfix and fix default value
	},
	render: function () {
		var { paramKey, isVisible, paramSettings, editElement } = this.props;
		var formRowClasses = classNames(
			'vc-v-form-row',
			isVisible ? 'vc-rules-manager-visible' : 'vc-rules-manager-hidden'
		);
		var type = paramSettings.getType().toLowerCase();
		var ComponentView = this.getComponent( type );
		var paramValue = this.getValue( editElement, type, paramKey );

		return (
			<div className={formRowClasses}>
				<div className="vc-v-form-row-control">
					<ComponentView
						value={paramValue}
						key={Mediator.getService('utils').createKey()}
						element={editElement}
						settings={paramSettings}
						rulesManager={this}
						name={paramKey}></ComponentView>
				</div>
			</div>
		);
	}
} );
module.exports = EditFormElement;
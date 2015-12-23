var React = require('react');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too
var InlineEditorControl = require('./InlineEditorControl');

require('./less/inline-editor/inline-editor.less');


module.exports = React.createClass(Mediator.installTo({
	getInitialState: function() {
		return {
			activated: false
		}
	},
	//componentDidMount: function() {
	//	// inlineEditorPlugin.publish('app:inline', true, $element.data('vcElement'));
	//	this.subscribe('app:inline-edit', function(activate, elementID){
	//		this.setState({activated: activate});
	//	}.bind(this));
	//},
	getControlsList: function() {
		return [
			{ type: 'Bold', name: 'Bold', icon: 'glyphicon glyphicon-bold', style: {} },
			{ type: 'Italic', name: 'Italic', icon: 'glyphicon glyphicon-italic', style: {} },
			{ type: 'Underline', name: 'Underline', icon: 'glyphicon glyphicon-font', style: {textDecoration: 'underline'} }
		];
	},
	render: function() {
		var activated = this.state.activated;
		return (
			<ul className="vc_ui-inline-editor-controls">
				{this.getControlsList().map(function(control) {
					return <InlineEditorControl key={control.type} {...control}/>;
				}.bind(this))}
			</ul>
		);
	}
}));
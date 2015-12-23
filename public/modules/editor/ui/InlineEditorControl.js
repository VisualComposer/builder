var React = require('react');
var Mediator = require( '../../../helpers/Mediator' ); // need to remove too


module.exports = React.createClass(Mediator.installTo({
	clickHandler: function ( e ) {
		e.preventDefault();
		alert(this.props.name + ' clicked');
	},
	render: function() {
		return <li className="vc_ui-inline-editor-control" key={this.props.type}>
			<a onClick={this.clickHandler} className="vc_ui-inline-control-trigger">
				<i className={this.props.icon} style={this.props.style} title={this.props.name}></i>
			</a>
		</li>;
	}
}));
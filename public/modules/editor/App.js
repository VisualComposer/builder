var React = require( 'react' );
var Mediator = require( '../../helpers/Mediator' ); // need to remove too

var Navbar = require( './Navbar' );
var EditorLayout = require( './EditorLayout' );

require( './App.less' );

var App = React.createClass( {
	getInitialState: function () {
		return {
			elements: [
				{ element: 'TextBlock', name: 'Text Block' }
			],
			data: {}
		};
	},
	componentWillMount: function() {
		App.publish('app:mounted');
	},
	render: function () {
		return (
			<div>
				<Navbar elements={this.state.elements}/>
				<EditorLayout data={this.state.data}/>
			</div>
		);
	}
} );

Mediator.installTo( App );
module.exports = App;
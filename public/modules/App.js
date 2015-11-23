var React = require( 'react' );
var Navbar = require( './ui/Navbar' );
var Store = require( './store/Store' );
var Mediator = require( './helpers/Mediator' );
var EditorLayout = require( './ui/EditorLayout' );

require( './App.less' );

var App = React.createClass( {
	getInitialState: function () {

		return {
			elements: [
				{ element: 'TextBlock', name: 'Text Block' }
			],
			data: Store.data
		};
	},
	componentWillMount: function() {
		App.subscribe( 'store:add', function (element) {
			var elements = this.state.data;
			var newElements = elements.concat([element]);
			this.setState( { data: newElements } );
		}.bind(this));
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
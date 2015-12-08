var React = require( 'react' );
var Mediator = require( '../../helpers/Mediator' ); // need to remove too

var Navbar = require( './ui/Navbar' );
var HtmlLayout = require( './layouts/html/HtmlLayout' );
// var TreeLayout = require( './layouts/tree/TreeLayout' );
// var DataLayout = require( './layouts/data/DataLayout' );

var Editor = React.createClass( {
	getInitialState: function () {
		return {
			elements: [
				{ element: 'Section', name: 'Section' }
			],
			data: {}
		};
	},
	componentDidMount: function() {
		Editor.subscribe('data:changed', function(data) {
			this.setState({data: data});
		}.bind(this));
		Editor.publish('data:sync');
	},
	render: function () {
		return (
				<div>
					<Navbar elements={this.state.elements}/>
					<HtmlLayout data={this.state.data}/>
				</div>
		);
	}
} );

Mediator.installTo( Editor );
module.exports = Editor;
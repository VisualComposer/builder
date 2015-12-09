var React = require( 'react' );
var Mediator = require( '../../helpers/Mediator' ); // need to remove too

var Navbar = require( './ui/Navbar' );
var HtmlLayout = require( './layouts/html/HtmlLayout' );
var TreeLayout = require( './layouts/tree/TreeLayout' );
var DataLayout = require( './layouts/data/DataLayout' );
require('./Editor.css');
var Editor = React.createClass( {
	getInitialState: function () {
		return {
			data: {}
		};
	},
	componentDidMount: function() {
		Editor.subscribe('data:changed', function(document) {
			this.setState({data: document});
		}.bind(this));
		Editor.publish('data:sync');
	},
	render: function () {
		return (
				<div>
					<Navbar data={this.state.data}/>
					<HtmlLayout data={this.state.data}/>
					<DataLayout data={this.state.data}/>
				</div>
		);
	}
} );

Mediator.installTo( Editor );
module.exports = Editor;
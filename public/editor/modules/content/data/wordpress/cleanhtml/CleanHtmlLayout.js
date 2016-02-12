var React = require( 'react' );
var Element = require( './Element.js' );
var Mediator = require( '../../.././Mediator' ); // need to remove too

require( './CleanHtmlLayout.less' );

var DataChanged = {
	componentDidMount: function () {
		this.subscribe( 'data:changed', function ( document ) {
			this.setState( { data: document } );
		}.bind( this ) );
	},
	getInitialState: function () {
		return {
			data: {}
		}
	}
};

var Layout = React.createClass( Mediator.installTo( {
	mixins: [ DataChanged ],
	render: function () {
		let elementsList;
		if ( this.state.data.childNodes ) {
			let data = Array.prototype.slice.call( this.state.data.childNodes );
			let rootElement = data[ 0 ];
			elementsList = Array.prototype.slice.call( rootElement.childNodes ).map( function ( element ) {
				let data = Array.prototype.slice.call( element.childNodes );
				return <Element element={element} data={data} key={element.getAttribute('id')} level={1}/>
			} );
		}
		return (<div className="vc-v-layouts-cleanhtml">
			{elementsList}
		</div>);
	}
} ) );
module.exports = Layout;
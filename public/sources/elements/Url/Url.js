var React = require( 'react' );
var Url = React.createClass( {
	render: function () {
		var { key, url, title, editor, ...other } = this.props;
		return (<div className="vc-url" key={key} {...editor}>
			<a href={url}>{title}</a>
		</div>);
	}
} );
module.exports = Url;
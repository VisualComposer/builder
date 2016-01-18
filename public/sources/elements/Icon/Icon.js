var React = require( 'react' );
var classNames = require( 'classnames' );
require( './Icon.less' );
var Icon = React.createClass( {
	render: function () {
		var { key, content, icon, custom, ...other } = this.props;
		var className = classNames( 'vc-icon', 'glyphicon', icon );
		debugger;
		return (<span className={className} key={key} {...other}><b>{custom}</b>{content}</span>);
	}
} );
module.exports = Icon;
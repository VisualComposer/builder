var React = require( 'react' );
var classNames = require( 'classnames' );
require( './Icon.less' );
var Icon = React.createClass( {
	render: function () {
		var { key, content, icon, custom, editor, ...other } = this.props;
		var className = classNames( 'vc-icon', 'glyphicon', icon );
		return (<span className={className} key={key} {...editor}><b>{custom}</b>{content}</span>);
	}
} );
module.exports = Icon;
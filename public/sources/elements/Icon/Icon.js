var React = require( 'react' );
var classNames = require( 'classnames' );
require( './Icon.less' );
var Icon = React.createClass( {
	render: function () {
		var { key, content, ...other } = this.props;
		var className = classNames( 'vc-icon', 'glyphicon', this.props.icon );
		return (<span className={className} key={key} {...other}>{content}</span>);
	}
} );
module.exports = Icon;
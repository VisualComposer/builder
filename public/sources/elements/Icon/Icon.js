var vcCake = require('vc-cake');
var React = require( 'react' );
var classNames = require( 'classnames' );
var AssetManager = vcCake.getService('asset-manager');
require( './Icon.less' );

AssetManager.addStyle( 'Icon', 'todo-remove-me.less' );
AssetManager.addScript( 'Icon', 'todo-remove-me.js' );

var Icon = React.createClass( {
	render: function () {
		var { key, content, icon, custom, editor, ...other } = this.props;
		var className = classNames( 'vc-icon', 'glyphicon', icon );
		return (<span className={className} key={key} {...editor}><b>{custom}</b>{content}</span>);
	}
} );
module.exports = Icon;
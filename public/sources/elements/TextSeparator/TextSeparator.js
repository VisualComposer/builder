var React = require( 'react' );
var classNames = require( 'classnames' );
require( './separator.less' );

var Separator = React.createClass( {
	render: function () {
		var { key, title, color, customColor, style,position, borderWidth, elWidth, editor, ...other } = this.props;

		var inlineCss = customColor ? { style: { borderColor: customColor } } : {};
		var content = title ? <h4>{title}</h4> : "";
		var cssClass = classNames(
			'vc-separator',
			( elWidth ) ? 'vc-sep-width-' + elWidth : 'vc-sep-width-100',
			( style ) ? 'vc-sep-' + style : '',
			( borderWidth ) ? 'vc-sep-border-width-' + borderWidth : '',
			( color && ! customColor ) ? 'vc-sep-color-' + color : '',
			( position ) ? 'vc-sep-pos-' + position : '',
			( title ) ? 'vc-sep-has-text' : 'vc-sep-no-text'
		);
		return (
			<div className={cssClass} key={key} {...editor}>
				<span className="vc-sep-holder vc-sep-holder-l"><span {...inlineCss} className="vc-sep-line"></span></span>{content}<span className="vc-sep-holder vc-sep-holder-r"><span {...inlineCss} className="vc-sep-line"></span></span>
			</div>
		);
	}
} );
module.exports = Separator;
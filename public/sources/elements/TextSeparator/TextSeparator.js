var React = require( 'react' );
var classNames = require( 'classnames' );
require( './css/TextSeparator.css' );

var Separator = React.createClass( {
  getInitialState: function () {
    return {
      'alignment': 'semi-left',
      'style': 'solid-dots',
      'color': 'info'
    };
  },
	render: function () {
		var { key, title, editor, ...other } = this.props;

    title = 'Text separator';

		var content = title ? title : "";

    let elementClassName = classNames(
      "vce-text-separator",
      ( this.state.alignment ) ? 'vce-text-separator-align-' + this.state.alignment : '',
      ( this.state.style ) ? 'vce-text-separator-style-' + this.state.style : '',
      ( this.state.color ) ? 'vce-text-separator-color-' + this.state.color : ''
    );

		return (
      <h4 className={elementClassName} key={key} {...editor} {...other}>
        <span className="vce-text-separator-content">{content}</span>
      </h4>
		);
	}
} );
module.exports = Separator;
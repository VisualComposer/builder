let React = require( 'react' );
let Button = require( '../Button/Button' );
let Icon = require( '../Icon/Icon' );
let ElementDefaults = require( '../../../helpers/ElementDefaults' );

let CallToAction = React.createClass( {
	render: function () {
		let { key, content, buttonComponent, iconComponent, ...other } = this.props;

		let IconDefaults = ElementDefaults.get( 'Icon' );
		let ButtonDefaults = ElementDefaults.get( 'Button' );

		let buttonProps = JSON.parse( buttonComponent || null ) || ButtonDefaults;
		let iconProps = JSON.parse( iconComponent || null ) || IconDefaults;

		return (
			<div className="vc-cta-block" key={key} {...other}>
				<Button {...buttonProps}/>{content}<Icon {...iconProps} /></div>
		);
	}
} );
module.exports = CallToAction;
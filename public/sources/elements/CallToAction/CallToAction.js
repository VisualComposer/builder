var vcCake = require('vc-cake');
let React = require('react');
let Button = require('../Button/Button');
let Icon = require('../Icon/Icon');
let ElementDefaults = vcCake.getService('element').defaults;

let CallToAction = React.createClass({
  render: function() {
    let {key, content, buttonComponent, iconComponent, editor, ...other} = this.props;

    let IconDefaults = ElementDefaults.get('Icon');
    let ButtonDefaults = ElementDefaults.get('Button');

    let buttonProps = JSON.parse(buttonComponent || null) || ButtonDefaults;
    let iconProps = JSON.parse(iconComponent || null) || IconDefaults;

    return (
      <div className="vc-cta-block" key={key} {...editor}>
        <Button {...buttonProps}/>{content}<Icon {...iconProps} /></div>
    );
  }
});
module.exports = CallToAction;
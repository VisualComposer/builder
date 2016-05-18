import {getService} from 'vc-cake';
getService('cook').add(
  {"tag":{"access":"protected","type":"string","value":"1eba8840-1ef2-46ad-adc3-ac48ad60a201"},"name":{"type":"string","access":"protected","value":"Button"},"buttonText":{"type":"string","access":"public","value":"Button text","options":{"label":"Button text"}},"textColor":{"type":"dropdown","access":"public","value":"white","options":{"label":"Text color","values":[{"label":"Default","value":"default"},{"label":"Silver","value":"silver"},{"label":"White","value":"white"},{"label":"Nero","value":"nero"},{"label":"Mortar","value":"mortar"},{"label":"Fire brick","value":"fire-brick"},{"label":"Coral","value":"coral"},{"label":"Medium wood","value":"medium-wood"},{"label":"Amber","value":"amber"},{"label":"Canary","value":"canary"},{"label":"Olive","value":"olive"},{"label":"Pear","value":"pear"},{"label":"Teal","value":"teal"},{"label":"Turquoise","value":"turquoise"},{"label":"Sapphire","value":"sapphire"},{"label":"Picton blue","value":"picton-blue"},{"label":"Vivid violet","value":"vivid-violet"},{"label":"Amethyst","value":"amethyst"},{"label":"Old brick","value":"old-brick"},{"label":"Hopbush","value":"hopbush"}]}},"borderColor":{"type":"dropdown","access":"public","value":"default","options":{"label":"Border color","values":[{"label":"Default","value":"default"},{"label":"Silver","value":"silver"},{"label":"White","value":"white"},{"label":"Nero","value":"nero"},{"label":"Mortar","value":"mortar"},{"label":"Fire brick","value":"fire-brick"},{"label":"Coral","value":"coral"},{"label":"Medium wood","value":"medium-wood"},{"label":"Amber","value":"amber"},{"label":"Canary","value":"canary"},{"label":"Olive","value":"olive"},{"label":"Pear","value":"pear"},{"label":"Teal","value":"teal"},{"label":"Turquoise","value":"turquoise"},{"label":"Sapphire","value":"sapphire"},{"label":"Picton blue","value":"picton-blue"},{"label":"Vivid violet","value":"vivid-violet"},{"label":"Amethyst","value":"amethyst"},{"label":"Old brick","value":"old-brick"},{"label":"Hopbush","value":"hopbush"}]}},"backgroundColor":{"type":"dropdown","access":"public","value":"default","options":{"label":"Background color","values":[{"label":"Default","value":"default"},{"label":"Silver","value":"silver"},{"label":"White","value":"white"},{"label":"Nero","value":"nero"},{"label":"Mortar","value":"mortar"},{"label":"Fire brick","value":"fire-brick"},{"label":"Coral","value":"coral"},{"label":"Medium wood","value":"medium-wood"},{"label":"Amber","value":"amber"},{"label":"Canary","value":"canary"},{"label":"Olive","value":"olive"},{"label":"Pear","value":"pear"},{"label":"Teal","value":"teal"},{"label":"Turquoise","value":"turquoise"},{"label":"Sapphire","value":"sapphire"},{"label":"Picton blue","value":"picton-blue"},{"label":"Vivid violet","value":"vivid-violet"},{"label":"Amethyst","value":"amethyst"},{"label":"Old brick","value":"old-brick"},{"label":"Hopbush","value":"hopbush"}]}},"style":{"type":"dropdown","access":"public","value":"flat","options":{"label":"Style","values":[{"label":"Flat","value":"flat"},{"label":"Outline","value":"outline"},{"label":"Double outline","value":"double-outline"}]}},"shape":{"type":"dropdown","access":"public","value":"square","options":{"label":"Shape","values":[{"label":"Square","value":"square"},{"label":"Round","value":"round"},{"label":"Rounded","value":"rounded"}]}},"showIcon":{"type":"toggle","access":"public","value":false,"options":{"label":"Show arrow","description":"Show arrow on button"}}},
  // Component callback
  function(component) {
    var React = require('react');
	require( './styles.css' )
    component.add(React.createClass({
      render: function() {
        // import variables
        var {buttonText, textColor, borderColor, backgroundColor, style, shape, showIcon, id, content, ...other} = this.props
        // import template js
        var classes = 'vce-button';

if (shape && shape !== 'square') {
  classes += ' vce-button--border-' + shape;
}

if (style) {
  classes += ' vce-button--style-' + style;
}

if (textColor) {
  classes += ' vce-button--text-color-' + textColor;
}

if (borderColor) {
  classes += ' vce-button--border-color-' + borderColor;
}

if (backgroundColor) {
  classes += ' vce-button--background-color-' + backgroundColor;
}

if (showIcon) {
  classes += ' vce-button--icon-state-visible';
}
        // import template
        return <button className={classes} {...other}>
  {buttonText}
  {(() => {
    if (showIcon) {
      return <span className="vce-button__icon lnr lnr-arrow-right"></span>
    }
  })()}
</button>
;
      }
    }));
  },
  // css settings // css for element
  {},
  // javascript callback
  function(){},
  // editor js
  null
);

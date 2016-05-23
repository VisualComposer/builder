window.vcvAddElement(
  {"tag":{"access":"protected","type":"string","value":"8a45ec68-a64c-4102-8af2-8785f80666aa"},"name":{"type":"string","access":"protected","value":"Icon Button 1.0"},"buttonTitle":{"type":"string","access":"public","value":"Icon Button v1.0.0","options":{"label":"Button text","description":"Add button text"}},"style":{"type":"dropdown","access":"public","value":"round","options":{"label":"Style","values":[{"label":"Flat","value":"flat"},{"label":"Round","value":"round"},{"label":"Rounded","value":"rounded"}]}},"color":{"type":"color","access":"public","value":"blue","options":{"label":"Color"}},"iconSize":{"type":"dropdown","access":"public","value":"sm","options":{"label":"Icon Size","values":[{"label":"Small","value":"sm"},{"label":"normal","value":"md"},{"label":"Big","value":"lg"}]}},"toggle":{"type":"toggle","access":"public","value":false,"options":{"label":"Toggle","description":"Toggle switch"}},"checkboxes":{"type":"checkbox","access":"public","value":["sm"],"options":{"label":"Multiple Checkbox","values":[{"label":"Small","value":"sm"},{"label":"normal","value":"md"},{"label":"Big","value":"lg"}]}},"editor":{"type":"htmleditor","access":"public","value":"red","options":{"label":"HTML Editor 1","description":"it should work"}},"otherEditor":{"type":"htmleditor","access":"public","value":"red","options":{"label":"HTML Editor 2","description":"it should work too"}}},
  // Component callback
  function(component) {
	
    component.add(React.createClass({
      render: function() {
        // import variables
        var {buttonTitle, style, color, iconSize, toggle, checkboxes, editor, otherEditor, id, content, ...other} = this.props
        // import template js
        var buttonClass = 'vc-button';
if (color) {
  buttonClass += ' vc-button-color-' + color;
}
if (style) {
  buttonClass += ' vc-button-style-' + style;
}
var iconClass = 'vc-icon vc-icon-size-' + iconSize;
var iconContent = '♘';
        // import template
        return (<button type="button" className={buttonClass} {...other}>
  <i className={iconClass}>{iconContent}</i> {buttonTitle}
</button>
);
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

import {getService} from 'vc-cake';
getService('cook').add(
  {
  "tag": {
    "type": "string",
    "access": "protected",
    "value": "iconButton"
  },
  "name": {
    "type": "string",
    "access": "protected",
    "value": "Icon Button 1.0"
  },
  "buttonTitle": {
    "type": "string",
    "access": "public",
    "value": "Icon Button v1.0.0",
    "options": {
      "label": "Button text"
    }
  },
  "style": {
    "type": "dropdown",
    "access": "public",
    "value": "round",
    "options": {
      "label": "Style",
      "values": [
        {
          "label": "Flat",
          "value": "flat"
        },
        {
          "label": "Round",
          "value": "round"
        },
        {
          "label": "Rounded",
          "value": "rounded"
        }
      ]
    }
  },
  "color": {
    "type": "dropdown",
    "access": "public",
    "value": "blue",
    "options": {
      "label": "Color",
      "data": "colors",
      "title": "Color"
    }
  },
  "iconSize": {
    "type": "dropdown",
    "access": "public",
    "value": "sm",
    "options": {
      "label": "Icon Size",
      "values": [
        {
          "label": "Small",
          "value": "sm"
        },
        {
          "label": "normal",
          "value": "md"
        },
        {
          "label": "Big",
          "value": "lg"
        }
      ]
    }
  }
}
,
  // Component callback
  function(component) {
    var React = require('react');
    component.add(React.createClass({
      render: function() {
		// import variables
		var {tag, name, buttonTitle, style, color, iconSize, id, ...other} = this.props;
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
        return <button type="button" className="{buttonClass}" {...other}>
  <i className="{iconClass}">{iconContent}</i> {buttonTitle}
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

import {getService} from 'vc-cake';
getService('cook').add(
  {
    "tag": {
      "access": "private",
      "value": "iconButton",
      "type": "string"
    },
    "name": {
      "type": "string",
      "access": "protected",
      "value": "Icon Button 1.0"
    },
    "title": {
      "access": "protected",
      "value": "Icon Button v1.0.0",
      "type": "string"
    },
    "style": {
      "access": "public",
      "value": "round",
      "type": "dropdpown",
      "options": [
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
    },
    "color": {
      "access": "public",
      "value": "blue",
      "type": "dropdpown",
      "options": [
        {
          "label": "Blue",
          "value": "blue"
        },
        {
          "label": "Black",
          "value": "black"
        }
      ]
    },
    "iconSize": {
      "access": "public",
      "value": "sm",
      "type": "dropdpown",
      "options": [
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
  },
  // Component callback
  function(component) {
    var React = require('react');
    component.add(React.createClass({
      render: function() {
        // import variables
        var {tag, name, title, style, color, iconSize, id, ...other} = this.props;
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
          <i className="{iconClass}">{iconContent}</i> {title}
        </button>;
      }
    }));
  },
  // css settings // css for element
  {},
  // javascript callback
  function() {
  },
  // editor js
  null
);

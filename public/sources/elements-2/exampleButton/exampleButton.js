import {getService} from 'vc-cake';
getService('cook').add(
  {
  "tag": {
    "type": "string",
    "access": "protected",
    "value": "exampleButton"
  },
  "name": {
    "type": "string",
    "access": "protected",
    "value": "Example Button 1.0"
  },
  "color": {
    "type": "color",
    "access": "public",
    "value": "red",
    "options": {
      "label": "Color",
      "description": "it should work"
    }
  },
  "select": {
    "type": "dropdown",
    "access": "public",
    "value": "3",
    "options": {
      "label": "Select",
      "values": [
        {
          "label": "First value",
          "value": "1"
        },
        {
          "label": "Second value",
          "value": "2"
        },
        {
          "label": "Third value",
          "value": "3"
        },
        {
          "label": "Four value",
          "value": "4"
        }
      ]
    }
  }
},
  // Component callback
  function(component) {
    var React = require('react');
    component.add(React.createClass({
      render: function() {
		// import variables
		var {tag, name, color, select, id, ...other} = this.props;
        // import template js
        
        // import template
        return <button type="button" className="vce-{tag} button-color-{color}" {...other}>
    Test
</button>;
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

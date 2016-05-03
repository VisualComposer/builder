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
  "category": {
    "type": "array",
    "access": "protected",
    "value": [
      "General",
      "Buttons"
    ]
  },
  "color": {
    "type": "dropdown",
    "access": "public",
    "value": "red",
    "title": "Color",
    "options": {
      "data": "colors"
    }
  },
  "edit-form": {
    "type": "group",
    "access": "protected",
    "value": ["color"]
  }
},
  // Component callback
  function() {var React = require('react');
return React.createClass({
  templateJs: function(data, settings) {
    return data;
  },
  render: function() {
    var data = this.templateJs(this.props.data, this.props.settings);
    return <button type="button" className="vce-example-button vc-example-button-{data.shape}" key={key}>
      {data.content}
    </button>;
  }
});},
  // css settings // css for element
  {},
  // javascript callback
  function(){},
  // editor js
 null
);
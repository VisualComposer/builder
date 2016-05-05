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
    "type": "string",
    "access": "public",
    "value": "red",
    "title": "Color",
    "options": {
      "data": "colors"
    }
  }
},
  // Component callback
  function() {
    React.createClass({
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
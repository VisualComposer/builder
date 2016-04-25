app.getService('element-manager').addElement({
    // Settings
    "tag": {
      "type": "string",
      "access": "private",
      "value": "Button"
    },
    "name": {
      "type": "string",
      "access": "private",
      "value": "Button 1.0"
    },
    "category": {
      "type": "array",
      "access": "private",
      "value": [
        "General",
        "Buttons"
      ]
    },
    "color": {
      "type": "dropdown",
      "access": "public",
      "value": "red",
      "name": "Color",
      "options": {
        "data": "colors"
      }
    },
    "edit-form-tabs": {
      "name": "Edit Form",
      "type": "group",
      "access": "private",
      "value": ["General"]
    },
    "General": {
      "name": "General tab",
      "type": "group",
      "access": "private",
      "value": []
    }
  },
  // Component callback
  function() {
    import {Component} from 'react';
    export class ExampleButton extends Component {
      render() {
        let {key, content, ...other} = this.props;
        return <button type="button" className="vc-button-block" key={key}>
          {content}
        </button>;
      }
    }
  },
  // css settings // css for element
  {

  },
  // javascript callback
  function() {

  }
);
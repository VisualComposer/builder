import {getService} from 'vc-cake';
getService('element-manager').add(
  {
  "tag": {
    "type": "string",
    "access": "system",
    "value": "exampleButton"
  },
  "name": {
    "type": "string",
    "access": "system",
    "value": "Example Button 1.0"
  },
  "category": {
    "type": "array",
    "access": "system",
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
    "access": "public",
    "value": ["color"]
  }
},
  // Component callback
  function() {},
  // css settings // css for element
  {},
  // javascript callback
  function(){},
  // editor js
 null
);
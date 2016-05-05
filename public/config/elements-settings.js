module.exports = [
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
    "type": "dropdown",
    "access": "public",
    "value": "red",
    "title": "Color",
    "options": {
      "data": "colors"
    }
  },
  "google": {
    "type": "string",
    "access": "public",
    "value": "search"
  }
},{
  "tag": {
    "access": "private",
    "value": "reactButton",
    "type": "string"
  },
  "title": {
    "access": "protected",
    "value": "{{title}}",
    "type": "string"
  },
  "style": {
    "access": "public",
    "value": "{{style}}",
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
    "value": "{{color}}",
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
    "value": "{{iconSize}}",
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
}];
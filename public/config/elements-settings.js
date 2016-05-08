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
      "data": "colors"
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
,{
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
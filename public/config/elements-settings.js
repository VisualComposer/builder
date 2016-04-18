module.exports = [
{
  "tag": {
    "type": "string",
    "access": "system",
    "value": "Button"
  },
  "name": {
    "type": "string",
    "access": "system",
    "value": "Button 1.0"
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
  "edit-form-tabs": {
    "type": "group",
    "access": ""
  }
}];
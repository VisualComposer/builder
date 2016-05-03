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
}];
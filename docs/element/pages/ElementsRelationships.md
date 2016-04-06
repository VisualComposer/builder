## Elements Relationships

- Section should use RawDropable: can dropped in only row
- Row should use ColumnDropable: can dropped in only column
- Column can use Dropable

- Dropable component can be added to elements
- tabs/tour like elements.

All elements should 
Relationship is a ability to be th epart of content in container elements.

settings.json settings types
relatedTo: adds element in to group
children - element that can part of this element

  "relatedTo": {
    "type": "array",
    "access": "system",
    "value": [
      "Button Groups"
    ]
  },
  "children": {
    "type": "string",
    "access": "system",
    "value": [
      "Buttons"
    ]
  }

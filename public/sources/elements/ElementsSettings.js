module.exports = [
{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Button Group"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "BtnGroup"
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "container"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["Button Groups"]
    },
    "children": {
      "type": "string",
      "access": "system",
      "value": ["Buttons", "Button"]
    }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Button 1.0"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "Button"
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "inline"
    },
    "content": {
        "type": "innerhtml",
        "access": "public",
        "value": "Button",
        "title": "Title"
    },
    "test": {
        "type": "string",
        "access": "public",
        "value": "ninja",
        "title": "Test"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["Buttons", "Semantics"]
    }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Column"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "Column"
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "container"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["Grid Columns"]
    },
    "children": {
      "type": "string",
      "access": "system",
      "value": "*"
    },
    "strongRelation": {
      "type": "string",
      "access": "system",
      "value": true
    }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Heading"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "Heading"
    },
    "icon": {
        "type": "string",
        "access": "system",
        "value": "Heading"
    },
    "content": {
        "type": "innerhtml",
        "access": "public",
        "value": "Boris says Да or Not."
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "block"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["Headings", "Semantics"]
    }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Paragraph"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "Paragraph"
    },
    "icon": {
        "type": "string",
        "access": "system",
        "value": "Paragraph"
    },
    "content": {
        "type": "innerhtml",
        "access": "public",
        "value": "Hello my name is Boris and I know ninja rules very well. Hide away."
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "block"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["Paragraphs", "Semantics"]
    }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Row"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "Row"
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "container"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["Grid Rows"]
    },
    "children": {
      "type": "string",
      "access": "system",
      "value": ["Grid Columns"]
    }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Section"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "Section"
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "container"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["Sections"]
    },
    "children": {
      "type": "string",
      "access": "system",
      "value": "*"
    }
}];
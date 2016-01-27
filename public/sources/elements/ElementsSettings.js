module.exports = [
{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Attributes"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "AttributesElement"
  },
  "icon": {
    "type": "string",
    "access": "system",
    "value": "AttributesElement"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "block"
  },
  "textarea": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "title": "textarea param"
  },
  "string": {
    "type": "string",
    "access": "public",
    "value": "",
    "title": "string param"
  },
  "select": {
    "type": "select",
    "access": "public",
    "value": "",
    "title": "select param",
    "settings": {
      "options": {
        "value": "test",
        "value2": "test2"
      }
    }
  }
},{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Autosuggest"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "Autosuggest"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "inline"
  },
  "mutable": {
    "type": "string",
    "access": "system",
    "value": "*"
  },
  "suggestions": {
    "type": "textarea",
    "access": "public",
    "title": "Suggestions",
    "value": ""
  },
  "initialSuggestion": {
    "type": "string",
    "access": "public",
    "title": "Selected value",
    "value": ""
  }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Button Group 1.0"
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
      "value": ["Buttons"]
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
        "type": "textarea",
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
    "iconComponent": {
        "type": "component",
        "access": "public",
        "value": "",
        "title": "",
        "settings": {
          "component": "icon"
        }
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
        "value": "Buttons group"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "ButtonsGroup"
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
      "value": ["Buttons"]
    }
},{
    "name": {
        "type": "string",
        "access": "system",
        "value": "Call To Action"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "CallToAction"
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "inline"
    },
    "buttonComponent": {
        "type": "component",
        "access": "public",
        "value": "",
        "settings": {
          "component": "button"
        }
    },
    "content": {
        "type": "textarea",
        "access": "public",
        "value": "Cta",
        "title": "Title"
    },
    "iconComponent": {
      "type": "component",
      "access": "public",
      "value": "",
      "title": "Custom Icon",
      "settings": {
        "component": "icon"
      }
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["CTA"]
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
    "width": {
        "type": "textarea",
        "access": "public",
        "value": "12",
        "title": "Width"
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
        "value": "Flex Column"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "FlexColumn"
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
        "value": "Flex Row"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "FlexRow"
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
        "value": "Header 1.0"
    },
    "tag": {
        "type": "string",
        "access": "system",
        "value": "Header"
    },
    "type": {
        "type": "string",
        "access": "system",
        "value": "inline"
    },
    "content": {
        "type": "innerhtml",
        "access": "public",
        "value": "Header",
        "title": "Title"
    },
    "param_tag": {
        "type": "string",
        "access": "public",
        "value": "h2",
        "title": "Tag"
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
    "value": "Icon"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "Icon"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "inline"
  },
  "icon-library": {
    "type": "autosuggest",
    "access": "public",
    "title": "Icon library",
    "settings": {
      "options": {
        "glyphicons": "Glyphicons",
        "fontawesome": "Font Awesome",
        "openiconic": "Open Iconic",
        "typicons": "Typicons",
        "entypo": "Entypo",
        "linecons": "Linecons"
      }
    }
  },
  "icon": {
    "type": "autosuggest",
    "access": "public",
    "title": "Icon",
    "value": "glyphicon-ok-circle",
    "settings": {
      "options": [
        {
          "value": "glyphicon-asterisk",
          "label": "Asterisk"
        },
        {
          "value": "glyphicon-plus",
          "label": "Plus"
        },
        {
          "value": "glyphicon-euro",
          "label": "Euro"
        },
        {
          "value": "glyphicon-eur",
          "label": "Eur"
        },
        {
          "value": "glyphicon-minus",
          "label": "Minus"
        },
        {
          "value": "glyphicon-cloud",
          "label": "Cloud"
        },
        {
          "value": "glyphicon-envelope",
          "label": "Envelope"
        },
        {
          "value": "glyphicon-pencil",
          "label": "Pencil"
        },
        {
          "value": "glyphicon-glass",
          "label": "Glass"
        },
        {
          "value": "glyphicon-music",
          "label": "Music"
        },
        {
          "value": "glyphicon-search",
          "label": "Search"
        },
        {
          "value": "glyphicon-heart",
          "label": "Heart"
        },
        {
          "value": "glyphicon-star",
          "label": "Star"
        },
        {
          "value": "glyphicon-star-empty",
          "label": "Star empty"
        },
        {
          "value": "glyphicon-user",
          "label": "User"
        },
        {
          "value": "glyphicon-film",
          "label": "Film"
        },
        {
          "value": "glyphicon-th-large",
          "label": "Th large"
        },
        {
          "value": "glyphicon-th",
          "label": "Th"
        },
        {
          "value": "glyphicon-th-list",
          "label": "Th list"
        },
        {
          "value": "glyphicon-ok",
          "label": "Ok"
        },
        {
          "value": "glyphicon-remove",
          "label": "Remove"
        },
        {
          "value": "glyphicon-zoom-in",
          "label": "Zoom in"
        },
        {
          "value": "glyphicon-zoom-out",
          "label": "Zoom out"
        },
        {
          "value": "glyphicon-off",
          "label": "Off"
        },
        {
          "value": "glyphicon-signal",
          "label": "Signal"
        },
        {
          "value": "glyphicon-cog",
          "label": "Cog"
        },
        {
          "value": "glyphicon-trash",
          "label": "Trash"
        },
        {
          "value": "glyphicon-home",
          "label": "Home"
        },
        {
          "value": "glyphicon-file",
          "label": "File"
        },
        {
          "value": "glyphicon-time",
          "label": "Time"
        },
        {
          "value": "glyphicon-road",
          "label": "Road"
        },
        {
          "value": "glyphicon-download-alt",
          "label": "Download alt"
        },
        {
          "value": "glyphicon-download",
          "label": "Download"
        },
        {
          "value": "glyphicon-upload",
          "label": "Upload"
        },
        {
          "value": "glyphicon-inbox",
          "label": "Inbox"
        },
        {
          "value": "glyphicon-play-circle",
          "label": "Play circle"
        },
        {
          "value": "glyphicon-repeat",
          "label": "Repeat"
        },
        {
          "value": "glyphicon-refresh",
          "label": "Refresh"
        },
        {
          "value": "glyphicon-list-alt",
          "label": "List alt"
        },
        {
          "value": "glyphicon-lock",
          "label": "Lock"
        },
        {
          "value": "glyphicon-flag",
          "label": "Flag"
        },
        {
          "value": "glyphicon-headphones",
          "label": "Headphones"
        },
        {
          "value": "glyphicon-volume-off",
          "label": "Volume off"
        },
        {
          "value": "glyphicon-volume-down",
          "label": "Volume down"
        },
        {
          "value": "glyphicon-volume-up",
          "label": "Volume up"
        },
        {
          "value": "glyphicon-qrcode",
          "label": "Qrcode"
        },
        {
          "value": "glyphicon-barcode",
          "label": "Barcode"
        },
        {
          "value": "glyphicon-tag",
          "label": "Tag"
        },
        {
          "value": "glyphicon-tags",
          "label": "Tags"
        },
        {
          "value": "glyphicon-book",
          "label": "Book"
        },
        {
          "value": "glyphicon-bookmark",
          "label": "Bookmark"
        },
        {
          "value": "glyphicon-print",
          "label": "Print"
        },
        {
          "value": "glyphicon-camera",
          "label": "Camera"
        },
        {
          "value": "glyphicon-font",
          "label": "Font"
        },
        {
          "value": "glyphicon-bold",
          "label": "Bold"
        },
        {
          "value": "glyphicon-italic",
          "label": "Italic"
        },
        {
          "value": "glyphicon-text-height",
          "label": "Text height"
        },
        {
          "value": "glyphicon-text-width",
          "label": "Text width"
        },
        {
          "value": "glyphicon-align-left",
          "label": "Align left"
        },
        {
          "value": "glyphicon-align-center",
          "label": "Align center"
        },
        {
          "value": "glyphicon-align-right",
          "label": "Align right"
        },
        {
          "value": "glyphicon-align-justify",
          "label": "Align justify"
        },
        {
          "value": "glyphicon-list",
          "label": "List"
        },
        {
          "value": "glyphicon-indent-left",
          "label": "Indent left"
        },
        {
          "value": "glyphicon-indent-right",
          "label": "Indent right"
        },
        {
          "value": "glyphicon-facetime-video",
          "label": "Facetime video"
        },
        {
          "value": "glyphicon-picture",
          "label": "Picture"
        },
        {
          "value": "glyphicon-map-marker",
          "label": "Map marker"
        },
        {
          "value": "glyphicon-adjust",
          "label": "Adjust"
        },
        {
          "value": "glyphicon-tint",
          "label": "Tint"
        },
        {
          "value": "glyphicon-edit",
          "label": "Edit"
        },
        {
          "value": "glyphicon-share",
          "label": "Share"
        },
        {
          "value": "glyphicon-check",
          "label": "Check"
        },
        {
          "value": "glyphicon-move",
          "label": "Move"
        },
        {
          "value": "glyphicon-step-backward",
          "label": "Step backward"
        },
        {
          "value": "glyphicon-fast-backward",
          "label": "Fast backward"
        },
        {
          "value": "glyphicon-backward",
          "label": "Backward"
        },
        {
          "value": "glyphicon-play",
          "label": "Play"
        },
        {
          "value": "glyphicon-pause",
          "label": "Pause"
        },
        {
          "value": "glyphicon-stop",
          "label": "Stop"
        },
        {
          "value": "glyphicon-forward",
          "label": "Forward"
        },
        {
          "value": "glyphicon-fast-forward",
          "label": "Fast forward"
        },
        {
          "value": "glyphicon-step-forward",
          "label": "Step forward"
        },
        {
          "value": "glyphicon-eject",
          "label": "Eject"
        },
        {
          "value": "glyphicon-chevron-left",
          "label": "Chevron left"
        },
        {
          "value": "glyphicon-chevron-right",
          "label": "Chevron right"
        },
        {
          "value": "glyphicon-plus-sign",
          "label": "Plus sign"
        },
        {
          "value": "glyphicon-minus-sign",
          "label": "Minus sign"
        },
        {
          "value": "glyphicon-remove-sign",
          "label": "Remove sign"
        },
        {
          "value": "glyphicon-ok-sign",
          "label": "Ok sign"
        },
        {
          "value": "glyphicon-question-sign",
          "label": "Question sign"
        },
        {
          "value": "glyphicon-info-sign",
          "label": "Info sign"
        },
        {
          "value": "glyphicon-screenshot",
          "label": "Screenshot"
        },
        {
          "value": "glyphicon-remove-circle",
          "label": "Remove circle"
        },
        {
          "value": "glyphicon-ok-circle",
          "label": "Ok circle"
        },
        {
          "value": "glyphicon-ban-circle",
          "label": "Ban circle"
        },
        {
          "value": "glyphicon-arrow-left",
          "label": "Arrow left"
        },
        {
          "value": "glyphicon-arrow-right",
          "label": "Arrow right"
        },
        {
          "value": "glyphicon-arrow-up",
          "label": "Arrow up"
        },
        {
          "value": "glyphicon-arrow-down",
          "label": "Arrow down"
        },
        {
          "value": "glyphicon-share-alt",
          "label": "Share alt"
        },
        {
          "value": "glyphicon-resize-full",
          "label": "Resize full"
        },
        {
          "value": "glyphicon-resize-small",
          "label": "Resize small"
        },
        {
          "value": "glyphicon-exclamation-sign",
          "label": "Exclamation sign"
        },
        {
          "value": "glyphicon-gift",
          "label": "Gift"
        },
        {
          "value": "glyphicon-leaf",
          "label": "Leaf"
        },
        {
          "value": "glyphicon-fire",
          "label": "Fire"
        },
        {
          "value": "glyphicon-eye-open",
          "label": "Eye open"
        },
        {
          "value": "glyphicon-eye-close",
          "label": "Eye close"
        },
        {
          "value": "glyphicon-warning-sign",
          "label": "Warning sign"
        },
        {
          "value": "glyphicon-plane",
          "label": "Plane"
        },
        {
          "value": "glyphicon-calendar",
          "label": "Calendar"
        },
        {
          "value": "glyphicon-random",
          "label": "Random"
        },
        {
          "value": "glyphicon-comment",
          "label": "Comment"
        },
        {
          "value": "glyphicon-magnet",
          "label": "Magnet"
        },
        {
          "value": "glyphicon-chevron-up",
          "label": "Chevron up"
        },
        {
          "value": "glyphicon-chevron-down",
          "label": "Chevron down"
        },
        {
          "value": "glyphicon-retweet",
          "label": "Retweet"
        },
        {
          "value": "glyphicon-shopping-cart",
          "label": "Shopping cart"
        },
        {
          "value": "glyphicon-folder-close",
          "label": "Folder close"
        },
        {
          "value": "glyphicon-folder-open",
          "label": "Folder open"
        },
        {
          "value": "glyphicon-resize-vertical",
          "label": "Resize vertical"
        },
        {
          "value": "glyphicon-resize-horizontal",
          "label": "Resize horizontal"
        },
        {
          "value": "glyphicon-hdd",
          "label": "Hdd"
        },
        {
          "value": "glyphicon-bullhorn",
          "label": "Bullhorn"
        },
        {
          "value": "glyphicon-bell",
          "label": "Bell"
        },
        {
          "value": "glyphicon-certificate",
          "label": "Certificate"
        },
        {
          "value": "glyphicon-thumbs-up",
          "label": "Thumbs up"
        },
        {
          "value": "glyphicon-thumbs-down",
          "label": "Thumbs down"
        },
        {
          "value": "glyphicon-hand-right",
          "label": "Hand right"
        },
        {
          "value": "glyphicon-hand-left",
          "label": "Hand left"
        },
        {
          "value": "glyphicon-hand-up",
          "label": "Hand up"
        },
        {
          "value": "glyphicon-hand-down",
          "label": "Hand down"
        },
        {
          "value": "glyphicon-circle-arrow-right",
          "label": "Circle arrow right"
        },
        {
          "value": "glyphicon-circle-arrow-left",
          "label": "Circle arrow left"
        },
        {
          "value": "glyphicon-circle-arrow-up",
          "label": "Circle arrow up"
        },
        {
          "value": "glyphicon-circle-arrow-down",
          "label": "Circle arrow down"
        },
        {
          "value": "glyphicon-globe",
          "label": "Globe"
        },
        {
          "value": "glyphicon-wrench",
          "label": "Wrench"
        },
        {
          "value": "glyphicon-tasks",
          "label": "Tasks"
        },
        {
          "value": "glyphicon-filter",
          "label": "Filter"
        },
        {
          "value": "glyphicon-briefcase",
          "label": "Briefcase"
        },
        {
          "value": "glyphicon-fullscreen",
          "label": "Fullscreen"
        },
        {
          "value": "glyphicon-dashboard",
          "label": "Dashboard"
        },
        {
          "value": "glyphicon-paperclip",
          "label": "Paperclip"
        },
        {
          "value": "glyphicon-heart-empty",
          "label": "Heart empty"
        },
        {
          "value": "glyphicon-link",
          "label": "Link"
        },
        {
          "value": "glyphicon-phone",
          "label": "Phone"
        },
        {
          "value": "glyphicon-pushpin",
          "label": "Pushpin"
        },
        {
          "value": "glyphicon-usd",
          "label": "Usd"
        },
        {
          "value": "glyphicon-gbp",
          "label": "Gbp"
        },
        {
          "value": "glyphicon-sort",
          "label": "Sort"
        },
        {
          "value": "glyphicon-sort-by-alphabet",
          "label": "Sort by alphabet"
        },
        {
          "value": "glyphicon-sort-by-alphabet-alt",
          "label": "Sort by alphabet alt"
        },
        {
          "value": "glyphicon-sort-by-order",
          "label": "Sort by order"
        },
        {
          "value": "glyphicon-sort-by-order-alt",
          "label": "Sort by order alt"
        },
        {
          "value": "glyphicon-sort-by-attributes",
          "label": "Sort by attributes"
        },
        {
          "value": "glyphicon-sort-by-attributes-alt",
          "label": "Sort by attributes alt"
        },
        {
          "value": "glyphicon-unchecked",
          "label": "Unchecked"
        },
        {
          "value": "glyphicon-expand",
          "label": "Expand"
        },
        {
          "value": "glyphicon-collapse-down",
          "label": "Collapse down"
        },
        {
          "value": "glyphicon-collapse-up",
          "label": "Collapse up"
        },
        {
          "value": "glyphicon-log-in",
          "label": "Log in"
        },
        {
          "value": "glyphicon-flash",
          "label": "Flash"
        },
        {
          "value": "glyphicon-log-out",
          "label": "Log out"
        },
        {
          "value": "glyphicon-new-window",
          "label": "New window"
        },
        {
          "value": "glyphicon-record",
          "label": "Record"
        },
        {
          "value": "glyphicon-save",
          "label": "Save"
        },
        {
          "value": "glyphicon-open",
          "label": "Open"
        },
        {
          "value": "glyphicon-saved",
          "label": "Saved"
        },
        {
          "value": "glyphicon-import",
          "label": "Import"
        },
        {
          "value": "glyphicon-export",
          "label": "Export"
        },
        {
          "value": "glyphicon-send",
          "label": "Send"
        },
        {
          "value": "glyphicon-floppy-disk",
          "label": "Floppy disk"
        },
        {
          "value": "glyphicon-floppy-saved",
          "label": "Floppy saved"
        },
        {
          "value": "glyphicon-floppy-remove",
          "label": "Floppy remove"
        },
        {
          "value": "glyphicon-floppy-save",
          "label": "Floppy save"
        },
        {
          "value": "glyphicon-floppy-open",
          "label": "Floppy open"
        },
        {
          "value": "glyphicon-credit-card",
          "label": "Credit card"
        },
        {
          "value": "glyphicon-transfer",
          "label": "Transfer"
        },
        {
          "value": "glyphicon-cutlery",
          "label": "Cutlery"
        },
        {
          "value": "glyphicon-header",
          "label": "Header"
        },
        {
          "value": "glyphicon-compressed",
          "label": "Compressed"
        },
        {
          "value": "glyphicon-earphone",
          "label": "Earphone"
        },
        {
          "value": "glyphicon-phone-alt",
          "label": "Phone alt"
        },
        {
          "value": "glyphicon-tower",
          "label": "Tower"
        },
        {
          "value": "glyphicon-stats",
          "label": "Stats"
        },
        {
          "value": "glyphicon-sd-video",
          "label": "Sd video"
        },
        {
          "value": "glyphicon-hd-video",
          "label": "Hd video"
        },
        {
          "value": "glyphicon-subtitles",
          "label": "Subtitles"
        },
        {
          "value": "glyphicon-sound-stereo",
          "label": "Sound stereo"
        },
        {
          "value": "glyphicon-sound-dolby",
          "label": "Sound dolby"
        },
        {
          "value": "glyphicon-sound-5-1",
          "label": "Sound 5 1"
        },
        {
          "value": "glyphicon-sound-6-1",
          "label": "Sound 6 1"
        },
        {
          "value": "glyphicon-sound-7-1",
          "label": "Sound 7 1"
        },
        {
          "value": "glyphicon-copyright-mark",
          "label": "Copyright mark"
        },
        {
          "value": "glyphicon-registration-mark",
          "label": "Registration mark"
        },
        {
          "value": "glyphicon-cloud-download",
          "label": "Cloud download"
        },
        {
          "value": "glyphicon-cloud-upload",
          "label": "Cloud upload"
        },
        {
          "value": "glyphicon-tree-conifer",
          "label": "Tree conifer"
        },
        {
          "value": "glyphicon-tree-deciduous",
          "label": "Tree deciduous"
        },
        {
          "value": "glyphicon-cd",
          "label": "Cd"
        },
        {
          "value": "glyphicon-save-file",
          "label": "Save file"
        },
        {
          "value": "glyphicon-open-file",
          "label": "Open file"
        },
        {
          "value": "glyphicon-level-up",
          "label": "Level up"
        },
        {
          "value": "glyphicon-copy",
          "label": "Copy"
        },
        {
          "value": "glyphicon-paste",
          "label": "Paste"
        },
        {
          "value": "glyphicon-alert",
          "label": "Alert"
        },
        {
          "value": "glyphicon-equalizer",
          "label": "Equalizer"
        },
        {
          "value": "glyphicon-king",
          "label": "King"
        },
        {
          "value": "glyphicon-queen",
          "label": "Queen"
        },
        {
          "value": "glyphicon-pawn",
          "label": "Pawn"
        },
        {
          "value": "glyphicon-bishop",
          "label": "Bishop"
        },
        {
          "value": "glyphicon-knight",
          "label": "Knight"
        },
        {
          "value": "glyphicon-baby-formula",
          "label": "Baby formula"
        },
        {
          "value": "glyphicon-tent",
          "label": "Tent"
        },
        {
          "value": "glyphicon-blackboard",
          "label": "Blackboard"
        },
        {
          "value": "glyphicon-bed",
          "label": "Bed"
        },
        {
          "value": "glyphicon-apple",
          "label": "Apple"
        },
        {
          "value": "glyphicon-erase",
          "label": "Erase"
        },
        {
          "value": "glyphicon-hourglass",
          "label": "Hourglass"
        },
        {
          "value": "glyphicon-lamp",
          "label": "Lamp"
        },
        {
          "value": "glyphicon-duplicate",
          "label": "Duplicate"
        },
        {
          "value": "glyphicon-piggy-bank",
          "label": "Piggy bank"
        },
        {
          "value": "glyphicon-scissors",
          "label": "Scissors"
        },
        {
          "value": "glyphicon-bitcoin",
          "label": "Bitcoin"
        },
        {
          "value": "glyphicon-btc",
          "label": "Btc"
        },
        {
          "value": "glyphicon-xbt",
          "label": "Xbt"
        },
        {
          "value": "glyphicon-yen",
          "label": "Yen"
        },
        {
          "value": "glyphicon-jpy",
          "label": "Jpy"
        },
        {
          "value": "glyphicon-ruble",
          "label": "Ruble"
        },
        {
          "value": "glyphicon-rub",
          "label": "Rub"
        },
        {
          "value": "glyphicon-scale",
          "label": "Scale"
        },
        {
          "value": "glyphicon-ice-lolly",
          "label": "Ice lolly"
        },
        {
          "value": "glyphicon-ice-lolly-tasted",
          "label": "Ice lolly tasted"
        },
        {
          "value": "glyphicon-education",
          "label": "Education"
        },
        {
          "value": "glyphicon-option-horizontal",
          "label": "Option horizontal"
        },
        {
          "value": "glyphicon-option-vertical",
          "label": "Option vertical"
        },
        {
          "value": "glyphicon-menu-hamburger",
          "label": "Menu hamburger"
        },
        {
          "value": "glyphicon-modal-window",
          "label": "Modal window"
        },
        {
          "value": "glyphicon-oil",
          "label": "Oil"
        },
        {
          "value": "glyphicon-grain",
          "label": "Grain"
        },
        {
          "value": "glyphicon-sunglasses",
          "label": "Sunglasses"
        },
        {
          "value": "glyphicon-text-size",
          "label": "Text size"
        },
        {
          "value": "glyphicon-text-color",
          "label": "Text color"
        },
        {
          "value": "glyphicon-text-background",
          "label": "Text background"
        },
        {
          "value": "glyphicon-object-align-top",
          "label": "Object align top"
        },
        {
          "value": "glyphicon-object-align-bottom",
          "label": "Object align bottom"
        },
        {
          "value": "glyphicon-object-align-horizontal",
          "label": "Object align horizontal"
        },
        {
          "value": "glyphicon-object-align-left",
          "label": "Object align left"
        },
        {
          "value": "glyphicon-object-align-vertical",
          "label": "Object align vertical"
        },
        {
          "value": "glyphicon-object-align-right",
          "label": "Object align right"
        },
        {
          "value": "glyphicon-triangle-right",
          "label": "Triangle right"
        },
        {
          "value": "glyphicon-triangle-left",
          "label": "Triangle left"
        },
        {
          "value": "glyphicon-triangle-bottom",
          "label": "Triangle bottom"
        },
        {
          "value": "glyphicon-triangle-top",
          "label": "Triangle top"
        },
        {
          "value": "glyphicon-console",
          "label": "Console"
        },
        {
          "value": "glyphicon-superscript",
          "label": "Superscript"
        },
        {
          "value": "glyphicon-subscript",
          "label": "Subscript"
        },
        {
          "value": "glyphicon-menu-left",
          "label": "Menu left"
        },
        {
          "value": "glyphicon-menu-right",
          "label": "Menu right"
        },
        {
          "value": "glyphicon-menu-down",
          "label": "Menu down"
        },
        {
          "value": "glyphicon-menu-up",
          "label": "Menu up"
        }
      ]
    }
  },
  "custom": {
      "type": "string",
      "access": "public",
      "value": "",
      "title": "custom class"
  },
  "relatedTo": {
    "type": "string",
    "access": "system",
    "value": [
      "Icons",
      "Semantics"
    ]
  }
},{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Image gallery"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "ImageGallery"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "block"
  },
  "urls": {
    "title": "URLs",
    "type": "textarea",
    "access": "public",
    "value": "http://lorempixel.com/800/600/nature/1,http://lorempixel.com/800/600/nature/2,http://lorempixel.com/800/600/nature/3"
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
  "mutable": {
    "type": "string",
    "access": "system",
    "value": "*"
  },
  "relatedTo": {
    "type": "string",
    "access": "system",
    "value": [
      "Paragraphs",
      "Semantics"
    ]
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
},{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Tabs"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "Tabs"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "block"
  },
  "mutable": {
    "type": "string",
    "access": "system",
    "value": "*"
  },
  "design": {
    "type": "select",
    "access": "public",
    "title": "Style",
    "value": "classic",
    "settings": {
      "options": {
        "classic": "Classic",
        "modern": "Modern",
        "flat": "Flat",
        "outline": "Outline"
      }
    }
  },
  "shape": {
    "type": "select",
    "access": "public",
    "title": "Shape",
    "value": "rounded",
    "settings": {
      "options": {
        "rounded": "Rounded",
        "square": "Square",
        "round": "Round"
      }
    }
  },
  "color": {
    "type": "select",
    "access": "public",
    "title": "Color",
    "value": "grey",
    "settings": {
      "options": {
        "blue": "Blue",
        "turquoise": "Turquoise",
        "pink": "Pink",
        "violet": "Violet",
        "peacoc": "Peacoc",
        "chino": "Chino",
        "mulled-wine": "Mulled Wine",
        "vista-blue": "Vista Blue",
        "black": "Black",
        "grey": "Grey",
        "orange": "Orange",
        "sky": "Sky",
        "green": "Green",
        "juicy-pink": "Juicy pink",
        "sandy-brown": "Sandy brown",
        "purple": "Purple",
        "white": "White"
      }
    }
  },
  "spacing": {
    "type": "select",
    "access": "public",
    "title": "Spacing",
    "value": "0",
    "settings": {
      "options": {
        "0": "None",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "5": "5px",
        "10": "10px",
        "15": "15px",
        "20": "20px",
        "25": "25px",
        "30": "30px",
        "35": "35px"
      }
    }
  },
  "gap": {
    "type": "select",
    "access": "public",
    "title": "Gap",
    "value": "0",
    "settings": {
      "options": {
        "0": "None",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "5": "5px",
        "10": "10px",
        "15": "15px",
        "20": "20px",
        "25": "25px",
        "30": "30px",
        "35": "35px"
      }
    }
  },
  "position": {
    "type": "select",
    "access": "public",
    "title": "Position of tabs",
    "value": "top",
    "settings": {
      "options": {
        "top": "Top",
        "bottom": "Bottom"
      }
    }
  },
  "alignment": {
    "type": "select",
    "access": "public",
    "title": "Alignment of tabs",
    "value": "left",
    "settings": {
      "options": {
        "left": "Left",
        "center": "Center",
        "right": "Right"
      }
    }
  }
},{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Text Separator"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "TextSeparator"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "inline"
  },
  "title": {
    "type": "string",
    "access": "public",
    "value": "",
    "title": "Title"
  },
  "color": {
    "type": "select",
    "title": "Color",
    "value": "",
    "settings": {
      "options": {
        "blue": "Blue",
        "turquoise": "Turquoise",
        "pink": "Pink",
        "violet": "Violet",
        "peacoc": "Peacoc",
        "chino": "Chino",
        "mulled-wine": "Mulled Wine",
        "vista-blue": "Vista Blue",
        "black": "Black",
        "grey": "Grey",
        "orange": "Orange",
        "sky": "Sky",
        "green": "Green",
        "juicy-pink": "Juicy pink",
        "sandy-brown": "Sandy brown",
        "purple": "Purple",
        "white": "White"
      }
    },
    "description": "Select color."
  },
  "customColor": {
    "type": "string",
    "access": "public",
    "value": "",
    "title": "Custom Separator color (Hex)"
  },
  "borderWidth": {
    "type": "select",
    "title": "Border width",
    "value": "",
    "settings": {
      "options": {
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "5": "5px",
        "6": "6px",
        "7": "7px",
        "8": "8px",
        "9": "9px",
        "10": "10px"
      }
    },
    "description": "Select border width (pixels)."
  },
  "style": {
    "type": "select",
    "title": "Style",
    "value": "",
    "settings": {
      "options": {
        "border": "Border",
        "dashed": "Dashed",
        "dotted": "Dotted",
        "double": "Double",
        "shadow": "Shadow"
      }
    },
    "description": "Select style."
  },
  "position": {
    "type": "select",
    "title": "Separator position",
    "value": "",
    "settings": {
      "options": {
        "center": "Center",
        "left": "Left",
        "right": "Right"
      },
      "description": "Select separator posititon."
    }
  },
  "elWidth": {
    "type": "select",
    "title": "Element width",
    "value": "",
    "settings": {
      "options": {
        "100": "100%",
        "90": "90%",
        "80": "80%",
        "70": "70%",
        "60": "60%",
        "50": "50%",
        "40": "40%",
        "30": "30%",
        "20": "20%",
        "10": "10%"
      }
    },
    "description": "Separator element width in percents."
  }
},{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Tour"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "Tour"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "block"
  },
  "mutable": {
    "type": "string",
    "access": "system",
    "value": "*"
  },
  "design": {
    "type": "select",
    "access": "public",
    "title": "Style",
    "value": "classic",
    "settings": {
      "options": {
        "classic": "Classic",
        "modern": "Modern",
        "flat": "Flat",
        "outline": "Outline"
      }
    }
  },
  "shape": {
    "type": "select",
    "access": "public",
    "title": "Shape",
    "value": "rounded",
    "settings": {
      "options": {
        "rounded": "Rounded",
        "square": "Square",
        "round": "Round"
      }
    }
  },
  "color": {
    "type": "select",
    "access": "public",
    "title": "Color",
    "value": "grey",
    "settings": {
      "options": {
        "blue": "Blue",
        "turquoise": "Turquoise",
        "pink": "Pink",
        "violet": "Violet",
        "peacoc": "Peacoc",
        "chino": "Chino",
        "mulled-wine": "Mulled Wine",
        "vista-blue": "Vista Blue",
        "black": "Black",
        "grey": "Grey",
        "orange": "Orange",
        "sky": "Sky",
        "green": "Green",
        "juicy-pink": "Juicy pink",
        "sandy-brown": "Sandy brown",
        "purple": "Purple",
        "white": "White"
      }
    }
  },
  "spacing": {
    "type": "select",
    "access": "public",
    "title": "Spacing",
    "value": "0",
    "settings": {
      "options": {
        "0": "None",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "5": "5px",
        "10": "10px",
        "15": "15px",
        "20": "20px",
        "25": "25px",
        "30": "30px",
        "35": "35px"
      }
    }
  },
  "gap": {
    "type": "select",
    "access": "public",
    "title": "Gap",
    "value": "0",
    "settings": {
      "options": {
        "0": "None",
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "5": "5px",
        "10": "10px",
        "15": "15px",
        "20": "20px",
        "25": "25px",
        "30": "30px",
        "35": "35px"
      }
    }
  },
  "position": {
    "type": "select",
    "access": "public",
    "title": "Position of tabs",
    "value": "left",
    "settings": {
      "options": {
        "left": "Left",
        "right": "Right"
      }
    }
  }
},{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Url"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "Url"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "block"
  },
  "onValidateItems": {
    "type": "string",
    "access": "system",
    "value": 1
  },
  "onCancelItems": {
    "type": "string",
    "access": "system",
    "value": 2
  },
  "onSaveItems": {
    "type": "string",
    "access": "system",
    "value": 2
  },
  "url": {
    "type": "string",
    "access": "public",
    "value": "#",
    "title": "Min Length validation check, minlength: 1",
    "settings": {
      "onOpen": [
        {
          "rule": "value",
          "options": "test",
        }
      ],
      "onChange": [
        {
          "rule": "value",
          "options": "test",
        }
      ],
      "onSave": [
        {
          "rule": "value",
          "options": "test",
        }
      ],
      "onCancel": [
        {
          "rule": "value",
          "options": "test",
        }
      ]
    }
  },
  "addIcon": {
    "type": "checkbox",
    "access": "public",
    "value": "",
    "title": "Check to add icon selector",
    "settings": {
      "options": {
        "1": "Yes"
      },
      "onOpen": [
        {
          "rule": "value",
          "options": "1",
          "done": [
            {
              "action": "show",
              "options": "icon"
            }
          ],
          "fail": [
            {
              "action": "hide",
              "options": "icon"
            }
          ]
        }
      ],
      "onChange": [
        {
          "rule": "value",
          "options": "1",
          "done": [
            {
              "action": "show",
              "options": "icon"
            }
          ],
          "fail": [
            {
              "action": "hide",
              "options": "icon"
            }
          ]
        }
      ],
      "onSave": [
        {
          "rule": "value",
          "options": "1",
          "done": [
            {
              "action": "show",
              "options": "icon"
            }
          ],
          "fail": [
            {
              "action": "hide",
              "options": "icon"
            }
          ]
        }
      ],
      "onCancel": [
        {
          "rule": "value",
          "options": "1",
          "done": [
            {
              "action": "show",
              "options": "icon"
            }
          ],
          "fail": [
            {
              "action": "hide",
              "options": "icon"
            }
          ]
        }
      ]
    }
  },
  "icon": {
    "type": "select",
    "access": "public",
    "value": "",
    "title": "Select icon",
    "settings": {
      "options": {
        "fa fa-heart": "Heart"
      }
    }
  },
  "title": {
    "type": "string",
    "access": "public",
    "value": "Url",
    "title": "Title, required"
  }
},{
  "name": {
    "type": "string",
    "access": "system",
    "value": "Validation"
  },
  "tag": {
    "type": "string",
    "access": "system",
    "value": "Validation"
  },
  "icon": {
    "type": "string",
    "access": "system",
    "value": "Validation"
  },
  "type": {
    "type": "string",
    "access": "system",
    "value": "block"
  },
  "minlength": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": "minlength:2"
    },
    "title": "Min Length validation check, minlength: 2"
  },
  "maxlength": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": "maxlength:5"
    },
    "title": "Max Length validation check, maxlength: 2"
  },
  "length": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": "length:2:5"
    },
    "title": "Length validation check, length:2:5"
  },
  "value": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": "value:2:5"
    },
    "title": "Value validation check, value:2:5"
  },
  "minvalue": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": "minvalue:2"
    },
    "title": "Value validation check, minvalue:2"
  },
  "maxvalue": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": "maxvalue:5"
    },
    "title": "Value validation check, maxvalue:5"
  },
  "required": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": "required"
    },
    "title": "Required validation check"
  },
  "arrays": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": [
        "value:2:50",
        "required",
        "minlength:2"
      ]
    },
    "title": "[value:2:50,required,minlength:2]"
  },
  "callbacks": {
    "type": "textarea",
    "access": "public",
    "value": "",
    "settings": {
      "validation": function(value, options) {
        return value == 2016;
      }
    },
    "title": "Callback check value 2016"
  }
}];
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
  "textfield": {
    "type": "textfield",
    "access": "public",
    "value": "",
    "title": "textfield param"
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
        "type": "innerhtml",
        "access": "public",
        "value": "Button",
        "title": "Title"
    },
    "mutable": {
        "type": "string",
        "access": "system",
        "value": "*"
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
    "mutable": {
        "type": "string",
        "access": "system",
        "value": "*"
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
    "content": {
        "type": "textarea",
        "access": "public",
        "value": "Cta",
        "title": "Title"
    },
    "relatedTo": {
      "type": "string",
      "access": "system",
      "value": ["CTA"]
    },
    "children": {
      "type": "string",
      "access": "system",
      "value": ["Button", "Paragraph", "Header"]
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
  "mutable": {
    "type": "string",
    "access": "system",
    "value": "*"
  },
  "icon-library": {
    "type": "select",
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
    "type": "select",
    "access": "public",
    "title": "Icon",
    "value": "glyphicon-ok-circle",
    "settings": {
      "options": {
        "glyphicon-asterisk": "Asterisk",
        "glyphicon-plus": "Plus",
        "glyphicon-euro": "Euro",
        "glyphicon-eur": "Eur",
        "glyphicon-minus": "Minus",
        "glyphicon-cloud": "Cloud",
        "glyphicon-envelope": "Envelope",
        "glyphicon-pencil": "Pencil",
        "glyphicon-glass": "Glass",
        "glyphicon-music": "Music",
        "glyphicon-search": "Search",
        "glyphicon-heart": "Heart",
        "glyphicon-star": "Star",
        "glyphicon-star-empty": "Star empty",
        "glyphicon-user": "User",
        "glyphicon-film": "Film",
        "glyphicon-th-large": "Th large",
        "glyphicon-th": "Th",
        "glyphicon-th-list": "Th list",
        "glyphicon-ok": "Ok",
        "glyphicon-remove": "Remove",
        "glyphicon-zoom-in": "Zoom in",
        "glyphicon-zoom-out": "Zoom out",
        "glyphicon-off": "Off",
        "glyphicon-signal": "Signal",
        "glyphicon-cog": "Cog",
        "glyphicon-trash": "Trash",
        "glyphicon-home": "Home",
        "glyphicon-file": "File",
        "glyphicon-time": "Time",
        "glyphicon-road": "Road",
        "glyphicon-download-alt": "Download alt",
        "glyphicon-download": "Download",
        "glyphicon-upload": "Upload",
        "glyphicon-inbox": "Inbox",
        "glyphicon-play-circle": "Play circle",
        "glyphicon-repeat": "Repeat",
        "glyphicon-refresh": "Refresh",
        "glyphicon-list-alt": "List alt",
        "glyphicon-lock": "Lock",
        "glyphicon-flag": "Flag",
        "glyphicon-headphones": "Headphones",
        "glyphicon-volume-off": "Volume off",
        "glyphicon-volume-down": "Volume down",
        "glyphicon-volume-up": "Volume up",
        "glyphicon-qrcode": "Qrcode",
        "glyphicon-barcode": "Barcode",
        "glyphicon-tag": "Tag",
        "glyphicon-tags": "Tags",
        "glyphicon-book": "Book",
        "glyphicon-bookmark": "Bookmark",
        "glyphicon-print": "Print",
        "glyphicon-camera": "Camera",
        "glyphicon-font": "Font",
        "glyphicon-bold": "Bold",
        "glyphicon-italic": "Italic",
        "glyphicon-text-height": "Text height",
        "glyphicon-text-width": "Text width",
        "glyphicon-align-left": "Align left",
        "glyphicon-align-center": "Align center",
        "glyphicon-align-right": "Align right",
        "glyphicon-align-justify": "Align justify",
        "glyphicon-list": "List",
        "glyphicon-indent-left": "Indent left",
        "glyphicon-indent-right": "Indent right",
        "glyphicon-facetime-video": "Facetime video",
        "glyphicon-picture": "Picture",
        "glyphicon-map-marker": "Map marker",
        "glyphicon-adjust": "Adjust",
        "glyphicon-tint": "Tint",
        "glyphicon-edit": "Edit",
        "glyphicon-share": "Share",
        "glyphicon-check": "Check",
        "glyphicon-move": "Move",
        "glyphicon-step-backward": "Step backward",
        "glyphicon-fast-backward": "Fast backward",
        "glyphicon-backward": "Backward",
        "glyphicon-play": "Play",
        "glyphicon-pause": "Pause",
        "glyphicon-stop": "Stop",
        "glyphicon-forward": "Forward",
        "glyphicon-fast-forward": "Fast forward",
        "glyphicon-step-forward": "Step forward",
        "glyphicon-eject": "Eject",
        "glyphicon-chevron-left": "Chevron left",
        "glyphicon-chevron-right": "Chevron right",
        "glyphicon-plus-sign": "Plus sign",
        "glyphicon-minus-sign": "Minus sign",
        "glyphicon-remove-sign": "Remove sign",
        "glyphicon-ok-sign": "Ok sign",
        "glyphicon-question-sign": "Question sign",
        "glyphicon-info-sign": "Info sign",
        "glyphicon-screenshot": "Screenshot",
        "glyphicon-remove-circle": "Remove circle",
        "glyphicon-ok-circle": "Ok circle",
        "glyphicon-ban-circle": "Ban circle",
        "glyphicon-arrow-left": "Arrow left",
        "glyphicon-arrow-right": "Arrow right",
        "glyphicon-arrow-up": "Arrow up",
        "glyphicon-arrow-down": "Arrow down",
        "glyphicon-share-alt": "Share alt",
        "glyphicon-resize-full": "Resize full",
        "glyphicon-resize-small": "Resize small",
        "glyphicon-exclamation-sign": "Exclamation sign",
        "glyphicon-gift": "Gift",
        "glyphicon-leaf": "Leaf",
        "glyphicon-fire": "Fire",
        "glyphicon-eye-open": "Eye open",
        "glyphicon-eye-close": "Eye close",
        "glyphicon-warning-sign": "Warning sign",
        "glyphicon-plane": "Plane",
        "glyphicon-calendar": "Calendar",
        "glyphicon-random": "Random",
        "glyphicon-comment": "Comment",
        "glyphicon-magnet": "Magnet",
        "glyphicon-chevron-up": "Chevron up",
        "glyphicon-chevron-down": "Chevron down",
        "glyphicon-retweet": "Retweet",
        "glyphicon-shopping-cart": "Shopping cart",
        "glyphicon-folder-close": "Folder close",
        "glyphicon-folder-open": "Folder open",
        "glyphicon-resize-vertical": "Resize vertical",
        "glyphicon-resize-horizontal": "Resize horizontal",
        "glyphicon-hdd": "Hdd",
        "glyphicon-bullhorn": "Bullhorn",
        "glyphicon-bell": "Bell",
        "glyphicon-certificate": "Certificate",
        "glyphicon-thumbs-up": "Thumbs up",
        "glyphicon-thumbs-down": "Thumbs down",
        "glyphicon-hand-right": "Hand right",
        "glyphicon-hand-left": "Hand left",
        "glyphicon-hand-up": "Hand up",
        "glyphicon-hand-down": "Hand down",
        "glyphicon-circle-arrow-right": "Circle arrow right",
        "glyphicon-circle-arrow-left": "Circle arrow left",
        "glyphicon-circle-arrow-up": "Circle arrow up",
        "glyphicon-circle-arrow-down": "Circle arrow down",
        "glyphicon-globe": "Globe",
        "glyphicon-wrench": "Wrench",
        "glyphicon-tasks": "Tasks",
        "glyphicon-filter": "Filter",
        "glyphicon-briefcase": "Briefcase",
        "glyphicon-fullscreen": "Fullscreen",
        "glyphicon-dashboard": "Dashboard",
        "glyphicon-paperclip": "Paperclip",
        "glyphicon-heart-empty": "Heart empty",
        "glyphicon-link": "Link",
        "glyphicon-phone": "Phone",
        "glyphicon-pushpin": "Pushpin",
        "glyphicon-usd": "Usd",
        "glyphicon-gbp": "Gbp",
        "glyphicon-sort": "Sort",
        "glyphicon-sort-by-alphabet": "Sort by alphabet",
        "glyphicon-sort-by-alphabet-alt": "Sort by alphabet alt",
        "glyphicon-sort-by-order": "Sort by order",
        "glyphicon-sort-by-order-alt": "Sort by order alt",
        "glyphicon-sort-by-attributes": "Sort by attributes",
        "glyphicon-sort-by-attributes-alt": "Sort by attributes alt",
        "glyphicon-unchecked": "Unchecked",
        "glyphicon-expand": "Expand",
        "glyphicon-collapse-down": "Collapse down",
        "glyphicon-collapse-up": "Collapse up",
        "glyphicon-log-in": "Log in",
        "glyphicon-flash": "Flash",
        "glyphicon-log-out": "Log out",
        "glyphicon-new-window": "New window",
        "glyphicon-record": "Record",
        "glyphicon-save": "Save",
        "glyphicon-open": "Open",
        "glyphicon-saved": "Saved",
        "glyphicon-import": "Import",
        "glyphicon-export": "Export",
        "glyphicon-send": "Send",
        "glyphicon-floppy-disk": "Floppy disk",
        "glyphicon-floppy-saved": "Floppy saved",
        "glyphicon-floppy-remove": "Floppy remove",
        "glyphicon-floppy-save": "Floppy save",
        "glyphicon-floppy-open": "Floppy open",
        "glyphicon-credit-card": "Credit card",
        "glyphicon-transfer": "Transfer",
        "glyphicon-cutlery": "Cutlery",
        "glyphicon-header": "Header",
        "glyphicon-compressed": "Compressed",
        "glyphicon-earphone": "Earphone",
        "glyphicon-phone-alt": "Phone alt",
        "glyphicon-tower": "Tower",
        "glyphicon-stats": "Stats",
        "glyphicon-sd-video": "Sd video",
        "glyphicon-hd-video": "Hd video",
        "glyphicon-subtitles": "Subtitles",
        "glyphicon-sound-stereo": "Sound stereo",
        "glyphicon-sound-dolby": "Sound dolby",
        "glyphicon-sound-5-1": "Sound 5 1",
        "glyphicon-sound-6-1": "Sound 6 1",
        "glyphicon-sound-7-1": "Sound 7 1",
        "glyphicon-copyright-mark": "Copyright mark",
        "glyphicon-registration-mark": "Registration mark",
        "glyphicon-cloud-download": "Cloud download",
        "glyphicon-cloud-upload": "Cloud upload",
        "glyphicon-tree-conifer": "Tree conifer",
        "glyphicon-tree-deciduous": "Tree deciduous",
        "glyphicon-cd": "Cd",
        "glyphicon-save-file": "Save file",
        "glyphicon-open-file": "Open file",
        "glyphicon-level-up": "Level up",
        "glyphicon-copy": "Copy",
        "glyphicon-paste": "Paste",
        "glyphicon-alert": "Alert",
        "glyphicon-equalizer": "Equalizer",
        "glyphicon-king": "King",
        "glyphicon-queen": "Queen",
        "glyphicon-pawn": "Pawn",
        "glyphicon-bishop": "Bishop",
        "glyphicon-knight": "Knight",
        "glyphicon-baby-formula": "Baby formula",
        "glyphicon-tent": "Tent",
        "glyphicon-blackboard": "Blackboard",
        "glyphicon-bed": "Bed",
        "glyphicon-apple": "Apple",
        "glyphicon-erase": "Erase",
        "glyphicon-hourglass": "Hourglass",
        "glyphicon-lamp": "Lamp",
        "glyphicon-duplicate": "Duplicate",
        "glyphicon-piggy-bank": "Piggy bank",
        "glyphicon-scissors": "Scissors",
        "glyphicon-bitcoin": "Bitcoin",
        "glyphicon-btc": "Btc",
        "glyphicon-xbt": "Xbt",
        "glyphicon-yen": "Yen",
        "glyphicon-jpy": "Jpy",
        "glyphicon-ruble": "Ruble",
        "glyphicon-rub": "Rub",
        "glyphicon-scale": "Scale",
        "glyphicon-ice-lolly": "Ice lolly",
        "glyphicon-ice-lolly-tasted": "Ice lolly tasted",
        "glyphicon-education": "Education",
        "glyphicon-option-horizontal": "Option horizontal",
        "glyphicon-option-vertical": "Option vertical",
        "glyphicon-menu-hamburger": "Menu hamburger",
        "glyphicon-modal-window": "Modal window",
        "glyphicon-oil": "Oil",
        "glyphicon-grain": "Grain",
        "glyphicon-sunglasses": "Sunglasses",
        "glyphicon-text-size": "Text size",
        "glyphicon-text-color": "Text color",
        "glyphicon-text-background": "Text background",
        "glyphicon-object-align-top": "Object align top",
        "glyphicon-object-align-bottom": "Object align bottom",
        "glyphicon-object-align-horizontal": "Object align horizontal",
        "glyphicon-object-align-left": "Object align left",
        "glyphicon-object-align-vertical": "Object align vertical",
        "glyphicon-object-align-right": "Object align right",
        "glyphicon-triangle-right": "Triangle right",
        "glyphicon-triangle-left": "Triangle left",
        "glyphicon-triangle-bottom": "Triangle bottom",
        "glyphicon-triangle-top": "Triangle top",
        "glyphicon-console": "Console",
        "glyphicon-superscript": "Superscript",
        "glyphicon-subscript": "Subscript",
        "glyphicon-menu-left": "Menu left",
        "glyphicon-menu-right": "Menu right",
        "glyphicon-menu-down": "Menu down",
        "glyphicon-menu-up": "Menu up"
      }
    }
  },
  "relatedTo": {
    "type": "string",
    "access": "system",
    "value": ["Icons", "Semantics"]
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
  "mutable": {
    "type": "string",
    "access": "system",
    "value": "*"
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
    "mutable": {
      "type": "string",
      "access": "system",
      "value": "*"
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
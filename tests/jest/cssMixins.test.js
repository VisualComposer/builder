/* global describe, test, expect */
import vcCake from 'vc-cake'
import '../../public/variables'

// Services & Storages
import '../../public/editor/services/dataManager/service'
import '../../public/editor/services/roleManager/service'
import '../../public/editor/services/utils/service'
import '../../public/editor/services/document/service'
import '../../public/editor/services/cook/service'
import '../../public/editor/services/modernAssetsStorage/service'
import { getMixinsSelector, getCssMixinsBySettings, getInnerCssMixinsBySettings } from '../../public/editor/services/modernAssetsStorage/cssMixins.ts'
import '../../public/editor/services/api/service'
import '../../public/editor/services/roleManager/service'
import '../../public/config/wp-attributes'
import '../../public/editor/stores/elements/elementsStorage'
import '../../public/editor/stores/elements/elementSettings'
import '../../public/editor/modules/elementLimit/module'

// Elements
import '../../elements/row/row/index'
import '../../elements/column/column/index'
import '../../elements/basicButton/basicButton/index'

// EnzymeJS
import React from 'react'
import { shallow, configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

// Import cssMixins.ts

configure({ adapter: new Adapter() });

jest.useFakeTimers()

describe('Test cssMixins from modernAssetsStorage', () => {
  vcCake.env('VCV_DEBUG', true)
  vcCake.start(() => {
    test('get cssMixins from settings empty', () => {
      const settings = {}
      const foundMixins = getCssMixinsBySettings(settings)
      // expect that foundMixins is empty object
      expect(foundMixins).toEqual({})
    })
    test('get cssMixins from settings basicButton', () => {
      const settings = {
        "hoverColor": {
          "type": "color",
          "access": "public",
          "value": "#fff",
          "options": {
            "label": "Title hover color",
            "cssMixin": {
              "mixin": "basicHoverColor",
              "property": "hoverColor",
              "namePattern": "[\\da-f]+"
            },
            "onChange": {
              "rules": {
                "toggleCustomHover": {
                  "rule": "toggle"
                }
              },
              "actions": [
                {
                  "action": "toggleVisibility"
                }
              ]
            }
          }
        },
        "hoverBackground": {
          "type": "color",
          "access": "public",
          "value": "#4d70ac",
          "options": {
            "label": "Background hover color",
            "cssMixin": {
              "mixin": "basicHoverColor",
              "property": "hoverBackground",
              "namePattern": "[\\da-f]+"
            },
            "onChange": {
              "rules": {
                "toggleCustomHover": {
                  "rule": "toggle"
                }
              },
              "actions": [
                {
                  "action": "toggleVisibility"
                }
              ]
            }
          }
        },
        "buttonText": {
          "type": "string",
          "access": "public",
          "value": "Apply Now",
          "options": {
            "label": "Button text",
            "dynamicField": true
          }
        },
        "color": {
          "type": "color",
          "access": "public",
          "value": "#fff",
          "options": {
            "label": "Title color",
            "cssMixin": {
              "mixin": "basicColor",
              "property": "color",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "background": {
          "type": "color",
          "access": "public",
          "value": "#557cbf",
          "options": {
            "label": "Background color",
            "cssMixin": {
              "mixin": "basicColor",
              "property": "background",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "tag": {
          "access": "protected",
          "type": "string",
          "value": "basicButton"
        }
      }

      const foundMixins = getCssMixinsBySettings(settings)
      expect(foundMixins).toEqual({
        "basicHoverColor": [
          {
            "propertyName": "hoverBackground",
            "attributeName": "hoverBackground",
            "namePattern": "[\\da-f]+"
          },
          {
            "propertyName": "hoverColor",
            "attributeName": "hoverColor",
            "namePattern": "[\\da-f]+"
          }
        ],
        "basicColor": [
          {
            "propertyName": "background",
            "attributeName": "background",
            "namePattern": "[\\da-f]+"
          },
          {
            "propertyName": "color",
            "attributeName": "color",
            "namePattern": "[\\da-f]+"
          }
        ]
      })
    })

    test('get cssMixins from settings custom', () => {
      const settings = {
        "color": {
          "type": "color",
          "access": "public",
          "value": "#fff",
          "options": {
            "label": "Title color",
            "cssMixin": {
              "mixin": "basicColor",
              "property": "color",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "background": {
          "type": "color",
          "access": "public",
          "value": "#557cbf",
          "options": {
            "label": "Background color",
            "cssMixin": {
              "mixin": "basicColor",
              "property": "background",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "blend": {
          "type": "dropdown",
          "access": "public",
          "value": "difference",
          "options": {
            "label": "Blending options",
            "values": [
              {
                "label": "Normal",
                "value": "normal"
              },
              {
                "label": "Multiply",
                "value": "multiply"
              },
              {
                "label": "Screen",
                "value": "screen"
              },
              {
                "label": "Overlay",
                "value": "overlay"
              },
              {
                "label": "Color dodge",
                "value": "colorDodge"
              },
              {
                "label": "Color burn",
                "value": "colorBurn"
              },
              {
                "label": "Hard light",
                "value": "hardLight"
              },
              {
                "label": "Soft light",
                "value": "softLight"
              },
              {
                "label": "Difference",
                "value": "difference"
              },
              {
                "label": "Exclusion",
                "value": "exclusion"
              },
              {
                "label": "Hue",
                "value": "hue"
              },
              {
                "label": "Saturation",
                "value": "saturation"
              },
              {
                "label": "Luminosity",
                "value": "luminosity"
              }
            ],
            "cssMixin": {
              "mixin": "backgroundColor",
              "property": "blendFunction",
              "namePattern": "[a-z]+"
            }
          }
        },
        "size": {
          "type": "number",
          "access": "public",
          "value": "10",
          "options": {
            "label": "Size",
            "description": "Enter the size in pixels (example: 5).",
            "cssMixin": {
              "mixin": "postsGridGap",
              "property": "size"
            }
          }
        },
        "gap": {
          "type": "number",
          "access": "public",
          "value": "10",
          "options": {
            "label": "Gap",
            "description": "Enter the gap in pixels (example: 5).",
            "cssMixin": {
              "mixin": "postsGridGap",
              "property": "gap"
            }
          }
        },
        "tag": {
          "access": "protected",
          "type": "string",
          "value": "customCssMixins"
        }
      }

      const foundMixins = getCssMixinsBySettings(settings)
      expect(foundMixins).toEqual({
        "basicColor": [
          {
            "propertyName": "background",
            "attributeName": "background",
            "namePattern": "[\\da-f]+"
          },
          {
            "propertyName": "color",
            "attributeName": "color",
            "namePattern": "[\\da-f]+"
          }
        ],
        "backgroundColor": [
          {
            "propertyName": "blendFunction",
            "attributeName": "blend",
            "namePattern": "[a-z]+"
          }
        ],
        "postsGridGap": [
          {
            "propertyName": "gap",
            "attributeName": "gap",
            "namePattern": undefined
          },
          {
            "propertyName": "size",
            "attributeName": "size",
            "namePattern": undefined
          }
        ]
      })

      const values = {
        color: "rgba(255, 255, 255, 0.99)",
        background: "rgb(255, 200, 255)",
      }
      const selector = getMixinsSelector(foundMixins['basicColor'], values)
      expect(selector).toEqual('b-255-200-255--ba-255-255-255-0-99')

      const selectorWithProps = getMixinsSelector(foundMixins['basicColor'], values, true)
      expect(selectorWithProps).toEqual(
        {
          color: 'rgba(255, 255, 255, 0.99)',
          background: 'rgb(255, 200, 255)',
          selector: 'b-255-200-255--ba-255-255-255-0-99'
        }
      )
    })

    test('get cssMixins from settings custom animatedTwoColorsButton', () => {
      const settings = {
        "groups": {
          "type": "string",
          "access": "protected",
          "value": "Buttons"
        },
        "buttonText": {
          "type": "string",
          "access": "public",
          "value": "Apply Now",
          "options": {
            "label": "Button text",
            "dynamicField": true
          }
        },
        "buttonUrl": {
          "type": "url",
          "access": "public",
          "value": {
            "url": "",
            "title": "",
            "targetBlank": false,
            "relNofollow": false
          },
          "options": {
            "label": "Link selection",
            "description": "Opens the field to add a link to the element.",
            "dynamicField": true
          }
        },
        "alignment": {
          "type": "buttonGroup",
          "access": "public",
          "value": "left",
          "options": {
            "label": "Alignment",
            "values": [
              {
                "label": "Left",
                "value": "left",
                "icon": "vcv-ui-icon-attribute-alignment-left"
              },
              {
                "label": "Center",
                "value": "center",
                "icon": "vcv-ui-icon-attribute-alignment-center"
              },
              {
                "label": "Right",
                "value": "right",
                "icon": "vcv-ui-icon-attribute-alignment-right"
              }
            ]
          }
        },
        "shape": {
          "type": "buttonGroup",
          "access": "public",
          "value": "round",
          "options": {
            "label": "Shape",
            "values": [
              {
                "label": "Square",
                "value": "square",
                "icon": "vcv-ui-icon-attribute-shape-square"
              },
              {
                "label": "Rounded",
                "value": "rounded",
                "icon": "vcv-ui-icon-attribute-shape-rounded"
              },
              {
                "label": "Round",
                "value": "round",
                "icon": "vcv-ui-icon-attribute-shape-round"
              }
            ]
          }
        },
        "titleColor": {
          "type": "color",
          "access": "public",
          "value": "#fff",
          "options": {
            "label": "Title color",
            "cssMixin": {
              "mixin": "titleColor",
              "property": "titleColor",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "backgroundOneColor": {
          "type": "color",
          "access": "public",
          "value": "#f8e71c",
          "options": {
            "label": "First background color",
            "cssMixin": {
              "mixin": "backgroundColor",
              "property": "backgroundColor1",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "backgroundTwoColor": {
          "type": "color",
          "access": "public",
          "value": "#4a90e2",
          "options": {
            "label": "Second background color",
            "cssMixin": {
              "mixin": "backgroundColor",
              "property": "backgroundColor2",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "blend": {
          "type": "dropdown",
          "access": "public",
          "value": "difference",
          "options": {
            "label": "Blending options",
            "values": [
              {
                "label": "Normal",
                "value": "normal"
              },
              {
                "label": "Multiply",
                "value": "multiply"
              },
              {
                "label": "Screen",
                "value": "screen"
              },
              {
                "label": "Overlay",
                "value": "overlay"
              },
              {
                "label": "Color dodge",
                "value": "colorDodge"
              },
              {
                "label": "Color burn",
                "value": "colorBurn"
              },
              {
                "label": "Hard light",
                "value": "hardLight"
              },
              {
                "label": "Soft light",
                "value": "softLight"
              },
              {
                "label": "Difference",
                "value": "difference"
              },
              {
                "label": "Exclusion",
                "value": "exclusion"
              },
              {
                "label": "Hue",
                "value": "hue"
              },
              {
                "label": "Saturation",
                "value": "saturation"
              },
              {
                "label": "Luminosity",
                "value": "luminosity"
              }
            ],
            "cssMixin": {
              "mixin": "backgroundColor",
              "property": "blendFunction",
              "namePattern": "[a-z]+"
            }
          }
        },
        "designOptions": {
          "type": "designOptions",
          "access": "public",
          "value": {},
          "options": {
            "label": "Design Options"
          }
        },
        "editFormTab1": {
          "type": "group",
          "access": "protected",
          "value": [
            "buttonText",
            "buttonUrl",
            "alignment",
            "shape",
            "titleColor",
            "backgroundOneColor",
            "backgroundTwoColor",
            "blend",
            "metaCustomId",
            "customClass"
          ],
          "options": {
            "label": "General"
          }
        },
        "metaEditFormTabs": {
          "type": "group",
          "access": "protected",
          "value": [
            "editFormTab1",
            "designOptions"
          ]
        },
        "relatedTo": {
          "type": "group",
          "access": "protected",
          "value": [
            "General",
            "Buttons"
          ]
        },
        "assetsLibrary": {
          "access": "public",
          "type": "string",
          "value": [
            "animate"
          ]
        },
        "customClass": {
          "type": "string",
          "access": "public",
          "value": "",
          "options": {
            "label": "Extra class name",
            "description": "Add an extra class name to the element and refer to it from the custom CSS option."
          }
        },
        "metaBackendLabels": {
          "type": "group",
          "access": "protected",
          "value": [
            {
              "value": [
                "buttonText",
                "buttonUrl"
              ]
            }
          ]
        },
        "metaCustomId": {
          "type": "customId",
          "access": "public",
          "value": "",
          "options": {
            "label": "Element ID",
            "description": "Apply a unique ID to the element to link it directly by using #your_id (for element ID use lowercase input only)."
          }
        },
        "tag": {
          "access": "protected",
          "type": "string",
          "value": "animatedTwoColorButton"
        }
      }

      const foundMixins = getCssMixinsBySettings(settings)
      expect(foundMixins).toEqual({
          "titleColor": [
            {
              "propertyName": "titleColor",
              "attributeName": "titleColor",
              "namePattern": "[\\da-f]+"
            }
          ],
          "backgroundColor": [
            {
              "propertyName": "backgroundColor1",
              "attributeName": "backgroundOneColor",
              "namePattern": "[\\da-f]+"
            },
            {
              "propertyName": "backgroundColor2",
              "attributeName": "backgroundTwoColor",
              "namePattern": "[\\da-f]+"
            },
            {
              "propertyName": "blendFunction",
              "attributeName": "blend",
              "namePattern": "[a-z]+"
            }
          ]
        }
      )

      const values = {
        titleColor: "rgba(255, 255, 255, 0.99)",
        backgroundOneColor: "rgba(255, 255, 255, 0.99)",
        backgroundTwoColor: "#fff",
        blend: "difference",
      }
      const selector = getMixinsSelector(foundMixins['backgroundColor'], values)
      expect(selector).toEqual('ba-255-255-255-0-99--fff--difference')

      const selectorWithProps = getMixinsSelector(foundMixins['backgroundColor'], values, true)
      expect(selectorWithProps).toEqual(
        {
          backgroundColor1: "rgba(255, 255, 255, 0.99)",
          backgroundColor2: "#fff",
          blendFunction: "difference",
          selector: 'ba-255-255-255-0-99--fff--difference'
        }
      )
    })

    test('get cssMixins from settings custom paramsGroup', () => {
      const settings = {
        "tag": {
          "access": "protected",
          "type": "string",
          "value": "progressBars"
        },
        "relatedTo": {
          "type": "group",
          "access": "protected",
          "value": [
            "General"
          ]
        },
        "thickness": {
          "type": "number",
          "access": "public",
          "value": "10",
          "options": {
            "label": "Thickness",
            "description": "Enter progress bar thickness in pixels.",
            "cssMixin": {
              "mixin": "barThickness",
              "property": "thickness",
              "namePattern": "[\\da-f]+"
            },
            "min": 1
          }
        },
        "toggleValue": {
          "type": "toggle",
          "access": "public",
          "value": true,
          "options": {
            "label": "Show value",
            "description": "Option to disable percentage display"
          }
        },
        "shape": {
          "type": "buttonGroup",
          "access": "public",
          "value": "square",
          "options": {
            "label": "Shape",
            "values": [
              {
                "label": "Square",
                "value": "square",
                "icon": "vcv-ui-icon-attribute-shape-square"
              },
              {
                "label": "Rounded",
                "value": "rounded",
                "icon": "vcv-ui-icon-attribute-shape-rounded"
              },
              {
                "label": "Round",
                "value": "round",
                "icon": "vcv-ui-icon-attribute-shape-round"
              }
            ]
          }
        },
        "bars": {
          "type": "paramsGroup",
          "access": "public",
          "value": {
            "value": [
              {
                "title": "Web Design",
                "value": 80,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              },
              {
                "title": "Marketing",
                "value": 50,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              },
              {
                "title": "Social Media",
                "value": 60,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              }
            ]
          },
          "options": {
            "label": "General",
            "title": "Progress bar",
            "groupDefaultTile": "Progress bar",
            "settings": {
              "title": {
                "type": "string",
                "access": "public",
                "value": "Progress bar",
                "options": {
                  "label": "Title",
                  "dynamicField": true
                }
              },
              "value": {
                "type": "range",
                "access": "public",
                "value": "70",
                "options": {
                  "label": "Value",
                  "cssMixin": {
                    "mixin": "barValue",
                    "property": "value",
                    "namePattern": "[\\da-f]+"
                  }
                }
              },
              "backgroundColor": {
                "type": "color",
                "access": "public",
                "value": "rgba(242, 242, 242, .5)",
                "options": {
                  "label": "Background color",
                  "cssMixin": {
                    "mixin": "barBackgroundColor",
                    "property": "backgroundColor",
                    "namePattern": "[\\da-f]+"
                  }
                }
              },
              "colorType": {
                "type": "dropdown",
                "access": "public",
                "value": "gradient",
                "options": {
                  "label": "Color type",
                  "values": [
                    {
                      "label": "Color",
                      "value": "color"
                    },
                    {
                      "label": "Gradient",
                      "value": "gradient"
                    }
                  ]
                }
              },
              "color": {
                "type": "color",
                "access": "public",
                "value": "#50e3c2",
                "options": {
                  "label": "Bar color",
                  "cssMixin": {
                    "mixin": "barColor",
                    "property": "color",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "color"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "gradientStart": {
                "type": "color",
                "access": "public",
                "value": " #3023AE",
                "options": {
                  "label": "Start color",
                  "cssMixin": {
                    "mixin": "barColor",
                    "property": "gradientStart",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "gradient"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "gradientEnd": {
                "type": "color",
                "access": "public",
                "value": " #C86DD7",
                "options": {
                  "label": "End color",
                  "cssMixin": {
                    "mixin": "barColor",
                    "property": "gradientEnd",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "gradient"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "_paramGroupEditFormTab1": {
                "type": "group",
                "access": "protected",
                "value": [
                  "title",
                  "value",
                  "backgroundColor",
                  "colorType",
                  "color",
                  "gradientStart",
                  "gradientEnd"
                ],
                "options": {
                  "label": "General"
                }
              },
              "metaEditFormTabs": {
                "type": "group",
                "access": "protected",
                "value": [
                  "_paramGroupEditFormTab1"
                ]
              }
            }
          }
        },
        "titleFont": {
          "type": "googleFonts",
          "access": "public",
          "value": {
            "fontFamily": "Lato",
            "fontStyle": {
              "weight": "400",
              "style": "regular"
            },
            "status": "active",
            "fontText": "The sky was cloudless and of a deep dark blue."
          },
          "options": {
            "label": "",
            "cssMixin": {
              "mixin": "titleFontFamily",
              "property": "titleFontFamily",
              "namePattern": "[a-z]+",
              "valueKey": "fontFamily"
            }
          }
        },
        "valueFont": {
          "type": "googleFonts",
          "access": "public",
          "value": {
            "fontFamily": "Lato",
            "fontStyle": {
              "weight": "400",
              "style": "regular"
            },
            "status": "active",
            "fontText": "The sky was cloudless and of a deep dark blue."
          },
          "options": {
            "label": "",
            "cssMixin": {
              "mixin": "valueFontFamily",
              "property": "valueFontFamily",
              "namePattern": "[a-z]+",
              "valueKey": "fontFamily"
            }
          }
        },
        "titleElementTag": {
          "type": "dropdown",
          "access": "public",
          "value": "span",
          "options": {
            "label": "Element tag",
            "values": [
              {
                "label": "h1",
                "value": "h1"
              },
              {
                "label": "h2",
                "value": "h2"
              },
              {
                "label": "h3",
                "value": "h3"
              },
              {
                "label": "h4",
                "value": "h4"
              },
              {
                "label": "h5",
                "value": "h5"
              },
              {
                "label": "h6",
                "value": "h6"
              },
              {
                "label": "p",
                "value": "p"
              },
              {
                "label": "span",
                "value": "span"
              }
            ]
          }
        },
        "valueElementTag": {
          "type": "dropdown",
          "access": "public",
          "value": "span",
          "options": {
            "label": "Element tag",
            "values": [
              {
                "label": "h1",
                "value": "h1"
              },
              {
                "label": "h2",
                "value": "h2"
              },
              {
                "label": "h3",
                "value": "h3"
              },
              {
                "label": "h4",
                "value": "h4"
              },
              {
                "label": "h5",
                "value": "h5"
              },
              {
                "label": "h6",
                "value": "h6"
              },
              {
                "label": "p",
                "value": "p"
              },
              {
                "label": "span",
                "value": "span"
              }
            ]
          }
        },
        "titleColor": {
          "type": "color",
          "access": "public",
          "value": "#333",
          "options": {
            "label": "Color",
            "cssMixin": {
              "mixin": "titleColor",
              "property": "titleColor",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "valueColor": {
          "type": "color",
          "access": "public",
          "value": "#333",
          "options": {
            "label": "Color",
            "cssMixin": {
              "mixin": "valueColor",
              "property": "valueColor",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "titleFontSize": {
          "type": "string",
          "access": "public",
          "value": "16px",
          "options": {
            "label": "Font size"
          }
        },
        "valueFontSize": {
          "type": "string",
          "access": "public",
          "value": "16px",
          "options": {
            "label": "Font size"
          }
        },
        "titleLineHeight": {
          "type": "string",
          "access": "public",
          "value": "1.3",
          "options": {
            "label": "Line height"
          }
        },
        "valueLineHeight": {
          "type": "string",
          "access": "public",
          "value": "1.3",
          "options": {
            "label": "Line height"
          }
        },
        "titleLetterSpacing": {
          "type": "string",
          "access": "public",
          "value": "0",
          "options": {
            "label": "Letter spacing"
          }
        },
        "valueLetterSpacing": {
          "type": "string",
          "access": "public",
          "value": "0",
          "options": {
            "label": "Letter spacing"
          }
        },
        "customClass": {
          "type": "string",
          "access": "public",
          "value": "",
          "options": {
            "label": "Extra class name",
            "description": "Add an extra class name to the element and refer to it from the custom CSS option."
          }
        },
        "metaCustomId": {
          "type": "customId",
          "access": "public",
          "value": "",
          "options": {
            "label": "Element ID",
            "description": "Apply a unique ID to the element to link it directly by using #your_id (for element ID use lowercase input only)."
          }
        },
        "fontsForTitle": {
          "type": "group",
          "access": "protected",
          "value": [
            "titleFont",
            "titleElementTag",
            "titleColor",
            "titleFontSize",
            "titleLineHeight",
            "titleLetterSpacing"
          ],
          "options": {
            "label": "Title Font Face"
          }
        },
        "fontsForValue": {
          "type": "group",
          "access": "protected",
          "value": [
            "valueFont",
            "valueElementTag",
            "valueColor",
            "valueFontSize",
            "valueLineHeight",
            "valueLetterSpacing"
          ],
          "options": {
            "label": "Value Font Face",
            "onChange": {
              "rules": {
                "toggleValue": {
                  "rule": "toggle"
                }
              },
              "actions": [
                {
                  "action": "toggleSectionVisibility"
                }
              ]
            }
          }
        },
        "designOptions": {
          "type": "designOptions",
          "access": "public",
          "value": {},
          "options": {
            "label": "Design Options"
          }
        },
        "editFormTab1": {
          "type": "group",
          "access": "protected",
          "value": [
            "thickness",
            "toggleValue",
            "shape",
            "bars",
            "metaCustomId",
            "customClass"
          ],
          "options": {
            "label": "General"
          }
        },
        "metaEditFormTabs": {
          "type": "group",
          "access": "protected",
          "value": [
            "editFormTab1",
            "fontsForTitle",
            "fontsForValue",
            "designOptions"
          ]
        },
        "sharedAssetsLibrary": {
          "access": "protected",
          "type": "string",
          "value": {
            "libraries": [
              {
                "libsNames": [
                  "waypoints",
                  "countUp"
                ]
              }
            ]
          }
        },
        "metaPublicJs": {
          "access": "protected",
          "type": "string",
          "value": {
            "libraries": [
              {
                "libPaths": "public/dist/countUpStarter.min.js"
              }
            ]
          }
        }
      }
      const foundMixins = getInnerCssMixinsBySettings(settings)
      expect(foundMixins).toEqual({
        "barValue": [
          {
            "propertyName": "value",
            "attributeName": "value",
            "namePattern": "[\\da-f]+"
          }
        ],
        "barBackgroundColor": [
          {
            "propertyName": "backgroundColor",
            "attributeName": "backgroundColor",
            "namePattern": "[\\da-f]+"
          }
        ],
        "barColor": [
          {
            "propertyName": "color",
            "attributeName": "color",
            "namePattern": "[\\da-f]+"
          },
          {
            "propertyName": "gradientEnd",
            "attributeName": "gradientEnd",
            "namePattern": "[\\da-f]+"
          },
          {
            "propertyName": "gradientStart",
            "attributeName": "gradientStart",
            "namePattern": "[\\da-f]+"
          }
        ]
      })
    })

    test('get cssMixins from settings custom multiple paramsGroup', () => {
      const settings = {
        "tag": {
          "access": "protected",
          "type": "string",
          "value": "progressBars"
        },
        "relatedTo": {
          "type": "group",
          "access": "protected",
          "value": [
            "General"
          ]
        },
        "thickness": {
          "type": "number",
          "access": "public",
          "value": "10",
          "options": {
            "label": "Thickness",
            "description": "Enter progress bar thickness in pixels.",
            "cssMixin": {
              "mixin": "barThickness",
              "property": "thickness",
              "namePattern": "[\\da-f]+"
            },
            "min": 1
          }
        },
        "toggleValue": {
          "type": "toggle",
          "access": "public",
          "value": true,
          "options": {
            "label": "Show value",
            "description": "Option to disable percentage display"
          }
        },
        "shape": {
          "type": "buttonGroup",
          "access": "public",
          "value": "square",
          "options": {
            "label": "Shape",
            "values": [
              {
                "label": "Square",
                "value": "square",
                "icon": "vcv-ui-icon-attribute-shape-square"
              },
              {
                "label": "Rounded",
                "value": "rounded",
                "icon": "vcv-ui-icon-attribute-shape-rounded"
              },
              {
                "label": "Round",
                "value": "round",
                "icon": "vcv-ui-icon-attribute-shape-round"
              }
            ]
          }
        },
        "bars": {
          "type": "paramsGroup",
          "access": "public",
          "value": {
            "value": [
              {
                "title": "Web Design",
                "value": 80,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              },
              {
                "title": "Marketing",
                "value": 50,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              },
              {
                "title": "Social Media",
                "value": 60,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              }
            ]
          },
          "options": {
            "label": "General",
            "title": "Progress bar",
            "groupDefaultTile": "Progress bar",
            "settings": {
              "title": {
                "type": "string",
                "access": "public",
                "value": "Progress bar",
                "options": {
                  "label": "Title",
                  "dynamicField": true
                }
              },
              "value": {
                "type": "range",
                "access": "public",
                "value": "70",
                "options": {
                  "label": "Value",
                  "cssMixin": {
                    "mixin": "barValue",
                    "property": "value",
                    "namePattern": "[\\da-f]+"
                  }
                }
              },
              "backgroundColor": {
                "type": "color",
                "access": "public",
                "value": "rgba(242, 242, 242, .5)",
                "options": {
                  "label": "Background color",
                  "cssMixin": {
                    "mixin": "barBackgroundColor",
                    "property": "backgroundColor",
                    "namePattern": "[\\da-f]+"
                  }
                }
              },
              "colorType": {
                "type": "dropdown",
                "access": "public",
                "value": "gradient",
                "options": {
                  "label": "Color type",
                  "values": [
                    {
                      "label": "Color",
                      "value": "color"
                    },
                    {
                      "label": "Gradient",
                      "value": "gradient"
                    }
                  ]
                }
              },
              "color": {
                "type": "color",
                "access": "public",
                "value": "#50e3c2",
                "options": {
                  "label": "Bar color",
                  "cssMixin": {
                    "mixin": "barColor",
                    "property": "color",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "color"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "gradientStart": {
                "type": "color",
                "access": "public",
                "value": " #3023AE",
                "options": {
                  "label": "Start color",
                  "cssMixin": {
                    "mixin": "barColor",
                    "property": "gradientStart",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "gradient"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "gradientEnd": {
                "type": "color",
                "access": "public",
                "value": " #C86DD7",
                "options": {
                  "label": "End color",
                  "cssMixin": {
                    "mixin": "barColor",
                    "property": "gradientEnd",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "gradient"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "_paramGroupEditFormTab1": {
                "type": "group",
                "access": "protected",
                "value": [
                  "title",
                  "value",
                  "backgroundColor",
                  "colorType",
                  "color",
                  "gradientStart",
                  "gradientEnd"
                ],
                "options": {
                  "label": "General"
                }
              },
              "metaEditFormTabs": {
                "type": "group",
                "access": "protected",
                "value": [
                  "_paramGroupEditFormTab1"
                ]
              }
            }
          }
        },
        "bars2": {
          "type": "paramsGroup",
          "access": "public",
          "value": {
            "value": [
              {
                "title": "Web Design",
                "value": 80,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              },
              {
                "title": "Marketing",
                "value": 50,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              },
              {
                "title": "Social Media",
                "value": 60,
                "backgroundColor": "rgba(242, 242, 242, .5)",
                "colorType": "gradient",
                "color": "#50e3c2",
                "gradientStart": "#3023ae",
                "gradientEnd": "#c86dd7"
              }
            ]
          },
          "options": {
            "label": "General",
            "title": "Progress bar",
            "groupDefaultTile": "Progress bar",
            "settings": {
              "title": {
                "type": "string",
                "access": "public",
                "value": "Progress bar",
                "options": {
                  "label": "Title",
                  "dynamicField": true
                }
              },
              "value": {
                "type": "range",
                "access": "public",
                "value": "70",
                "options": {
                  "label": "Value",
                  "cssMixin": {
                    "mixin": "barValueBar2",
                    "property": "value",
                    "namePattern": "[\\da-f]+"
                  }
                }
              },
              "backgroundColor": {
                "type": "color",
                "access": "public",
                "value": "rgba(242, 242, 242, .5)",
                "options": {
                  "label": "Background color",
                  "cssMixin": {
                    "mixin": "barBackgroundColorBar2",
                    "property": "backgroundColor",
                    "namePattern": "[\\da-f]+"
                  }
                }
              },
              "colorType": {
                "type": "dropdown",
                "access": "public",
                "value": "gradient",
                "options": {
                  "label": "Color type",
                  "values": [
                    {
                      "label": "Color",
                      "value": "color"
                    },
                    {
                      "label": "Gradient",
                      "value": "gradient"
                    }
                  ]
                }
              },
              "color": {
                "type": "color",
                "access": "public",
                "value": "#50e3c2",
                "options": {
                  "label": "Bar color",
                  "cssMixin": {
                    "mixin": "barColorBar2",
                    "property": "color",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "color"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "gradientStart": {
                "type": "color",
                "access": "public",
                "value": " #3023AE",
                "options": {
                  "label": "Start color",
                  "cssMixin": {
                    "mixin": "barColorBar2",
                    "property": "gradientStart",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "gradient"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "gradientEnd": {
                "type": "color",
                "access": "public",
                "value": " #C86DD7",
                "options": {
                  "label": "End color",
                  "cssMixin": {
                    "mixin": "barColorBar2",
                    "property": "gradientEnd",
                    "namePattern": "[\\da-f]+"
                  },
                  "onChange": {
                    "rules": {
                      "colorType": {
                        "rule": "value",
                        "options": {
                          "value": "gradient"
                        }
                      }
                    },
                    "actions": [
                      {
                        "action": "toggleVisibility"
                      }
                    ]
                  }
                }
              },
              "_paramGroupEditFormTab1": {
                "type": "group",
                "access": "protected",
                "value": [
                  "title",
                  "value",
                  "backgroundColor",
                  "colorType",
                  "color",
                  "gradientStart",
                  "gradientEnd"
                ],
                "options": {
                  "label": "General"
                }
              },
              "metaEditFormTabs": {
                "type": "group",
                "access": "protected",
                "value": [
                  "_paramGroupEditFormTab1"
                ]
              }
            }
          }
        },
        "titleFont": {
          "type": "googleFonts",
          "access": "public",
          "value": {
            "fontFamily": "Lato",
            "fontStyle": {
              "weight": "400",
              "style": "regular"
            },
            "status": "active",
            "fontText": "The sky was cloudless and of a deep dark blue."
          },
          "options": {
            "label": "",
            "cssMixin": {
              "mixin": "titleFontFamilyBars2",
              "property": "titleFontFamily",
              "namePattern": "[a-z]+",
              "valueKey": "fontFamily"
            }
          }
        },
        "valueFont": {
          "type": "googleFonts",
          "access": "public",
          "value": {
            "fontFamily": "Lato",
            "fontStyle": {
              "weight": "400",
              "style": "regular"
            },
            "status": "active",
            "fontText": "The sky was cloudless and of a deep dark blue."
          },
          "options": {
            "label": "",
            "cssMixin": {
              "mixin": "valueFontFamilyBars2",
              "property": "valueFontFamily",
              "namePattern": "[a-z]+",
              "valueKey": "fontFamily"
            }
          }
        },
        "titleElementTag": {
          "type": "dropdown",
          "access": "public",
          "value": "span",
          "options": {
            "label": "Element tag",
            "values": [
              {
                "label": "h1",
                "value": "h1"
              },
              {
                "label": "h2",
                "value": "h2"
              },
              {
                "label": "h3",
                "value": "h3"
              },
              {
                "label": "h4",
                "value": "h4"
              },
              {
                "label": "h5",
                "value": "h5"
              },
              {
                "label": "h6",
                "value": "h6"
              },
              {
                "label": "p",
                "value": "p"
              },
              {
                "label": "span",
                "value": "span"
              }
            ]
          }
        },
        "valueElementTag": {
          "type": "dropdown",
          "access": "public",
          "value": "span",
          "options": {
            "label": "Element tag",
            "values": [
              {
                "label": "h1",
                "value": "h1"
              },
              {
                "label": "h2",
                "value": "h2"
              },
              {
                "label": "h3",
                "value": "h3"
              },
              {
                "label": "h4",
                "value": "h4"
              },
              {
                "label": "h5",
                "value": "h5"
              },
              {
                "label": "h6",
                "value": "h6"
              },
              {
                "label": "p",
                "value": "p"
              },
              {
                "label": "span",
                "value": "span"
              }
            ]
          }
        },
        "titleColor": {
          "type": "color",
          "access": "public",
          "value": "#333",
          "options": {
            "label": "Color",
            "cssMixin": {
              "mixin": "titleColorBars2",
              "property": "titleColor",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "valueColor": {
          "type": "color",
          "access": "public",
          "value": "#333",
          "options": {
            "label": "Color",
            "cssMixin": {
              "mixin": "valueColorBars2",
              "property": "valueColor",
              "namePattern": "[\\da-f]+"
            }
          }
        },
        "titleFontSize": {
          "type": "string",
          "access": "public",
          "value": "16px",
          "options": {
            "label": "Font size"
          }
        },
        "valueFontSize": {
          "type": "string",
          "access": "public",
          "value": "16px",
          "options": {
            "label": "Font size"
          }
        },
        "titleLineHeight": {
          "type": "string",
          "access": "public",
          "value": "1.3",
          "options": {
            "label": "Line height"
          }
        },
        "valueLineHeight": {
          "type": "string",
          "access": "public",
          "value": "1.3",
          "options": {
            "label": "Line height"
          }
        },
        "titleLetterSpacing": {
          "type": "string",
          "access": "public",
          "value": "0",
          "options": {
            "label": "Letter spacing"
          }
        },
        "valueLetterSpacing": {
          "type": "string",
          "access": "public",
          "value": "0",
          "options": {
            "label": "Letter spacing"
          }
        },
        "customClass": {
          "type": "string",
          "access": "public",
          "value": "",
          "options": {
            "label": "Extra class name",
            "description": "Add an extra class name to the element and refer to it from the custom CSS option."
          }
        },
        "metaCustomId": {
          "type": "customId",
          "access": "public",
          "value": "",
          "options": {
            "label": "Element ID",
            "description": "Apply a unique ID to the element to link it directly by using #your_id (for element ID use lowercase input only)."
          }
        },
        "fontsForTitle": {
          "type": "group",
          "access": "protected",
          "value": [
            "titleFont",
            "titleElementTag",
            "titleColor",
            "titleFontSize",
            "titleLineHeight",
            "titleLetterSpacing"
          ],
          "options": {
            "label": "Title Font Face"
          }
        },
        "fontsForValue": {
          "type": "group",
          "access": "protected",
          "value": [
            "valueFont",
            "valueElementTag",
            "valueColor",
            "valueFontSize",
            "valueLineHeight",
            "valueLetterSpacing"
          ],
          "options": {
            "label": "Value Font Face",
            "onChange": {
              "rules": {
                "toggleValue": {
                  "rule": "toggle"
                }
              },
              "actions": [
                {
                  "action": "toggleSectionVisibility"
                }
              ]
            }
          }
        },
        "designOptions": {
          "type": "designOptions",
          "access": "public",
          "value": {},
          "options": {
            "label": "Design Options"
          }
        },
        "editFormTab1": {
          "type": "group",
          "access": "protected",
          "value": [
            "thickness",
            "toggleValue",
            "shape",
            "bars",
            "metaCustomId",
            "customClass"
          ],
          "options": {
            "label": "General"
          }
        },
        "metaEditFormTabs": {
          "type": "group",
          "access": "protected",
          "value": [
            "editFormTab1",
            "fontsForTitle",
            "fontsForValue",
            "designOptions"
          ]
        },
        "sharedAssetsLibrary": {
          "access": "protected",
          "type": "string",
          "value": {
            "libraries": [
              {
                "libsNames": [
                  "waypoints",
                  "countUp"
                ]
              }
            ]
          }
        },
        "metaPublicJs": {
          "access": "protected",
          "type": "string",
          "value": {
            "libraries": [
              {
                "libPaths": "public/dist/countUpStarter.min.js"
              }
            ]
          }
        }
      }
      const foundMixins = getInnerCssMixinsBySettings(settings)
      expect(foundMixins).toEqual({
          "barValue": [
            {
              "propertyName": "value",
              "attributeName": "value",
              "namePattern": "[\\da-f]+"
            }
          ],
          "barBackgroundColor": [
            {
              "propertyName": "backgroundColor",
              "attributeName": "backgroundColor",
              "namePattern": "[\\da-f]+"
            }
          ],
          "barColor": [
            {
              "propertyName": "color",
              "attributeName": "color",
              "namePattern": "[\\da-f]+"
            },
            {
              "propertyName": "gradientEnd",
              "attributeName": "gradientEnd",
              "namePattern": "[\\da-f]+"
            },
            {
              "propertyName": "gradientStart",
              "attributeName": "gradientStart",
              "namePattern": "[\\da-f]+"
            }
          ],
          "barValueBar2": [
            {
              "propertyName": "value",
              "attributeName": "value",
              "namePattern": "[\\da-f]+"
            }
          ],
          "barBackgroundColorBar2": [
            {
              "propertyName": "backgroundColor",
              "attributeName": "backgroundColor",
              "namePattern": "[\\da-f]+"
            }
          ],
          "barColorBar2": [
            {
              "propertyName": "color",
              "attributeName": "color",
              "namePattern": "[\\da-f]+"
            },
            {
              "propertyName": "gradientEnd",
              "attributeName": "gradientEnd",
              "namePattern": "[\\da-f]+"
            },
            {
              "propertyName": "gradientStart",
              "attributeName": "gradientStart",
              "namePattern": "[\\da-f]+"
            }
          ]
        }
      )
    })
  })
})

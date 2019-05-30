import { getService, env } from 'vc-cake'
import lodash from 'lodash'

const cookService = getService('cook')

export default class {
  /**
   * Get element tags from element exact data or default settings
   * @param tag
   * @param tags
   * @param data
   * @returns {*}
   */
  getElementTagsByTagName (tag, tags, data = {}) { // @SM
    // TODO: Memoize, note @data argument it is used for inner
    let elementSettings = cookService.getSettings(tag)
    if (!elementSettings) {
      return tags
    }
    for (let key in elementSettings.settings) {
      // If found element than get actual tags form element
      if (elementSettings.settings[ key ].type === 'element') {
        if (lodash.isEmpty(data) || lodash.isEmpty(data[ key ])) {
          // get tag from default value
          if (elementSettings.settings[ key ].value.tag) {
            tags = this.getElementTagsByTagName(elementSettings.settings[ key ].value.tag, tags)
          }
        } else {
          // get tag from data
          if (data[ key ].tag) {
            tags = this.getElementTagsByTagName(data[ key ].tag, tags, data[ key ])
          }
        }
      } else if (elementSettings.settings[ key ].type === 'paramsGroup') {
        let paramsGroupValues = data[ key ]
        if (paramsGroupValues && paramsGroupValues.value && paramsGroupValues.value.length) {
          paramsGroupValues.value.forEach((paramsGroupValue) => {
            for (let fieldKey in paramsGroupValue) {
              const value = paramsGroupValue[ fieldKey ]
              if (value.tag) {
                tags = this.getElementTagsByTagName(value.tag, tags, value)
              }
            }
          })
        }
      }
    }
    if (!tags.hasOwnProperty(tag)) {
      tags[ tag ] = true
    }

    return tags
  }

  /**
   * Get css mixins data by element
   * @param elData
   * @param mixins
   * @param elSettings
   * @param elCssSettings
   * @returns {{}}
   */
  getCssMixinsByElement (elData, mixins = {}, elSettings = false, elCssSettings = false) {
    let element
    if (elSettings === false) {
      element = cookService.get(elData)
    } else {
      element = cookService.buildSettingsElement(elData, elSettings, elCssSettings)
    }
    if (!element) {
      env('VCV_DEBUG') && console.warn('AssetsStorage no element found', elData, mixins, elSettings, elCssSettings)
      return mixins
    }

    let settings = element.get('settings')
    let foundMixins = {}
    const tag = element.data.tag || 'innerTag'
    for (let key in settings) {
      // If found element then get actual data form element
      if (settings[ key ].type === 'element') {
        mixins = this.getCssMixinsByElement(element.get(key), mixins)
      } else if (settings[ key ].type === 'paramsGroup') {
        let paramsGroupValue = element.get(key)
        if (paramsGroupValue && paramsGroupValue.value && paramsGroupValue.value.length) {
          const paramGroupSettingsList = settings[ key ].options.settings
          const paramGroupSettings = {}
          for (let paramKey in paramGroupSettingsList) {
            paramGroupSettings[ paramKey ] = element.settings(paramKey, paramGroupSettingsList).settings
          }
          paramsGroupValue.value.forEach((value, paramGroupValueIndex) => {
            // here we need to add options
            const cssSettings = element.get('cssSettings')
            let paramGroupItemMixins = this.getCssMixinsByElement(value, {}, paramGroupSettings, cssSettings)
            if (typeof mixins[ tag ] === 'undefined') {
              mixins[ tag ] = {}
            }
            if (typeof mixins[ tag ][ key ] === 'undefined') {
              mixins[ tag ][ key ] = {}
            }
            mixins[ tag ][ key ][ paramGroupValueIndex ] = paramGroupItemMixins
          })
        }
      } else {
        if (settings[ key ].hasOwnProperty('options') && settings[ key ].options.hasOwnProperty('cssMixin')) {
          let mixin = settings[ key ].options.cssMixin
          let cssSettings = element.get('cssSettings')
          if (!foundMixins[ mixin.mixin ] && cssSettings.mixins[ mixin.mixin ]) {
            foundMixins[ mixin.mixin ] = {
              variables: {},
              src: cssSettings.mixins[ mixin.mixin ].mixin,
              path: element.get('metaElementPath')
            }
          }
          if (settings[ key ].type === 'designOptions' || settings[ key ].type === 'designOptionsAdvanced') {
            let DO = element.get('designOptions')
            if (DO && DO.attributeMixins) {
              foundMixins[ mixin.mixin ].selector = mixin.selector
              foundMixins[ mixin.mixin ].variables = {
                all: {
                  value: false
                },
                xs: {
                  value: false
                },
                sm: {
                  value: false
                },
                md: {
                  value: false
                },
                lg: {
                  value: false
                },
                xl: {
                  value: false
                }
              }
              for (let deviceMixin in DO.attributeMixins) {
                if (DO.attributeMixins[ deviceMixin ] && DO.attributeMixins[ deviceMixin ].variables) {
                  let device = DO.attributeMixins[ deviceMixin ].variables.device && DO.attributeMixins[ deviceMixin ].variables.device.value ? DO.attributeMixins[ deviceMixin ].variables.device.value : 'all'
                  let properties = {
                    [ device ]: {
                      value: true
                    }
                  }
                  if (mixin.property === 'all') {
                    for (let variable in DO.attributeMixins[ deviceMixin ].variables) {
                      let variableName = device + variable
                      if (variable !== 'device') {
                        properties[ variableName ] = DO.attributeMixins[ deviceMixin ].variables[ variable ]
                      }
                    }
                  } else {
                    mixin.property.split(' ').forEach(property => {
                      for (let variable in DO.attributeMixins[ deviceMixin ].variables) {
                        if (variable.indexOf(property) >= 0) {
                          let variableName = device + variable
                          properties[ variableName ] = DO.attributeMixins[ deviceMixin ].variables[ variable ]
                        }
                      }
                    })
                  }
                  foundMixins[ mixin.mixin ].variables = {
                    ...foundMixins[ mixin.mixin ].variables,
                    ...properties
                  }
                }
              }
            }
          } else {
            let mixinValue = settings[ key ].value
            let tempValue = element.get(key)
            if (typeof tempValue === 'number') {
              mixinValue = tempValue.toString()
            }

            if (typeof tempValue === 'string') {
              mixinValue = tempValue
            }

            if (typeof tempValue === 'object' && tempValue.constructor === Object && tempValue.mixinValue) {
              mixinValue = tempValue.mixinValue
            }

            foundMixins[ mixin.mixin ].variables[ mixin.property ] = { value: mixinValue }
            if (mixin.namePattern) {
              foundMixins[ mixin.mixin ].variables[ mixin.property ].namePattern = mixin.namePattern
            }
          }
        }
      }
    }

    for (let mixin in foundMixins) {
      if (!mixins[ tag ]) {
        mixins[ tag ] = {}
      }
      if (!mixins[ tag ][ mixin ]) {
        mixins[ tag ][ mixin ] = {}
      }
      let names = []
      let variables = {}
      let useMixin = false
      Object.keys(foundMixins[ mixin ].variables).sort().forEach((variable) => {
        let name = foundMixins[ mixin ].variables[ variable ].value || 'empty' // must be string 'empty' for css selector
        if (!lodash.isString(name)) {
          env('VCV_DEBUG') && console.warn('Mixin attribute value not a string', name, variable, mixin, foundMixins)
        }
        name = name + ''
        if (name !== 'empty' && foundMixins[ mixin ].variables[ variable ].namePattern) {
          name = name.match(new RegExp(foundMixins[ mixin ].variables[ variable ].namePattern, 'gi'))
          name = name.length ? name.join('-') : 'empty'
        }
        if (name.indexOf('%')) {
          name = name.replace('%', 'percent')
        }
        names.push(name)
        variables[ variable ] = foundMixins[ mixin ].variables[ variable ].value || false
        // if any variable is set we can use mixin
        if (variables[ variable ] && [ 'all', 'xs', 'sm', 'md', 'lg', 'xl' ].indexOf(variable) < 0) {
          useMixin = true
        }
      })
      let selector = foundMixins[ mixin ].selector || names.join('--')
      if (selector && useMixin) {
        variables[ 'selector' ] = selector
        // Check if mixins exists, write only in empty object
        if (!mixins[ tag ][ mixin ][ selector ]) {
          mixins[ tag ][ mixin ][ selector ] = variables
        }
      }
    }

    return mixins
  }

  /**
   * Get attributes mixins data by element
   * @param elData
   * @returns {{}}
   */
  getAttributesMixinsByElement (elData) {
    let cookElement = cookService.get(elData)
    if (!cookElement) {
      return {}
    }
    let mixins = {}
    let settings = cookElement.get('settings')
    let foundMixins = {}
    let tag = cookElement.get('tag')
    let id = cookElement.get('id')
    for (let key in settings) {
      if (settings.hasOwnProperty(key)) {
        // get css mixin from attribute
        let value = cookElement.get(key)
        if (value) {
          let elementMixins = {}
          let attributeSettings = settings[ key ].attrSettings
          if (attributeSettings.type.component && attributeSettings.type.component.buildMixins) {
            elementMixins = Object.assign(elementMixins, attributeSettings.type.component.buildMixins(cookElement.toJS(), value, cookElement, attributeSettings))
          }
          if (value.attributeMixins) {
            elementMixins = Object.assign(elementMixins, value.attributeMixins)
          }

          if (elementMixins) {
            Object.keys(elementMixins).forEach((mixinName) => {
              foundMixins[ `${key}:${mixinName}` ] = lodash.defaultsDeep({}, elementMixins[ mixinName ])
            })
          }
        }
      }
    }

    for (let mixin in foundMixins) {
      let variables = {}
      let useMixin = false
      // get variables
      Object.keys(foundMixins[ mixin ].variables).sort().forEach((variable) => {
        variables[ variable ] = foundMixins[ mixin ].variables[ variable ].value || false
        // if any variable is set we can use mixin
        if (variables[ variable ]) {
          useMixin = true
        }
      })
      if (useMixin) {
        if (!mixins[ tag ]) {
          mixins[ tag ] = {}
        }
        if (!mixins[ tag ][ mixin ]) {
          mixins[ tag ][ mixin ] = {}
        }
        if (!variables[ 'selector' ]) {
          variables[ 'selector' ] = `el-${id}`
        }
        mixins[ tag ][ mixin ].src = foundMixins[ mixin ].src
        mixins[ tag ][ mixin ].variables = variables
        mixins[ tag ][ mixin ].path = cookElement.get('metaElementPath')
      }
    }

    return mixins
  }

  /**
   * Get css data for single element
   * @returns {Array}
   */
  getCssDataByElement (elementData, options) {
    if (!elementData) {
      return null
    }
    let defaultOptions = {
      tags: true,
      cssMixins: true,
      attributeMixins: true
    }
    options = lodash.defaults(options, defaultOptions, {})
    let styles = {
      tags: [],
      cssMixins: [],
      attributeMixins: []
    }
    // get tag styles
    if (options.tags) {
      // Tags are recursive function depends also on inner elements
      let tags = this.getElementTagsByTagName(elementData.tag, {}, elementData)
      Object.keys(tags).forEach((tag) => {
        let elementObject = cookService.get({ tag: tag })
        if (!elementObject) {
          return
        }
        let cssSettings = elementObject.get('cssSettings')
        if (cssSettings.css) {
          styles.tags.push({
            src: cssSettings.css,
            path: elementObject.get('metaElementPath')
          })
        }
      })
    }
    // get mixins styles
    if (options.cssMixins) {
      styles.cssMixins = styles.cssMixins.concat(this.getMixinStyles(elementData))
    }
    // get attribute mixins styles
    if (options.attributeMixins) {
      let attributesMixins = this.getAttributesMixinsByElement(elementData, {})
      Object.keys(attributesMixins).forEach((tag) => {
        Object.keys(attributesMixins[ tag ]).forEach((attribute) => {
          styles.attributeMixins.push(attributesMixins[ tag ][ attribute ])
        })
      })
    }

    return styles
  }

  elementCssBase (tag) {
    let styles = []
    let elementObject = cookService.get({ tag: tag })
    if (!elementObject) {
      return
    }
    let cssSettings = elementObject.get('cssSettings')
    if (cssSettings.css) {
      styles.push({
        src: cssSettings.css,
        path: elementObject.get('metaElementPath')
      })
    }

    return styles
  }

  elementCssEditor (tag) {
    let styles = []
    let elementObject = cookService.get({ tag: tag })
    if (!elementObject) {
      return
    }
    let cssSettings = elementObject.get('cssSettings')
    if (cssSettings.editorCss) {
      styles.push({
        src: cssSettings.editorCss,
        path: elementObject.get('metaElementPath')
      })
    }

    return styles
  }

  /**
   * Get design options css data for single element
   * @returns {Array}
   */
  getElementLocalAttributesCssMixins (elementData) {
    if (!elementData) {
      return null
    }
    let styles = []

    // get mixins styles
    styles = styles.concat(this.getMixinStyles(elementData))

    return styles
  }

  /**
   * Get mixins css data for single element
   * @returns {Array}
   */
  getElementGlobalAttributesCssMixins (elementData) {
    if (!elementData) {
      return null
    }
    let styles = []
    // get attribute mixins styles
    let attributesMixins = this.getAttributesMixinsByElement(elementData)
    Object.keys(attributesMixins).forEach((tag) => {
      Object.keys(attributesMixins[ tag ]).forEach((attribute) => {
        styles.push(attributesMixins[ tag ][ attribute ])
      })
    })
    return styles
  }

  getNestedMixinsStyles (cssSettings, cssMixins, elementObject) {
    let styles = []
    for (let mixin in cssMixins) {
      for (let mixinSelector in cssMixins[ mixin ]) {
        if (cssSettings.mixins && cssSettings.mixins[ mixin ]) {
          styles.push({
            variables: cssMixins[ mixin ][ mixinSelector ],
            src: cssSettings.mixins[ mixin ].mixin,
            path: elementObject.get('metaElementPath')
          })
        }
      }
    }

    return styles
  }

  getMixinStyles (elementData) {
    let styles = []
    let cssMixins = this.getCssMixinsByElement(elementData, {})
    Object.keys(cssMixins).forEach((tag) => {
      let elementObject = cookService.get({ tag: tag })
      if (!elementObject) {
        return
      }
      let cssSettings = elementObject.get('cssSettings')
      let mixins = Object.keys(cssMixins[ tag ])

      mixins.forEach((mixin) => {
        if (elementData.hasOwnProperty(mixin) && cssSettings.mixins && !cssSettings.mixins[ mixin ]) {
          for (let itemMixinsIndex in cssMixins[ tag ][ mixin ]) {
            for (let mixinElementTag in cssMixins[ tag ][ mixin ][ itemMixinsIndex ]) {
              let mixinStyles = []
              if (mixinElementTag === 'innerTag') {
                mixinStyles = this.getNestedMixinsStyles(cssSettings, cssMixins[ tag ][ mixin ][ itemMixinsIndex ][ mixinElementTag ], elementObject)
              } else {
                let innerElement = cookService.get({ tag: mixinElementTag })
                let innerElementCssSettings = innerElement.get('cssSettings')
                mixinStyles = this.getNestedMixinsStyles(innerElementCssSettings, cssMixins[ tag ][ mixin ][ itemMixinsIndex ][ mixinElementTag ], innerElement)
              }
              styles = styles.concat(mixinStyles)
            }
          }
        } else {
          for (let selector in cssMixins[ tag ][ mixin ]) {
            if (cssSettings.mixins && cssSettings.mixins[ mixin ]) {
              styles.push({
                variables: cssMixins[ tag ][ mixin ][ selector ],
                src: cssSettings.mixins[ mixin ].mixin,
                path: elementObject.get('metaElementPath')
              })
            }
          }
        }
      })
    })

    return styles
  }
}

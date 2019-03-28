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
        let paramsGroupValue = data[ key ]
        if (paramsGroupValue && paramsGroupValue.value && paramsGroupValue.value.length) {
          paramsGroupValue.value.forEach((value, i) => {
            if (value.tag) {
              tags = this.getElementTagsByTagName(value.tag, tags, value)
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

  getCssMixinsByData (elData, settings, cssSettings) {
    const foundMixins = {}
    let mixins = {}
    const element = cookService.buildSettingsElement(elData, settings, cssSettings)
    for (let key in settings) {
      // If found element then get actual data form element
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
          foundMixins[ mixin.mixin ].variables[ mixin.property ] = { value: mixinValue }
          if (mixin.namePattern) {
            foundMixins[ mixin.mixin ].variables[ mixin.property ].namePattern = mixin.namePattern
          }
        }
      }
    }

    for (let mixin in foundMixins) {
      let names = []
      let variables = {}
      let useMixin = false
      Object.keys(foundMixins[ mixin ].variables).sort().forEach((variable) => {
        let name = foundMixins[ mixin ].variables[ variable ].value || 'empty' // must be string 'empty' for css selector
        if (name !== 'empty' && foundMixins[ mixin ].variables[ variable ].namePattern) {
          name = name.match(new RegExp(foundMixins[ mixin ].variables[ variable ].namePattern, 'gi'))
          name = name.length ? name.join('-') : 'empty'
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
        mixins[ mixin ] = mixins[ mixin ] || {}
        mixins[ mixin ] = variables
      }
    }

    return mixins
  }

  /**
   * Get css mixins data by element
   * @param elData
   * @param mixins
   * @param settings
   * @param cssSettings
   * @returns {{}}
   */
  getCssMixinsByElement (elData, mixins = {}, settings = false, cssSettings = false) {
    let element
    if (settings === false) {
      element = cookService.get(elData)
    } else {
      element = cookService.buildSettingsElement(elData, settings, cssSettings)
    }
    if (!element) {
      env('VCV_DEBUG') && console.warn('AssetsStorage no element found', elData, mixins, settings, cssSettings)
      return mixins
    }

    settings = element.get('settings')
    let foundMixins = {}
    for (let key in settings) {
      // If found element then get actual data form element
      if (settings[ key ].type === 'element') {
        mixins = this.getCssMixinsByElement(element.get(key), mixins)
      } else if (settings[ key ].type === 'paramsGroup') {
        let paramsGroupValue = element.get(key)
        if (paramsGroupValue && paramsGroupValue.value && paramsGroupValue.value.length) {
          paramsGroupValue.value.forEach((value, i) => {
            // here we need to add options
            const paramGroupSettings = {}
            const paramGroupSettingsList = settings[ key ].options.settings
            for (let paramKey in paramGroupSettingsList) {
              paramGroupSettings[ paramKey ] = element.settings(paramKey, paramGroupSettingsList).settings
            }
            const cssSettings = element.get('cssSettings')
            let mixinData = this.getCssMixinsByData(value, paramGroupSettings, cssSettings)
            mixins[ element.data.tag ] = mixins[ element.data.tag ] || {}
            mixins[ element.data.tag ][ key ] = mixins[ element.data.tag ][ key ] || {}
            mixins[ element.data.tag ][ key ][ i ] = mixinData
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
      if (!mixins[ element.data.tag ]) {
        mixins[ element.data.tag ] = {}
      }
      if (!mixins[ element.data.tag ][ mixin ]) {
        mixins[ element.data.tag ][ mixin ] = {}
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
        if (!mixins[ element.data.tag ][ mixin ][ selector ]) {
          mixins[ element.data.tag ][ mixin ][ selector ] = variables
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
    let element = cookService.get(elData)
    if (!element) {
      return {}
    }
    let mixins = {}
    let settings = element.get('settings')
    let foundMixins = {}
    let tag = element.get('tag')
    let id = element.get('id')
    for (let key in settings) {
      if (settings.hasOwnProperty(key)) {
        // get css mixin from attribute
        let value = element.get(key)
        if (value) {
          let elementMixins = {}
          let attributeSettings = element.settings(key)
          if (attributeSettings.type.component && attributeSettings.type.component.buildMixins) {
            elementMixins = Object.assign(elementMixins, attributeSettings.type.component.buildMixins(element.toJS()))
            // elementMixins = attributeSettings.type.component.buildMixins(element.toJS())
          }
          if (value.attributeMixins) {
            elementMixins = Object.assign(elementMixins, value.attributeMixins)
            // elementMixins = value.attributeMixins
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
        mixins[ tag ][ mixin ].path = element.get('metaElementPath')
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
    for (let itemMixins in cssMixins) {
      for (let mixin in cssMixins[ itemMixins ]) {
        if (cssSettings.mixins && cssSettings.mixins[ mixin ]) {
          styles.push({
            variables: cssMixins[ itemMixins ][ mixin ],
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
          const mixinStyles = this.getNestedMixinsStyles(cssSettings, cssMixins[ tag ][ mixin ], elementObject)
          styles = styles.concat(mixinStyles)
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

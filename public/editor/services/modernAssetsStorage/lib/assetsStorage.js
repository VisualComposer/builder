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
  getElementTagsByTagName (tag, tags, data = null) { // @SM
    // TODO: Memoize, note @data argument it is used for inner
    const elementSettings = cookService.getSettings(tag)
    if (!elementSettings) {
      return tags
    }
    for (const key in elementSettings.settings) {
      // If found element than get actual tags form element
      if (elementSettings.settings[key].type === 'element') {
        if (!data || !data[key]) {
          // get tag from default value
          if (elementSettings.settings[key].value.tag) {
            tags = this.getElementTagsByTagName(elementSettings.settings[key].value.tag, tags)
          }
        } else {
          // get tag from data
          if (data[key]?.tag) {
            tags = this.getElementTagsByTagName(data[key].tag, tags, data[key])
          }
        }
      } else if (elementSettings.settings[key].type === 'paramsGroup') {
        const paramsGroupValues = data[key]
        if (paramsGroupValues && paramsGroupValues.value && paramsGroupValues.value.length) {
          paramsGroupValues.value.forEach((paramsGroupValue) => {
            for (const fieldKey in paramsGroupValue) {
              const value = paramsGroupValue[fieldKey]
              if (value.tag) {
                tags = this.getElementTagsByTagName(value.tag, tags, value)
              }
            }
          })
        }
      }
    }
    tags[tag] = true

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

    const settings = element.get('settings')
    const foundMixins = {}
    const tag = element.data.tag || 'innerTag'
    for (const key in settings) {
      // If found element then get actual data form element
      if (settings[key].type === 'element') {
        mixins = this.getCssMixinsByElement(element.get(key), mixins)
      } else if (settings[key].type === 'paramsGroup') {
        const paramsGroupValue = element.get(key)
        if (paramsGroupValue && paramsGroupValue.value && paramsGroupValue.value.length) {
          const paramGroupSettingsList = settings[key].options.settings
          const paramGroupSettings = {}
          for (const paramKey in paramGroupSettingsList) {
            paramGroupSettings[paramKey] = element.settings(paramKey, paramGroupSettingsList).settings
          }
          paramsGroupValue.value.forEach((value, paramGroupValueIndex) => {
            // here we need to add options
            const cssSettings = element.get('cssSettings')
            const paramGroupItemMixins = this.getCssMixinsByElement(value, {}, paramGroupSettings, cssSettings)
            if (typeof mixins[tag] === 'undefined') {
              mixins[tag] = {}
            }
            if (typeof mixins[tag][key] === 'undefined') {
              mixins[tag][key] = {}
            }
            mixins[tag][key][paramGroupValueIndex] = paramGroupItemMixins
          })
        }
      } else {
        if (Object.prototype.hasOwnProperty.call(settings[key], 'options') && Object.prototype.hasOwnProperty.call(settings[key].options, 'cssMixin')) {
          const mixin = settings[key].options.cssMixin
          const cssSettings = element.get('cssSettings')
          if (!foundMixins[mixin.mixin] && cssSettings.mixins[mixin.mixin]) {
            foundMixins[mixin.mixin] = {
              variables: {},
              src: cssSettings.mixins[mixin.mixin].mixin,
              path: element.get('metaElementPath')
            }
          }
          if (settings[key].type === 'designOptions' || settings[key].type === 'designOptionsAdvanced') {
            const DO = element.get('designOptions')
            if (DO && DO.attributeMixins) {
              foundMixins[mixin.mixin].selector = mixin.selector
              foundMixins[mixin.mixin].variables = {
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
              for (const deviceMixin in DO.attributeMixins) {
                if (DO.attributeMixins[deviceMixin] && DO.attributeMixins[deviceMixin].variables) {
                  const device = DO.attributeMixins[deviceMixin].variables.device && DO.attributeMixins[deviceMixin].variables.device.value ? DO.attributeMixins[deviceMixin].variables.device.value : 'all'
                  const properties = {
                    [device]: {
                      value: true
                    }
                  }
                  if (mixin.property === 'all') {
                    for (const variable in DO.attributeMixins[deviceMixin].variables) {
                      const variableName = device + variable
                      if (variable !== 'device') {
                        properties[variableName] = DO.attributeMixins[deviceMixin].variables[variable]
                      }
                    }
                  } else {
                    mixin.property.split(' ').forEach(property => {
                      for (const variable in DO.attributeMixins[deviceMixin].variables) {
                        if (variable.indexOf(property) >= 0) {
                          const variableName = device + variable
                          properties[variableName] = DO.attributeMixins[deviceMixin].variables[variable]
                        }
                      }
                    })
                  }
                  foundMixins[mixin.mixin].variables = {
                    ...foundMixins[mixin.mixin].variables,
                    ...properties
                  }
                }
              }
            }
          } else {
            if (!Object.prototype.hasOwnProperty.call(foundMixins, mixin.mixin)) {
              console.warn(`${mixin.mixin} not found in element! Please check your mixin!`)
              return {}
            }
            let mixinValue = settings[key].value
            const tempValue = element.get(key)
            if (typeof tempValue === 'number') {
              mixinValue = tempValue.toString()
            }

            if (typeof tempValue === 'string') {
              mixinValue = tempValue
            }

            if (typeof tempValue === 'object' && tempValue.constructor === Object && tempValue.mixinValue) {
              mixinValue = tempValue.mixinValue
            }

            if (typeof tempValue === 'object' && tempValue.constructor === Object && mixin.valueKey) {
              mixinValue = tempValue[mixin.valueKey]
            }

            foundMixins[mixin.mixin].variables[mixin.property] = { value: mixinValue }
            if (mixin.namePattern) {
              foundMixins[mixin.mixin].variables[mixin.property].namePattern = mixin.namePattern
            }
          }
        }
      }
    }

    for (const mixin in foundMixins) {
      if (!mixins[tag]) {
        mixins[tag] = {}
      }
      if (!mixins[tag][mixin]) {
        mixins[tag][mixin] = {}
      }
      const names = []
      const variables = {}
      let useMixin = false
      Object.keys(foundMixins[mixin].variables).sort().forEach((variable) => {
        let name = foundMixins[mixin].variables[variable].value || 'empty' // must be string 'empty' for css selector
        if (!lodash.isString(name)) {
          env('VCV_DEBUG') && console.warn('Mixin attribute value not a string', name, variable, mixin, foundMixins)
        }
        name = name + ''
        if (name !== 'empty' && foundMixins[mixin].variables[variable].namePattern) {
          name = name.match(new RegExp(foundMixins[mixin].variables[variable].namePattern, 'gi'))
          name = name.length ? name.join('-') : 'empty'
        }
        if (name.indexOf('%')) {
          name = name.replace('%', 'percent')
        }
        names.push(name)
        variables[variable] = foundMixins[mixin].variables[variable].value || false
        // if any variable is set we can use mixin
        if (variables[variable] && ['all', 'xs', 'sm', 'md', 'lg', 'xl'].indexOf(variable) < 0) {
          useMixin = true
        }
      })
      const selector = foundMixins[mixin].selector || names.join('--')
      if (selector && useMixin) {
        variables.selector = selector
        // Check if mixins exists, write only in empty object
        if (!mixins[tag][mixin][selector]) {
          mixins[tag][mixin][selector] = variables
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
    const cookElement = cookService.get(elData)
    if (!cookElement) {
      return {}
    }
    const mixins = {}
    const settings = cookElement.get('settings')
    const foundMixins = {}
    const tag = cookElement.get('tag')
    const id = cookElement.get('id')
    for (const key in settings) {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        // get css mixin from attribute
        const value = cookElement.get(key)
        if (value) {
          let elementMixins = {}
          const attributeSettings = settings[key].attrSettings
          if (attributeSettings.type.component && attributeSettings.type.component.buildMixins) {
            elementMixins = Object.assign(elementMixins, attributeSettings.type.component.buildMixins(cookElement.toJS(), value, cookElement, attributeSettings))
          }
          if (value.attributeMixins) {
            elementMixins = Object.assign(elementMixins, value.attributeMixins)
          }

          if (elementMixins) {
            Object.keys(elementMixins).forEach((mixinName) => {
              foundMixins[`${key}:${mixinName}`] = lodash.defaultsDeep({}, elementMixins[mixinName])
            })
          }
        }
      }
    }

    for (const mixin in foundMixins) {
      const variables = {}
      let useMixin = false
      // get variables
      Object.keys(foundMixins[mixin].variables).sort().forEach((variable) => {
        variables[variable] = foundMixins[mixin].variables[variable].value || false
        // if any variable is set we can use mixin
        if (variables[variable]) {
          useMixin = true
        }
      })
      if (useMixin) {
        if (!mixins[tag]) {
          mixins[tag] = {}
        }
        if (!mixins[tag][mixin]) {
          mixins[tag][mixin] = Object.assign({}, foundMixins[mixin])
        }
        if (!variables.selector) {
          variables.selector = `el-${id}`
        }
        mixins[tag][mixin].src = foundMixins[mixin].src
        mixins[tag][mixin].variables = variables
        mixins[tag][mixin].path = cookElement.get('metaElementPath')
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
    const defaultOptions = {
      tags: true,
      cssMixins: true,
      attributeMixins: true
    }
    options = lodash.defaults(options, defaultOptions, {})
    const styles = {
      tags: [],
      cssMixins: [],
      attributeMixins: []
    }
    // get tag styles
    if (options.tags) {
      // Tags are recursive function depends also on inner elements
      const tags = this.getElementTagsByTagName(elementData.tag, {}, elementData)
      Object.keys(tags).forEach((tag) => {
        const elementObject = cookService.get({ tag: tag })
        if (!elementObject) {
          return
        }
        const cssSettings = elementObject.get('cssSettings')
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
      const attributesMixins = this.getAttributesMixinsByElement(elementData)
      Object.keys(attributesMixins).forEach((tag) => {
        Object.keys(attributesMixins[tag]).forEach((attribute) => {
          if (options.skipOnSave) {
            if (!attributesMixins[tag][attribute].skipOnSave) {
              styles.attributeMixins.push(attributesMixins[tag][attribute])
            }
          } else {
            styles.attributeMixins.push(attributesMixins[tag][attribute])
          }
        })
      })
    }

    return styles
  }

  elementCssBase (tag) {
    const styles = []
    const elementObject = cookService.get({ tag: tag })
    if (!elementObject) {
      return
    }
    const cssSettings = elementObject.get('cssSettings')
    if (cssSettings.css) {
      styles.push({
        src: cssSettings.css,
        path: elementObject.get('metaElementPath')
      })
    }

    return styles
  }

  elementCssEditor (tag) {
    const styles = []
    const elementObject = cookService.get({ tag: tag })
    if (!elementObject) {
      return
    }
    const cssSettings = elementObject.get('cssSettings')
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
    const styles = []
    // get attribute mixins styles
    const attributesMixins = this.getAttributesMixinsByElement(elementData)
    Object.keys(attributesMixins).forEach((tag) => {
      Object.keys(attributesMixins[tag]).forEach((attribute) => {
        styles.push(attributesMixins[tag][attribute])
      })
    })
    return styles
  }

  getNestedMixinsStyles (cssSettings, cssMixins, elementObject) {
    const styles = []
    for (const mixin in cssMixins) {
      for (const mixinSelector in cssMixins[mixin]) {
        if (cssSettings.mixins && cssSettings.mixins[mixin]) {
          styles.push({
            variables: cssMixins[mixin][mixinSelector],
            src: cssSettings.mixins[mixin].mixin,
            path: elementObject.get('metaElementPath')
          })
        }
      }
    }

    return styles
  }

  getMixinStyles (elementData) {
    let styles = []
    const cssMixins = this.getCssMixinsByElement(elementData, {})
    Object.keys(cssMixins).forEach((tag) => {
      const elementObject = cookService.get({ tag: tag })
      if (!elementObject) {
        return
      }
      const cssSettings = elementObject.get('cssSettings')
      const mixins = Object.keys(cssMixins[tag])

      mixins.forEach((mixin) => {
        if (Object.prototype.hasOwnProperty.call(elementData, mixin) && cssSettings.mixins && !cssSettings.mixins[mixin]) {
          for (const itemMixinsIndex in cssMixins[tag][mixin]) {
            for (const mixinElementTag in cssMixins[tag][mixin][itemMixinsIndex]) {
              let mixinStyles = []
              if (mixinElementTag === 'innerTag') {
                mixinStyles = this.getNestedMixinsStyles(cssSettings, cssMixins[tag][mixin][itemMixinsIndex][mixinElementTag], elementObject)
              } else {
                const innerElement = cookService.get({ tag: mixinElementTag })
                const innerElementCssSettings = innerElement.get('cssSettings')
                mixinStyles = this.getNestedMixinsStyles(innerElementCssSettings, cssMixins[tag][mixin][itemMixinsIndex][mixinElementTag], innerElement)
              }
              styles = styles.concat(mixinStyles)
            }
          }
        } else {
          for (const selector in cssMixins[tag][mixin]) {
            if (cssSettings.mixins && cssSettings.mixins[mixin]) {
              styles.push({
                variables: cssMixins[tag][mixin][selector],
                src: cssSettings.mixins[mixin].mixin,
                path: elementObject.get('metaElementPath')
              })
            }
          }
        }
      })
    })

    return styles
  }

  getPageDesignOptionsMixins (data) {
    const elementMixins = Object.assign({}, data.attributeMixins)
    const foundMixins = {}
    const mixins = {}
    const tag = 'pageDesignOptions'

    if (elementMixins) {
      Object.keys(elementMixins).forEach((mixinName) => {
        foundMixins[`${tag}:${mixinName}`] = lodash.defaultsDeep({}, elementMixins[mixinName])
      })
    }

    for (const mixin in foundMixins) {
      const variables = {}
      let useMixin = false
      // get variables
      Object.keys(foundMixins[mixin].variables).sort().forEach((variable) => {
        variables[variable] = foundMixins[mixin].variables[variable].value || false
        // if any variable is set we can use mixin
        if (variables[variable]) {
          useMixin = true
        }
      })
      if (useMixin) {
        if (!mixins[tag]) {
          mixins[tag] = {}
        }
        if (!mixins[tag][mixin]) {
          mixins[tag][mixin] = Object.assign({}, foundMixins[mixin])
        }
        if (!variables.selector) {
          variables.selector = data.selector || 'body'
        }
        mixins[tag][mixin].src = foundMixins[mixin].src
        mixins[tag][mixin].variables = variables
      }
    }
    return mixins
  }
}

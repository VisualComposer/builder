import { getService } from 'vc-cake'
import memoize from '../../../tools/memoize'

export type MixinData = {
  attributeName: string
  propertyName: string
  namePattern?: string
}

export type CssMixinsBySettingsType = {
  [key: string]: MixinData[]
}

export function getCssMixinsBySettings (elSettings: { [key: string]: any }): CssMixinsBySettingsType {
  const foundAttributesWithMixins: {
    [key: string]: {
      mixin: string
      property: string
      namePattern?: string
    }
  } = {}
  for (const key in elSettings) {
    if (elSettings[key]?.options?.cssMixin) {
      foundAttributesWithMixins[key] = elSettings[key].options.cssMixin
    }
  }

  const foundMixins: CssMixinsBySettingsType = {}
  for (const attributeName in foundAttributesWithMixins) {
    const mixinName: string = foundAttributesWithMixins[attributeName].mixin
    const mixinProperty: string = foundAttributesWithMixins[attributeName].property
    const mixinPropertyNamePattern = foundAttributesWithMixins[attributeName]?.namePattern || undefined
    if (foundMixins[mixinName]) {
      foundMixins[mixinName].push({
        propertyName: mixinProperty,
        attributeName: attributeName,
        namePattern: mixinPropertyNamePattern
      })
    } else {
      foundMixins[mixinName] = [
        {
          propertyName: mixinProperty,
          attributeName: attributeName,
          namePattern: mixinPropertyNamePattern
        }
      ]
    }
  }

  // sort foundMixins[].mixinProperties by propertyName name alphabetically a-z
  for (const mixinName in foundMixins) {
    foundMixins[mixinName].sort((a, b) => {
      if (a.propertyName < b.propertyName) {
        return -1
      }
      if (a.propertyName > b.propertyName) {
        return 1
      }
      return 0
    })
  }

  return foundMixins
}

export function getInnerCssMixinsBySettings (elSettings: { [key: string]: any }): CssMixinsBySettingsType {
  let foundMixins: CssMixinsBySettingsType = {}
  for (const key in elSettings) {
    if (elSettings[key].type === 'paramsGroup') {
      const groupFieldsSettings = elSettings[key].options.settings
      let newFoundMixins = getCssMixinsBySettings(groupFieldsSettings)
      foundMixins = { ...foundMixins, ...newFoundMixins }
    }
  }

  return foundMixins
}

export type MixinsReduceResult = {
  selectors?: string[]
  [index: string]: any
}

export type MixinsSelectorResult = string | MixinsReduceResult

export function getMixinsSelector (mixin: MixinData[], atts: { [key: string]: object }, returnObjectWithProperties: boolean = false): MixinsSelectorResult {
  const getSelector = (mixinData: MixinData) => {
    let attrSelector = ''
    const attributeName = mixinData.attributeName
    const namePattern = mixinData.namePattern
    const propertyName = mixinData.propertyName
    let value: string | any = atts[attributeName] || 'empty'
    if (typeof value === 'object' && value.hasOwnProperty(propertyName)) {
      value = value[propertyName]
    }
    value = value + '' // force to string
    if (value !== 'empty' && namePattern) {
      const matches = value.match(new RegExp(namePattern, 'gi'))
      attrSelector = matches.length ? matches.join('-') : 'empty'
    }
    if (attrSelector.indexOf('%')) {
      attrSelector = attrSelector.replace(/%/g, 'percent')
    }
    return attrSelector
  }
  if (returnObjectWithProperties) {
    const result: MixinsReduceResult = mixin.reduce<MixinsReduceResult>((previousValue: MixinsReduceResult, currentValue: MixinData): MixinsReduceResult => {
      const attributeName: string = currentValue.attributeName
      let value: string | any = atts[attributeName] || 'empty'
      value = value + '' // force to string
      previousValue[currentValue.propertyName] = value
      previousValue.selectors!.push(getSelector(currentValue))

      return previousValue
    }, {
      selectors: []
    } as unknown as MixinsReduceResult)
    result.selector = result.selectors!.join('--')

    // it was just temporary variable to concatenate selector to string
    delete result.selectors

    return result
  } else {
    return mixin.map(getSelector).join('--')
  }
}

export const getCssMixinsData = memoize<{ [key: string]: any }>((tag: string): CssMixinsBySettingsType => {
  const cook = getService('cook')
  const elSettings = cook.getSettings(tag)
  if (!elSettings) {
    return {}
  }
  const mixins: CssMixinsBySettingsType = getCssMixinsBySettings(elSettings.settings)

  return mixins
})

export const getInnerCssMixinsData = memoize<{ [key: string]: any }>((tag: string): CssMixinsBySettingsType => {
  const cook = getService('cook')
  const elSettings = cook.getSettings(tag)
  if (!elSettings) {
    return {}
  }
  const mixins: CssMixinsBySettingsType = getInnerCssMixinsBySettings(elSettings.settings)

  return mixins
})

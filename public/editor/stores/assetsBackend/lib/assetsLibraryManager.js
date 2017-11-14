import { getStorage, getService, env } from 'vc-cake'
const assets = getStorage('assetsBackend')
const storageState = assets.state('jsLibs')
const cook = getService('cook')

const libData = [
  {
    fieldKey: 'animation',
    library: 'animate'
  },
  {
    fieldKey: 'gradientOverlay',
    value: true,
    library: 'backgroundColorGradient'
  },
  {
    fieldKey: 'backgroundType',
    value: 'imagesSimple',
    library: 'backgroundSimple'
  },
  {
    fieldKey: 'backgroundType',
    value: 'imagesSlideshow',
    library: 'backgroundSlider'
  },
  {
    fieldKey: 'backgroundType',
    value: 'videoEmbed',
    library: 'backgroundVideoEmbed'
  },
  {
    fieldKey: 'backgroundType',
    value: 'videoVimeo',
    library: 'backgroundVideoVimeo'
  },
  {
    fieldKey: 'backgroundType',
    value: 'videoYoutube',
    library: 'backgroundVideoYoutube'
  },
  {
    fieldKey: 'backgroundType',
    value: 'backgroundZoom',
    library: 'backgroundZoom'
  },
  {
    fieldKey: 'divider',
    value: true,
    library: 'divider'
  },
  // TODO: Enable for all elements
  // {
  //   fieldKey: 'iconpicker',
  //   library: 'iconpicker'
  // },
  {
    fieldKey: 'parallax',
    value: 'simple',
    library: 'parallaxBackground'
  },
  {
    fieldKey: 'parallax',
    value: 'simple-fade',
    library: 'parallaxFade'
  }
]

const getElementLibNames = (id, element, callback) => {
  let cookElement = cook.get(element)
  const settingsTypes = cookElement.filter((key, value, settings) => {
    return settings.type === 'designOptionsAdvanced' || settings.type === 'designOptions'
  })
  let elementDO = cookElement.get(settingsTypes[0])
  let data = {
    id: id,
    libraries: []
  }
  if (env('ATTRIBUTE_LIBS')) {
    let cookGetAll = cookElement.getAll()

    let elementAttributes = Object.keys(cookGetAll)
    elementAttributes.forEach((attrKey) => {
      let attributeSettings = cookElement.settings(attrKey)
      if (attributeSettings.type.getAttributeLibs) {
        let attributeValue = cookElement.get(attrKey, true)
        let attributeLibs = attributeSettings.type.getAttributeLibs(attributeValue)
        if (attributeLibs && attributeLibs.length) {
          data.libraries.push(...attributeLibs)
        }
      }
      if (attributeSettings.settings.type === 'element') {
        let value = cookElement.get(attrKey)
        let innerElement = cook.get(value)
        let innerElementValue = innerElement.toJS()
        callback(innerElementValue.id, innerElementValue)
      }
    })
  } else {
    if (Object.keys(elementDO).length) {
      for (let device in elementDO.device) {
        if (elementDO.device.hasOwnProperty(device)) {
          for (let fieldKey in elementDO.device[ device ]) {
            if (elementDO.device[ device ].hasOwnProperty(fieldKey)) {
              let matchField = libData.find((lib) => {
                let matchKey = lib.fieldKey === fieldKey
                let matchValue = lib.value === elementDO.device[ device ][ fieldKey ]
                return (matchKey && matchValue) || (fieldKey === 'animation')
              })
              if (matchField) {
                data.libraries.push(matchField.library)
              }
            }
          }
        }
      }
    }
    // TODO: temporary fix for Row only, should take libraries from each edit form attribute accordingly
    if (cookElement.get('tag') === 'row') {
      data.libraries.push('divider')
    }
  }
  return data
}

export default class AssetsLibraryManager {
  add (id, element) {
    let data = getElementLibNames(id, element, this.add.bind(this))
    let stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
    stateElements.push(data)
    storageState.set({ elements: stateElements })
  }

  edit (id, element) {
    let data = getElementLibNames(id, element, this.edit.bind(this))
    let stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
    let stateElementIndex = stateElements.findIndex((element) => {
      return element.id === id
    })
    if (stateElementIndex < 0) {
      stateElements.push(data)
    } else {
      stateElements[ stateElementIndex ] = data
    }
    storageState.set({ elements: stateElements })
  }

  remove (id) {
    let stateElements = storageState.get()
    if (stateElements && stateElements.elements) {
      let newElements = stateElements.elements.filter((element) => {
        return element.id !== id
      })
      storageState.set({ elements: newElements })
    }
  }
}

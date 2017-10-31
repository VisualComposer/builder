import { getStorage, getService, env } from 'vc-cake'
const assets = getStorage('assets')
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

const getElementLibNames = (id, element) => {
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
    let elementAttributes = Object.keys(cookElement.getAll())
    elementAttributes.forEach((attr) => {
      let attribute = cookElement.settings(attr)
      if (attribute.type.getAttributeLibs) {
        let attributeValue = attribute.type.getRawValue(cookElement.getAll(), attr)
        let attributeLibs = attribute.type.getAttributeLibs(attributeValue)
        if (attributeLibs) {
          data.libraries.push(attributeLibs)
        }
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

export default class LibraryManager {
  add (id, element) {
    let stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
    let data = getElementLibNames(id, element)
    stateElements.push(data)
    storageState.set({ elements: stateElements })
  }

  edit (id, element) {
    let stateElements = storageState.get() && storageState.get().elements ? storageState.get().elements : []
    let data = getElementLibNames(id, element)
    let stateElementIndex = stateElements.findIndex((element) => {
      return element.id === id
    })
    stateElements[ stateElementIndex ] = data
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

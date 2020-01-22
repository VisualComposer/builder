import { getStorage } from 'vc-cake'

const assetsStorage = getStorage('assets')

export default (value) => {
  const libs = []
  const libNames = assetsStorage.state('attributeLibs').get()

  if (value && value.device && Object.keys(value.device).length) {
    for (const device in value.device) {
      if (Object.prototype.hasOwnProperty.call(value.device, device)) {
        for (const fieldKey in value.device[device]) {
          if (Object.prototype.hasOwnProperty.call(value.device[device], fieldKey)) {
            const matchField = libNames.find((lib) => {
              const matchKey = lib.fieldKey === fieldKey
              let currentValue = value.device[device][fieldKey]
              if (currentValue === '0' || currentValue === '1') {
                currentValue = !!parseInt(currentValue)
              }
              const matchValue = lib.value === currentValue
              return (matchKey && matchValue) || (fieldKey === 'animation')
            })
            if (matchField) {
              const libData = {
                name: '',
                dependencies: []
              }
              libData.name = matchField.library
              if (matchField.dependencies) {
                libData.dependencies.push(...matchField.dependencies)
              }
              libs.push(libData)
            }
          }
        }
      }
    }
  }

  return libs
}

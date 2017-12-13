import { env } from 'vc-cake'

export default (value) => {
  if (env('ATTRIBUTE_LIBS')) {
    let libs = []
    const libNames = [
      {
        fieldKey: 'animation',
        library: 'animate',
        dependencies: [
          'waypoints'
        ],
        value: (value) => {
          return value
        }
      },
      {
        fieldKey: 'image',
        library: 'backgroundSimple',
        value: (value) => {
          return value && value.ids && value.urls && value.ids.length && value.urls.length
        }
      }
    ]

    if (value && value.device && Object.keys(value.device).length) {
      for (let device in value.device) {
        if (value.device.hasOwnProperty(device)) {
          for (let fieldKey in value.device[ device ]) {
            if (value.device[ device ].hasOwnProperty(fieldKey)) {
              let matchField = libNames.find((lib) => {
                let matchKey = lib.fieldKey === fieldKey
                if (matchKey && lib.value) {
                  return matchKey && lib.value(value.device[ device ][ fieldKey ])
                }
                return matchKey
              })
              if (matchField) {
                let libData = {
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
}

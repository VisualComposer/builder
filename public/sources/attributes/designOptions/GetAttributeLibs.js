export default (value) => {
  const libs = []
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
    },
    {
      fieldKey: 'lazyLoad',
      value: true,
      library: 'lazyLoad'
    }
  ]

  if (value && value.device && Object.keys(value.device).length) {
    for (const device in value.device) {
      if (Object.prototype.hasOwnProperty.call(value.device, device)) {
        for (const fieldKey in value.device[device]) {
          if (Object.prototype.hasOwnProperty.call(value.device[device], fieldKey)) {
            const matchField = libNames.find((lib) => {
              const matchKey = lib.fieldKey === fieldKey
              if (matchKey && lib.value) {
                return matchKey && lib.value(value.device[device][fieldKey])
              }
              return matchKey
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

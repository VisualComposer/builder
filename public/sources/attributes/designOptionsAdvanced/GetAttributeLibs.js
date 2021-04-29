export default (value) => {
  const libs = []
  const libNames = [
    {
      fieldKey: 'animation',
      library: 'animate',
      dependencies: [
        'waypoints'
      ]
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
      library: 'backgroundZoom',
      dependencies: [
        'waypoints'
      ]
    },
    {
      fieldKey: 'parallax',
      value: 'simple',
      library: 'parallaxBackground',
      dependencies: [
        'waypoints'
      ]
    },
    {
      fieldKey: 'parallax',
      value: 'simple-fade',
      library: 'parallaxFade',
      dependencies: [
        'waypoints',
        'parallaxBackground'
      ]
    },
    {
      fieldKey: 'parallax',
      value: 'mouse-move',
      library: 'parallaxMouseMove',
      dependencies: []
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

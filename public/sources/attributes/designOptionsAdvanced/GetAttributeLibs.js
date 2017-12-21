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
      }
    ]

    if (env('PARALLAX_MOUSEMOVE')) {
      libNames.push({
        fieldKey: 'parallax',
        value: 'mouse-move',
        library: 'parallaxMouseMove',
        dependencies: []
      })
    }

    if (value && value.device && Object.keys(value.device).length) {
      for (let device in value.device) {
        if (value.device.hasOwnProperty(device)) {
          for (let fieldKey in value.device[ device ]) {
            if (value.device[ device ].hasOwnProperty(fieldKey)) {
              let matchField = libNames.find((lib) => {
                let matchKey = lib.fieldKey === fieldKey
                let matchValue = lib.value === value.device[ device ][ fieldKey ]
                return (matchKey && matchValue) || (fieldKey === 'animation')
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

import { env } from 'vc-cake'

export default (value) => {
  if (env('ATTRIBUTE_LIBS')) {
    let libs = []

    if (value && value.device && Object.keys(value.device).length) {
      let deviceKeys = Object.keys(value.device)
      deviceKeys.forEach((deviceKey) => {
        let device = value.device[ deviceKey ]
        if (device.dividerTop || device.dividerBottom) {
          let libData = {
            name: 'divider',
            dependencies: []
          }
          let backgroundType = device.dividerTopBackgroundType || device.dividerBottomBackgroundType
          switch (backgroundType) {
            case 'videoEmbed':
              libData.dependencies.push('backgroundVideoEmbed')
              break
            case 'videoYoutube':
              libData.dependencies.push('backgroundVideoYoutube')
              break
            case 'videoVimeo':
              libData.dependencies.push('backgroundVideoVimeo')
              break
          }
          libs.push(libData)
        }
      })
    }

    return libs
  }
}

export default (value) => {
  const libs = []

  if (value && value.device && Object.keys(value.device).length) {
    const deviceKeys = Object.keys(value.device)
    deviceKeys.forEach((deviceKey) => {
      const device = value.device[deviceKey]
      if (device.dividerTop || device.dividerBottom) {
        const libData = {
          name: 'divider',
          dependencies: []
        }
        const backgroundType = device.dividerTopBackgroundType || device.dividerBottomBackgroundType
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

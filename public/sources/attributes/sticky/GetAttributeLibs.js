export default (value) => {
  const libs = []
  let addStickyLib = false

  if (value && value.device && Object.keys(value.device).length) {
    const deviceKeys = Object.keys(value.device)
    deviceKeys.forEach((deviceKey) => {
      const device = value.device[deviceKey]
      if (device.stickyEnable) {
        addStickyLib = true
      }
    })
  }

  if (addStickyLib) {
    libs.push({
      name: 'stickyElement'
    })
  }

  return libs
}

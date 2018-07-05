export default (value) => {
  let libs = []
  let addStickyLib = false

  if (value && value.device && Object.keys(value.device).length) {
    let deviceKeys = Object.keys(value.device)
    deviceKeys.forEach((deviceKey) => {
      let device = value.device[ deviceKey ]
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

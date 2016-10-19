let tinycolor = require('react-color/modules/tinycolor2')
let customProps = {}
let colorValue = tinycolor(color).toRgbString()

let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
let animations = []
devices.forEach((device) => {
  let prefix = designOptions.visibleDevices[ device ]
  if (designOptions[ device ].animation) {
    if (prefix) {
      prefix = `-${prefix}`
    }
    animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
  }
})
if (animations) {
  customProps[ 'data-vce-animate' ] = animations.join(' ')
}
let classes = 'vce-features'
let customProps = {}
let CustomTag = 'i'
let tinycolor = require('react-color/modules/tinycolor2')
let colorValue = tinycolor(iconColor).toRgbString()

if (addUrl) {
  CustomTag = 'a'
  let { url, title, targetBlank, relNofollow } = buttonUrl
  customProps = {
    'href': url,
    'title': title,
    'target': targetBlank ? '_blank' : undefined,
    'rel': relNofollow ? 'nofollow' : undefined
  }
}

if (shape) {
  classes += ` vce-features--style-${shape}`
}

if (iconAlignment) {
  classes += ` vce-features--align-${iconAlignment}`
}

if (size) {
  classes += ` vce-features--size-${size}`
}

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
if (animations.length) {
  customProps[ 'data-vce-animate' ] = animations.join(' ')
}
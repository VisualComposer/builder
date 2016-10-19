let containerClasses = 'vce-single-image-container vce'
let classes = 'vce-single-image'
let customProps = {}
let CustomTag = 'div'

var imgSrc = image

let vcCake = require('vc-cake')
const cook = vcCake.getService('cook')
let cookElement = cook.get(atts)
const AssetsManager = vcCake.getService('assets-manager')

if (image && image.full) {
  imgSrc = image.full
} else {
  imgSrc = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('image'))
}

if (shape && shape !== 'square') {
  classes += ` vce-single-image--border-${shape}`
}

if (clickableOptions === 'url') {
  CustomTag = 'a'
  let { url, title, targetBlank, relNofollow } = imageUrl
  customProps = {
    'href': url,
    'title': title,
    'target': targetBlank ? '_blank' : undefined,
    'rel': relNofollow ? 'nofollow' : undefined
  }
} else if (clickableOptions === 'imageNewTab') {
  CustomTag = 'a'
  customProps = {
    'href': imgSrc,
    'target': '_blank'
  }
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
if (animations) {
  customProps[ 'data-vce-animate' ] = animations.join(' ')
}
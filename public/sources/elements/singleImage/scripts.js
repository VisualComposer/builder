let containerClasses = 'vce-single-image-container vce'
let classes = 'vce-single-image'

var imgSrc = image

let vcCake = require('vc-cake')
const cook = vcCake.getService('cook')
let cookElement = cook.get(atts)
const AssetsManager = vcCake.getService('assets-manager')

if (typeof imgSrc !== 'string' && typeof imgSrc.urls[ 0 ] !== 'undefined') {
  imgSrc = imgSrc.urls[0].full
} else {
  imgSrc = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('image'))
}

if (shape && shape !== 'square') {
  classes += ` vce-single-image--border-${shape}`
}


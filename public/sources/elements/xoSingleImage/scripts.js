let containerClasses = 'vce-single-image-container vce'
let classes = 'vce-single-image-inner'
let customProps = {}
let CustomTag = 'div'

if (typeof customClass === 'string' && customClass) {
  classes += ' ' + customClass
}

var imgSrc = image
let vcCake = require('vc-cake')
const cook = vcCake.getService('cook')
let cookElement = cook.get(atts)
const AssetsManager = vcCake.getService('assets-manager')

if (typeof imgSrc !== 'string' && typeof imgSrc.urls[ 0 ] !== 'undefined') {
  imgSrc = imgSrc.urls[ 0 ].full
} else {
  imgSrc = AssetsManager.getPublicPath(cookElement.get('tag'), cookElement.get('image'))
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
} else if (clickableOptions === 'lightbox') {
  CustomTag = 'a'
  customProps = {
    'href': imgSrc,
    'data-lightbox': `lightbox-${this.props.id}`
  }
} else if (clickableOptions === 'zoom') {
  classes += ' vcv-single-image-zoom-container'
}

if (shape && shape !== 'square') {
  classes += ` vce-single-image--border-${shape}`

  if (shape === 'round') {
    customProps.style = this.state ? this.state.imgSize : null
  }
}

customProps.key = `customProps:${this.props.id}-${imgSrc}-${clickableOptions}-${shape}`